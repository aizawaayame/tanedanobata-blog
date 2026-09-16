---
title: 空间数据结构
slug: note-68964234e524
published: 2025-05-08
draft: false
description: ''
tags: []
category: Algorithm
lang: zh_CN
kind: directory
directory: Algorithm/数据结构/空间数据结构
route: /Algorithm/数据结构/空间数据结构/
---

## Quadtree

 **四叉树** ：

四叉树索引的基本思想是将地理空间递归划分为不同层次的树结构。  

它将已知范围的空间等分成四个相等的子空间，如此递归下去，直至树的层次达到一定深度或者满足某种要求后停止分割。

 **时间效率**:

四叉树的结构在空间数据对象分布比较均匀时，具有比较高的空间数据插入和查询效率（复杂度 $O(\log N)$）。

详细实现和优化思路见[四叉树](/Algorithm/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84/%E7%A9%BA%E9%97%B4%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84/%E5%9B%9B%E5%8F%89%E6%A0%91/)

## Bouding Volume Hierarchy Based On Tree

 **层次包围盒树(BVH)** ：

层次包围盒树（BVH树）是一棵多叉树，用来存储包围盒形状。  
它的根节点代表一个最大的包围盒，其多个子节点则代表多个子包围盒。

此外为了统一化层次包围盒树的形状，它只能存储同一种包围盒形状。

>  常见的包围盒形状有球体/AABB/OBB/k-DOP

### AABB Tree

 **AABB树**：把不同形状粗略用AABB形状围起来看作一个AABB形状（为了统一化形状），然后建立层次化的AABB树。  
