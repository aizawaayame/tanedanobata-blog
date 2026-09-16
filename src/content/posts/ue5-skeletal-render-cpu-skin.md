---
title: UE 5.5.4 SkeletalRenderCPUSkin 源码深度解析
slug: ue5-skeletal-render-cpu-skin
published: 2025-05-27
draft: false
description: ''
tags: []
category: 游戏开发
lang: zh_CN
kind: post
directory: blog/posts
route: /posts/ue5-skeletal-render-cpu-skin/
---

UE 5.5.4 SkeletalRenderCPUSkin 源码深度解析
<!-- more -->

# UE 5.5.4 SkeletalRenderCPUSkin 源码深度解析

基于您提供的真实源码，我来详细分析 UE 5.5.4中 CPU 蒙皮系统的实际实现原理。

## 核心架构分析

### 1. 主要类结构

```cpp
// 主要的CPU蒙皮对象
class FSkeletalMeshObjectCPUSkin : public FSkeletalMeshObject
{
    // LOD数据数组
    TArray<FSkeletalMeshObjectLOD> LODs;
    
    // 动态数据指针
    FDynamicSkelMeshObjectDataCPUSkin* DynamicData;
    
    // 缓存的顶点数据
    mutable TArray<FFinalSkinVertex> CachedFinalVertices;
    mutable int32 CachedVertexLOD;
    
    // 调试渲染相关
    bool bRenderOverlayMaterial;
    TArray<int32> BonesOfInterest;
    TArray<UMorphTarget*> MorphTargetOfInterest;
};

// LOD级别的数据管理
struct FSkeletalMeshObjectLOD
{
    // 顶点缓冲区
    FPositionVertexBuffer PositionVertexBuffer;
    FStaticMeshVertexBuffer StaticMeshVertexBuffer;
    
    // 顶点工厂
    FLocalVertexFactory VertexFactory;
    
    // 权重和颜色缓冲区指针
    FSkinWeightVertexBuffer* MeshObjectWeightBuffer;
    FColorVertexBuffer* MeshObjectColorBuffer;
    
    // 射线追踪支持
    #if RHI_RAYTRACING
    FRayTracingGeometry RayTracingGeometry;
    #endif
};
```

### 2. 动态数据结构

```cpp
class FDynamicSkelMeshObjectDataCPUSkin
{
public:
    int32 LODIndex;                                    // 当前LOD级别
    FMorphTargetWeightMap ActiveMorphTargets;          // 活跃的Morph Target
    TArray<float> MorphTargetWeights;                  // Morph Target权重
    TArray<FMatrix44f> ReferenceToLocal;               // 骨骼变换矩阵
    
    // 布料模拟相关
    TMap<int32, FClothSimulData> ClothSimulUpdateData; // 布料模拟数据
    float ClothBlendWeight;                            // 布料混合权重
    FMatrix WorldToLocal;                              // 世界到局部空间变换
    
    #if !(UE_BUILD_SHIPPING || UE_BUILD_TEST)
    TArray<FTransform> MeshComponentSpaceTransforms;   // 组件空间变换（调试用）
    #endif
};
```

## 主要更新流程

### 1. Update 函数 - 主线程调用

```cpp
void FSkeletalMeshObjectCPUSkin::Update(
    int32 LODIndex,
    USkinnedMeshComponent* InMeshComponent,
    const FMorphTargetWeightMap& InActiveMorphTargets,
    const TArray<float>& InMorphTargetWeights,
    EPreviousBoneTransformUpdateMode PreviousBoneTransformUpdateMode,
    const FExternalMorphWeightData& InExternalMorphWeightData)
{
    if (InMeshComponent)
    {
        // 创建新的动态数据
        FDynamicSkelMeshObjectDataCPUSkin* NewDynamicData = 
            new FDynamicSkelMeshObjectDataCPUSkin(
                InMeshComponent, SkeletalMeshRenderData, LODIndex, 
                InActiveMorphTargets, InMorphTargetWeights);

        uint64 FrameNumberToPrepare = GFrameCounter;
        uint32 RevisionNumber = 0;

        if (InMeshComponent->SceneProxy)
        {
            RevisionNumber = InMeshComponent->GetBoneTransformRevisionNumber();
        }

        // 提交渲染命令到特定的渲染管道
        FSkeletalMeshObjectCPUSkin* MeshObject = this;
        ENQUEUE_RENDER_COMMAND(SkelMeshObjectUpdateDataCommand)(
            UE::RenderCommandPipe::SkeletalMesh,
            [MeshObject, FrameNumberToPrepare, RevisionNumber, NewDynamicData]
            (FRHICommandList& RHICmdList)
            {
                FScopeCycleCounter Context(MeshObject->GetStatId());
                MeshObject->UpdateDynamicData_RenderThread(
                    RHICmdList, NewDynamicData, FrameNumberToPrepare, RevisionNumber);
            }
        );
    }
}
```

