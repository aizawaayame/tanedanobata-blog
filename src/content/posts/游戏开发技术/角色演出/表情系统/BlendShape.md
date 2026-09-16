---
title: BlendShape
slug: note-e3863cfcda94
published: 2025-05-12
draft: false
description: ''
tags: []
category: 游戏开发技术
lang: zh_CN
kind: note
directory: 游戏开发技术/角色演出/表情系统
route: /游戏开发技术/角色演出/表情系统/BlendShape/
---

## Blend Shape

blendshape的核心原理是存储多个预定义的网格变形（称为morph target或blend key），这些变形通常基于一个中性姿态（neutral pose）创建。

每个morph target代表一种特定的表情或姿势，例如“微笑”、“闭眼”或“扬眉”。

在动画过程中，顶点的属性（如位置、法线、纹理坐标）会在顶点着色器中通过线性插值（linear interpolation）进行混合，生成最终的动画效果。

数学上，blendshape可以表示为每个顶点的差值：​，然后通过权重组合计算最终位置。例如，对于面部动画，可以创建多个morph target（如“微笑”权重为0.5，“闭眼”权重为0.3），中性姿态的权重为1减去所有target权重的和，确保总和在0到1之间。

顶点动画则更广义，涵盖任何直接操作顶点属性的动画技术。blendshape是顶点动画的一种具体实现，特别适合需要高精度控制的场景，如面部表情、布料或皮肤的变形。相比之下，骨骼动画通过骨骼层次结构驱动顶点变形，适合更通用的角色动画。

## Tech

现代blendshape技术在GPU计算方面的优化已经非常成熟。DirectX 10引入了Stream-Out和Buffer-Template等特性，显著提升了blendshape的性能。例如，Stream-Out方法通过迭代处理将blendshape数据流式输出到缓冲区，适合处理多个blendshape的场景（如7次迭代处理54个blendshape中的50%以上）。Buffer-Template方法则允许在顶点着色器中直接访问blendshape数据，通过shader resource view实现单次绘制调用（draw call），性能更高。例如，在处理50个blendshape时，Buffer-Template方法比Stream-Out方法快2.4倍（见NVIDIA Developer的Figure 3-6）。  
Shader Model 5以上才能支持GPU加速。

另一个前沿技术是Vertex Animation Texture（VAT），它将动画数据烘焙（bake）到纹理中，在顶点着色器中通过采样纹理来驱动动画。这种方法特别适合处理大量简单动画对象，如游戏中的观众（例如Tennis Clash中的观众动画）。VAT将SkinnedMeshRenderer替换为MeshRenderer，保持网格在CPU上静态，减少CPU负载。在Samsung S6上测试，超过2000个实例（每个800顶点）无帧率下降。但VAT在动画混合方面存在局限性，可能会导致过渡时的“弹跳”效果（popping），通常通过确保初始和最终帧一致来缓解，如Tennis Clash的观众动画（闲置和鼓掌动画通过个体起始时间偏移实现有机效果）。VAT使用RGBAHalf（64位/像素）格式，但为支持更多设备，推荐使用RGB24（24位/像素），受限于OpenGLES 2.0的2048x2048纹理限制，适合顶点数≤2048的网格。

## VS Skeletal Skinning Animation

blendshape和骨骼蒙皮动画各有优势和劣势，具体选择取决于动画需求。

|        | BlendShape               | 骨骼蒙皮动画           |
| ------ | ------------------------ | ---------------- |
| 适用场景   | 面部表情、布料、皮肤等有机变形          | 通用角色动画           |
| 控制精度   | 高，允许直接定义每个顶点             | 低，依赖骨骼变换进行间接控制   |
| 动画混合   | 线性插值，可能出现“弹跳”，混合效果有限     | 支持复杂的状态过渡        |
| 内存使用   | 高，每个BS需要存储完整的顶点数据        | 低，仅存储骨骼变换        |
| 美术开发难度 | 高，美术工作量大                 | 低，骨骼动画开发快        |
| 性能     | GPU进行优化后高效               | 复杂骨骼可能增加CPU负载    |
| 技术局限   | 线性插值不适合旋转运动，可能需多target模拟 | 对精细变形（如面部细节）控制不足 |
