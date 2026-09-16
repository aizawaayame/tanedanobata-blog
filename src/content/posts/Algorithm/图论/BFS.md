---
title: BFS
slug: note-05fedb5e0971
published: 2025-04-22
draft: false
description: ''
tags: []
category: Algorithm
lang: zh_CN
kind: note
directory: Algorithm/图论
route: /Algorithm/图论/BFS/
---

## 概述

###  **What Is**

BFS 全称是 [Breadth First Search](https://en.wikipedia.org/wiki/Breadth-first_search)，也就是广度优先搜索。

所谓广度优先。就是每次都尝试访问同一层的节点。如果同一层都访问完了，再访问下一层。

###  **结果**

这样做的结果是，BFS 算法找到的路径是从起点开始的 **最短** 合法路径。换言之，这条路径所包含的边数最小。

在 BFS 结束时，**每个节点都是通过从起点到该点的最短路径访问的** 。

###  **本质**

在实现 BFS 的时候，本质上我们把未被访问过的节点放在一个称为 open 的容器中，而把已经访问过了的节点放在一个称为 closed 容器中。

## 链式前向星实现

###  实现代码

链式前向星的实现见[图的存储](/Algorithm/%E5%9B%BE%E8%AE%BA/%E5%9B%BE%E7%9A%84%E5%AD%98%E5%82%A8/)。


**伪代码**


```cpp
bfs(s){
    q = new queue()
    q.push(s);
    visited[s] = true;
    while(!q.empty())
    {
        u = q.pop();
        for each edge(u, v)
        {
            if (!visited[v])
            {
                q.push(v);
                visited[v] = true;
            }
        }
    }
}
```



**C++**


```cpp
struct Edge {
    int to;
    int next;
    int w;
};
// u代表起始的顶点
void bfs(int u) {
    queue<int> q;
    q.push(u);
    visited[u] = true;
    // 额外信息
    d[u] = 0;
    p[u] = -1;

    while (!q.empty())
    {
        u = q.front();
        q.pop();
        for (Edge e = head[u]; e.next != -1; e = edge[e.next].next)
        {
            if (!visited[e.to]) {
                q.push(e.to);
                visited[e.to] = true;

                d[e.to] = d[u] + 1;
                p[e.to] = u;
            }
        }
    }
}
```


###  **执行流程**

1. 队列 `Q` 记录需要处理的节点，以 `visited[]` 类标记节点是否已经被访问。

2. 初始化时，将起点 `s` 入队，并标记 `visited[s] = true`。

3. 每次从队列 `Q` 中取出队首的节点 `u`，然后把与 `u` 相邻的所有节点 `v` 标记为已访问过并放入队列 `Q`。

###  **性质**

1. 时间复杂度：$O(V + E)$

2. 空间复杂度：$O(V)$

###  **练习题**

[200. 岛屿数量 - 力扣（LeetCode）](https://leetcode.cn/problems/number-of-islands/description/)
