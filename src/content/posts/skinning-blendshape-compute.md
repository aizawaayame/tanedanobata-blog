---
title: 蒙皮和BS的Compute Shader参考
slug: skinning-blendshape-compute
published: 2025-05-27
draft: false
description: ''
tags: []
category: 游戏开发
lang: zh_CN
kind: post
directory: blog/posts
route: /posts/skinning-blendshape-compute/
---

Unity 的蒙皮和 Bs 的 ComputeShader 的一种实现的参考。
<!-- more -->

[Unity-Built-in-Shaders/DefaultResources/Internal-BlendShape.compute at master · TwoTailsGames/Unity-Built-in-Shaders · GitHub](https://github.com/TwoTailsGames/Unity-Built-in-Shaders/blob/master/DefaultResources/Internal-BlendShape.compute)
```hlsl
// Unity built-in shader source. Copyright (c) 2016 Unity Technologies. MIT license (see license.txt)

#pragma kernel main
#pragma kernel main SKIN_NORM
#pragma kernel main SKIN_NORM SKIN_TANG

#include "HLSLSupport.cginc"
#include "Internal-Skinning-Util.cginc"

struct BlendShapeVertex
{
    int index;
    float3 pos;
    float3 norm;
    float3 tang;
};

uint g_FirstVert; // First vertex from blend shape buffer to use
uint g_VertCount; // Sparse vertex count, not the full amount of vertices in mesh
float g_Weight;

[numthreads(64, 1, 1)]
void main(uint3 threadID : SV_DispatchThreadID, SAMPLER_UNIFORM RWStructuredBuffer<MeshVertex> inOutMeshVertices, SAMPLER_UNIFORM StructuredBuffer<BlendShapeVertex> inBlendShapeVertices)
{
    const uint t = threadID.x;

    if (t >= g_VertCount)
    {
        return;
    }

    BlendShapeVertex blendShapeVert = inBlendShapeVertices[t + g_FirstVert];

    const uint vertIndex = blendShapeVert.index;

    inOutMeshVertices[vertIndex].pos += blendShapeVert.pos * g_Weight;
#if SKIN_NORM
    inOutMeshVertices[vertIndex].norm += blendShapeVert.norm * g_Weight;
#endif
#if SKIN_TANG
    inOutMeshVertices[vertIndex].tang.xyz += blendShapeVert.tang * g_Weight;
#endif
}
```

[Unity-Built-in-Shaders/DefaultResources/Internal-Skinning.compute at master · TwoTailsGames/Unity-Built-in-Shaders · GitHub](https://github.com/TwoTailsGames/Unity-Built-in-Shaders/blob/master/DefaultResources/Internal-Skinning.compute)

```hlsl
// Unity built-in shader source. Copyright (c) 2016 Unity Technologies. MIT license (see license.txt)

// Generic compute skinning ... with pos, norm, and tangent skinning

#pragma kernel main SKIN_BONESFORVERT=0
#pragma kernel main SKIN_BONESFORVERT=0 SKIN_NORM
#pragma kernel main SKIN_BONESFORVERT=0 SKIN_TANG
#pragma kernel main SKIN_BONESFORVERT=0 SKIN_NORM SKIN_TANG
#pragma kernel main SKIN_BONESFORVERT=1
#pragma kernel main SKIN_BONESFORVERT=1 SKIN_NORM
#pragma kernel main SKIN_BONESFORVERT=1 SKIN_TANG
#pragma kernel main SKIN_BONESFORVERT=1 SKIN_NORM SKIN_TANG
#pragma kernel main SKIN_BONESFORVERT=2
#pragma kernel main SKIN_BONESFORVERT=2 SKIN_NORM
#pragma kernel main SKIN_BONESFORVERT=2 SKIN_TANG
#pragma kernel main SKIN_BONESFORVERT=2 SKIN_NORM SKIN_TANG
#pragma kernel main SKIN_BONESFORVERT=4
#pragma kernel main SKIN_BONESFORVERT=4 SKIN_NORM
#pragma kernel main SKIN_BONESFORVERT=4 SKIN_TANG
#pragma kernel main SKIN_BONESFORVERT=4 SKIN_NORM SKIN_TANG

#include "HLSLSupport.cginc"

uint g_VertCount;

#if defined(SHADER_API_D3D11) || defined(SHADER_API_XBOXONE) || defined(SHADER_API_PS4) || defined(SHADER_API_GLCORE) || defined(SHADER_API_GLES3) || defined(SHADER_API_VULKAN) || defined(SHADER_API_METAL) || defined(SHADER_API_PSSL) || defined(SHADER_API_SWITCH)
#define STRUCTURED_BUFFER_SUPPORT 1
#else
#define STRUCTURED_BUFFER_SUPPORT 0
#endif

struct MeshVertex
{
    float3 pos;
#if SKIN_NORM
    float3 norm;
#endif
#if SKIN_TANG
    float4 tang;
#endif
};

struct SkinInfluence
{
#if SKIN_BONESFORVERT <= 1
    int index0;
#elif SKIN_BONESFORVERT == 2
    float weight0, weight1;
    int index0, index1;
#elif SKIN_BONESFORVERT == 4
    float weight0, weight1, weight2, weight3;
    int index0, index1, index2, index3;
#endif
};

#if SKIN_NORM && SKIN_TANG
#define VERTEX_STRIDE 10
#elif SKIN_NORM
#define VERTEX_STRIDE 6
#else
#define VERTEX_STRIDE 3
#endif


#if !STRUCTURED_BUFFER_SUPPORT
MeshVertex FetchVert(SAMPLER_UNIFORM Buffer<float> vertices, const uint index, const uint stride)
{
    MeshVertex vert;

    uint offset = index * stride;
    vert.pos.x = vertices[offset++];
    vert.pos.y = vertices[offset++];
    vert.pos.z = vertices[offset++];

#if SKIN_NORM
    vert.norm.x = vertices[offset++];
    vert.norm.y = vertices[offset++];
    vert.norm.z = vertices[offset++];
#endif

#if SKIN_TANG
    vert.tang.x = vertices[offset++];
    vert.tang.y = vertices[offset++];
    vert.tang.z = vertices[offset++];
    vert.tang.w = vertices[offset++];
#endif

    return vert;
}

void StoreVert(SAMPLER_UNIFORM RWBuffer<float> vertices, float3 pos, float3 normal, float4 tang, const uint index, const uint stride)
{
    uint offset = index * stride;
    vertices[offset++] = pos.x;
    vertices[offset++] = pos.y;
    vertices[offset++] = pos.z;

#if SKIN_NORM
    vertices[offset++] = normal.x;
    vertices[offset++] = normal.y;
    vertices[offset++] = normal.z;
#endif

#if SKIN_TANG
    vertices[offset++] = tang.x;
    vertices[offset++] = tang.y;
    vertices[offset++] = tang.z;
    vertices[offset++] = tang.w;
#endif
}

#endif


[numthreads(64, 1, 1)]
#if !STRUCTURED_BUFFER_SUPPORT
void main(uint3 threadID : SV_DispatchThreadID, SAMPLER_UNIFORM Buffer<float> inVertices, SAMPLER_UNIFORM StructuredBuffer<SkinInfluence> inSkin, SAMPLER_UNIFORM RWBuffer<float> outVertices, SAMPLER_UNIFORM StructuredBuffer<float4x4> inMatrices)
#else
void main(uint3 threadID : SV_DispatchThreadID, SAMPLER_UNIFORM StructuredBuffer<MeshVertex> inVertices, SAMPLER_UNIFORM StructuredBuffer<SkinInfluence> inSkin, SAMPLER_UNIFORM RWStructuredBuffer<MeshVertex> outVertices, SAMPLER_UNIFORM StructuredBuffer<float4x4> inMatrices)
#endif
{
    const uint t = threadID.x;

    if (t >= g_VertCount)
    {
        return;
    }

#if !STRUCTURED_BUFFER_SUPPORT
    const MeshVertex vert = FetchVert(inVertices, t, VERTEX_STRIDE);
#else
    const MeshVertex vert = inVertices[t];
#endif
    SkinInfluence si = inSkin[t];

    float3 vPos = vert.pos.xyz;
#if SKIN_NORM
    float3 vNorm = vert.norm.xyz;
#endif
#if SKIN_TANG
    float3 vTang = vert.tang.xyz;
#endif

    float3 oPos = float3(0, 0, 0);
    float3 oNorm = float3(0, 0, 0);
    float4 oTang = float4(0, 0, 0, 0);

#if SKIN_BONESFORVERT == 0
    uint startIndex = si.index0;
    uint endIndex = inSkin[t + 1].index0;
    float4x4 blendedMatrix = 0;
    for (uint i = startIndex; i < endIndex; i++)
    {
        uint weightAndIndex = inSkin[i].index0;
        float weight = float(weightAndIndex >> 16) * (1.0f / 65535.0f);
        uint index = weightAndIndex & 0xFFFF;
        blendedMatrix += inMatrices[index] * weight;
    }
#elif SKIN_BONESFORVERT == 1
    const float4x4 blendedMatrix = inMatrices[si.index0];
#elif SKIN_BONESFORVERT == 2
    const float4x4 blendedMatrix = inMatrices[si.index0] * si.weight0 +
                                   inMatrices[si.index1] * si.weight1;
#elif SKIN_BONESFORVERT == 4
    const float4x4 blendedMatrix = inMatrices[si.index0] * si.weight0 +
                                   inMatrices[si.index1] * si.weight1 +
                                   inMatrices[si.index2] * si.weight2 +
                                   inMatrices[si.index3] * si.weight3;
#endif

    oPos = mul(blendedMatrix, float4(vPos, 1)).xyz;

#if SKIN_NORM
    oNorm = mul(blendedMatrix, float4(vNorm, 0)).xyz;
#endif

#if SKIN_TANG
    oTang.xyz = mul(blendedMatrix, float4(vTang, 0)).xyz;
    oTang.w = vert.tang.w;
#endif

#if STRUCTURED_BUFFER_SUPPORT
    outVertices[t].pos = oPos;
#if SKIN_NORM
    outVertices[t].norm = oNorm;
#endif
#if SKIN_TANG
    outVertices[t].tang = oTang;
#endif
#else
    StoreVert(outVertices, oPos, oNorm, oTang, t, VERTEX_STRIDE);
#endif
}
```