### 2. UpdateDynamicData_RenderThread - 渲染线程执行

```cpp
void FSkeletalMeshObjectCPUSkin::UpdateDynamicData_RenderThread(
    FRHICommandList& RHICmdList, 
    FDynamicSkelMeshObjectDataCPUSkin* InDynamicData, 
    uint64 FrameNumberToPrepare, 
    uint32 RevisionNumber)
{
    // 删除旧数据，更新新数据
    delete DynamicData;
    DynamicData = InDynamicData; 
    check(DynamicData);

    // 执行顶点缓存更新
    CacheVertices(DynamicData->LODIndex, true, RHICmdList);
}
```

## 核心蒙皮算法实现

### 1. CacheVertices - 顶点缓存核心函数

```cpp
void FSkeletalMeshObjectCPUSkin::CacheVertices(int32 LODIndex, bool bForce, FRHICommandList& RHICmdList) const
{
    SCOPE_CYCLE_COUNTER(STAT_CPUSkinUpdateRTTime);
    check(IsInParallelRenderingThread());

    FSkeletalMeshLODRenderData& LOD = SkeletalMeshRenderData->LODRenderData[LODIndex];
    const FSkeletalMeshObjectLOD& MeshLOD = LODs[LODIndex];

    // 只在LOD变化或强制更新时重新计算
    if ((LODIndex != CachedVertexLOD || bForce) &&
        DynamicData && 
        MeshLOD.StaticMeshVertexBuffer.IsValid())
    {
        // 获取骨骼变换矩阵
        FMatrix44f* ReferenceToLocal = DynamicData->ReferenceToLocal.GetData();

        int32 CachedFinalVerticesNum = LOD.GetNumVertices();
        CachedFinalVertices.Empty(CachedFinalVerticesNum);
        CachedFinalVertices.AddUninitialized(CachedFinalVerticesNum);

        FFinalSkinVertex* DestVertex = CachedFinalVertices.GetData();

        if (DestVertex)
        {
            check(GIsEditor || LOD.StaticVertexBuffers.StaticMeshVertexBuffer.GetAllowCPUAccess());
            SCOPE_CYCLE_COUNTER(STAT_SkinningTime);

            // 根据UV精度选择不同的蒙皮路径
            if (LOD.StaticVertexBuffers.StaticMeshVertexBuffer.GetUseFullPrecisionUVs())
            {
                SKIN_LOD_VERTICES(TGPUSkinVertexFloat32Uvs, 
                    LOD.StaticVertexBuffers.StaticMeshVertexBuffer.GetNumTexCoords());
            }
            else
            {
                SKIN_LOD_VERTICES(TGPUSkinVertexFloat16Uvs, 
                    LOD.StaticVertexBuffers.StaticMeshVertexBuffer.GetNumTexCoords());
            }

            // 处理调试渲染（骨骼权重或Morph Target可视化）
            if (bRenderOverlayMaterial)
            {
                if (MorphTargetOfInterest.Num() > 0)
                {
                    CalculateMorphTargetWeights(DestVertex, LOD, LODIndex, MorphTargetOfInterest);
                }
                else
                {
                    CalculateBoneWeights(DestVertex, LOD, *MeshLOD.MeshObjectWeightBuffer, BonesOfInterest);
                }
            }
        }

        CachedVertexLOD = LODIndex;
        
        // 将计算结果写入GPU缓冲区
        UpdateGPUBuffers(LOD, MeshLOD, RHICmdList);
    }
}
```

### 2. SKIN_LOD_VERTICES 宏展开

```cpp
#define SKIN_LOD_VERTICES(VertexType, NumUVs) \
{\
    switch(NumUVs)\
    {\
        case 1:\
            SkinVertices<VertexType<1>, 1>(DestVertex, ReferenceToLocal, /*...*/);\
            break;\
        case 2:\
            SkinVertices<VertexType<2>, 2>(DestVertex, ReferenceToLocal, /*...*/);\
            break;\
        case 3:\
            SkinVertices<VertexType<3>, 3>(DestVertex, ReferenceToLocal, /*...*/);\
            break;\
        case 4:\
            SkinVertices<VertexType<4>, 4>(DestVertex, ReferenceToLocal, /*...*/);\
            break;\
        default:\
            checkf(false, TEXT("Invalid number of UV sets. Must be between 1 and 4"));\
            break;\
    }\
}
```

## 高度优化的蒙皮核心算法

### 1. SkinVertices 模板函数

