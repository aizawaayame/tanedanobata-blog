---
title: Actor生命周期
slug: note-67523ea29e6b
published: 2025-05-07
draft: false
description: ''
tags: []
category: UE
lang: zh_CN
kind: note
directory: UE/Framework/Actor
route: /UE/Framework/Actor/Actor生命周期/
---

![](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/ad3b6cf4-7965-4a29-a44c-43183cf16fab/actorlifecycle1.png)  
/// Caption  
**Actor生命周期**  
///

## Create

创建Actor方式有以下几种：

1. [从磁盘加载](/UE/Framework/Actor/Actor%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F/#load-from-disc)

2. [Play In Editor](/UE/Framework/Actor/Actor%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F/#play-in-editor)

3. [SpawnActor](/UE/Framework/Actor/Actor%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F/#spawnactor)

### Load From Disc

**从磁盘加载** 适用于关卡中已存在的 Actor：

1. 调用 `UEngine::LoadMap` 时。

2. 关卡流式传输调用 `UWorld::AddToWorld` 时。

### Play In Editor

**Play in Editor** 的Actor由编辑器中复制而来。

### SpawnActor

## BeginPlay

关卡开始后被调用。

## EndPlay

## GC

## Reference

[Unreal Engine Actor Lifecycle | Unreal Engine 5.5 Documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-actor-lifecycle)
