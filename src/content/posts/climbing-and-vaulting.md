---
title: 一种使用多数地形的攀爬和翻越思路
slug: climbing-and-vaulting
published: 2025-05-14
draft: false
description: ''
tags: []
category: 随笔
lang: zh_CN
kind: post
directory: blog/posts
route: /posts/climbing-and-vaulting/
---

一种多地形适配的攀爬和翻越思路。
<!-- more -->

## 基本思路

![image.png](https://cdn.jsdelivr.net/gh/aizawaayame/blogimage@main/img/%E4%B8%80%E7%A7%8D%E9%80%82%E7%94%A8%E5%A4%9A%E6%95%B0%E5%9C%B0%E5%BD%A2%E7%9A%84%E6%94%80%E7%88%AC%E5%92%8C%E7%BF%BB%E8%B6%8A%E6%80%9D%E8%B7%AF-%E5%9F%BA%E6%9C%AC%E6%80%9D%E8%B7%AF.png)

1. 从膝盖发出射线检测墙体
2. 从上向下打射线检测出攀爬点
3. 向前从上到下再打一个射线

## 攀爬和翻越的区别

![image.png](https://cdn.jsdelivr.net/gh/aizawaayame/blogimage@main/img/%E4%B8%80%E7%A7%8D%E9%80%82%E5%BA%94%E5%A4%9A%E6%95%B0%E5%9C%B0%E5%BD%A2%E7%9A%84%E6%94%80%E7%88%AC%E5%92%8C%E7%BF%BB%E8%B6%8A%E6%80%9D%E8%B7%AF-%E7%BF%BB%E8%B6%8A%E5%92%8C%E6%94%80%E7%88%AC%E7%9A%84%E5%8C%BA%E5%88%AB.png)

攀爬的高度要求更高  

## 存在的问题

无法检测窗框  
![image.png](https://cdn.jsdelivr.net/gh/aizawaayame/blogimage@main/img/%E7%A7%8D%E4%BD%BF%E7%94%A8%E5%A4%9A%E6%95%B0%E5%9C%B0%E5%BD%A2%E7%9A%84%E6%94%80%E7%88%AC%E5%92%8C%E7%BF%BB%E8%B6%8A%E6%80%9D%E8%B7%AF-%E6%97%A0%E6%B3%95%E6%A3%80%E6%B5%8B%E7%AA%97%E6%A1%86.png)

陡峭楼梯会被识别为厚墙触发攀爬动作  
![image.png](https://cdn.jsdelivr.net/gh/aizawaayame/blogimage@main/img/%E7%A7%8D%E4%BD%BF%E7%94%A8%E5%A4%9A%E6%95%B0%E5%9C%B0%E5%BD%A2%E7%9A%84%E6%94%80%E7%88%AC%E5%92%8C%E7%BF%BB%E8%B6%8A%E6%80%9D%E8%B7%AF-%E9%99%A1%E5%B3%AD%E6%A5%BC%E6%A2%AF%E8%A2%AB%E8%AF%86%E5%88%AB%E4%B8%BA%E5%8E%9A%E5%A2%99.png)

1. 有个洞，但太厚无法翻越
2. 即可翻越又可攀爬
3. 下方是破碎的
4. 悬空物体  
![image.png](https://cdn.jsdelivr.net/gh/aizawaayame/blogimage@main/img/%E4%B8%80%E7%A7%8D%E4%BD%BF%E7%94%A8%E5%A4%9A%E6%95%B0%E5%9C%B0%E5%BD%A2%E7%9A%84%E6%94%80%E7%88%AC%E5%92%8C%E7%BF%BB%E8%B6%8A%E6%80%9D%E8%B7%AF-%E6%9E%81%E7%AB%AF%E6%83%85%E5%86%B5%E7%9A%84%E8%AF%86%E5%88%AB.png)

## 检测思路

### 判断墙的厚度

碰撞检测能获得碰撞点的法向量，沿法向量反方向检测墙的厚度。
- 墙厚->只能站上去，执行攀爬。
- 墙薄->玩家在移动，执行翻越。
- 墙薄->玩家未移动，执行攀爬。