```cpp
template<typename VertexType, int32 NumberOfUVs>
static void SkinVertices(
    FFinalSkinVertex* DestVertex, 
    FMatrix44f* ReferenceToLocal, 
    int32 LODIndex, 
    FSkeletalMeshLODRenderData& LOD,
    FSkinWeightVertexBuffer& WeightBuffer,
    const FMorphTargetWeightMap& InActiveMorphTargets, 
    const TArray<float>& MorphTargetWeights, 
    const TMap<int32, FClothSimulData>& ClothSimulUpdateData, 
    float ClothBlendWeight, 
    const FMatrix& WorldToLocal,
    const FVector& WorldScale)
{
    // 设置SIMD寄存器控制
    uint32 StatusRegister = VectorGetControlRegister();
    VectorSetControlRegister(StatusRegister | VECTOR_ROUND_TOWARD_ZERO);

    // 初始化Morph Target评估信息
    TArray<FMorphTargetInfo> MorphEvalInfos;
    uint32 NumValidMorphs = InitEvalInfos(InActiveMorphTargets, MorphTargetWeights, 
                                         LODIndex, MorphEvalInfos);

    // 预取骨骼矩阵到缓存
    const uint32 MaxGPUSkinBones = FGPUBaseSkinVertexFactory::GetMaxGPUSkinBones();
    for (uint32 MatrixIndex = 0; MatrixIndex < MaxGPUSkinBones; MatrixIndex += 2)
    {
        FPlatformMisc::Prefetch(ReferenceToLocal + MatrixIndex);
    }

    int32 CurBaseVertIdx = 0;
    int32 VertexBufferBaseIndex = 0;
    const FVector WorldScaleAbs = WorldScale.GetAbs();

    // 按Section处理顶点
    for(int32 SectionIndex = 0; SectionIndex < LOD.RenderSections.Num(); SectionIndex++)
    {
        FSkelMeshRenderSection& Section = LOD.RenderSections[SectionIndex];
        const FClothSimulData* ClothSimData = ClothSimulUpdateData.Find(Section.CorrespondClothAssetIndex);

        SkinVertexSection<VertexType, NumberOfUVs>(
            DestVertex, MorphEvalInfos, MorphTargetWeights, Section, LOD, WeightBuffer, 
            VertexBufferBaseIndex, NumValidMorphs, CurBaseVertIdx, LODIndex, 
            ReferenceToLocal, ClothSimData, ClothBlendWeight, WorldToLocal, WorldScaleAbs);
    }

    // 恢复SIMD寄存器状态
    VectorSetControlRegister(StatusRegister);
}
```

### 2. SkinVertexSection - SIMD 优化的蒙皮计算

```cpp
template<typename VertexType, int32 NumberOfUVs>
static void SkinVertexSection(/* 参数列表 */)
{
    static constexpr VectorRegister VECTOR_INV_65535 = 
        MakeVectorRegisterDoubleConstant(1.0/65535, 1.0/65535, 1.0/65535, 1.0/65535);
    
    VertexType VertexCopy; // Morph Target处理用的临时顶点

    // 预取骨骼映射数据
    const FBoneIndexType* BoneMap = Section.BoneMap.GetData();
    FPlatformMisc::Prefetch(BoneMap);
    FPlatformMisc::Prefetch(BoneMap, PLATFORM_CACHE_LINE_SIZE);

    const int32 MaxSectionBoneInfluences = WeightBuffer.GetMaxBoneInfluences();
    const bool bLODUsesCloth = LOD.HasClothData() && ClothSimData != nullptr && ClothBlendWeight > 0.0f;
    const int32 NumSoftVertices = Section.GetNumVertices();
    
    if (NumSoftVertices > 0)
    {
        INC_DWORD_STAT_BY(STAT_CPUSkinVertices, NumSoftVertices);
        
        // 逐顶点处理
        for(int32 VertexIndex = VertexBufferBaseIndex; VertexIndex < NumSoftVertices; 
            VertexIndex++, DestVertex++)
        {
            const int32 VertexBufferIndex = Section.GetVertexBufferIndex() + VertexIndex;

            // 加载源顶点数据
            VertexType SrcSoftVertex;
            const FVector& VertexPosition = (FVector)LOD.StaticVertexBuffers.PositionVertexBuffer.VertexPosition(VertexBufferIndex);
            FPlatformMisc::Prefetch(&VertexPosition, PLATFORM_CACHE_LINE_SIZE);
            
            SrcSoftVertex.Position = (FVector3f)VertexPosition;
            SrcSoftVertex.TangentX = LOD.StaticVertexBuffers.StaticMeshVertexBuffer.VertexTangentX(VertexBufferIndex);
            SrcSoftVertex.TangentZ = LOD.StaticVertexBuffers.StaticMeshVertexBuffer.VertexTangentZ(VertexBufferIndex);
            
            // 加载UV坐标
            for (uint32 j = 0; j < VertexType::NumTexCoords; j++)
            {
                SrcSoftVertex.UVs[j] = LOD.StaticVertexBuffers.StaticMeshVertexBuffer.GetVertexUV_Typed<VertexType::StaticMeshVertexUVType>(VertexBufferIndex, j);
            }

            // 处理Morph Target
            VertexType* MorphedVertex = &SrcSoftVertex;
            if(NumValidMorphs) 
            {
                MorphedVertex = &VertexCopy;
                UpdateMorphedVertex<VertexType>(*MorphedVertex, SrcSoftVertex, CurBaseVertIdx, LODIndex, MorphEvalInfos, MorphTargetWeights);
            }

            // 获取蒙皮权重
            FSkinWeightInfo SrcWeights = WeightBuffer.GetVertexSkinWeights(VertexBufferIndex);
            
            // 执行SIMD优化的蒙皮计算
            PerformSIMDSkinning(MorphedVertex, SrcWeights, BoneMap, ReferenceToLocal, 
                               MaxSectionBoneInfluences, DestVertex);

            // 处理布料模拟
            ProcessClothSimulation(VertexIndex, ClothVertData, ClothSimData, 
                                 ClothBlendWeight, WorldToLocal, WorldScaleAbs, DestVertex);

            // 复制UV坐标
            CopyUVCoordinates(VertexIndex, Section, LOD, NumberOfUVs, DestVertex);

            CurBaseVertIdx++;
        }
    }
}
```

