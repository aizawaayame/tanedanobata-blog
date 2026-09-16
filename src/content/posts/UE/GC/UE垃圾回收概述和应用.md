---
title: UE垃圾回收概述和应用
slug: note-6dc8f943025a
published: 2025-04-09
draft: false
description: ''
tags: []
category: UE
lang: zh_CN
kind: note
directory: UE/GC
route: /UE/GC/UE垃圾回收概述和应用/
---

## 算法

| 分类  | 方式           | 描述                                                                                                                                                   |
| --- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 分类一 | 引用计数式        | 通过额外的计数来实时计算对单个对象的引用次数，当引用次数为0时回收对象。<br>如：微软COM对象。句柄功能的引用值以及C++中的智能指针都是通过引用计数来实现GC的                                                                  |
|     | **追踪式（UE）**  | 达到GC条件时（内存不够用，到达GC回收的时或者强制GC）通过引擎系统中是否有对象的引用来判断对象是否存活，然后回收无引用对象                                                                                      |
| 分类二 | 保守式          | 不能准确识别某一个无用的对象（比如在32位程序中的一个4字节的值，它是不能判断出它是一个对象指针还是一个数字的），但是能保证在不会错误回收存活的对象的情况下回收一部分无用对象。<br>不需要额外的数据来支持查找对象的引用，它所有的内存数据假定为指针。通过一些条件来判定这个指针是否是一个合法的对象 |
|     | **精确式（UE）**  | 在回收过程中能准确得到别的回收每一个无用对象的GC方式，为了准确识别每一个对象的引用，通过需要一些额外的数据（比如在类中的属性UPROPERTY）                                                                            |
| 分类三 | 搬迁式          | GC过程中需要移动对象在内存中的位置，当然移动对象位置后需要修正所有引用到这个对象的地方更新到新的位置（有的通过句柄来实现，而有的可能需要修改所有引用内存的指针）。                                                                   |
|     | **非搬迁式（UE）** | 在GC过程中不需要移动对象的内存位置                                                                                                                                   |
| 分类五 | 增量式          | 不会在对象被弃时立即回收占用的内存资源，而是在GC达成一定条件时进行回收操作                                                                                                               |
|     | **非增量式（UE）** | 在对象被抛弃时立即回收占用的内存资源                                                                                                                                   |



UE的垃圾回收机制采用 **追踪式，精确式，非搬迁式，非渐进式** 的 **Mark-Sweep** 算法。



## 直接或间接被根节点引用的方法

1. 调用 `AddToRoot` 函数，将UObject对象添加到根节点。(1)  


1. `RemoveFromRoot` 能去除 `EInternalObjectFlags::RootSet` 标记。

2. 通过 `UPROPERTY` 保持引用。(1)  


1. `UPROPERTY` 宏修饰 `UObject*` 成员变量。  
   `UObject*` 放在 `UPROPERTY` 宏修饰的 `TArray`、`TMap` 中也能保持引用。

> Unreal implements a garbage collection scheme whereby `UObjects` that are no longer referenced or have been explicitly flagged for destruction will be cleaned up at regular intervals. The engine builds a reference graph to determine which `UObjects` are still in use and which ones are orphaned. At the root of this graph is a set of `UObjects` designated as the "root set". Any `UObject` can be added to the root set. When garbage collection occurs, the engine can track all referenced `UObjects` by searching the tree of known `UObject` references, starting from the root set. Any unreferenced `UObjects`, meaning those which are not found in the tree search, will be assumed to be unneeded, and will be removed.
>
> [Unreal Object Handling in Unreal Engine \| Unreal Engine 5.5 Documentation \| Epic Developer Community](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-object-handling-in-unreal-engine#garbagecollection)

## 针对UPROPERTY的优化设计

UE源码中，能看到很多的Property并没有被标记为 `UPROPERTY`。这种设计往往会通过持有引用的方式来保证不被垃圾回收。

这样做的目的是优化垃圾回收的性能，减少特别追踪的数量。
