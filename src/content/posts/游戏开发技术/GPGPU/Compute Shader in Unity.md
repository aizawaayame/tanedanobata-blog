---
title: GPGPU in Unity
slug: note-8b1c9a43680a
published: 2025-05-26
draft: false
description: ''
tags: []
category: 游戏开发技术
lang: zh_CN
kind: note
directory: 游戏开发技术/GPGPU
route: /游戏开发技术/GPGPU/Compute Shader in Unity/
---

# GPGPU in Unity

首先从 Unity 应用的角度来看 GPGPU。Unity 想要使用 GPGPU, 需要用到 Compute Shader。  
定义一个简单的 ComputeShader：
```cpp
#pragma kernel CSMain

RWStructuredBuffer<float4> Result;

[numthreads(8,8,1)]
void CSMain (uint3 id : SV_DispatchThreadID)
{
    Result[id.xy] = float4(id.x & id.y, (id.x & 15)/15.0, (id.y & 15)/15.0, 0.0);
}
```

## kernel

`kernel` 指定核函数, Compute Shader 最终会在 C\# 层调用 `Dispatch` 函数来运行指定的核函数。
```cpp
public extern void Dispatch(  
  int kernelIndex,  
  int threadGroupsX,  
  int threadGroupsY,  
  int threadGroupsZ);
```

## Thread and Group

`Dispatch` 定义了计算的 **线程组** 的数量。  
numthread 定义了一个 **线程组 (Thread Group) 中被执行线程** 的总数量。  

Compute Shader 中需要理解与线程相关的 SV 的含义：  
定义 **由 Dispatch 函数决定** 的线程组 ID 定义为 $[gx, gy, gz]$ , 范围是 $[gX-1, gY-1, gZ-1]$。  
定义 **由 threadnumber 决定的** 线程组内线程 ID 定义为 $[tx,ty,tz]$, 范围是 $[tX-1, tY-1, tZ-1]$  
定义线程的 **全局唯一标识 ID** 的范围是 $[gX*tX-1,gY*tY-1,gZ*tZ-1]$

| SV                  | Type | Desc                             | Formula                        |
| ------------------- | ---- | -------------------------------- | ------------------------------ |
| SV_GroupID          | int3 | **由 Dispatch 函数决定** 的线程组 ID      |                                |
| SV_GroupThreadID    | int3 | **由 threadnumber 决定的** 线程组内线程 ID |                                |
| SV_DispatchThreadID | int3 | **全局唯一标识 ID**                    | $[gx*tX+tx,gy*tY+ty,gz*tZ+tz]$ |
| SV_GroupIndex       | int  | 线程所在线程组内的下标                      | $x+y*tX+z*tX*tY$               |
注意 group 和 thread 计数的时候, 都是将 x 作为最后的计数维度, z 作为最先技术的维度。

![image.png](https://cdn.jsdelivr.net/gh/aizawaayame/blogimage@main/img/20250526142026.png)  
[numthreads - Win32 apps \| Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/direct3dhlsl/sm5-attributes-numthreads)

## Static Value

```glsl
#pragma kernel CSMain

float3 boxSize1 = float3(1.0f, 1.0f, 1.0f); // 方法1
const float3 boxSize2 = float3(2.0f, 2.0f, 2.0f); // 方法2
static float3 boxSize3 = float3(3.0f, 3.0f, 3.0f); // 方法3

[numthreads(8,8,1)]
void CSMain (uint3 id : SV_DispatchThreadID)
{
    // 做判断
}
```
Computer Shader 遵循 HLSL 的语法规定。方法一和方法二初始化是无效的, 在 CSMain 中会读取到 $(0,0,0)$。只有方法三才能读取到初始化的值。

## Code in CPU

在 CPU 层, 核心只需要做两件事情：  
1. Data Transfer  
2. Dispatch

### Data Transfer

核心是定义基础数据结构或者 StructBuffer, 然后通过 `ComputeShader` 的 `Set` 方法将 CPU 的数据传递给 GPU。

### Dispatch

调用 `ComputeShader` 的 `Dispatch` 函数, 触发核函数的计算。一般是回写到 `RWStructBuffer` 或者其他 RW 的 GPU 结构。

回写之后, 可以在显存中直接取用已经计算好的数据。