### 3. SIMD 优化的蒙皮矩阵计算

```cpp
// 核心的SIMD蒙皮计算（简化版）
void PerformSIMDSkinning(/* 参数 */)
{
    const FBoneIndexType* RESTRICT BoneIndices = SrcWeights.InfluenceBones;
    const uint16* RESTRICT BoneWeights = SrcWeights.InfluenceWeights;

    // 将顶点数据加载到SIMD寄存器
    static VectorRegister SrcNormals[3];
    VectorRegister DstNormals[3];
    SrcNormals[0] = VectorLoadFloat3_W1(&MorphedVertex->Position);
    SrcNormals[1] = Unpack3(&MorphedVertex->TangentX.Vector.Packed);
    SrcNormals[2] = Unpack4(&MorphedVertex->TangentZ.Vector.Packed);
    
    // 权重归一化（从uint16转换为float）
    VectorRegister Weights = VectorMultiply(VectorLoadURGBA16N(BoneWeights), VECTOR_INV_65535);
    VectorRegister ExtraWeights = MakeVectorRegister(0.f, 0.f, 0.f, 0.f);
    VectorRegister ExtraWeights2 = MakeVectorRegister(0.f, 0.f, 0.f, 0.f);
    
    // 处理超过4个骨骼影响的情况
    if (MaxSectionBoneInfluences > 4)
    {
        ExtraWeights = VectorMultiply(VectorLoadURGBA16N(&BoneWeights[MAX_INFLUENCES_PER_STREAM]), VECTOR_INV_65535);
    }
    if (MaxSectionBoneInfluences > 8)
    {
        ExtraWeights2 = VectorMultiply(VectorLoadURGBA16N(&BoneWeights[EXTRA_BONE_INFLUENCES]), VECTOR_INV_65535);
    }
    
    VectorResetFloatRegisters();

    // 累积骨骼变换（支持最多12个骨骼影响）
    const FMatrix44f BoneMatrix0 = ReferenceToLocal[BoneMap[BoneIndices[INFLUENCE_0]]];
    VectorRegister Weight0 = VectorReplicate(Weights, INFLUENCE_0);
    VectorRegister M00 = VectorMultiply(VectorLoadAligned(&BoneMatrix0.M[0][0]), Weight0);
    VectorRegister M10 = VectorMultiply(VectorLoadAligned(&BoneMatrix0.M[1][0]), Weight0);
    VectorRegister M20 = VectorMultiply(VectorLoadAligned(&BoneMatrix0.M[2][0]), Weight0);
    VectorRegister M30 = VectorMultiply(VectorLoadAligned(&BoneMatrix0.M[3][0]), Weight0);

    // 展开循环处理其他骨骼影响（源码中有完整的if-else嵌套结构）
    if (MaxSectionBoneInfluences > 1)
    {
        const FMatrix44f BoneMatrix1 = ReferenceToLocal[BoneMap[BoneIndices[INFLUENCE_1]]];
        VectorRegister Weight1 = VectorReplicate(Weights, INFLUENCE_1);
        M00 = VectorMultiplyAdd(VectorLoadAligned(&BoneMatrix1.M[0][0]), Weight1, M00);
        M10 = VectorMultiplyAdd(VectorLoadAligned(&BoneMatrix1.M[1][0]), Weight1, M10);
        M20 = VectorMultiplyAdd(VectorLoadAligned(&BoneMatrix1.M[2][0]), Weight1, M20);
        M30 = VectorMultiplyAdd(VectorLoadAligned(&BoneMatrix1.M[3][0]), Weight1, M30);
        
        // ... 继续处理其他骨骼 (源码支持最多12个骨骼)
    }

    // 应用变换到顶点属性
    VectorRegister N_xxxx = VectorReplicate(SrcNormals[0], 0);
    VectorRegister N_yyyy = VectorReplicate(SrcNormals[0], 1);
    VectorRegister N_zzzz = VectorReplicate(SrcNormals[0], 2);
    DstNormals[0] = VectorMultiplyAdd(N_xxxx, M00, 
                    VectorMultiplyAdd(N_yyyy, M10, 
                    VectorMultiplyAdd(N_zzzz, M20, M30)));

    // 处理切线和法线
    N_xxxx = VectorReplicate(SrcNormals[1], 0);
    N_yyyy = VectorReplicate(SrcNormals[1], 1);
    N_zzzz = VectorReplicate(SrcNormals[1], 2);
    DstNormals[1] = VectorNormalize(VectorMultiplyAdd(N_xxxx, M00, 
                    VectorMultiplyAdd(N_yyyy, M10, VectorMultiply(N_zzzz, M20))));

    N_xxxx = VectorReplicate(SrcNormals[2], 0);
    N_yyyy = VectorReplicate(SrcNormals[2], 1);
    N_zzzz = VectorReplicate(SrcNormals[2], 2);
    DstNormals[2] = VectorNormalize(VectorMultiplyAdd(N_xxxx, M00, 
                    VectorMultiplyAdd(N_yyyy, M10, VectorMultiply(N_zzzz, M20))));

    // 保持W分量（基向量的行列式符号）
    DstNormals[2] = VectorMultiplyAdd(VECTOR_0001, SrcNormals[2], DstNormals[2]);

    // 写入内存
    VectorStoreFloat3(DstNormals[0], &DestVertex->Position);
    Pack3(DstNormals[1], &DestVertex->TangentX.Vector.Packed);
    Pack4(DstNormals[2], &DestVertex->TangentZ.Vector.Packed);
    VectorResetFloatRegisters();
}
```

