---
title: 堆
slug: note-978a4064919c
published: 2025-05-04
draft: false
description: ''
tags: []
category: Algorithm
lang: zh_CN
kind: directory
directory: Algorithm/数据结构/堆
route: /Algorithm/数据结构/堆/
---

# 堆

堆是一棵树，其每个节点都有一个键值，且每个节点的键值都大于等于/小于等于其父亲的键值。

每个节点的键值都大于等于其父亲键值的堆叫做小根堆，否则叫做大根堆。STL 中的 [priority_queue](https://oi-wiki.org/lang/csl/container-adapter/#%E4%BC%98%E5%85%88%E9%98%9F%E5%88%97)  其实就是一个大根堆。

（小根）堆主要支持的操作有：插入一个数、查询最小值、删除最小值、合并两个堆、减小一个元素的值。

一些功能强大的堆（可并堆）还能（高效地）支持 merge 等操作。
