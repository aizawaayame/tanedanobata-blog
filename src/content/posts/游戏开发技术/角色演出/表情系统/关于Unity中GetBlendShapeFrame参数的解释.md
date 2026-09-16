---
title: 关于Unity中GetBlendShapeFrame参数的解释
slug: note-40a8e36f25b0
published: 2025-05-12
draft: false
description: ''
tags: []
category: 游戏开发技术
lang: zh_CN
kind: note
directory: 游戏开发技术/角色演出/表情系统
route: /游戏开发技术/角色演出/表情系统/关于Unity中GetBlendShapeFrame参数的解释/
---

## Blend Shape Funcs in Unity

BlendShape在Unity中有以下的函数：
```cpp title="Mesh"
GetBlendShapeFrameWeight
GetBlendShapeFrameCount
GetBlendShapeFrameVertices
GetBlendShapeIndex
GetBlendShapeName
```

这几个函数涉及到两个参数 `shapeIndex` 和 `frameIndex`。

1. `shapeIndex`  
BlendShape按照导入时的顺序进行索引，可以通过 `GetBlendShapeName(index)` 获取指定索引对应的BlendShape名称

2. `frameIndex`  
指定BlendShape中的关键帧索引，大多数情况下每个BlendShape只有一个关键帧