## Morph Target 处理系统

### 1. Morph Target 信息结构

```cpp
struct FMorphTargetInfo
{
    int32 WeightIndex = INDEX_NONE;     // 权重列表中的索引
    int32 NextDeltaIndex = INDEX_NONE;  // 下一个要应用的Delta索引
    const FMorphTargetDelta* Deltas = nullptr;  // Delta数组
    int32 NumDeltas = 0;                // Delta数量
};

// 初始化Morph Target评估信息
static uint32 InitEvalInfos(const FMorphTargetWeightMap& InActiveMorphTargets, 
                           const TArray<float>& MorphTargetWeights, 
                           int32 LODIndex, 
                           TArray<FMorphTargetInfo>& OutEvalInfos)
{
    uint32 NumValidMorphTargets = 0;
    const float MorphTargetMaxBlendWeight = UE::SkeletalRender::Settings::GetMorphTargetMaxBlendWeight();

    for(const TTuple<const UMorphTarget*, int32>& MorphItem : InActiveMorphTargets)
    {
        FMorphTargetInfo NewInfo;
        const UMorphTarget* MorphTarget = MorphItem.Key;
        const int32 WeightIndex = MorphItem.Value;

        const float ActiveMorphAbsVertexWeight = FMath::Abs(MorphTargetWeights[WeightIndex]);

        // 检查Morph Target是否有效且权重在有效范围内
        if(MorphTarget != nullptr &&
           ActiveMorphAbsVertexWeight >= MinMorphTargetBlendWeight &&
           ActiveMorphAbsVertexWeight <= MorphTargetMaxBlendWeight &&
           MorphTarget->HasDataForLOD(LODIndex))
        {
            NewInfo.WeightIndex = WeightIndex;
            NewInfo.NextDeltaIndex = 0;
            NewInfo.Deltas = MorphTarget->GetMorphTargetDelta(LODIndex, NewInfo.NumDeltas);
            NumValidMorphTargets++;
        }

        OutEvalInfos.Add(NewInfo);
    }
    return NumValidMorphTargets;
}
```

### 2. Morph Target 混合算法

