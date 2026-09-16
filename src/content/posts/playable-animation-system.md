---
title: Playable API构建动画系统
slug: playable-animation-system
published: 2025-05-14
draft: false
description: ''
tags: []
category: 随笔
lang: zh_CN
kind: post
directory: blog/posts
route: /posts/playable-animation-system/
---

Playable 尝试构建动画系统的记录。
<!-- more -->

## Why

可控制动画加载策略，按需加载，异步加载。  
灵活控制PlayableGraph数据流，可插入自定义AnimationJob。  
加载自定义配置数据，和其他游戏系统配合。  
更高自由度的Override。

## 动作系统机制

动态过度时间：  
    比较角色当前pose和目标pose，差异越大，过渡时间越长。

按角色当前pose自动匹配目标动作：  
    如制作了多个跑步停止缓冲动作，不同脚部周期自动匹配到不同的动作

动作后处理：  
    叠加受击动作（参数化表现受击方向、力度）  
    IK

## 运动系统

基础运动：  
    走跑，跳跃，蹲伏，滑铲  
特殊运动：  
    翻越，攀爬，贴墙，

触发方式：  
离线标注-可控且精度高，但工作量大  
物理检测-运行时更加灵活，但有性能开销

### 运行时环境检测

坡度检测，用于上下坡动作融合；

自动跨越前方小障碍；

贴墙；

跳跃目标点连通性检测

### 优化方向

## Reference

[\[Unity 活动\]-Unity X 永劫无间「Unity大咖作客」线上分享会 — 动作动画专场【回放】\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1QN411f7WJ/?spm_id_from=333.337.search-card.all.click&vd_source=045b781ce97c08d03e566beb5f968ac4)