![](https://cdn.jsdelivr.net/gh/aizawaayame/blogimage@main/img/%E7%A9%BA%E9%97%B4%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84-AABB%E6%A0%91.png)

在物理引擎里，由于物理模拟，大部分形状都是会动态更新的，例如位移/旋转都会改变形状。于是就又有一种支持动态更新的层次包围盒树，称之为动态层次包围盒树。

它的算法核心大概：形状的位移/旋转/伸缩更新对应的叶节点，然后一级一级更新上面的节点，使它们的包围体包住子节点。

### Bounding Sphere Tree

 **快速构造松散球体树的步骤** (以三角形为例):

1. 计算出包围所有三角边顶点的最小球体包围盒，作为根节点

2. 以球心为坐标系原点，其坐标系X轴划分出在该X轴左右的三角形，并将这些分别放入左子节点、右子节点中
> 还可以按X轴，Y轴，Z轴的顺序轮流划分，即第一次步骤2划分用X轴，第二次步骤2划分用Y轴…

3. 重复步骤1、2，最后得到一棵球体树

![](https://cdn.jsdelivr.net/gh/aizawaayame/blogimage@main/img/%E7%A9%BA%E9%97%B4%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84-%E7%90%83%E4%BD%93%E5%8C%85%E5%9B%B4%E7%9B%92%E6%A0%91.png)

这样生成的球体树是粗糙的，但是其平衡效果并不差，且最重要的是它的构造时间复杂度只有 $O(N \log N)$。

### Applications of BVH

#### Collision Detection

在Bullet、Havok等物理引擎的碰撞粗测阶段，使用一种叫做 **动态层次AABB包围盒树(Dynamic Bounding Volume Hierarchy Based On AABB Tree)** 的结构来存储动态的AABB形状。

然后通过该包围盒树的性质（不同父包围盒必定不会碰撞），快速过滤大量不可能发生碰撞的形状对。

#### Raycast Detection

射线检测从层次包围盒树自顶向下检测是否射线通过包围盒，若不通过则无需检测其子包围盒。  

这种剪裁可让每次射线检测平均只需检测 $O( \log N)$ 数量的形状。

通过一个点位置快速挑选该点的几何体也是类似的原理。

#### View Frustum Culling

对 **BVH** 树进行中序遍历的视锥测试，如果一个节点所代表的包围盒不在视锥范围内，那么其所有子节点所代表的包围盒都不会在视锥范围内，则可以跳过测试其子节点。

在这个遍历过程中，通过测试的节点所代表的几何体才可以发送渲染命令。

#### Ray Tracing Filtering

光线追踪渲染，可使用BVH来进行基于物体的划分，这样光线测试也可以过滤掉大量不必要的碰撞物体。

### Reference

- [Game Physics: Broadphase – Dynamic AABB Tree | Ming-Lun "Allen" Chou | 周明倫](http://allenchou.net/2014/02/game-physics-broadphase-dynamic-aabb-tree/)
- 《游戏编程精粹5(Game Programming Gems 5)》 Kim.Pallister [2007-9]
- [Real-Time Collision Detection for Dynamic Virtual  Environments](https://hal.inria.fr/inria-00537446/file/bounding_volume_hierarchies.pdf)

## Binary Space Partitioning Tree

 **二维空间分割树**：

BSP tree在3D空间下其每个节点表示一个平面，其代表的平面将当前空间划分为前向和背向两个子空间，分别对应左儿子和右儿子。

2D空间下，BSP树每个节点则表示一条边，也可以将2D空间划分成前后两部分。

![](https://cdn.jsdelivr.net/gh/aizawaayame/blogimage@main/img/%E7%A9%BA%E9%97%B4%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84-BSP.png)

### Application of BSP

### Reference

- [BSPTreesGameEngines-1](https://www.slideshare.net/JasonCalvert9/bsptreesgameengines1)
- [BSPTreesGameEngines-2](https://www.slideshare.net/JasonCalvert9/bsptreesgameengines2)
- [Quake3BSPRendering](https://www.slideshare.net/JasonCalvert9/quake3bsprendering)
- [Real-Time Rendering SPEEDING UP RENDERING Lecture 04 Marina Gavrilova. - ppt download](https://slideplayer.com/slide/7856440/)
- [BSP技术详解1 - Dreams - 博客园](https://www.cnblogs.com/dreams/archive/2007/03/25/687267.html#2012669)
- [BSP技术详解2 - Dreams - 博客园](https://www.cnblogs.com/dreams/archive/2007/03/25/687290.html)
- [BSP技术详解3 - Dreams - 博客园](https://www.cnblogs.com/dreams/archive/2007/03/25/687294.html)
- [BSP技术详解(补充）--pvs算法 - Dreams - 博客园](https://www.cnblogs.com/dreams/archive/2007/03/25/687300.html)
- [场景管理--BSP - bitbit - 博客园](https://www.cnblogs.com/skyofbitbit/p/4093453.html)
- 《游戏编程精粹5(Game Programming Gems 5)》Kim.Pallister [2007-9]
- 《游戏编程精粹6(Game Programming Gems 6)》Michael Dickheiser [2007-11]

## K-Dimensional Tree

K-d树是一棵二叉树，其每个节点都代表一个 k维坐标点：

- 树的每层都是对应一个划分维度（取决于你定义第i层是哪个维度）
- 树的每个节点代表一个超平面，该超平面垂直于当前划分维度的坐标轴，并在该维度上将空间划分为两部分，一部分在其左子树，另一部分在其右子树

实际上，k-d树就是一种特殊形式的BSP树（轴对齐的BSP树）。

例如一棵k-d树（k=2）的结构如图：  
![](https://cdn.jsdelivr.net/gh/aizawaayame/blogimage@main/img/20250508195755.png)

根据第一层划分维度为X，第二层为Y，第三层为X，  

所以该k-d树（k=2）对应代表划分的空间，看起来应该是这样的：

![](https://cdn.jsdelivr.net/gh/aizawaayame/blogimage@main/img/20250508195824.png)

### Application of K-Dimensional Tree

- 划分区域（不实用）：虽然k-d树也可以划分区域，但是k-d树的构建往往非常耗时，且不支持动态构建（即发生变化需要重新构建），因此目前游戏开发还是比较少用得上。
    
- 最近邻静态目标查找（很少用）：通过最近邻查找算法，可以剪枝了大量无需遍历的子树，效率提升得很好，其平均时间复杂度可以达到O(n1−1k)O(n1−1k)，k为维度。