```cpp
template<typename VertexType>
FORCEINLINE void UpdateMorphedVertex(
    VertexType& MorphedVertex, 
    const VertexType& SrcVertex, 
    int32 CurBaseVertIdx, 
    int32 LODIndex, 
    TArray<FMorphTargetInfo>& EvalInfos, 
    const TArray<float>& MorphWeights)
{
    MorphedVertex = SrcVertex;

    // 遍历所有活跃的Morph Target
    for(int32 MorphIdx = 0; MorphIdx < EvalInfos.Num(); MorphIdx++)
    {
        FMorphTargetInfo& Info = EvalInfos[MorphIdx];

        // 检查下一个Delta是否匹配当前顶点
        if(Info.NextDeltaIndex != INDEX_NONE &&
           Info.NextDeltaIndex < Info.NumDeltas &&
           Info.Deltas[Info.NextDeltaIndex].SourceIdx == CurBaseVertIdx)
        {
            // 应用Morph Target混合
            ApplyMorphBlend(MorphedVertex, Info.Deltas[Info.NextDeltaIndex], 
                           MorphWeights[Info.WeightIndex]);

            // 更新下一个Delta索引
            Info.NextDeltaIndex += 1;
        }
    }

    // 重建正交标准化的切线基
    RebuildTangentBasis(MorphedVertex);
}

template<typename VertexType>
FORCEINLINE void ApplyMorphBlend(VertexType& DestVertex, 
                                const FMorphTargetDelta& SrcMorph, 
                                float Weight)
{
    // 添加位置偏移
    DestVertex.Position += SrcMorph.PositionDelta * Weight;

    // 保存W分量（TangentZ的W存储基向量行列式符号）
    int8 W = DestVertex.TangentZ.Vector.W;

    FVector TanZ = DestVertex.TangentZ.ToFVector();
    
    // 添加法线偏移（法线Delta权重最大限制为1.0）
    DestVertex.TangentZ = (TanZ + FVector(SrcMorph.TangentZDelta * FMath::Min(Weight, 1.0f))).GetUnsafeNormal();
    
    // 恢复W分量
    DestVertex.TangentZ.Vector.W = W;
}

template<typename VertexType>
FORCEINLINE void RebuildTangentBasis(VertexType& DestVertex)
{
    // 通过将新法线与基切线向量正交标准化来重建切线
    FVector Tangent = DestVertex.TangentX.ToFVector();
    FVector Normal = DestVertex.TangentZ.ToFVector();
    Tangent = Tangent - ((Tangent | Normal) * Normal);
    Tangent.Normalize();
    DestVertex.TangentX = Tangent;
}
```

## 布料模拟集成

### 1. 布料模拟数据结构

```cpp
// 布料模拟的CPU实现
struct ClothCPU
{
    // 获取布料模拟位置
    FORCEINLINE static FVector GetClothSimulPosition(const FClothSimulData& InClothSimData, int32 InIndex)
    {
        if (InClothSimData.Positions.IsValidIndex(InIndex))
        {
            return FVector(InClothSimData.Transform.TransformPosition(
                (FVector)InClothSimData.Positions[InIndex]));
        }
        return FVector::ZeroVector;
    }

    // 获取布料模拟法线
    FORCEINLINE static FVector GetClothSimulNormal(const FClothSimulData& InClothSimData, int32 InIndex)
    {
        if (InClothSimData.Normals.IsValidIndex(InIndex))
        {
            return FVector(InClothSimData.Transform.TransformVector(
                (FVector)InClothSimData.Normals[InIndex]));
        }
        return FVector(0, 0, 1);
    }

    // 计算布料位置（使用重心坐标插值）
    FORCEINLINE static FVector ClothingPosition(const FMeshToMeshVertData& InClothVertData, 
                                               const FClothSimulData& InClothSimData, 
                                               const FVector& InWorldScaleAbs)
    {
        return InClothVertData.PositionBaryCoordsAndDist.X * 
               (GetClothSimulPosition(InClothSimData, InClothVertData.SourceMeshVertIndices[0]) + 
                GetClothSimulNormal(InClothSimData, InClothVertData.SourceMeshVertIndices[0]) * 
                InClothVertData.PositionBaryCoordsAndDist.W * InWorldScaleAbs.X)
             + /* 类似地处理Y和Z分量 */;
    }
};
```

### 2. 布料与骨骼蒙皮的混合

