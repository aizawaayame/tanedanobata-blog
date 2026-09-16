---
title: 简历归档
slug: resume-archive
published: 2025-04-29
draft: false
description: ''
tags: []
category: 随笔
lang: zh_CN
kind: post
directory: blog/posts
route: /posts/resume-archive/
---

简历归档
<!-- more -->
[Typst](https://typst.app/project/pyA4QmHXNzyKmfwXBRjszS)
```
#import "template.typ": *

// 主题颜色
#let theme-color = rgb("#26267d")
#let icon = icon.with(fill: theme-color)

// 设置图标, 来源: https://fontawesome.com/icons/
#let fa-award = icon("icons/fa-award.svg")
#let fa-building-columns = icon("icons/fa-building-columns.svg")
#let fa-code = icon("icons/fa-code.svg")
#let fa-envelope = icon("icons/fa-envelope.svg")
#let fa-github = icon("icons/fa-github.svg")
#let fa-graduation-cap = icon("icons/fa-graduation-cap.svg")
#let fa-linux = icon("icons/fa-linux.svg")
#let fa-phone = icon("icons/fa-phone.svg")
#let fa-windows = icon("icons/fa-windows.svg")
#let fa-wrench = icon("icons/fa-wrench.svg")
#let fa-work = icon("icons/fa-work.svg")

// 设置简历选项与头部
#show: resume.with(
  // 字体和基准大小
  size: 10pt,
  // 标题颜色
  theme-color: theme-color,
  // 控制纸张的边距
  margin: (
    top: 1.5cm,
    bottom: 2cm,
    left: 2cm,
    right: 2cm,
  ),

  // 如果需要姓名及联系信息居中，请删除下面关于头像的三行参数，并取消headerCenter的注释
  //headerCenter : true,

  // 如果不需要头像，则将下面三行的参数注释或删除
  // photograph: "profile.jpg",
  // photograph-width: 10em,
  // gutter-width: 2em,
)[
  = 王朝伟

  #info(
    color: theme-color,
    (
      icon: fa-phone,
      content: "(+86) 189-1869-1145",
    ),
    (
      icon: fa-envelope,
      content: "aizawaayame@outlook.com",
      link: "mailto:aizawaayame@outlook.com",
    ),
    (
      icon: fa-github,
      content: "github.com/aizawaayame/OnaGameSample",
      link: "https://github.com/aizawaayame/OnaGameSample",
    ),
  )
][
  #h(2em)

  拥有 #text(weight: "bold")[3 年] 游戏客户端开发经验，在米哈游期间，#text(weight: "bold")[主导并深度参与] 了多个核心系统的设计、开发与优化，包括基于 PCG 的表情系统、高性能编辑器 Canvas 渲染基建、灵活的 Playable 动画系统以及组件化相机约束系统。

  擅长*演出动画系统和工具链开发*，在提升内容创作效率方面有丰富经验。具备跨部门协作能力，能将复杂技术转化为高效生产工具。

  同时对 UE 反射系统、垃圾回收、动画系统有了解和个人项目实践经验。对UE技术有浓厚兴趣。
]


== #fa-graduation-cap 教育背景

#sidebar(with-line: true, side-width: 12%)[
  2018.09

  2022.07
][
  *哈尔滨工业大学* 

  计算机科学与技术专业
]

== #fa-work 工作经历
#sidebar(with-line: true, side-width: 12%)[
  2022.08

  至今
][
  *米哈游* · 原神组 · 客户端开发

    - 主导多个核心功能模块的架构设计与开发，包括表情系统、编辑器UI基础设施和动画系统
    - 深入优化编辑器性能，利用GPU合批和GPGPU思想，大幅度优化项目组的编辑器开发效率和性能
    - 建立内容创作工具链和自动化流程，提升团队工作效率，支持每6周稳定迭代6000+对话内容
    - 了解UE核心功能，了解Gameplay框架、反射系统、垃圾回收和动画系统底层机制
]

#sidebar(with-line: true, side-width: 12%)[
  2021.07

  2021.11
][
  *腾讯* · j2工作室-全境封锁项目组 · UE客户端开发实习

  - 参与behaviac行为树逻辑的维护
  - 学习UE的整体架构，了解UE行为树的设计
]

== #fa-wrench 专业技能

#sidebar(with-line: false, side-width: 12%)[
  *编程语言*
  
  *图形渲染*
  
  *动画系统*
  

  *工具开发*
][
  C++(熟悉)、C\#(熟练)、HLSL/GLSL(了解)
  
  GPU实例化、计算着色器、了解渲染管线、空间数据结构
  
  理解骨骼动画系统、Playable架构、状态机设计、动画混合空间
  

  编辑器扩展开发、自动化生产流水线设计、美术工具链构建
]


== #fa-code 项目经历

#item(
  [ *表情系统架构升级与 PCG 系统实现* ]
)

#tech[ 表情系统，PCG ]

基于 PCG 的表情构建管线

 - 主导设计并实现了程序化表情生成系统，实现从文本和音频到面部表情的自动映射，大幅度提升表情制作效率。
 - 整合MFCC音频特征提取和NLP情感分析算法，构建精确的语音-表情映射关系，支持多语言本地化。
 - 设计标记驱动的分层编辑架构，支持表情批量生成和精细调整两种工作流，实现每6周迭代稳定产出6000+对话表情。
#item(
  [ *编辑器 Canvas 图形系统重构* ]
)

#tech[ 编辑器, 图形编程, UI架构 ]

一个支持高性能绘制的编辑器UI系统

- 主导编辑器 UI 渲染基础设施的重构，采用 GPU 实例化合批技术，极大提升编辑器 UI 渲染性能。
- 应用 GPGPU 计算着色器技术处理大量 UI 元素的变换计算，特别针对曲线绘制场景有大幅度的性能优化。
- 实现了自定义的四叉树空间管理算法，优化了大量 UI 元素的剔除和渲染提交，提高了编辑器响应速度。
- 设计了高效的 GPU 资源管理机制，实现不同视口大小的无缝切换。

#item(
  [ *演出动画系统迭代与 Playable 技术引入* ]
)

#tech[ 动画系统, Playable ]

一个支持自由拓展的基于Playable的动画系统

- 参与引入 Playable 动画系统，实现了非侵入式的动画叠加功能，使演出动画与角色状态机解耦。
- 开发了动态动画创建和运行时混合框架，支持在任意游戏时刻无缝插入和融合复杂动画序列。

#item(
  [ *演出相机系统架构优化* ]
)

#tech[ 相机，演出系统 ]

一个支持多种约束的演出相机系统

- 参与设计并实现了组件化的相机约束系统，支持多种约束条件的组合与优先级管理。
- 实现美术最常用的曲线约束，跟随约束和目标点旋转约束等约束功能，优化演出效果，提高了美术的产能。

== #fa-github 个人项目

#item(
  link(
    "https://github.com/aizawaayame/OnaGameSample",
    [ *基于ALS的个人项目* ]
  )
)
#item(
link(
"https://www.tanedanobata.top/Project/OnaGameSample/",
[ 技术博客: OnaGameSample ]
)
)
#tech[ 相机，动画，ALS ]

用C++重写ALS并重构部分系统

- 使用纯C++重写了Advanced Locomotion System的核心功能，实现了轻量级、高性能的角色运动系统。
- 设计了模块化的Camera Stack架构，支持多种相机效果叠加和平滑过渡。



```


## 原首页履历（2025-04-02）

# 教育背景

**学位**：哈尔滨工业大学-计算机科学与技术专业-本科  
**时间段**：2018 年 9 月-2022 年 7 月  
**学信网在线验证码**：AVT75TLTCJ0RM8XV

# 求职意向

游戏客户端开发工程师 / Unreal Engine (UE) C++ 工程师

# 个人概述

拥有 3 年游戏客户端开发经验。在动画系统、相机系统及编辑器工具开发方面积累了一定经验。了解虚幻引擎核心机制，包括反射系统、垃圾回收、动画系统。  
专注于动画模块，演出模块开发及工具链构建

# 专业技能

- 编程语言：C++(熟悉)、C#(熟练)
- 动画系统：熟悉 Unity Playable 动画系统，了解 UE 动画状态机
- 工具开发：构建面向内容创作的编辑器工具链、自动化流程设计
- 引擎使用：了解 UE Gameplay 架构，反射系统和垃圾回收机制

# 项目经验

**米哈游|游戏客户端开发**：2022 年7 月-至今  

## 表情系统架构升级与 PCG 系统实现

- 主导设计并实现了基于程序化内容生成 (PCG) 的表情系统，大幅度提升表情制作效率。每 6 周迭代能稳定产出 6000+条对话的表情。
- 结合 MFCC 音频特征提取和 NLP 情感分析技术，构建了自动化表情生成管线，实现了从文本到面部表情的映射。
- 设计了标记驱动的表情系统编辑架构，支持批量生成和精细调整两种生产模式，满足不同品质需求。

## 编辑器 Canvas 图形系统重构

- 主导编辑器 UI 渲染基础设施的重构，采用 GPU 实例化合批技术，极大提升编辑器 UI 渲染性能。
- 应用 GPGPU 计算着色器技术处理大量 UI 元素的变换计算，特别针对曲线绘制场景有大幅度的性能优化。
- 实现了自定义的四叉树空间管理算法，优化了大量 UI 元素的剔除和渲染提交，提高了编辑器响应速度。
- 设计了高效的 GPU 资源管理机制，实现不同视口大小的无缝切换。

## 演出动画系统迭代与 Playable 技术引入

- 参与引入 Playable 动画系统，实现了非侵入式的动画叠加功能，使演出动画与角色状态机解耦。
- 开发了动态动画创建和运行时混合框架，支持在任意游戏时刻无缝插入和融合复杂动画序列。

## 演出相机系统架构优化

- 参与设计并实现了组件化的相机约束系统，支持多种约束条件的组合与优先级管理。
- 实现美术最常用的曲线约束，跟随约束和目标点旋转约束等约束功能，优化演出效果，提高了美术的产能。

# 个人项目

用UE C++重写ALS项目。实现文档[走跑混合 - 种田的黄油](/Project/OnaGameSample/%E8%B5%B0%E8%B7%91%E6%B7%B7%E5%90%88/)
- 用C++逻辑重写动画相关逻辑。
- (进行中)用Camera Stack设计思路重构相机模块。  
项目地址[GitHub - aizawaayame/OnaGameSample: Rewrite the ALS project using C++.](https://github.com/aizawaayame/OnaGameSample)
