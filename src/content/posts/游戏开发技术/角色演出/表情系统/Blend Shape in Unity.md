---
title: Blend Shape in Unity
slug: note-975b819e0bbb
published: 2025-05-12
draft: false
description: ''
tags: []
category: 游戏开发技术
lang: zh_CN
kind: note
directory: 游戏开发技术/角色演出/表情系统
route: /游戏开发技术/角色演出/表情系统/Blend Shape in Unity/
---

## Storage

### Storage of Imported Assets

BlendShape数据最初存储在导入的3D模型文件中(如FBX)

### Storage in Runtime

#### In Mesh

Mesh相关接口见[关于Unity中GetBlendShapeFrame参数的解释](/%E6%B8%B8%E6%88%8F%E5%BC%80%E5%8F%91%E6%8A%80%E6%9C%AF/%E8%A7%92%E8%89%B2%E6%BC%94%E5%87%BA/%E8%A1%A8%E6%83%85%E7%B3%BB%E7%BB%9F/%E5%85%B3%E4%BA%8EUnity%E4%B8%ADGetBlendShapeFrame%E5%8F%82%E6%95%B0%E7%9A%84%E8%A7%A3%E9%87%8A/)

在Mesh中，BlendShape的具体数据包括：  

1. 顶点偏移量  

2. 法线偏移量  

3. 切线偏移量

```csharp
// Mesh类包含BlendShape数据
public sealed class Mesh : Object
{
    // 获取BlendShape数量
    public int blendShapeCount { get; }
    
    // 获取指定索引的BlendShape名称
    public string GetBlendShapeName(int shapeIndex);
    
    // 获取BlendShape的帧数
    public int GetBlendShapeFrameCount(int shapeIndex);
    
    // 重要：这个方法能获取原始BlendShape顶点位移数据
    public void GetBlendShapeFrameVertices(
        int shapeIndex, 
        int frameIndex, 
        Vector3[] deltaVertices, 
        Vector3[] deltaNormals, 
        Vector3[] deltaTangents
    );
}
```

在C++层中

```cpp
// 简化的C++伪代码示意内部结构
struct BlendShapeChannel
{
    std::string name;
    std::vector<BlendShapeFrame> frames;
};

struct BlendShapeFrame
{
    float weight;
    std::vector<Vector3> deltaVertices;  // 顶点位置增量
    std::vector<Vector3> deltaNormals;   // 法线增量
    std::vector<Vector3> deltaTangents;  // 切线增量
};

class Mesh
{
    // 其他网格数据...
    std::vector<BlendShapeChannel> blendShapes;
};
```

### Storate In GPU

当BlendShape被应用时，数据会通过Mesh被上传到GPU顶点缓冲区：

## Compute

### Compute In CPU

传统上，BlendShape的混合是在CPU端完成的：

```csharp
// CPU端BlendShape处理过程的伪代码
void ProcessBlendShapesOnCPU()
{
    // 获取基础网格数据
    Vector3[] baseVertices = mesh.vertices;
    Vector3[] result = new Vector3[baseVertices.Length];
    
    // 复制基础顶点数据
    System.Array.Copy(baseVertices, result, baseVertices.Length);
    
    // 对每个BlendShape进行处理
    for (int shapeIndex = 0; shapeIndex < mesh.blendShapeCount; shapeIndex++)
    {
        // 获取权重
        float weight = skinnedMeshRenderer.GetBlendShapeWeight(shapeIndex) / 100f;
        
        if (weight > 0)
        {
            // 获取此BlendShape的顶点偏移
            Vector3[] deltaVertices = new Vector3[baseVertices.Length];
            Vector3[] deltaNormals = new Vector3[baseVertices.Length];
            Vector3[] deltaTangents = new Vector3[baseVertices.Length];
            
            mesh.GetBlendShapeFrameVertices(shapeIndex, 0, deltaVertices, deltaNormals, deltaTangents);
            
            // 应用权重偏移
            for (int i = 0; i < baseVertices.Length; i++)
            {
                result[i] += deltaVertices[i] * weight;
            }
        }
    }
    
    // 最终更新网格并上传到GPU
    mesh.vertices = result;
    mesh.RecalculateBounds();
}
```

当在CPU上计算时，Unity使用SkinnedMeshRenderer组件进行处理，并将计算后的最终网格数据上传到GPU进行渲染。
实际上这些计算都是在C++层实现的，主要考虑：
1. **性能考量**：处理大量顶点数据需要高效计算，C++比C\# 更适合此类低级操作。C++实现允许使用SIMD、多线程等更低层次的优化

2. **内存管理**：避免在托管代码中产生大量的垃圾回收压力。


### Compute In GPU
从Unity 2019版本开始，引入了"GPU Skinning"（GPU蒙皮）技术，允许BlendShape在GPU上直接计算。
GPU蒙皮将BlendShape计算移至顶点着色器阶段，大致实现方式为：

```c
// 顶点着色器中的伪代码（简化版）
void vert(inout appdata_full v) {
    // 基础顶点位置
    float3 basePosition = v.vertex.xyz;
    float3 finalPosition = basePosition;
    
    // 应用每个BlendShape的偏移
    // 这些值和权重由Unity自动传递到GPU
    finalPosition += _BlendShape0 * _Weight0;
    finalPosition += _BlendShape1 * _Weight1;
    // ... 更多BlendShape
    
    v.vertex.xyz = finalPosition;
}
```