```cpp
// 在SkinVertexSection中应用布料模拟
if (ClothVertData != nullptr && ClothVertData->SourceMeshVertIndices[3] < FIXED_VERTEX_INDEX)
{
    // 构建模拟位置（世界空间）
    FVector SimulatedPositionWorld = ClothCPU::ClothingPosition(*ClothVertData, *ClothSimData, WorldScaleAbs);

    // 转换回局部空间
    FVector3f SimulatedPosition = (FVector4f)WorldToLocal.TransformPosition(SimulatedPositionWorld);

    // 计算顶点混合权重
    const float VertexBlend = ClothBlendWeight * (1.0f - (ClothVertData->SourceMeshVertIndices[3] / 65535.0f));
    
    // 在蒙皮位置和模拟位置之间插值
    DestVertex->Position = FMath::Lerp(DestVertex->Position, SimulatedPosition, VertexBlend);

    // 重新计算切线和法线
    FVector TangentX, TangentZ;
    ClothCPU::ClothingTangents(*ClothVertData, *ClothSimData, SimulatedPositionWorld, 
                              WorldToLocal, WorldScaleAbs, TangentX, TangentZ);

    // 在蒙皮切线和模拟切线之间插值
    FVector SkinnedTangentX = DestVertex->TangentX.ToFVector();
    FVector4 SkinnedTangentZ = DestVertex->TangentZ.ToFVector4();
    DestVertex->TangentX = (TangentX * VertexBlend) + (SkinnedTangentX * (1.0f - VertexBlend));
    DestVertex->TangentZ = FVector4((TangentZ * VertexBlend) + (SkinnedTangentZ * (1.0f - VertexBlend)), 
                                   SkinnedTangentZ.W);
}
```

## GPU 缓冲区更新机制

### 1. 缓存顶点到 GPU 缓冲区更新

```cpp
// 在CacheVertices函数的最后部分
void UpdateGPUBuffers(const FSkeletalMeshLODRenderData& LOD, 
                     const FSkeletalMeshObjectLOD& MeshLOD, 
                     FRHICommandList& RHICmdList)
{
    check(LOD.GetNumVertices() == CachedFinalVertices.Num());

    // 更新位置和切线数据
    for (int i = 0; i < CachedFinalVertices.Num(); i++)
    {
        // 位置缓冲区
        MeshLOD.PositionVertexBuffer.VertexPosition(i) = CachedFinalVertices[i].Position;
        
        // 切线缓冲区
        MeshLOD.StaticMeshVertexBuffer.SetVertexTangents(i, 
            (FVector3f)CachedFinalVertices[i].TangentX.ToFVector(), 
            CachedFinalVertices[i].GetTangentY(), 
            (FVector3f)CachedFinalVertices[i].TangentZ.ToFVector());

        // UV坐标
        for (uint32 UVIndex = 0; UVIndex < LOD.StaticVertexBuffers.StaticMeshVertexBuffer.GetNumTexCoords(); ++UVIndex)
        {
            MeshLOD.StaticMeshVertexBuffer.SetVertexUV(i, UVIndex, 
                FVector2f(CachedFinalVertices[i].TextureCoordinates[UVIndex].X, 
                         CachedFinalVertices[i].TextureCoordinates[UVIndex].Y));
        }
    }

    // 更新RHI缓冲区
    MeshLOD.PositionVertexBuffer.UpdateRHI(RHICmdList);
    MeshLOD.StaticMeshVertexBuffer.UpdateRHI(RHICmdList);

    // 重新绑定顶点工厂
    FLocalVertexFactory::FDataType Data;
    MeshLOD.PositionVertexBuffer.BindPositionVertexBuffer(&MeshLOD.VertexFactory, Data);
    MeshLOD.StaticMeshVertexBuffer.BindTangentVertexBuffer(&MeshLOD.VertexFactory, Data);
    MeshLOD.StaticMeshVertexBuffer.BindPackedTexCoordVertexBuffer(&MeshLOD.VertexFactory, Data, MAX_TEXCOORDS);
    MeshLOD.StaticMeshVertexBuffer.BindLightMapVertexBuffer(&MeshLOD.VertexFactory, Data, 0);
    MeshLOD.MeshObjectColorBuffer->BindColorVertexBuffer(&MeshLOD.VertexFactory, Data);

    MeshLOD.VertexFactory.SetData(RHICmdList, Data);
    MeshLOD.VertexFactory.InitResource(RHICmdList);
}
```

## 调试和可视化功能

### 1. 骨骼权重可视化

```cpp
static void CalculateBoneWeights(FFinalSkinVertex* DestVertex, 
                                FSkeletalMeshLODRenderData& LOD, 
                                FSkinWeightVertexBuffer& WeightBuffer, 
                                TArray<int32> InBonesOfInterest)
{
    int32 VertexBufferBaseIndex = 0;

    for(int32 SectionIndex = 0; SectionIndex < LOD.RenderSections.Num(); SectionIndex++)
    {
        FSkelMeshRenderSection& Section = LOD.RenderSections[SectionIndex];
        CalculateSectionBoneWeights(DestVertex, WeightBuffer, Section, InBonesOfInterest);
    }
}

static FORCEINLINE void CalculateSectionBoneWeights(FFinalSkinVertex*& DestVertex, 
                                                   FSkinWeightVertexBuffer& SkinWeightVertexBuffer, 
                                                   FSkelMeshRenderSection& Section, 
                                                   const TArray<int32>& BonesOfInterest)
{
    FBoneIndexType* BoneMap = Section.BoneMap.GetData();

    for(int32 VertexIndex = 0; VertexIndex < Section.GetNumVertices(); VertexIndex++, DestVertex++)
    {
        const int32 VertexBufferIndex = Section.GetVertexBufferIndex() + VertexIndex;
        FSkinWeightInfo SrcWeight = SkinWeightVertexBuffer.GetVertexSkinWeights(VertexBufferIndex);

        // 清零 UV 坐标
        DestVertex->TextureCoordinates[0].X = 0.0f;
        DestVertex->TextureCoordinates[0].Y = 0.0f;

        const FBoneIndexType* RESTRICT BoneIndices = SrcWeight.InfluenceBones;
        const uint16* RESTRICT BoneWeights = SrcWeight.InfluenceWeights;

        // 累积感兴趣骨骼的权重
        for (uint32 i = 0; i < SkinWeightVertexBuffer.GetMaxBoneInfluences(); i++)
        {
            if (BonesOfInterest.Contains(BoneMap[BoneIndices[i]]))
            {
                DestVertex->TextureCoordinates[0].X += BoneWeights[i] / 65535.0; 
                DestVertex->TextureCoordinates[0].Y += BoneWeights[i] / 65535.0;
            }
        }
    }
}
```

### 2. Morph Target 可视化

```cpp
static void CalculateMorphTargetWeights(FFinalSkinVertex* DestVertex, 
                                       FSkeletalMeshLODRenderData& LOD, 
                                       int LODIndex, 
                                       TArray<UMorphTarget*> InMorphTargetOfInterest)
{
    const FFinalSkinVertex* EndVert = DestVertex + LOD.GetNumVertices();

    // 清零所有顶点的 UV 坐标
    for (FFinalSkinVertex* ClearVert = DestVertex; ClearVert != EndVert; ++ClearVert)
    {
        ClearVert->TextureCoordinates[0].X = 0.0f;
        ClearVert->TextureCoordinates[0].Y = 0.0f;
    }

    // 为每个感兴趣的 Morph Target 标记受影响的顶点
    for (const UMorphTarget* Morphtarget : InMorphTargetOfInterest)
    {
        int32 NumDeltas;
        const FMorphTargetDelta* MTLODVertices = Morphtarget->GetMorphTargetDelta(LODIndex, NumDeltas);
        
        for (int32 MorphVertexIndex = 0; MorphVertexIndex < NumDeltas; ++MorphVertexIndex)
        {
            FFinalSkinVertex* SetVert = DestVertex + MTLODVertices[MorphVertexIndex].SourceIdx;
            SetVert->TextureCoordinates[0].X += 1.0f;
            SetVert->TextureCoordinates[0].Y += 1.0f;
        }
    }
}
```

## 性能优化要点

### 1. SIMD 指令使用

- 使用`VectorRegister`类型进行4路并行计算
- `VectorLoadAligned`、`VectorMultiplyAdd`等优化指令
- `Unpack3`、`Pack4`等紧凑数据格式处理

### 2. 内存访问优化

- `FPlatformMisc::Prefetch`预取数据到缓存
- `RESTRICT`关键字告诉编译器指针不重叠
- 顺序访问模式最大化缓存效率

### 3. 分支预测优化

- 展开骨骼影响处理循环而非使用动态循环
- 模板特化避免运行时分支
- 常量条件编译时优化

### 4. 内存布局优化

- 顶点数据紧凑排列
- Section-wise 处理提高局部性
- 预分配缓冲区避免动态分配

## 总结

UE 5.5.4的 CPU 蒙皮系统是一个**高度优化的多功能渲染管线**：

### 核心特征

1. **SIMD 向量化**：充分利用现代 CPU 的并行计算能力
2. **多骨骼支持**：最多支持12个骨骼影响 per 顶点
3. **Morph Target 集成**：高效的增量混合算法
4. **布料模拟**：与物理模拟的无缝集成
5. **调试可视化**：完整的权重和变形可视化工具

### 适用场景

1. **高精度需求**：需要 CPU 端访问变形后顶点数据
2. **兼容性考虑**：不支持 GPU 蒙皮的平台
3. **调试开发**：实时权重调试和可视化
4. **特殊效果**：复杂的程序化变形

这个系统为 UE 提供了强大的 CPU 端骨骼动画处理能力，确保在各种场景下都能提供高质量的骨骼动画渲染效果。
