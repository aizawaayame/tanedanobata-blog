---
title: 散文分镜语言：用于电影标注与导演的工具
slug: prose-storyboard-language-zh
published: 2026-10-12
draft: false
description: 一种用文字精确描述电影镜头的形式语言：从画面构图、演员调度到摄影机运动，附完整中文译文、英文对照、图例与语法。
tags: [论文翻译, 镜头语言, PSL]
category: 游戏开发
lang: zh_CN
kind: post
directory: ''
route: /posts/prose-storyboard-language-zh/
---

<span id="top" class="psl-anchor" aria-hidden="true"></span>

<div class="psl-controls" role="group" aria-label="论文阅读选项">
<button type="button" data-psl-english-toggle aria-pressed="false">展开全部英文对照</button>
<a href="#glossary">查看术语表</a>
</div>

<p class="psl-original-title" lang="en">The Prose Storyboard Language: A Tool for Annotating and Directing Movies</p>

<p class="psl-authors"><a href="https://orcid.org/0000-0003-4830-5690">Rémi Ronfard</a><sup>1</sup> · <a href="https://orcid.org/0000-0001-8861-7731">Vineet Gandhi</a><sup>2</sup> · Laurent Boiron<sup>3</sup> · <a href="https://orcid.org/0000-0001-9455-3391">Vaishnavi Ameya Murukutla</a><sup>1</sup></p>

<div class="psl-affiliations">

<sup>1</sup> 法国格勒诺布尔-阿尔卑斯大学、Inria、CNRS、格勒诺布尔理工学院、LJK

<sup>2</sup> 印度海得拉巴国际信息技术学院

<sup>3</sup> 新西兰 Weta Digital

<details class="psl-english">
<summary>机构原名</summary>

<div lang="en">

1 Univ. Grenoble Alpes, Inria, CNRS, Grenoble INP, LJK, France<br/>

2 International Institute of Information Technology, Hyderabad, India<br/>

3 Weta Digital, New Zeland

</div>

</details>

</div>

<div class="psl-paper-meta">

<span>8 节正文</span>

<span>21 幅图</span>

<span>1 张统计表</span>

<span>44 条参考文献</span>

<a href="https://arxiv.org/abs/1508.07593v5">arXiv 论文</a>

<a href="https://arxiv.org/pdf/1508.07593v5">英文 PDF</a>

</div>

<p class="psl-edition-note">本文根据英文论文翻译。正文中的“我们”指原论文作者；补充解释标为“译注”。PSL 关键字、人物标识符和原始图例保持原样，可展开英文对照阅读。</p>

<span id="abstract" class="psl-anchor" aria-hidden="true"></span>

## 摘要<small lang="en">Abstract</small>

<div class="psl-translation-unit" data-source-block="b001" id="b001">

散文分镜语言（Prose Storyboard Language，简称 PSL）是一种逐镜头描述电影的形式语言：每个镜头用一个独立的句子来表达。它采用简明的语法和数量有限的词汇，词汇来自传统电影制作实践，因此既便于人阅读，也便于机器处理。过去十年间，我们持续设计这门语言，希望将它用作智能摄影与剪辑系统的高层交互接口。本文介绍这项工作的最新进展，以及一次大规模人工标注的结果。这些结果表明，PSL 有助于细致描述经典电影中复杂而精巧的摄影与剪辑手法。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>The prose storyboard language is a formal language for describing movies shot by shot, where each shot is described with a unique sentence. The language uses a simple syntax and limited vocabulary borrowed from working practices in traditional movie-making and is intended to be readable both by machines and humans. The language has been designed over the last ten years to serve as a high-level user interface for intelligent cinematography and editing systems. In this new paper, we present the latest evolution of the language, and the results of an extensive annotation exercise showing the benefits of the language in the task of annotating the sophisticated cinematography and film editing of classic movies.</p>

</div>

</details>

</div>

<p class="psl-ccs">CCS 分类：应用计算 → 媒体艺术 <span lang="en">Applied computing → Media arts</span></p>

<span id="section-1" class="psl-anchor" aria-hidden="true"></span>

## 引言<small lang="en">Introduction</small>

<div class="psl-translation-unit" data-source-block="b003" id="b003">

在电影制作中，导演常用一套有一定约定、但并不严格形式化的说法，向摄影师说明自己想要的镜头。电影研究者在向读者分析已有影片的画面构图时，也会使用类似的表达。我们认为，要构建具有智能、又能充分表达创作意图的虚拟摄影与剪辑系统，就需要对这类高层描述形成共同约定。本文提出的形式语言正是为此而设计的。

我们的首要目标是构建摄影软件智能体：以形式化描述为输入，将描述具体实现为镜头。另一个目标是用这门语言自动分析实拍电影及其剧本，从而深入研究电影风格。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>In movie production, directors often use a semi-formal idiom of natural language to convey the shots they want to their cinematographer. Similarly, film scholars use a semi-formal idiom of natural language to describe the visual composition of shots in produced movies to their readers. In order to build intelligent and expressive virtual cinematography and editing systems, we believe the same kind of high-level descriptions need to be agreed upon. In this paper, we propose a formal language that can serve that role. Our primary goal in proposing this language is to build software cinematography agents that can take such formal descriptions as input, and produce fully realized shots as an output. A secondary goal is to perform in-depth studies of film style by automatically analyzing real movies and their scripts in terms of the proposed language.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b004" id="b004">

PSL 描述镜头的视觉内容，声音部分留待后续研究。它将两件事分开表达：单幅电影画面的空间结构，即“构图”；以及画面在时间上的组织，即“镜头”。电影分析经常混淆这两个概念。例如，“中景”说明的是某一时刻的构图，并不能概括整个镜头。如果演员在同一个镜头里走近摄影机，画面就可能由中景变为近景。

因此，一门通用的镜头描述语言，不能只列出中景、近景等构图，还必须能描述镜头内部使构图发生变化的画面事件。在 PSL 中，一个镜头对应一个完整的句子，句中至少包含一种构图，也可以包含任意数量的画面事件。这使它在描述电影和指导拍摄方面具有以往方法所不具备的表达能力。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>The prose storyboard language is a formal language for describing shots visually. We leave the description of the soundtrack for future work. The prose storyboard language separately describes the spatial structure of individual movie frames (compositions) and their temporal structure (shots). In film analysis, there is frequent confusion between shots and compositions. A <em>medium shot</em> describes a composition, not a shot. If the actor moves towards the camera in the same shot, the composition will change to a <em>close shot</em> and so on. Therefore, a general language for describing shots cannot be limited to describing compositions such as <em>medium shot</em> or <em>close shot</em> but should also describe screen events which change the composition during the shot. In the prose storyboard language, each shot is a complete sentence with at least one composition and an arbitrary number of screen events. This offers unprecedented expressive power for describing and directing movies.</p>

</div>

</details>

</div>

<p class="psl-translator-note">译注：本文的 shot 指两次剪辑点之间的一段连续画面；composition 指其中某一时刻的画面组织。因此，一个镜头可以包含多种构图。“摄影镜头”则指光学镜头（lens），与这里的 shot 不同。</p>


<div class="psl-translation-unit" data-source-block="b005" id="b005">

PSL 可以用于电影制作的不同阶段：前期筹备时，影片还只存在于编剧和导演的设想中；拍摄时，摄影机记录导演喊“开机”到“停”之间的一段连续画面；后期制作时，剪辑师对镜头进行裁切和组接。它也可以用来描述已经完成的电影。在这些情况下，描述方法相同：一部电影写成一列有先后顺序的句子，每个句子对应一个镜头。特殊情况下，一部单镜头电影——例如阿尔弗雷德·希区柯克的《夺魂索》——可以用一个很长的句子描述。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Our language can be used indifferently to describe shots in pre-production (when the movie only exists in the screen-writer and director's minds), during production (when the camera records a continuous "shot" between the times when the director calls "camera" and "cut"), in post-production (when shots are cut and assembled by the film editor) or to describe existing movies. The description of an entire movie is an ordered list of sentences, one per shot. Exceptionally, a movie with a single shot, such as Rope by Alfred Hitchcock, can be described with a single, long sentence.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b006" id="b006">

本文假定所有镜头描述都由人工编写。如何从已有影片自动生成散文分镜，是一个重要问题，但不在本文的研究范围内；现有技术可为这项后续工作提供基础 <a aria-label="参考文献 Bra97" class="psl-cite" href="#ref-Brand97">[Bra97]</a> <a aria-label="参考文献 DMR05" class="psl-cite" href="#ref-DMR05">[DMR05]</a> <a aria-label="参考文献 GCSS06" class="psl-cite" href="#ref-GoldmanCSS06">[GCSS06]</a> <a aria-label="参考文献 GR13" class="psl-cite" href="#ref-GR13">[GR13]</a>。另一个同样留待后续研究的难题，是如何根据散文分镜自动生成电影；这方面可以利用已有的虚拟摄影机控制技术 <a aria-label="参考文献 HCS96" class="psl-cite" href="#ref-He96">[HCS96]</a> <a aria-label="参考文献 CAwH*96" class="psl-cite" href="#ref-Christianson96">[CAwH*96]</a> <a aria-label="参考文献 JY06" class="psl-cite" href="#ref-Jhala06">[JY06]</a> <a aria-label="参考文献 CO06" class="psl-cite" href="#ref-CO06">[CO06]</a> <a aria-label="参考文献 GCR*13" class="psl-cite" href="#ref-Galvane2013">[GCR*13]</a> <a aria-label="参考文献 GRCS14" class="psl-cite" href="#ref-Galvane2014">[GRCS14]</a> <a aria-label="参考文献 GCLR15" class="psl-cite" href="#ref-Galvane2015">[GCLR15]</a>。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>In this paper, we assume that all shot descriptions are manually created. We leave for future work the important issue of automatically generating prose storyboards from existing movies, where a number of existing techniques can be used <a aria-label="参考文献 Bra97" class="psl-cite" href="#ref-Brand97">[Bra97]</a> <a aria-label="参考文献 DMR05" class="psl-cite" href="#ref-DMR05">[DMR05]</a> <a aria-label="参考文献 GCSS06" class="psl-cite" href="#ref-GoldmanCSS06">[GCSS06]</a> <a aria-label="参考文献 GR13" class="psl-cite" href="#ref-GR13">[GR13]</a>. We also leave for future work the difficult problems of automatically generating movies from their prose storyboards, where existing techniques in virtual camera control can be used <a aria-label="参考文献 HCS96" class="psl-cite" href="#ref-He96">[HCS96]</a> <a aria-label="参考文献 CAwH*96" class="psl-cite" href="#ref-Christianson96">[CAwH*96]</a> <a aria-label="参考文献 JY06" class="psl-cite" href="#ref-Jhala06">[JY06]</a> <a aria-label="参考文献 CO06" class="psl-cite" href="#ref-CO06">[CO06]</a> <a aria-label="参考文献 GCR*13" class="psl-cite" href="#ref-Galvane2013">[GCR*13]</a> <a aria-label="参考文献 GRCS14" class="psl-cite" href="#ref-Galvane2014">[GRCS14]</a> <a aria-label="参考文献 GCLR15" class="psl-cite" href="#ref-Galvane2015">[GCLR15]</a>.</p>

</div>

</details>

</div>

<figure class="psl-paper-figure" data-figure="1" id="fig-1">

<figcaption><span class="psl-fig-number">图 01</span><h3>《精疲力尽》：复杂镜头</h3></figcaption>

<img alt="图 1：《精疲力尽》中的复杂镜头，含原始画面和完整解析树" decoding="async" height="679" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-01.png" width="1756"/>

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">Composition · 初始构图</th><td lang="en"><code>high angle LS Pat 34backleft</code></td><td>俯拍远景：Pat 以左后侧三分之四面朝向摄影机。</td></tr><tr><th scope="row">Event · 事件</th><td lang="en"><code>while Pat moves to screen left</code></td><td>与此同时，Pat 向画面左侧移动。</td></tr><tr><th scope="row">Recomposition 1 / CameraTo</th><td lang="en"><code>then pan left to</code></td><td>接着，摄影机向左摇摄，形成下一种构图：</td></tr><tr><th scope="row">Recomposition 1 / Composition</th><td lang="en"><code>high angle LS Mi Pat left</code></td><td>俯拍远景：从左到右为 Mi、Pat，两人以左侧面朝向摄影机。</td></tr><tr><th scope="row">Recomposition 2 / Cue</th><td lang="en"><code>then as Mi moves to screen left</code></td><td>接着，以 Mi 向画面左侧移动为动作提示，</td></tr><tr><th scope="row">Recomposition 2 / CameraTo</th><td lang="en"><code>pan left to</code></td><td>摄影机向左摇摄，形成下一种构图：</td></tr><tr><th scope="row">Recomposition 2 / Composition</th><td lang="en"><code>high angle LS Mi 34backleft</code></td><td>俯拍远景：Mi 以左后侧三分之四面朝向摄影机。</td></tr></tbody></table></div>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Complex shot in Breathless</p>

</div>

</details>

</figure>

<span id="section-2" class="psl-anchor" aria-hidden="true"></span>

## 相关工作<small lang="en">Prior art</small>

<div class="psl-translation-unit" data-source-block="b008" id="b008">

PSL 的设计参考了电影制作惯例 <a aria-label="参考文献 TB09b" class="psl-cite" href="#ref-Thompson09a">[TB09b]</a> <a aria-label="参考文献 TB09a" class="psl-cite" href="#ref-Thompson09b">[TB09a]</a>，也借鉴了电影风格史研究 <a aria-label="参考文献 Bor98" class="psl-cite" href="#ref-Bordwell98">[Bor98]</a> <a aria-label="参考文献 Sal09" class="psl-cite" href="#ref-Salt09">[Sal09]</a>。它与常见的绘图分镜同样密切相关。在绘图分镜中，每种构图用一幅画来表示；摄影机与演员的调度，则可以通过画面中的约定箭头、单独绘制的俯视平面图，或画格之间的文字说明来表达。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Our language is loosely based on existing practices in movie-making <a aria-label="参考文献 TB09b" class="psl-cite" href="#ref-Thompson09a">[TB09b]</a> <a aria-label="参考文献 TB09a" class="psl-cite" href="#ref-Thompson09b">[TB09a]</a> and previous research in the history of film style <a aria-label="参考文献 Bor98" class="psl-cite" href="#ref-Bordwell98">[Bor98]</a> <a aria-label="参考文献 Sal09" class="psl-cite" href="#ref-Salt09">[Sal09]</a>. Our language is also related to the common practice of graphic storyboards. In a graphic storyboard, each composition is illustrated with a single drawing. The blocking of the camera and actors can be depicted with a conventional system of arrows within each frame, or with a separate set of floor plan views, or with titles between frames.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b009" id="b009">

在 PSL 中，从一种构图到另一种构图的变化，用一小组“画面事件”来表达。这些事件包括摄影机动作，如摇摄（pan）、移动摄影（dolly）、升降摄影（crane）、保持静止（hold）和继续（continue）；也包括演员动作，如说话（speak）、作出反应（react）、移动（move）和交错通过（cross）。动作词汇很容易扩充，但我们有意将其控制在较小范围内，因为本文关注的是演员与摄影机的调度，而不是故事情节的高层含义。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>In our case, the transitions between compositions use a small vocabulary of screen events including camera actions (pan, dolly, crane, hold, continue) and actor actions (speak, react, move, cross). Although the action vocabulary could easily be extended, we voluntarily keep it small because our focus in this paper is restricted to the blocking of actors and cameras, not the high-level semantics of the narrative.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b010" id="b010">

“散文分镜”（prose storyboard）一词借自 Proferes <a aria-label="参考文献 Pro08" class="psl-cite" href="#ref-Proferes08">[Pro08]</a>。他用这一方法将电影剧本拆分为一系列镜头，并以自然语言描述每个镜头。其他作者也用法语词“découpage”指称电影制作中的这一重要步骤。这个名称传达了一种直觉：文字描述应当能够直接转化为影像。与 Proferes 的方法不同，我们的 PSL 是一门具有明确语法和语义的形式语言，可作为后续智能摄影与剪辑研究的基础。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>We borrow the term prose storyboard from Proferes <a aria-label="参考文献 Pro08" class="psl-cite" href="#ref-Proferes08">[Pro08]</a> who used it as a technique for decomposing a films script into a sequence of shots, expressed in natural language. Other authors use the French term "decoupage" to describe this important step in film production. The name catches the intuition that the language should directly translate to images. In contrast to Proferes, our prose storyboard language is a formal language, with a well-defined syntax and semantics, suitable for future work in intelligent cinematography and editing.</p>

</div>

</details>

</div>

<p class="psl-translator-note">译注：“散文”在这里指用连续文字写分镜，而非一种文学体裁；PSL 的句子仍须遵守形式语法，不能任意改写。</p>


<div class="psl-translation-unit" data-source-block="b011" id="b011">

PSL 与电影剧本标记语言（Movie Script Markup Language，MSML）<a aria-label="参考文献 RKV*09" class="psl-cite" href="#ref-RijsselbergenKVMW09">[RKV*09]</a> 可以互补。MSML 编码的是剧本结构：它将剧本划分为对白块和动作块，却不说明这些内容如何呈现为具体镜头。PSL 则可以结合 MSML 编码的剧本，描述影片中各个镜头的调度。MSML 为此预留了制作模型（Manufacturing model）和动画模型（Animation model），但对二者的规定较为宽泛。PSL 可以视为这两种模型的另一种表示方式。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Our proposal is complementary to the Movie Script Markup Language (MSML) <a aria-label="参考文献 RKV*09" class="psl-cite" href="#ref-RijsselbergenKVMW09">[RKV*09]</a>, which encodes the structure of a movie script. In MSML, a script is decomposed into dialogue and action blocks but does not describe how each block is translated into shots. Our prose storyboard language can be used to describe the blocking of the shots in a movie in relation to an MSML-encoded movie script. For this purpose, MSML makes provision for a Manufacturing model and Animation model, which are only loosely described. The prose storyboard language can be seen as an alternative representation for both the Manufacturing and Animation models in MSML.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b012" id="b012">

PSL 也与声明式摄影机控制语言（Declarative Camera Control Language，DCCL）有关。DCCL 用画面坐标中的镜头来描述电影惯用手法，而不是用世界坐标中的摄影机参数来描述 <a aria-label="参考文献 CAwH*96" class="psl-cite" href="#ref-Christianson96">[CAwH*96]</a>。DCCL 会被编译成一棵“电影树”，其中包含针对输入动作的所有可能剪辑方案；动作本身表示为“主语—动词—宾语”三元组。PSL 可以与这样的结构配合，指导更丰富的镜头类型，包括复杂镜头和发展镜头。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Our proposal is also related to the Declarative Camera Control Language (DCCL) which describes film idioms, not in terms of cameras in world coordinates but in terms of shots in screen coordinates <a aria-label="参考文献 CAwH*96" class="psl-cite" href="#ref-Christianson96">[CAwH*96]</a>. The DCCL is compiled into a film tree, which contains all the possible editings of the input actions, where actions are represented as subject-verb-object triples. Our prose storyboard language can be used in coordination with such constructs to guide a more extensive set of shot categories, including complex and developing shots.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b013" id="b013">

Jhala 和 Young 的研究也与我们的方法有关。他们以希区柯克的《夺魂索》为例，说明应当如何向自动剪辑系统表示故事情节与导演意图 <a aria-label="参考文献 JY06" class="psl-cite" href="#ref-Jhala06">[JY06]</a>。他们使用偏序因果链规划器 Crossbow，按照维持节奏、表现情绪等不同策略求解最佳剪辑方案，并展示了同一段情节可以采用不同的剪辑风格。不过，这项工作没有尝试描述可供选择的镜头集合。PSL 希望补上这一环节。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Our approach is also related to the work of Jhala and Young who used the movie Rope by Alfred Hitchcock to demonstrate how the storyline and the director's goal should be represented to an automatic editing system <a aria-label="参考文献 JY06" class="psl-cite" href="#ref-Jhala06">[JY06]</a>. They used Crossbow, a partial order causal link planner, to solve for the best editing, according to a variety of strategies, including maintaining tempo and depicting emotion. They demonstrated the capability of their solver to present the same sequence in different editing styles. But their approach does not attempt to describe the set of possible shots. Our prose storyboard language attempts to fill that gap.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b014" id="b014">

其他虚拟摄影研究 <a aria-label="参考文献 SMAY03" class="psl-cite" href="#ref-Shen03">[SMAY03]</a> <a aria-label="参考文献 JY05" class="psl-cite" href="#ref-Jhala05">[JY05]</a> <a aria-label="参考文献 FF06" class="psl-cite" href="#ref-Friedman06">[FF06]</a> <a aria-label="参考文献 ORN09" class="psl-cite" href="#ref-ONeillRN09">[ORN09]</a> <a aria-label="参考文献 MJSB11" class="psl-cite" href="#ref-MarkowitzKSB11">[MJSB11]</a> <a aria-label="参考文献 GRCS14" class="psl-cite" href="#ref-Galvane2014">[GRCS14]</a> <a aria-label="参考文献 GCLR15" class="psl-cite" href="#ref-Galvane2015">[GCLR15]</a> <a aria-label="参考文献 LDTA17" class="psl-cite" href="#ref-Leake2017">[LDTA17]</a> 大多局限于较简单的镜头：摄影机要么静止，要么只作一种匀速运动。PSL 可以与这些工作互补，为现有的大多数虚拟摄影系统定义更高层的电影表现策略，包括摄影机运动与演员动作的任意复杂组合。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Other previous work in virtual cinematography <a aria-label="参考文献 SMAY03" class="psl-cite" href="#ref-Shen03">[SMAY03]</a> <a aria-label="参考文献 JY05" class="psl-cite" href="#ref-Jhala05">[JY05]</a> <a aria-label="参考文献 FF06" class="psl-cite" href="#ref-Friedman06">[FF06]</a> <a aria-label="参考文献 ORN09" class="psl-cite" href="#ref-ONeillRN09">[ORN09]</a> <a aria-label="参考文献 MJSB11" class="psl-cite" href="#ref-MarkowitzKSB11">[MJSB11]</a> <a aria-label="参考文献 GRCS14" class="psl-cite" href="#ref-Galvane2014">[GRCS14]</a> <a aria-label="参考文献 GCLR15" class="psl-cite" href="#ref-Galvane2015">[GCLR15]</a> <a aria-label="参考文献 LDTA17" class="psl-cite" href="#ref-Leake2017">[LDTA17]</a> has been limited to simple shots with either a static camera or a single uniform camera movement. Our prose storyboard language is complementary to such previous work and can be used to define higher-level cinematic strategies, including arbitrarily complex combinations of camera and actor movements, for most existing virtual cinematography systems.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b015" id="b015">

“文本生成电影”（text-to-movie）或“文本生成场景”（text-to-scene）是一类根据自然语言文本自动生成三维图形与动画的创作方法。在限定领域内，这些方法已经取得了不错的效果，例如根据自然语言撰写的事故报告生成三维场景 <a aria-label="参考文献 ASSN03" class="psl-cite" href="#ref-Akerberg2003">[ASSN03]</a>，或根据对白场景脚本生成卡通动画 <a aria-label="参考文献 SY06" class="psl-cite" href="#ref-Seversky2006">[SY06]</a>。已有商业系统包括 NawmalMAKE 和 Plotagon Studio。这些系统以带标记的对白为输入，生成的镜头较简单，摄影机运动和剪辑变化也较少。相关研究还包括 Ye 和 Baldwin 根据电影剧本生成分镜的方法 <a aria-label="参考文献 YB08" class="psl-cite" href="#ref-Ye2008">[YB08]</a>，以及 Marti 等人根据电影剧本生成预演动画（previz）的方法 <a aria-label="参考文献 MVW*18" class="psl-cite" href="#ref-Marti2018">[MVW*18]</a>。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Text-to-movie (or text-to-scene) authoring is a general class of methods that have been proposed for automatically generating 3D graphics and animation from natural language text. Good results have been obtained in limited domains, such as generating 3D scenes from natural language accident reports <a aria-label="参考文献 ASSN03" class="psl-cite" href="#ref-Akerberg2003">[ASSN03]</a> or generating cartoon animation from scripted dialogue scenes <a aria-label="参考文献 SY06" class="psl-cite" href="#ref-Seversky2006">[SY06]</a>. Commercially available text-to-movie systems include NawmalMAKE and Plotagon Studio Such systems use marked-up dialogues as input and generate simple shots with minimal camera movements and editing. Other related work along the same lines includes Ye and Baldwin <a aria-label="参考文献 YB08" class="psl-cite" href="#ref-Ye2008">[YB08]</a> who describe a method for generating storyboards from movie scripts; Marti et al. <a aria-label="参考文献 MVW*18" class="psl-cite" href="#ref-Marti2018">[MVW*18]</a> who describe methods for generating previz animation, also from movie scripts.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b016" id="b016">

与 PSL 更接近的是导演记谱法（Director Notation，DN）<a aria-label="参考文献 Yan13" class="psl-cite" href="#ref-Yannopoulos2013">[Yan13]</a>。它试图像乐谱记录音乐那样，用一套符号来表达电影内容。不过，DN 使用图形符号，PSL 则采用接近自然语言的表达；DN 描述电影的制作过程，PSL 则像分镜一样描述电影本身。TIMISTO <a aria-label="参考文献 VHL*13" class="psl-cite" href="#ref-Vogt2013">[VHL*13]</a> 和 SLAP <a aria-label="参考文献 BS16" class="psl-cite" href="#ref-Braga2016">[BS16]</a> 则是用于从分镜生成动画的模式语言。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Closer to our approach, Director Notation <a aria-label="参考文献 Yan13" class="psl-cite" href="#ref-Yannopoulos2013">[Yan13]</a> is a symbolic language intended to express the content of film (motion pictures), much as musical notation provides a language for the writing of music. But DN is a graphical notation whereas PSL is a pseudo-natural language, and DN describes the movie production process, whereas PSL describes the movie itself, as in a storyboard. TIMISTO <a aria-label="参考文献 VHL*13" class="psl-cite" href="#ref-Vogt2013">[VHL*13]</a> and SLAP <a aria-label="参考文献 BS16" class="psl-cite" href="#ref-Braga2016">[BS16]</a> are pattern languages for creating animation from storyboards.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b017" id="b017">

PSL 最早于 2012 年在智能摄影与剪辑国际研讨会（WICED）上提出。此后，基于 PSL 的不同变体被用于多种任务：为严肃游戏生成具有电影感的回放 <a aria-label="参考文献 GRCS14" class="psl-cite" href="#ref-Galvane2014">[GRCS14]</a>；根据实拍视频合成复杂镜头 <a aria-label="参考文献 GRG14" class="psl-cite" href="#ref-GR14">[GRG14]</a> <a aria-label="参考文献 GR15" class="psl-cite" href="#ref-GR15">[GR15]</a>；为三维动画中的复杂场景安排调度 <a aria-label="参考文献 LCL18" class="psl-cite" href="#ref-Louarn18">[LCL18]</a>；指挥航拍无人机 <a aria-label="参考文献 GLC*18" class="psl-cite" href="#ref-Galvane2018">[GLC*18]</a>；以及从示例中学习电影剪辑模式 <a aria-label="参考文献 WPRC18" class="psl-cite" href="#ref-Wu2018">[WPRC18]</a>。本文给出定稿后的语言设计、大量示例及参考实现，希望推动电影自动标注与生成的后续研究。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>A previous version of the prose storyboard language was presented at the international workshop on intelligent cinematography and editing (WICED) in 2012. Since then, several variations of PSL have been used for generating cinematic replays in serious games <a aria-label="参考文献 GRCS14" class="psl-cite" href="#ref-Galvane2014">[GRCS14]</a>, for generating synthetic complex shots from live video material <a aria-label="参考文献 GRG14" class="psl-cite" href="#ref-GR14">[GRG14]</a> <a aria-label="参考文献 GR15" class="psl-cite" href="#ref-GR15">[GR15]</a>, for staging complex scenes in 3D animation <a aria-label="参考文献 LCL18" class="psl-cite" href="#ref-Louarn18">[LCL18]</a>, for directing cinematographic drones <a aria-label="参考文献 GLC*18" class="psl-cite" href="#ref-Galvane2018">[GLC*18]</a> and for learning film editing patterns from examples <a aria-label="参考文献 WPRC18" class="psl-cite" href="#ref-Wu2018">[WPRC18]</a>. In this revised edition, we provide a definitive version of the language, illustrated with a large number of examples and a reference implementation, in the hope that it will stimulate future work in automatic annotation and generation of movies.</p>

</div>

</details>

</div>

<figure class="psl-paper-figure" data-figure="2" id="fig-2">

<figcaption><span class="psl-fig-number">图 02</span><h3>希区柯克《西北偏北》中两个经典镜头的 PSL 描述</h3></figcaption>

<img alt="图 2：阿尔弗雷德·希区柯克《西北偏北》中两个标志性镜头的 PSL 描述，含原始画面和完整解析树" decoding="async" height="553" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-02.png" width="843"/>

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">Scene / Shot 1 / Composition</th><td lang="en"><code>low angle FS Plane MS Th front</code></td><td>仰拍构图：从左到右，Plane 以全景呈现，Th 以中景呈现并正对摄影机。</td></tr><tr><th scope="row">Scene / Shot 2 / Transition</th><td lang="en"><code>cut to</code></td><td>切到下一个镜头。</td></tr><tr><th scope="row">Scene / Shot 2 / Composition</th><td lang="en"><code>MLS Th 34right</code></td><td>中远景：Th 以右前侧三分之四面朝向摄影机。</td></tr></tbody></table></div>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Prose storyboard language description of two iconic shots in Alfred Hitchcock's North By Northwest</p>

</div>

</details>

</figure>

<span id="section-3" class="psl-anchor" aria-hidden="true"></span>

## 设计要求<small lang="en">Requirements</small>

<div class="psl-translation-unit" data-source-block="b019" id="b019">

PSL 的设计目标是兼顾表达能力、简洁性和直观性：既要能够描述任意复杂的镜头，又要让简单镜头的描述尽可能简单，只在确有需要时增加复杂度。例如，我们按画面从左到右的顺序列出构图中的演员；在大多数情况下，这样既简洁又直观地交代了他们的相对位置。因此，PSL 的表达形式与自然语言十分接近，示例见图 <a class="psl-xref" href="#fig-21">21</a>。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>The prose storyboard language is designed to be expressive, i.e. it should describe arbitrarily complex shots, while at the same time being compact and intuitive. Our approach has been to keep the description of simple shots as simple as possible, and allowing for more complex descriptions when needed. Thus, for example, we describe actors in composition from left to right, which is an economical and intuitive way of specifying relative actor positions in most cases. As a result, our prose storyboard language is very close to natural language (see Fig.<a class="psl-xref" href="#fig-21">21</a> for examples).</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b020" id="b020">

这门语言应当便于解析，并产生无歧义的语义表示。这种表示需要能够与视频内容对应，既可用于描述已有影像，也可用于生成符合描述的新影像。因此，至少从理论上说，任意一句 PSL 都应当能够先转化为草图分镜，再进一步转化为完整的动画片段。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>It should be easy to parse the language into a non-ambiguous semantic representation that can be matched to video content, either for the purpose of describing existing content or for generating novel content that matches the description. It should therefore be possible (at least in theory) to translate any sentence in the language into a sketch storyboard, then to a fully animated sequence.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b021" id="b021">

反过来，从已有视频生成散文分镜，理论上也应当可行。这带来另一项要求：除地点和人物名称外，观看镜头本身就应当足以写出描述，无须依赖其他背景信息。这样，PSL 既能标注整部电影，也能用于后期制作前的素材镜头记录。即使进入后期，标注者通常也无法掌握拍摄方案的全部细节 <a aria-label="参考文献 Mur86" class="psl-cite" href="#ref-Murch86">[Mur86]</a> <a aria-label="参考文献 Ond04" class="psl-cite" href="#ref-Ondaatje04">[Ond04]</a>。因此，语言必须允许仅凭画面坐标描述镜头，而不必引用世界坐标。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>It should also be theoretically possible to translate existing video content into a prose storyboard. This puts another requirement on the language, that it should be possible to describe existing shots just by watching them. There should be no need for contextual information, except for place and character names. As a result, the prose storyboard language can also be used as a tool for annotating complete movies and for logging shots before post-production. Since the annotator has no access to the details of the shooting plan, even during post-production <a aria-label="参考文献 Mur86" class="psl-cite" href="#ref-Murch86">[Mur86]</a> <a aria-label="参考文献 Ond04" class="psl-cite" href="#ref-Ondaatje04">[Ond04]</a>, we must therefore make it possible to describe the shots in screen coordinates, without any reference to world coordinates.</p>

</div>

</details>

</div>

<span id="section-4" class="psl-anchor" aria-hidden="true"></span>

## 语法与语义<small lang="en">Syntax and semantics</small>

<div class="psl-translation-unit" data-source-block="b023" id="b023">

PSL 是一种上下文无关语言，其终结符分为通用词汇和场景专用词汇。通用词汇描述主要的画面事件，包括摄影机动作，如 pan、dolly、cut、dissolve，以及演员动作，如 enter、exit、cross、move、speak、react。场景专用词汇则是人物、地点和物体的名称；这些元素既出现在画面中，也参与故事。

非终结符包括镜头的主要类别（简单镜头、复杂镜头和发展镜头）、画面构图，以及镜头内的后续变化。图 <a class="psl-xref" href="#fig-14">14</a> 用 AND/OR 图展示完整语法，图 <a class="psl-xref" href="#fig-15">15</a> 给出 PEG 记法。使用 Python 和 Parsimonious 工具包解析 PSL 句子的参考实现见 <a href="https://gitlab.inria.fr/vmurukut/psl">https://gitlab.inria.fr/vmurukut/psl</a>。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>The prose storyboard language is a context-free language, whose terminals include generic and specific terms. Generic terminals are used to describe the main categories of screen events including camera actions (pan, dolly, cut, dissolve, etc.) and actor actions (enter, exit, cross, move, speak, react, etc.). Specific terminals are the names of characters, places and objects that compose the image and play a part in the story. Non-terminals of the language include important categories of shots (simple, complex, developing), image compositions and developments. The complete grammar for the language is illustrated with the AND/OR graph in Fig. <a class="psl-xref" href="#fig-14">14</a> and described in the PEG notation in Fig.<a class="psl-xref" href="#fig-15">15</a>. A reference implementation using the Parsimonious toolkit for parsing PSL sentences using the Python language can be found at <a href="https://gitlab.inria.fr/vmurukut/psl">https://gitlab.inria.fr/vmurukut/psl</a>.</p>

</div>

</details>

</div>

<p class="psl-translator-note">译注：“终结符”是句子最终写出的具体词，如 pan 和人物名称；“非终结符”是组织这些词的语法类别，如 Shot、Composition。图 15 中，每条规则左侧是类别名称，右侧说明它如何展开。</p>


<div class="psl-translation-unit" data-source-block="b024" id="b024">

PSL 的语义最适合用时间 Petri 网（Timed Petri Net，TPN）来描述：持续一段时间的事件，例如某种构图的持续或摄影机动作，用“库所”（place）表示；瞬时事件，例如切镜头，或其他事件的开始与结束，用“变迁”（transition）表示。我们选择时间 Petri 网，而不是有限状态机，是为了表达发展镜头中演员与摄影机同时展开的复杂调度。例如，奥逊·威尔斯《历劫佳人》的开场镜头就包含这种并发运动。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>The semantics of the prose storyboard language is best described in terms of a Timed Petri Net (TPN) where durative events such as compositions and camera actions are represented as <em>places</em> ; and instantaneous events (such as cuts and the start and end of other events) are represented as <em>transitions</em>. We use timed Petri nets, rather than finite state machines, as a semantic representation of shots in a prose storyboard, in order to adequately represent developing shots with an elaborate choreography of actor and camera movements taking place simultaneously, such as the opening shot in Orson Welles' "Touch of evil".</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b025" id="b025">

时间 Petri 网此前已被用于表示电影剧本的时间结构 <a aria-label="参考文献 RKV*09" class="psl-cite" href="#ref-RijsselbergenKVMW09">[RKV*09]</a>、角色动画 <a aria-label="参考文献 MRR98" class="psl-cite" href="#ref-Magalhaes98">[MRR98]</a> <a aria-label="参考文献 BvKR01" class="psl-cite" href="#ref-Blackwell01">[BvKR01]</a>、游戏创作 <a aria-label="参考文献 BBAG08" class="psl-cite" href="#ref-BalasBAG08">[BBAG08]</a>、对话中的轮流发言 <a aria-label="参考文献 Cha12" class="psl-cite" href="#ref-Chao12">[Cha12]</a>，以及多媒体系统的同步与存储模型 <a aria-label="参考文献 LG90" class="psl-cite" href="#ref-Little1990SynchronizationAS">[LG90]</a>。我们的方法与这些工作不同：所有持续事件都用库所表示，再用变迁协调它们的时序。受篇幅所限，PSL 的 Petri 网解释将留待后续工作详细介绍。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>TPNs have been proposed for representing the temporal structure of movie scripts <a aria-label="参考文献 RKV*09" class="psl-cite" href="#ref-RijsselbergenKVMW09">[RKV*09]</a>, character animation <a aria-label="参考文献 MRR98" class="psl-cite" href="#ref-Magalhaes98">[MRR98]</a> <a aria-label="参考文献 BvKR01" class="psl-cite" href="#ref-Blackwell01">[BvKR01]</a>, game authoring <a aria-label="参考文献 BBAG08" class="psl-cite" href="#ref-BalasBAG08">[BBAG08]</a>, turn-taking in conversation <a aria-label="参考文献 Cha12" class="psl-cite" href="#ref-Chao12">[Cha12]</a> and synchronisation and storage models for multimedia systems <a aria-label="参考文献 LG90" class="psl-cite" href="#ref-Little1990SynchronizationAS">[LG90]</a>. Our model differs from previous work by representing all durative events with places and using transitions to synchronize them. For lack of space, we differ the description of the Petri Net interpretation of the prose storyboard language to future work.</p>

</div>

</details>

</div>

<figure class="psl-paper-figure" data-figure="3" id="fig-3">

<figcaption><span class="psl-fig-number">图 03</span><h3>景别与人物朝向</h3></figcaption>

<p class="psl-figure-caption">（a）PSL 使用的景别分类，图片转载自 <a aria-label="参考文献 Sal06" class="psl-cite" href="#ref-Salt06">[Sal06]</a>。（b）人物的朝向角表示其身体相对于摄影机的方向。例如，left 表示人物以自己的左侧面朝向摄影机。</p>

<div class="psl-figure-images">

<div class="psl-subfigure">

<img alt="（a）景别" decoding="async" height="226" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-03-a.png" width="271"/>

（a）景别

</div>

<div class="psl-subfigure">

<img alt="（b）朝向角" decoding="async" height="321" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-03-b.png" width="450"/>

（b）朝向角

</div>

</div>

<p class="psl-translator-note">译注：图中的 front/back 表示正面/背面，left/right 表示人物自身的左/右侧面朝向摄影机。3/4 left/right 是左/右前侧三分之四面，3/4 backleft/backright 是左/右后侧三分之四面。这些名称描述摄影机看见人物的哪一面，不是人物站在画面的哪一边。PSL 将 3/4 连写为 34。</p>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>(a) shows shot sizes in the prose storyboard (reproduced from [Sal06]). (b) shows the profile angle of an actor defines his orientation relative to the camera. For example, an actor with a left profile angle is oriented with his left side facing the camera.</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="4" id="fig-4">

<figcaption><span class="psl-fig-number">图 04</span><h3>景别与画面位置</h3></figcaption>

<p class="psl-figure-caption">（a）景别取决于摄影机与人物之间的距离，也取决于摄影镜头的焦距。（b）构图中人物的水平位置，用画面坐标表示。</p>

<div class="psl-figure-images">

<div class="psl-subfigure">

<img alt="（a）景别的依据" decoding="async" height="488" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-04-a.png" width="562"/>

（a）景别的依据

</div>

<div class="psl-subfigure">

<img alt="（b）屏幕坐标" decoding="async" height="283" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-04-b.png" width="432"/>

（b）屏幕坐标

</div>

</div>

<p class="psl-translator-note">译注：Placement 表示位置分布；screenleft/screenright 表示画面左侧/右侧；center 表示中央；cam 表示摄影机。图中的 1/4、1/3 是位置比例标记。（a）以 BCU 表示大特写，但图 15 的 Size 规则未列出这个缩写；阅读时应注意图示与语法清单的这一差异。</p>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Shot size is a function of the distance between the camera and actors, as well as the camera focal length, as seen in (a). (b) shows the horizontal placement of actors in a composition is expressed in screen coordinates.</p>

</div>

</details>

</figure>

<span id="section-5" class="psl-anchor" aria-hidden="true"></span>

## 画面构图<small lang="en">Image Composition</small>

<div class="psl-translation-unit" data-source-block="b027" id="b027">

画面构图，就是在电影画面中组织视觉元素，以向观众传达特定信息。本文提出一种形式化描述方法：以画面中的人物和物体为基础，描述它们之间的空间关系与时间关系。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Image composition is the way to organise visual elements in the motion picture frame to deliver a specific message to the audience. In our work, we propose a formal way to describe image composition in terms of the actors and objects present on the screen and the spatial and temporal relations between them.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b028" id="b028">

依据 Thomson 和 Bowen 的定义 <a aria-label="参考文献 TB09b" class="psl-cite" href="#ref-Thompson09a">[TB09b]</a>，我们将构图理解为：各个视觉元素在画面坐标中的相对位置与朝向。这些视觉元素统称为“主体”（Subject）。在较简单的平面调度（flat staging）中，主体大致处于同一纵深平面，在画面中的大小也相近；纵深调度（deep staging）则将主体安排在不同纵深处，使它们在画面中呈现不同大小。

为了兼容这两种情况，PSL 分别标明每个主体的景别。于是，每个主体都由景别、朝向角和画面位置三个方面来描述。图 <a class="psl-xref" href="#fig-3">3b</a> 和图 <a class="psl-xref" href="#fig-3">3b</a> 提供了直观示意。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Following Thomson and Bowen <a aria-label="参考文献 TB09b" class="psl-cite" href="#ref-Thompson09a">[TB09b]</a>, we define a composition as the relative position and orientation of visual elements called <em>Subject</em>, in screen coordinates. In the simple case of <em>flat staging</em>, all subjects are more or less in the same plane with the same size, but in the case of <em>deep staging</em>, different subjects are seen at different sizes, in different planes. For the sake of generality, we therefore choose to indicate the size of each subject separately. As a result, each subject is defined by its size, profile angle, and screen position. See Fig. <a class="psl-xref" href="#fig-3">3b</a> and <a class="psl-xref" href="#fig-3">3b</a> for a visual explanation.</p>

</div>

</details>

</div>

<p class="psl-translator-note">译注：英文原文在这里两次引用图 3(b)。该图说明人物朝向；景别的示意实际位于图 3(a)。正文保留原文引用，阅读时可结合两幅图理解。</p>

<div class="psl-translation-unit" data-source-block="b029" id="b029">

我们约定按画面从左到右的顺序描述主体。换言之，人物和物体的左右排列顺序本身就是构图信息的一部分。这一顺序在摄影和剪辑中非常重要，因此 PSL 专门引入 `cross` 关键字，描述一个主体与另一个主体交错通过的画面事件，并以 `over` / `under` 区分两者的相对关系。景别则描述主体在画面中的相对大小，无须指定所用摄影镜头，参见图 <a class="psl-xref" href="#fig-4">4a</a>。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>As a convention, we assume that the subjects are described from left to right. This means that the left-to-right ordering of actors and objects is part of the composition. Indeed, because the left-to-right ordering of subjects is so important in cinematography and film editing, we introduce a special keyword <em>cross</em> for the screen event of one subject crossing over or under another subject. Shot sizes are used to describe the relative sizes of subjects independently of the camera lens as illustrated in Fig.<a class="psl-xref" href="#fig-4">4a</a>.</p>

</div>

</details>

</div>

<p class="psl-translator-note">译注：cross 关注的是两个主体在画面中的交错与左右顺序变化。原文使用 over/under 区分交错关系，但没有进一步给出几何判定规则，因此示例保留这两个关键词，不将其机械地译为从对方头顶越过或从脚下钻过。阅读图 10 等示例时，可先比较前后两幅画面中人物的排列。</p>


<div class="psl-translation-unit" data-source-block="b030" id="b030">

`Screen` 项描述主体在画面坐标中的位置。它允许在一般取景的基础上作小幅调整，例如把主体移向画面的左侧或右侧，见图 <a class="psl-xref" href="#fig-4">4b</a>。默认的 `Screen` 值表示对称构图，主体从左到右均匀分布；指定其他值则可以表达非对称构图，例如为头顶或视线前方留出空间，或遵循三分法。PSL 也能描述非常规取景，用于营造有意失衡的构图，或让场景中的其他视觉元素进入画面。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>The <code>Screen</code> term describe the subject position in screen coordinate. It allows to slightly modify the generic framing by shifting the subject position to the left or right corner as shown in Fig.<a class="psl-xref" href="#fig-4">4b</a>. Default <code>Screen</code> values are used to describe symetric compositions where subjects are evenly distributed from left to right. Non-default <code>Screen</code> values are used to describe asymetric compositions, e.g. taking into account head room and look room or the rules of thirds. We can also describe unconventional framing to create unbalanced artistic composition or to show other visual elements in the scene.</p>

</div>

</details>

</div>

<figure class="psl-paper-figure" data-figure="5" id="fig-5">

<figcaption><span class="psl-fig-number">图 05</span><h3>单人构图</h3></figcaption>

<p class="psl-figure-caption">布莱恩·德·帕尔马的《剃刀边缘》（Dressed to Kill，1980）中的一帧：从低角度仰拍人物的大特写。</p>

<div class="psl-figure-images">

<div class="psl-subfigure">

<img alt="low angle ECU Girl 34left" decoding="async" height="299" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-05.jpg" width="501"/>

low angle ECU Girl 34left

</div>

</div>

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">构图</th><td lang="en"><code>low angle ECU Girl 34left</code></td><td>仰拍大特写：Girl 以左前侧三分之四面朝向摄影机。</td></tr></tbody></table></div>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Single actor composition in Prose Storyboard Language. This frame from Brian De Palma's Dressed To Kill (1980) shows an extreme close up shot from a low angle.</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="6" id="fig-6">

<figcaption><span class="psl-fig-number">图 06</span><h3>双人构图</h3></figcaption>

<p class="psl-figure-caption">（a）文森特·明奈利的歌舞片《篷车队》（The Band Wagon，1953）；（b）让-吕克·戈达尔的法国新浪潮电影《狂人皮埃罗》（Pierrot le Fou，1965）。两幅画面中都有两名人物，以不同景别呈现。</p>

<div class="psl-figure-images">

<div class="psl-subfigure">

<img alt="（a）FS Cyd 34right Fred front" decoding="async" height="629" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-06-a.jpg" width="976"/>

（a）FS Cyd 34right Fred front

</div>

<div class="psl-subfigure">

<img alt="（b）MS Girl 34backright Ferdinand front" decoding="async" height="367" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-06-b.jpg" width="853"/>

（b）MS Girl 34backright Ferdinand front

</div>

</div>

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">（a）</th><td lang="en"><code>FS Cyd 34right Fred front</code></td><td>全景，从左到右：Cyd 以右前侧三分之四面朝向摄影机；Fred 正对摄影机。</td></tr><tr><th scope="row">（b）</th><td lang="en"><code>MS Girl 34backright Ferdinand front</code></td><td>中景，从左到右：Girl 以右后侧三分之四面朝向摄影机；Ferdinand 正对摄影机。</td></tr></tbody></table></div>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Two actor composition in Prose Storyboard Language. Compositions from Vincente Minnelli's 1953 musical, The Band Wagon (a) and Jean-Luc Godard's 1965 French New Wave film, Pierrot Le Fou (b) feature two actors in a frame at different sizes.</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="7" id="fig-7">

<figcaption><span class="psl-fig-number">图 07</span><h3>将无生命物体纳入构图</h3></figcaption>

<p class="psl-figure-caption">构图也可以包含无生命物体：（a）戈达尔《狂人皮埃罗》中的剪刀；（b）威尔斯《历劫佳人》中的炸弹。</p>

<div class="psl-figure-images">

<div class="psl-subfigure">

<img alt="（a）ECU Scissors MCU Marianne front" decoding="async" height="219" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-07-a.jpg" width="503"/>

（a）ECU Scissors MCU Marianne front

</div>

<div class="psl-subfigure">

<img alt="（b）CU Sanchez hands front as hands hold Bomb" decoding="async" height="153" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-07-b.png" width="300"/>

（b）CU Sanchez hands front as hands hold Bomb

</div>

</div>

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">（a）</th><td lang="en"><code>ECU Scissors MCU Marianne front</code></td><td>从左到右：剪刀以大特写呈现；Marianne 以中近景呈现，正对摄影机。</td></tr><tr><th scope="row">（b）</th><td lang="en"><code>CU Sanchez hands front as hands hold Bomb</code></td><td>特写：Sanchez 的双手正面入镜，同时双手握着 Bomb（炸弹）。</td></tr></tbody></table></div>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Compositions in (a) and (b) include inanimate objects (scissors in Jean-Luc Godard's Pierrot Le Fou and a bomb in Orson Welles's Touch Of Evil).</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="8" id="fig-8">

<figcaption><span class="psl-fig-number">图 08</span><h3>多人在不同纵深上的构图</h3></figcaption>

<p class="psl-figure-caption">（a）威尔斯的《公民凯恩》（1941）；（b）希区柯克的《西北偏北》（1959）。画面中的人物与摄影机距离各不相同。PSL 按从左到右的顺序列出人物，并用各自的景别反映他们在构图中的纵深。</p>

<div class="psl-figure-images">

<div class="psl-subfigure">

<img alt="（a）《公民凯恩》" decoding="async" height="300" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-08-a.jpg" width="400"/>

（a）《公民凯恩》

</div>

<div class="psl-subfigure">

<img alt="（b）《西北偏北》" decoding="async" height="416" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-08-b.jpg" width="739"/>

（b）《西北偏北》

</div>

</div>

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">（a）</th><td lang="en"><code>MLS Father 34right screen left ELS Kane 34left screen center MS Thatcher Mother 34left screen right</code></td><td>画面左侧：Father 为中远景，露出右前侧三分之四面；画面中央：Kane 为大远景，露出左前侧三分之四面；画面右侧：Thatcher 与 Mother 均为中景，露出左前侧三分之四面。</td></tr><tr><th scope="row">（b）</th><td lang="en"><code>MCU Eve 34left MS Thornhill 34right Vandam 34left Leonard 34backleft</code></td><td>从左到右：Eve 为中近景，露出左前侧三分之四面；Thornhill 为中景，露出右前侧三分之四面；Vandam 露出左前侧三分之四面；Leonard 露出左后侧三分之四面。</td></tr></tbody></table></div>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Complex composition in (a) Orson Welles's 1941 Citizen Kane and (b) Alfred Hitchcock's 1959 North By Northwest show multiple actors at different distances from the camera. They are described from left to right with their sizes indicating their depth in the composition.</p>

</div>

</details>

</figure>

<span id="section-6" class="psl-anchor" aria-hidden="true"></span>

## 镜头描述<small lang="en">Shot Descriptions</small>

<div class="psl-translation-unit" data-source-block="b032" id="b032">

一个镜头由一段连续时间内的画面组成。为了使叙事连贯，各镜头的衔接必须让观众能够在头脑中重建故事 <a aria-label="参考文献 Cut16" class="psl-cite" href="#ref-Cutting2016NarrativeTA">[Cut16]</a>。转场描述镜头如何接到下一个镜头，也描述镜头如何开始或结束。我们的模型包含三种常用方式：切换（cut）、叠化（dissolve）和淡入淡出（fade）。

切换采用最简单的形式：两个镜头直接先后播放。其他切换方式也使用同一套记法，例如插入镜头（cutaway）：先从镜头 A 切到构图不同的镜头，再回到 A。叠化和淡入淡出则用来描述镜头进入或退出时，画面逐渐显现或消失的过程。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>A <em>shot</em> is a sequence of frames over a continuous time period. For a cohesive and coherent narration the individual shots have to be joined in a manner so as to allow the spectator to mentally recreate the story <a aria-label="参考文献 Cut16" class="psl-cite" href="#ref-Cutting2016NarrativeTA">[Cut16]</a>. Transition describes the progression of a shot to the subsequent one or the starting and ending of a shot. In our model we include three of the most widely used transition techniques: <em>cut</em>, <em>dissolve</em> and <em>fade</em>. We use the simplest form of cut transition in which the two shots are played one after another. We also use the same notation to describe other types of cuts, such as cutaways in which shot A is followed by a intermittent shot with a different composition and then returns back to shot A. Dissolves and fades are used to describe the entry or exit of a shot in which the composition either slowly appears or disappears respectively.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b033" id="b033">

镜头开始时有两种情况：一种是“静态”构图，演员尚未做出动作；另一种是切入一个已经在进行的动作。前者只需描述镜头第一帧的构图；后者则要结合正在发生的动作来描述构图，见图 <a class="psl-xref" href="#fig-1">1</a>。语法中的 `WhileEvent` 非终结符用于这种情况，说明演员执行某个 `Action` 时，镜头最初呈现什么构图。

切入动作时，摄影机也可能已经在运动。图 <a class="psl-xref" href="#fig-11">11</a> 就直接切入演员动作与摄影机运动同时进行的画面。摄影机跟随演员移动，因此整段动作始终维持同一种构图，无须再写后续变化。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>As we enter the shot the initial composition can be of two types. It can either be a 'static' composition in which the actors are not performing any action or we can transition into action. In the former case, we describe the composition in the first frame of the shot. In the latter, we describe the composition in relation to the action that is being performed (figure <a class="psl-xref" href="#fig-1">1</a>). This is described under the non-terminal <em>whileEvent</em> which describes the first composition of the shot <em>while</em> the actors are performing an <em>Action</em>. As we transition into action, the composition can also be accompanied by a camera movement. In Fig. <a class="psl-xref" href="#fig-11">11</a> we transition directly into an actor action with camera movement. Here the camera tracks with the actor thereby resulting in maintaining a single composition in the entire action shot with no developments.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b034" id="b034">

PSL 的一个核心特点是：每个镜头都是自包含的。一个句子从转场写到最后的构图，涵盖摄影机动作和剧本动作，不依赖前后镜头的信息。因此，读者可以单独编写或阅读任何一个镜头的描述，而不必先了解影片中的上一个或下一个镜头。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>The key feature of the language is that all shots are self contained entities. Starting from a transition to the final composition, including camera and script actions, each prose storyboard sentence is independent of the previous or the next shot. A shot description can always be written and read without requiring knowledge from the previous or next shot in a movie.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b035" id="b035">

依据 Thomson 和 Bowen 的镜头分类 <a aria-label="参考文献 TB09b" class="psl-cite" href="#ref-Thompson09a">[TB09b]</a>，PSL 可以精确描述以下三大类镜头：

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Based on the taxonomy of shots proposed by Thomson and Bowen <a aria-label="参考文献 TB09b" class="psl-cite" href="#ref-Thompson09a">[TB09b]</a>, the prose storyboard language allows to describe precisely three main categories of shots :</p>

</div>

</details>

</div>

<ul class="psl-paper-list"><li class="psl-translation-unit" data-source-block="b037" id="b037"><p class="psl-zh">简单镜头中，摄影机既不移动，也不转动。构图如有变化，只能来自演员相对于摄影机的运动。</p>

<details class="psl-english"><summary>英文原文</summary><div lang="en"><p>A simple shot is taken with a camera that does not move or turn. Any change in the composition is from the movements of the actors in relation to the camera.</p></div></details></li><li class="psl-translation-unit" data-source-block="b038" id="b038"><p class="psl-zh">复杂镜头中，摄影机的位置固定，但可以摇摄、俯仰或变焦。PSL 用 <code>pan</code> 和 <code>zoom</code> 表达这些操作：<code>pan</code> 可以向左、向右，也可以向上、向下（即俯仰摇摄）；<code>zoom</code> 则可以推近或拉远画面。</p>

<details class="psl-english"><summary>英文原文</summary><div lang="en"><p>A complex shot is taken with a camera that has movements around a fixed point such as pan, tilt and zoom. We introduce camera actions pan and zoom to describe such movements. Thus the camera can pan left and right, up and down (as in a tilt) and zoom in and out.</p></div></details></li><li class="psl-translation-unit" data-source-block="b039" id="b039"><p class="psl-zh">发展镜头中，摄影机本身的位置会发生变化。PSL 用 <code>dolly</code>（移动摄影）和 <code>crane</code>（升降摄影）来描述这类镜头。在移动或升降的同时，还可以叠加摇摄和变焦，从而形成丰富的视觉效果。</p>

<details class="psl-english"><summary>英文原文</summary><div lang="en"><p>A developing shot is taken with a moving camera. We introduce two camera actions (dolly and crane) to describe these shots. Pan and zoom are allowed during dolly and crane movements thereby creating interesting visual effects.</p></div></details></li></ul>

<p class="psl-translator-note">译注：这里沿用原文的三类名称。“复杂”与“发展”是分类术语，不是对情节复杂程度的评价：简单镜头的摄影机不动；复杂镜头保持机位，可摇摄或变焦；发展镜头会移动机位。变焦改变的是焦距，与 dolly 实际移动摄影机不同。</p>


<div class="psl-translation-unit" data-source-block="b041" id="b041">

有些镜头从头到尾只有一种构图，但更多镜头会在初始构图之后继续展开。PSL 将这些后续变化统称为 `Development`，分为“延续”（Continuation）和“重新构图”（Recomposition）两类。

延续是指演员或摄影机做出了动作，但原有构图没有改变。一种情况是说话、注视等动作：它们对剧本很重要，值得记录，却不改变构图。这类情况由 `Event` 非终结符描述。另一种情况是“跟随事件”（FollowEvent）：主体开始做出作为提示的动作，摄影机随之跟踪主体，使构图保持不变。这类摄影机动作归入 `CameraWith`。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Some shots consist of a single composition from beginning to end. In many cases, however, the initial composition is followed by a number of <em>developments</em>. They are of two types, <em>continuation</em> or <em>recomposition</em>. A <em>continuation</em> is the PSL description of actions, either actor or camera, that do not lead to a change in composition from the previous one. It can be from an <em>action</em> such as speaking or looking that is important to the screenplay to mention but that does not cause a change in composition. These are described under the <em>event</em> non-terminal. Or the <em>continuation</em> can be due to a <em>follow event</em> in which the subjects start to perform an action in the <em>cue</em> and the camera moves with the subjects and tracks their movements so as to maintain the composition. This camera action is categorized under the <em>camera with</em> non-terminal.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b042" id="b042">

另一类是“重新构图”，顾名思义，原有构图发生了变化。变化可能由主体动作、摄影机动作，或两者共同造成；但二者不像 `CameraWith` 那样协调运动以维持构图。这类摄影机动作归入 `CameraTo`。如果构图变化完全由演员运动造成，例如图 <a class="psl-xref" href="#fig-9">9</a> 中的简单镜头，摄影机就“保持静止”（hold），等待画面形成下一种构图。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>The second type of <em>development</em> is the <em>recomposition</em> where there is, as the name suggests, a change in composition. This change can either be due to an action performed by the <em>subject</em> or by the camera or both but these two movements are not synchronized as in <em>camera with</em>. These camera actions are categorized under the <em>camera to</em> non-terminal. In the case of a change in composition only because of actor movements such as in simple shots (figure <a class="psl-xref" href="#fig-9">9</a>), the camera "holds" to the next composition.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b043" id="b043">

初始构图之后，可以接任意数量的延续或重新构图。据我们所知，PSL 是首个能够准确描述任意时长、任意复杂程度的发展镜头的描述框架。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>After the initial composition, there can be any number of developments of either type. To the best of our knowledge, the prose storyboard language is the first description framework that correctly describes developing shots of arbitrary length and complexity.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b044" id="b044">

对于上述三类镜头，我们采用同一个简化模型：镜头由构图、动作提示和画面事件按顺序组成。“动作提示”（Cue）是触发摄影机运动的演员动作。经典电影制作十分重视这种提示，因为摄影机往往因故事中的动作而运动。

动作提示是可选的。因此，PSL 也能描述先于演员动作发生、没有动作动因的摄影机运动，或与演员运动无关、用于交代环境的摄影机运动。画面事件既可以是摄影机相对于演员的动作，也可以是演员相对于摄影机的动作。它们主要分为两类：使构图发生变化的事件（events-to-composition），以及使构图保持不变的事件（events-with-composition）。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>For each of the three cases we propose a simplified model of a shot which consists of a sequence of compositions, cues and screen events. Cues are actor movement which trigger camera movements. They are an important construct in classical movie-making where camera movements are frequently motivated by the story. Cues are optional, which makes it possible to also describe unmotivated camera movements preceding the action, or descriptive camera movements not related to actor movements. Screen events can be actions of the camera relative to the actors, or actions of the actors relative to the camera. Screen events come in two main categories - those which change the composition (<em>events-to-composition</em>) and those which maintain the composition (<em>events-with-composition</em>).</p>

</div>

</details>

</div>

<p class="psl-translator-note">译注：with 和 to 是阅读 PSL 的关键。with 强调“跟着主体动，维持构图”；to 强调“经过动作，到达新的构图”。Cue 说明动作发生的时机，Composition 说明画面最终是什么样。</p>


<div class="psl-translation-unit" data-source-block="b045" id="b045">

在这个模型中，任一时刻只会处于以下四种状态之一：

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>In our model, we can be in only one of four different states:</p>

</div>

</details>

</div>

<ol class="psl-paper-list"><li class="psl-translation-unit" data-source-block="b047" id="b047"><p class="psl-zh">摄影机不动，构图也不变。</p>

<details class="psl-english"><summary>英文原文</summary><div lang="en"><p>Camera does not move and composition does not change.</p></div></details></li><li class="psl-translation-unit" data-source-block="b048" id="b048"><p class="psl-zh">摄影机不动，演员的运动使构图发生变化。</p>

<details class="psl-english"><summary>英文原文</summary><div lang="en"><p>Camera does not move and composition changes due to actor movements.</p></div></details></li><li class="psl-translation-unit" data-source-block="b049" id="b049"><p class="psl-zh">摄影机运动，但构图保持不变。</p>

<details class="psl-english"><summary>英文原文</summary><div lang="en"><p>Camera moves and composition does not change</p></div></details></li><li class="psl-translation-unit" data-source-block="b050" id="b050"><p class="psl-zh">摄影机运动，构图也随之改变。</p>

<details class="psl-english"><summary>英文原文</summary><div lang="en"><p>Camera moves and composition changes.</p></div></details></li></ol>

<div class="psl-translation-unit" data-source-block="b052" id="b052">

第（1）种情况用一种构图就能描述。第（2）种情况使用专门的动词 `hold`：摄影机保持静止，演员继续运动，直到形成新的构图。第（3）种情况使用 `CameraWith` 结构，例如 `pan with`、`dolly with`、`crane with`，说明摄影机如何随主体运动来维持构图。第（4）种情况使用 `CameraTo` 结构，说明摄影机如何运动以转到新的构图。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>In case (1), the shot can be described with a single composition. In case (2), we introduce the special verb <em>hold</em> to indicate that the camera remains static while the actors move, leading to a new composition. In case (3), we use the generic construction <em>CameraWith</em> (pan with, dolly with, crane with) to indicate how the camera moves to maintain the composition. In case (4), we use the generic construction <em>CameraTo</em> to indicate how the cameras moves to change the composition.</p>

</div>

</details>

</div>

<span id="section-7" class="psl-anchor" aria-hidden="true"></span>

## 标注结果<small lang="en">Annotation results</small>

<div class="psl-translation-unit" data-source-block="b054" id="b054">

为了检验 PSL，我们从不同时期、不同风格的已有电影中选取了较长的场景片段，进行人工标注。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>As a validation of the proposed language, we have manually annotated extended scenes from existing movies covering many different styles and periods.</p>

</div>

</details>

</div>

<figure class="psl-paper-figure" id="table-1">

<figcaption><span class="psl-fig-number">表 1</span><h3>标注统计</h3></figcaption>

<p class="psl-figure-caption">按影片统计标注的镜头数、构图数和镜内变化数，并分别列出主要摄影机动作的次数。</p>

<div aria-label="标注结果统计表" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-stats-table"><thead><tr><th rowspan="3" scope="col">电影</th><th rowspan="3" scope="col">镜头</th><th rowspan="3" scope="col">构图</th><th colspan="8" scope="colgroup">镜内变化 Development</th></tr><tr><th colspan="3" scope="colgroup">延续 Continuation</th><th colspan="5" scope="colgroup">重新构图 Recomposition</th></tr><tr><th scope="col">摇摄<br/>Pan</th><th scope="col">移动<br/>Dolly</th><th scope="col">升降<br/>Crane</th><th scope="col">保持<br/>Hold</th><th scope="col">变焦<br/>Zoom</th><th scope="col">摇摄<br/>Pan</th><th scope="col">移动<br/>Dolly</th><th scope="col">升降<br/>Crane</th></tr></thead><tbody><tr><th scope="row">《回到未来》</th><td>41</td><td>69</td><td>—</td><td>—</td><td>—</td><td>12</td><td>1</td><td>6</td><td>10</td><td>—</td></tr><tr><th scope="row">《西北偏北》</th><td>133</td><td>209</td><td>2</td><td>7</td><td>—</td><td>49</td><td>1</td><td>8</td><td>16</td><td>—</td></tr><tr><th scope="row">《历劫佳人》</th><td>1</td><td>40</td><td>—</td><td>2</td><td>1</td><td>6</td><td>—</td><td>1</td><td>18</td><td>13</td></tr><tr><th scope="row">《夺魂索》</th><td>2</td><td>12</td><td>—</td><td>1</td><td>—</td><td>—</td><td>—</td><td>3</td><td>7</td><td>—</td></tr><tr class="psl-total"><th scope="row">合计</th><td>177</td><td>330</td><td>2</td><td>10</td><td>1</td><td>67</td><td>2</td><td>18</td><td>51</td><td>13</td></tr></tbody></table></div>

<p class="psl-translator-note">译注：数字与破折号均照原表保留，不将破折号改写为零。</p>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Annotation results: For each movie, we give the total number of annotated shots, compositions and developments, together with a count of the main categories of camera movement.</p>

</div>

</details>

</figure>

<span id="section-7-1" class="psl-anchor" aria-hidden="true"></span>

### 7.1 标注过程<small lang="en">Process of annotation</small>

<div class="psl-translation-unit" data-source-block="b056" id="b056">

标注首先从反复观看场景开始。随后，我们将场景划分为镜头，为每个镜头编写一句 PSL，并用时间码把描述与镜头中的相应关键帧对应起来。例如，镜头第一帧对应 PSL 的初始构图，我们先记录这一帧的时间码，再依次记录后续构图及其时间码。这些带时间码的 PSL 描述在文字处理软件中编写为字幕，保存成 SubRip（`.srt`）文件，便可以与对应影片片段一起播放。

为了便于阅读，较长的句子通常会拆成若干片段：先写起始构图（from）及其持续时间；再写摄影机、演员或两者共同做出的、使构图发生变化的动作；最后写该动作带来的目标构图（to）。每个片段都配有相应的时间码。整个过程最终生成一个 `.srt` 文件，其中包含该场景按时间排列的 PSL 描述。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>We start the annotation process by viewing the scenes multiple times. The scene is then divided into its consisting shots which we describe in Prose Storyboard Language. Each of these sentences is matched to their corresponding keyframe in the shot via timecodes. For example, the first frame of the shot matches the initial composition in PSL. The time code for this keyframe is noted. As the shot progresses, we make a note of the subsequent compositions and their time codes. This list of PSL sentences with time codes for keyframes is written as subtitles in a word processor and saved as SubRip(.srt) files that can be played with the annotated scene. To make the PSL sentences easier to read they are generally broken down into fragments that start with a 'from' composition and the time codes for the duration this composition lasts. Then the next PSL fragment contains the action that either the camera or actor or both perform that changes this initial composition. After this, we describe the 'to' composition that the previously mentioned action leads to. All these fragments are accompanied by their time codes. The output of this process of annotation is a time-coded PSL description of the scene in a .srt file.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b057" id="b057">

接着，我们按照图 <a class="psl-xref" href="#fig-14">14</a> 的 AND/OR 树所示语法解析这些 PSL 句子。解析程序用 Python 编写，使用 Parsimonious 工具包。它基于解析表达式文法（Parsing Expression Grammar，PEG），词法分析和语法分析在同一过程中完成。

PEG 的关键特点是使用有先后顺序的选择运算符 `/`，而不是无序选择运算符 `|`。因此，候选项的书写顺序会影响解析结果。例如，规则 `A = a / b / c` 会先尝试匹配 `a`，只有失败才尝试下一项。这种优先选择机制消除了选择上的歧义，使同一输入只产生一棵解析树。PSL 解析器的参考实现与本文涉及的全部 PSL 句子均可免费获取：<a href="https://gitlab.inria.fr/vmurukut/psl">https://gitlab.inria.fr/vmurukut/psl</a>。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>These PSL sentences are then parsed using the PSL grammar described in the AND/OR tree in Fig. <a class="psl-xref" href="#fig-14">14</a>. This parsing is done in Python using the Parsimonious toolkit. The parser is based on parsing expression grammars (PEGs) in which lexing and parsing are done at the same time. The key feature of PEGs is that it uses a prioritized choice operator "/" rather than an unordered operator "|". This means the order in which the choices are written is important (For example, in a rule 'A = a / b / c ', the parser first checks if the input matches 'a'. It only moves to the next choice if this fails). This prioritization removes ambiguity and ensures there is only one output parse tree for a given input. A reference implementation of the PSL parser is freely available at <a href="https://gitlab.inria.fr/vmurukut/psl">https://gitlab.inria.fr/vmurukut/psl</a> together with all PSL sentences mentioned in the paper.</p>

</div>

</details>

</div>

<span id="section-7-2" class="psl-anchor" aria-hidden="true"></span>

### 7.2 标注结果<small lang="en">Annotation results</small>

<div class="psl-translation-unit" data-source-block="b059" id="b059">

我们标注了四部影片中的场景：罗伯特·泽米吉斯的《回到未来》、希区柯克的《夺魂索》和《西北偏北》，以及奥逊·威尔斯的《历劫佳人》。每个案例都提供原始剧本、带完整 PSL 字幕的影片片段，以及为每种构图或后续变化各选一幅关键帧的分镜。字幕描述了片段中的全部构图与后续变化。

表 <a class="psl-xref" href="#table-1">1</a> 汇总了标注结果，配套材料可在 <a href="https://team.inria.fr/anima/prose-storyboard-language/">https://team.inria.fr/anima/prose-storyboard-language/</a> 获取。全部标注共涉及 177 个镜头、330 个构图，既为 PSL 的表达能力与通用性提供了非形式化验证，也展示了如何用这门语言精确标注电影镜头。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>We annotated scenes extracted from four movies : Back To The Future by Robert Zemekis, Rope and North By Northwest by Alfred Hitchcock, and Touch Of Evil by Orson Welles. In each case, we give the original screenplay, the movie subtitled with a complete PSL description of all compositions and developments, and a storyboard with one keyframe per composition or development. Annotation results are summarized in Table <a class="psl-xref" href="#table-1">1</a> and can be found in the accompanying material available online at <a href="https://team.inria.fr/anima/prose-storyboard-language/">https://team.inria.fr/anima/prose-storyboard-language/</a>. With 177 shots and 330 compositions, they constitute an informal validation of the expressivity and generality of the language, as well as an illustration of good practices for precisely annotating movie shots using the language.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b060" id="b060">

《回到未来》（1985）的咖啡馆场景发生在室内，结合了动作和对白，涉及 8 名主要人物。图 <a class="psl-xref" href="#fig-16">16</a> 列出该场景的元素；标注时，将这些元素加入 PSL 语法。我们公开了场景中全部 41 个镜头的散文分镜，供后续研究参考。

希区柯克的《夺魂索》（1948）同样呈现了 8 名人物之间的动作与对白。不过，这部以单镜头形式展开的影片，依靠精心设计的调度和摄影机运动组织画面，而不是依靠切镜头。图 <a class="psl-xref" href="#fig-17">17</a> 列出其场景元素。这是一个较难标注的案例；我们选取其中两个较长的段落，用 PSL 作了完整标注，结果见图 <a class="psl-xref" href="#fig-20">20</a> 和图 <a class="psl-xref" href="#fig-21">21</a>。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>The cafe scene in Back To The future (1985) is an interior scene with a combination of action and dialogues involving 8 main characters. Scene elements for this movie are enumerated in Fig. <a class="psl-xref" href="#fig-16">16</a> and appended to the PSL grammar for annotation. We are making the prose storyboard for all 41 shots in the scene available for future reference. Rope (1948), a single shot movie by Alfred Hitchcock, also shows action and dialogue between 8 characters, this time using elaborate blocking and camera movements rather than employing cuts. Scene elements for this movie are enumerated in Fig. <a class="psl-xref" href="#fig-17">17</a>. This is challenging example for annotation, and we show examples from two extended sequences fully annotated with PSL. Results are shown in Fig. <a class="psl-xref" href="#fig-20">20</a> and <a class="psl-xref" href="#fig-21">21</a>.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b061" id="b061">

我们还标注了《西北偏北》（1959）中的农用飞机追杀场景，以检验 PSL 能否描述包含大量非人物元素的复杂室外场景。在这里，飞行员的意图通过飞机的运动体现出来。我们为这段精彩场景的全部 133 个镜头编写了散文分镜，展示它如何在几乎没有对白的情况下运用丰富的镜头变化。图 <a class="psl-xref" href="#fig-18">18</a> 列出相应场景元素。

最后，我们标注了奥逊·威尔斯《历劫佳人》（1958）的开场长镜头。多种摄影机运动与细致编排的人物调度交织在一起，形成丰富而不断变化的画面构图；相应场景元素见图 <a class="psl-xref" href="#fig-19">19</a>。尽管这些场景相当复杂，标注结果仍表明，散文分镜既比较容易阅读，也便于编写。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>We also annotated the crop duster scene from North By Northwest (1959) to highlight the versatility of the language in describing a complex scene in an outdoor environment involving many non human elements. In that scene the intent of the pilot is personified in the movements of the plane. We annotated all 133 shots in this virtuoso scene with their prose storyboards, to illustrate the variety of shots used in this mostly silent scene. Scene elements for this movie are enumerated in Fig. <a class="psl-xref" href="#fig-18">18</a>. Finally we annotated the long opening shot from Orson Welles's Touch Of Evil (1958) which shows a wide variety of camera movements interlaced with meticulously planned choreography for the characters resulting in a rich and dynamic visual composition. Scene elements for this movie are enumerated in Fig. <a class="psl-xref" href="#fig-19">19</a>. Despite the complexity of these scenes, they show that the prose storyboard is fairly simple to read and easy to generate.</p>

</div>

</details>

</div>

<span id="section-8" class="psl-anchor" aria-hidden="true"></span>

## 结论<small lang="en">Conclusion</small>

<div class="psl-translation-unit" data-source-block="b063" id="b063">

本文提出了一门描述电影空间结构与时间结构的语言，能够表达任意复杂的镜头。它还可以向许多方向扩展，例如纳入摄影镜头的选择、景深、照明，以及对白等叙事内声音。

后续工作将研究两个方向相反的问题：在游戏引擎电影（machinima）环境中，根据散文分镜自动生成电影；以及为已有电影自动生成镜头描述。我们还计划支持立体电影，这需要在构图描述中加入主体的深度与视差。进一步扩展到全景视频和沉浸式虚拟现实电影，也值得探索。现阶段，我们认为 PSL 能帮助现有智能摄影与剪辑方法表达更丰富的策略和惯用手法，并在实拍电影与虚拟电影制作之间建立联系。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>We have presented a language for describing the spatial and temporal structure of movies with arbitrarily complex shots. The language can be extended in many ways, e.g. by taking into account lens choices, depth-of-field and lighting, and diegetic sound including speech. Future work will be devoted to the dual problems of automatically generating movies from prose storyboards in machinima environments, and automatically describing shots in existing movies. We are also planning to extend our framework for the case of stereoscopic movies, where image composition needs to be extended to include the depth and disparity of subjects in the composition. It would also be interesting to extend the language even further for the case of panoramic video and immersive virtual reality movies. At this stage, we believe that the proposed language can be useful to extend existing approaches in intelligent cinematography and editing towards more expressive strategies and idioms, and to bridge the gap between real and virtual movie-making.</p>

</div>

</details>

</div>

<p class="psl-translator-note">译注：“叙事内声音”（diegetic sound）指故事世界中存在的声音，例如人物说话、车辆声；“视差”指立体电影左右眼画面中同一主体的位置差异。</p>


<span id="references" class="psl-anchor" aria-hidden="true"></span>

## 参考文献<small>References · 44 条</small>

<p class="psl-section-intro">保留原文的作者、标题、出版信息与页码；中文标题为阅读辅助译名。引用编号沿用论文。</p>

<ol class="psl-references"><li data-reference="Akerberg2003" id="ref-Akerberg2003"><span class="psl-reference-label">[ASSN03]</span><div><p class="psl-reference-zh">CarSim：从道路事故报告自动生成三维场景</p><p class="psl-reference-original" lang="en">Akerberg O., Svensson H., Schulz B., Nugues P.: Carsim: An automatic 3d text-to-scene conversion system applied to road accident reports. In Proceedings of the Tenth Conference on European Chapter of the Association for Computational Linguistics - Volume 2 (2003), EACL '03, pp. 191–194.</p></div></li><li data-reference="BalasBAG08" id="ref-BalasBAG08"><span class="psl-reference-label">[BBAG08]</span><div><p class="psl-reference-zh">用层次化 Petri 网描述包含虚拟人物的故事情节</p><p class="psl-reference-original" lang="en">Balas D., Brom C., Abonyi A., Gemrot J.: Hierarchical petri nets for story plots featuring virtual humans. In AIIDE (2008).</p></div></li><li data-reference="Bordwell98" id="ref-Bordwell98"><span class="psl-reference-label">[Bor98]</span><div><p class="psl-reference-zh">电影风格史论</p><p class="psl-reference-original" lang="en">Bordwell D.: On the History of Film Style. Harvard University Press, 1998.</p></div></li><li data-reference="Brand97" id="ref-Brand97"><span class="psl-reference-label">[Bra97]</span><div><p class="psl-reference-zh">“逆好莱坞问题”：通过因果分析，将视频转化为剧本和分镜</p><p class="psl-reference-original" lang="en">Brand M.: The "inverse hollywood problem": From video to scripts and storyboards via causal analysis. In AAAI/IAAI (1997), pp. 132–137.</p></div></li><li data-reference="Braga2016" id="ref-Braga2016"><span class="psl-reference-label">[BS16]</span><div><p class="psl-reference-zh">SLAP：面向动画编程的分镜语言</p><p class="psl-reference-original" lang="en">Braga P. H. C., Silveira I. F.: Slap: Storyboard language for animation programming. IEEE Latin America Transactions 14, 12 (Dec 2016), 4821–4826.</p></div></li><li data-reference="Blackwell01" id="ref-Blackwell01"><span class="psl-reference-label">[BvKR01]</span><div><p class="psl-reference-zh">Petri 网脚本：描述动作、行为和情节的可视化语言</p><p class="psl-reference-original" lang="en">Blackwell L., von Konsky B., Robey M.: Petri net script: a visual language for describing action, behaviour and plot. In Australasian conference on Computer science (2001), ACSC '01.</p></div></li><li data-reference="Christianson96" id="ref-Christianson96"><span class="psl-reference-label">[CAwH*96]</span><div><p class="psl-reference-zh">面向自动摄影的声明式摄影机控制</p><p class="psl-reference-original" lang="en">Christianson D. B., Anderson S. E., wei He L., Salesin D. H., Weld D. S., Cohen M. F.: Declarative camera control for automatic cinematography. In AAAI (1996).</p></div></li><li data-reference="Chao12" id="ref-Chao12"><span class="psl-reference-label">[Cha12]</span><div><p class="psl-reference-zh">人机协作中多模态轮流交互的时序安排</p><p class="psl-reference-original" lang="en">Chao C.: Timing multimodal turn-taking for human-robot cooperation. In Proceedings of the 14th ACM international conference on Multimodal interaction (New York, NY, USA, 2012), ICMI '12, ACM, pp. 309–312.</p></div></li><li data-reference="CO06" id="ref-CO06"><span class="psl-reference-label">[CO06]</span><div><p class="psl-reference-zh">计算机图形学中的摄影机控制</p><p class="psl-reference-original" lang="en">Christie M., Olivier P.: Camera control for computer graphics. In Eurographics State of the Art Reports (2006), Eurographics 2006, Blackwell.</p></div></li><li data-reference="Cutting2016NarrativeTA" id="ref-Cutting2016NarrativeTA"><span class="psl-reference-label">[Cut16]</span><div><p class="psl-reference-zh">叙事理论与大众电影的动态变化</p><p class="psl-reference-original" lang="en">Cutting J. E.: Narrative theory and the dynamics of popular movies. In Psychonomic Bulletin &amp; Review (2016).</p></div></li><li data-reference="DMR05" id="ref-DMR05"><span class="psl-reference-label">[DMR05]</span><div><p class="psl-reference-zh">从影像自动反向生成分镜的技术</p><p class="psl-reference-original" lang="en">Dony R., Mateer J., Robinson J.: Techniques for automated reverse storyboarding. IEE Journal of Vision, Image and Signal Processing 152, 4 (2005), 425–436.</p></div></li><li data-reference="Friedman06" id="ref-Friedman06"><span class="psl-reference-label">[FF06]</span><div><p class="psl-reference-zh">针对摄影机行为的自动电影化推理</p><p class="psl-reference-original" lang="en">Friedman D., Feldman Y. A.: Automated cinematic reasoning about camera behavior. Expert Syst. Appl. 30, 4 (May 2006), 694–704.</p></div></li><li data-reference="Galvane2015" id="ref-Galvane2015"><span class="psl-reference-label">[GCLR15]</span><div><p class="psl-reference-zh">Camera-on-rails：自动计算满足约束的摄影机路径</p><p class="psl-reference-original" lang="en">Galvane Q., Christie M., Lino C., Ronfard R.: Camera-on-rails: Automated Computation of Constrained Camera Paths. In ACM SIGGRAPH Conference on Motion in Games (Paris, France, Nov. 2015), ACM, pp. 151–157.</p></div></li><li data-reference="Galvane2013" id="ref-Galvane2013"><span class="psl-reference-label">[GCR*13]</span><div><p class="psl-reference-zh">自主摄影机的运动引导行为</p><p class="psl-reference-original" lang="en">Galvane Q., Christie M., Ronfard R., Lim C.-K., Cani M.-P.: Steering Behaviors for Autonomous Cameras. In MIG 2013 - ACM SIGGRAPH conference on Motion in Games (Dublin, Ireland, Nov. 2013), MIG '13 Proceedings of Motion on Games, ACM, pp. 93–102.</p></div></li><li data-reference="GoldmanCSS06" id="ref-GoldmanCSS06"><span class="psl-reference-label">[GCSS06]</span><div><p class="psl-reference-zh">用于视频可视化与剪辑的示意分镜</p><p class="psl-reference-original" lang="en">Goldman D. B., Curless B., Salesin D., Seitz S. M.: Schematic storyboarding for video visualization and editing. ACM Trans. Graph. 25, 3 (2006), 862–871.</p></div></li><li data-reference="Galvane2018" id="ref-Galvane2018"><span class="psl-reference-label">[GLC*18]</span><div><p class="psl-reference-zh">航拍无人机的导演控制</p><p class="psl-reference-original" lang="en">Galvane Q., Lino C., Christie M., Fleureau J., Servant F., Tariolle F.-l., Guillotel P.: Directing cinematographic drones. ACM Trans. Graph. 37, 3 (July 2018), 34:1–34:18.</p></div></li><li data-reference="GR13" id="ref-GR13"><span class="psl-reference-label">[GR13]</span><div><p class="psl-reference-zh">利用生成式外观模型检测电影演员并识别其身份</p><p class="psl-reference-original" lang="en">Gandhi V., Ronfard R.: Detecting and naming actors in movies using generative appearance models. In CVPR (2013).</p></div></li><li data-reference="GR15" id="ref-GR15"><span class="psl-reference-label">[GR15]</span><div><p class="psl-reference-zh">纵向视频剪辑的计算框架</p><p class="psl-reference-original" lang="en">Gandhi V., Ronfard R.: A Computational Framework for Vertical Video Editing. In 4th Workshop on Intelligent Camera Control, Cinematography and Editing (Zurich, Switzerland, May 2015), Eurographics, Eurographics Association, pp. 31–37.</p></div></li><li data-reference="Galvane2014" id="ref-Galvane2014"><span class="psl-reference-label">[GRCS14]</span><div><p class="psl-reference-zh">叙事驱动的摄影机控制：为计算机游戏生成电影化回放</p><p class="psl-reference-original" lang="en">Galvane Q., Ronfard R., Christie M., Szilas N.: Narrative-Driven Camera Control for Cinematic Replay of Computer Games. In MIG'14 - 7th International Conference on Motion in Games (Los Angeles, United States, Nov. 2014), ACM, pp. 109–117.</p></div></li><li data-reference="GR14" id="ref-GR14"><span class="psl-reference-label">[GRG14]</span><div><p class="psl-reference-zh">从单一视点素材进行多片段视频剪辑</p><p class="psl-reference-original" lang="en">Gandhi V., Ronfard R., Gleicher M.: Multi-Clip Video Editing from a Single Viewpoint. In CVMP 2014 - European Conference on Visual Media Production (London, United Kingdom, Nov. 2014), ACM, p. Article No. 9.</p></div></li><li data-reference="He96" id="ref-He96"><span class="psl-reference-label">[HCS96]</span><div><p class="psl-reference-zh">虚拟摄影师：自动实时摄影机控制与导演的一种范式</p><p class="psl-reference-original" lang="en">He L.-w., Cohen M. F., Salesin D. H.: The virtual cinematographer: a paradigm for automatic real-time camera control and directing. In Proceedings of the 23rd annual conference on Computer graphics and interactive techniques (New York, NY, USA, 1996), SIGGRAPH '96, ACM, pp. 217–224.</p></div></li><li data-reference="Jhala05" id="ref-Jhala05"><span class="psl-reference-label">[JY05]</span><div><p class="psl-reference-zh">以话语规划控制虚拟环境叙事中的电影摄影机</p><p class="psl-reference-original" lang="en">Jhala A., Young R. M.: A discourse planning approach to cinematic camera control for narratives in virtual environments. In AAAI (2005).</p></div></li><li data-reference="Jhala06" id="ref-Jhala06"><span class="psl-reference-label">[JY06]</span><div><p class="psl-reference-zh">基于规划的自动摄影机控制：对表示方法的要求</p><p class="psl-reference-original" lang="en">Jhala A., Young R. M.: Representational requirements for a plan based approach to automated camera control. In AIIDE'06 (2006), pp. 36–41.</p></div></li><li data-reference="Louarn18" id="ref-Louarn18"><span class="psl-reference-label">[LCL18]</span><div><p class="psl-reference-zh">虚拟摄影中的自动场面调度</p><p class="psl-reference-original" lang="en">Louarn A., Christie M., Lamarche F.: Automated staging for virtual cinematography. In Proceedings of the 11th Annual International Conference on Motion, Interaction, and Games, MIG 2018, Limassol, Cyprus, November 08-10, 2018 (2018), pp. 4:1–4:10.</p></div></li><li data-reference="Leake2017" id="ref-Leake2017"><span class="psl-reference-label">[LDTA17]</span><div><p class="psl-reference-zh">面向对白驱动场景的计算视频剪辑</p><p class="psl-reference-original" lang="en">Leake M., Davis A., Truong A., Agrawala M.: Computational video editing for dialogue-driven scenes. ACM Trans. Graph. 36, 4 (July 2017), 130:1–130:14.</p></div></li><li data-reference="Little1990SynchronizationAS" id="ref-Little1990SynchronizationAS"><span class="psl-reference-label">[LG90]</span><div><p class="psl-reference-zh">多媒体对象的同步与存储模型</p><p class="psl-reference-original" lang="en">Little T. D. C., Ghafoor A.: Synchronization and storage models for multimedia objects. IEEE Journal on Selected Areas in Communications 8 (1990), 413–427.</p></div></li><li data-reference="MarkowitzKSB11" id="ref-MarkowitzKSB11"><span class="psl-reference-label">[MJSB11]</span><div><p class="psl-reference-zh">基于行为树的智能摄影机控制</p><p class="psl-reference-original" lang="en">Markowitz D., Jr. J. T. K., Shoulson A., Badler N. I.: Intelligent camera control using behavior trees. In MIG (2011), pp. 156–167.</p></div></li><li data-reference="Magalhaes98" id="ref-Magalhaes98"><span class="psl-reference-label">[MRR98]</span><div><p class="psl-reference-zh">用 Petri 网为动画建模</p><p class="psl-reference-original" lang="en">Magalhaes L. P., Raposo A. B., Ricarte I. L.: Animation modeling with petri nets. Computers and Graphics 22, 6 (1998), 735 – 743.</p></div></li><li data-reference="Murch86" id="ref-Murch86"><span class="psl-reference-label">[Mur86]</span><div><p class="psl-reference-zh">眨眼之间</p><p class="psl-reference-original" lang="en">Murch W.: In the blink of an eye. Silman-James Press, 1986.</p></div></li><li data-reference="Marti2018" id="ref-Marti2018"><span class="psl-reference-label">[MVW*18]</span><div><p class="psl-reference-zh">Cardinal：计算机辅助电影剧本创作</p><p class="psl-reference-original" lang="en">Marti M., Vieli J., Witoń W., Sanghrajka R., Inversini D., Wotruba D., Simo I., Schriber S., Kapadia M., Gross M.: Cardinal: Computer assisted authoring of movie scripts. In 23rd International Conference on Intelligent User Interfaces (2018), IUI '18, pp. 509–519.</p></div></li><li data-reference="Ondaatje04" id="ref-Ondaatje04"><span class="psl-reference-label">[Ond04]</span><div><p class="psl-reference-zh">对话：沃尔特·默奇与电影剪辑艺术</p><p class="psl-reference-original" lang="en">Ondaatje M.: The Conversations: Walter Murch and the Art of Film Editing. Random House, 2004.</p></div></li><li data-reference="ONeillRN09" id="ref-ONeillRN09"><span class="psl-reference-label">[ORN09]</span><div><p class="psl-reference-zh">面向游戏引擎电影的智能创作工具</p><p class="psl-reference-original" lang="en">O'Neill B., Riedl M. O., Nitsche M.: Towards intelligent authoring tools for machinima creation. In CHI Extended Abstracts (2009), pp. 4639–4644.</p></div></li><li data-reference="Proferes08" id="ref-Proferes08"><span class="psl-reference-label">[Pro08]</span><div><p class="psl-reference-zh">电影导演基础：在开拍之前看见你的电影</p><p class="psl-reference-original" lang="en">Proferes N.: Film Directing Fundamentals - See your film before shooting it. Focal Press, 2008.</p></div></li><li data-reference="RijsselbergenKVMW09" id="ref-RijsselbergenKVMW09"><span class="psl-reference-label">[RKV*09]</span><div><p class="psl-reference-zh">电影剧本标记语言</p><p class="psl-reference-original" lang="en">Rijsselbergen D. V., Keer B. V. D., Verwaest M., Mannens E., de Walle R. V.: Movie script markup language. In ACM Symposium on Document Engineering (2009), pp. 161–170.</p></div></li><li data-reference="Salt06" id="ref-Salt06"><span class="psl-reference-label">[Sal06]</span><div><p class="psl-reference-zh">走进影像</p><p class="psl-reference-original" lang="en">Salt B.: Moving Into Pictures. Starword, 2006.</p></div></li><li data-reference="Salt09" id="ref-Salt09"><span class="psl-reference-label">[Sal09]</span><div><p class="psl-reference-zh">电影风格与技术：历史与分析（第 3 版）</p><p class="psl-reference-original" lang="en">Salt B.: Film Style and Technology: History and Analysis (3 ed.). Starword, 2009.</p></div></li><li data-reference="Shen03" id="ref-Shen03"><span class="psl-reference-label">[SMAY03]</span><div><p class="psl-reference-zh">DMP：智能数字电影制作系统</p><p class="psl-reference-original" lang="en">Shen J., Miyazaki S., Aoki T., Yasuda H.: Intelligent digital filmmaker dmp. In ICCIMA (2003).</p></div></li><li data-reference="Seversky2006" id="ref-Seversky2006"><span class="psl-reference-label">[SY06]</span><div><p class="psl-reference-zh">根据自然语言的语音和文字描述，实时自动生成三维场景</p><p class="psl-reference-original" lang="en">Seversky L. M., Yin L.: Real-time automatic 3d scene generation from natural language voice and text descriptions. In Proceedings of the 14th ACM International Conference on Multimedia (2006), MM '06, pp. 61–64.</p></div></li><li data-reference="Thompson09b" id="ref-Thompson09b"><span class="psl-reference-label">[TB09a]</span><div><p class="psl-reference-zh">剪辑的语法</p><p class="psl-reference-original" lang="en">Thompson R., Bowen C.: Grammar of the Edit. Focal Press, 2009.</p></div></li><li data-reference="Thompson09a" id="ref-Thompson09a"><span class="psl-reference-label">[TB09b]</span><div><p class="psl-reference-zh">镜头的语法</p><p class="psl-reference-original" lang="en">Thompson R., Bowen C.: Grammar of the Shot. Focal Press, 2009.</p></div></li><li data-reference="Vogt2013" id="ref-Vogt2013"><span class="psl-reference-label">[VHL*13]</span><div><p class="psl-reference-zh">TIMISTO：从分镜中提取使用过程的技术</p><p class="psl-reference-original" lang="en">Vogt J., Haesen M., Luyten K., Coninx K., Meier A.: Timisto: A technique to extract usage sequences from storyboards. In Proceedings of the 5th ACM SIGCHI Symposium on Engineering Interactive Computing Systems (2013), EICS '13, pp. 113–118.</p></div></li><li data-reference="Wu2018" id="ref-Wu2018"><span class="psl-reference-label">[WPRC18]</span><div><p class="psl-reference-zh">像导演一样思考：虚拟电影叙事中的剪辑模式</p><p class="psl-reference-original" lang="en">Wu H.-Y., Palù F., Ranon R., Christie M.: Thinking like a director: Film editing patterns for virtual cinematographic storytelling. ACM Trans. Multimedia Comput. Commun. Appl. 14, 4 (Oct. 2018), 81:1–81:22.</p></div></li><li data-reference="Yannopoulos2013" id="ref-Yannopoulos2013"><span class="psl-reference-label">[Yan13]</span><div><p class="psl-reference-zh">DirectorNotation：面向专业电影导演的艺术与技术系统</p><p class="psl-reference-original" lang="en">Yannopoulos A.: DirectorNotation: Artistic and technological system for professional film directing. J. Comput. Cult. Herit. 6, 1 (Apr. 2013), 2:1–2:34.</p></div></li><li data-reference="Ye2008" id="ref-Ye2008"><span class="psl-reference-label">[YB08]</span><div><p class="psl-reference-zh">迈向自动生成动画分镜</p><p class="psl-reference-original" lang="en">Ye P., Baldwin T.: Towards automatic animated storyboarding. In Proceedings of the 23rd National Conference on Artificial Intelligence - Volume 1 (2008), AAAI'08, pp. 578–583.</p></div></li></ol>

<span id="appendix-shots" class="psl-anchor" aria-hidden="true"></span>

## 补充镜头示例<small>原文图 9–14</small>

<figure class="psl-paper-figure" data-figure="9" id="fig-9">

<figcaption><span class="psl-fig-number">图 09</span><h3>《西北偏北》：演员运动形成的简单镜头</h3></figcaption>

<img alt="图 9：简单镜头：《西北偏北》中的演员运动，含原始画面和完整解析树" decoding="async" height="924" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-09.png" width="1756"/>

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">Composition</th><td lang="en"><code>MS Th 34 right</code></td><td>中景：Th 以右前侧三分之四面朝向摄影机。</td></tr><tr><th scope="row">Recomposition / Cue</th><td lang="en"><code>then as Th turns away from camera</code></td><td>接着，以 Th 转身背向摄影机为动作提示，</td></tr><tr><th scope="row">Recomposition / CameraTo</th><td lang="en"><code>hold to</code></td><td>摄影机保持静止，等待下一种构图形成：</td></tr><tr><th scope="row">Recomposition / Composition</th><td lang="en"><code>MS Th 34backright</code></td><td>中景：Th 以右后侧三分之四面朝向摄影机。</td></tr></tbody></table></div>

<p class="psl-translator-note">译注：图中的 34 right 写成两个词，图 15 的语法清单则写作 34right，二者都用于表示右前侧三分之四面。</p>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Simple shot: with actor movement in North By Northwest</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="10" id="fig-10">

<figcaption><span class="psl-fig-number">图 10</span><h3>《回到未来》：发展镜头</h3></figcaption>

<img alt="图 10：《回到未来》中的发展镜头，含原始画面和完整解析树" decoding="async" height="886" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-10.png" width="1756"/>

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">Composition</th><td lang="en"><code>MS Mar Go 34right Ge 34left</code></td><td>中景，从左到右：Mar、Go 露出右前侧三分之四面，Ge 露出左前侧三分之四面。</td></tr><tr><th scope="row">Recomposition / Cue</th><td lang="en"><code>then as Go crosses under Ge</code></td><td>接着，以 Go 与 Ge 交错通过（under）为动作提示，</td></tr><tr><th scope="row">Recomposition / CameraTo</th><td lang="en"><code>dolly right to</code></td><td>摄影机向右移动，形成下一种构图：</td></tr><tr><th scope="row">Recomposition / Composition</th><td lang="en"><code>MS Mar 34right Ge front Go 34left</code></td><td>中景，从左到右：Mar 露出右前侧三分之四面；Ge 正对摄影机；Go 露出左前侧三分之四面。</td></tr></tbody></table></div>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Developing shot in Back To The Future</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="11" id="fig-11">

<figcaption><span class="psl-fig-number">图 11</span><h3>《闪灵》：跟随人物移动的发展镜头</h3></figcaption>

<img alt="图 11：发展镜头：《闪灵》中跟随演员的移动摄影，含原始画面和完整解析树" decoding="async" height="1004" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-11.png" width="1756"/>

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">Transition</th><td lang="en"><code>cut to</code></td><td>切到这个镜头。</td></tr><tr><th scope="row">CameraWith</th><td lang="en"><code>dolly with</code></td><td>摄影机跟随人物移动，使构图保持不变。</td></tr><tr><th scope="row">Composition</th><td lang="en"><code>FS Dan back</code></td><td>全景：Dan 背对摄影机。</td></tr><tr><th scope="row">Event</th><td lang="en"><code>while Dan moves to screen center</code></td><td>与此同时，Dan 向画面中央移动。</td></tr></tbody></table></div>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Developing shot: Dolly with actor in The Shining</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="12" id="fig-12">

<figcaption><span class="psl-fig-number">图 12</span><h3>《正午》：摄影机升起的发展镜头</h3></figcaption>

<img alt="图 12：发展镜头：《正午》中的升降摄影机上升，含原始画面和完整解析树" decoding="async" height="1053" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-12.png" width="1756"/>

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">Composition</th><td lang="en"><code>MS Sh left</code></td><td>中景：Sh 以左侧面朝向摄影机。</td></tr><tr><th scope="row">Recomposition / Cue</th><td lang="en"><code>then as Sh moves to screen top</code></td><td>接着，以 Sh 向画面上方移动为动作提示，</td></tr><tr><th scope="row">Recomposition / CameraTo</th><td lang="en"><code>crane up to</code></td><td>摄影机向上升起，形成下一种构图：</td></tr><tr><th scope="row">Recomposition / Composition</th><td lang="en"><code>high angle ELS Sh back</code></td><td>俯拍大远景：Sh 背对摄影机。</td></tr></tbody></table></div>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Developing shot: Crane up in High Noon</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="13" id="fig-13">

<figcaption><span class="psl-fig-number">图 13</span><h3>《公民凯恩》：多名人物参与的发展镜头</h3></figcaption>

<img alt="图 13：《公民凯恩》中包含多名演员的发展镜头，含原始画面和完整解析树" decoding="async" height="2191" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-13.png" width="1756"/>

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">Shot… / Composition</th><td lang="en"><code>LS Kane</code></td><td>远景：Kane。</td></tr><tr><th scope="row">Recomposition 1 / Cue</th><td lang="en"><code>then as M appears screen left</code></td><td>接着，以 M 出现在画面左侧为动作提示，</td></tr><tr><th scope="row">Recomposition 1 / CameraTo</th><td lang="en"><code>dolly out to</code></td><td>摄影机向后移动，形成下一种构图：</td></tr><tr><th scope="row">Recomposition 1 / Composition</th><td lang="en"><code>MS M right LS Kane 34backleft MS Th left</code></td><td>从左到右：M 为中景，露出右侧面；Kane 为远景，露出左后侧三分之四面；Th 为中景，露出左侧面。</td></tr><tr><th scope="row">（续）Recomposition 2 / Cue</th><td lang="en"><code>then as F appears screen left and M crosses over Th</code></td><td>接着，以 F 出现在画面左侧、M 与 Th 交错通过（over）为动作提示，</td></tr><tr><th scope="row">Recomposition 2 / CameraTo</th><td lang="en"><code>dolly out to</code></td><td>摄影机继续向后移动，形成下一种构图：</td></tr><tr><th scope="row">Recomposition 2 / Composition</th><td lang="en"><code>LS F MS M</code></td><td>从左到右：F 为远景，M 为中景。</td></tr><tr><th scope="row">（续）Recomposition 3 / Cue</th><td lang="en"><code>then as Th F moves to M</code></td><td>接着，以 Th 和 F 向 M 移动为动作提示，</td></tr><tr><th scope="row">Recomposition 3 / CameraTo</th><td lang="en"><code>pan down to</code></td><td>摄影机向下摇摄，形成下一种构图：</td></tr><tr><th scope="row">Recomposition 3 / Composition</th><td lang="en"><code>MLS F 34right ELS Kane 34left MS Th M 34left</code></td><td>从左到右：F 为中远景，露出右前侧三分之四面；Kane 为大远景，露出左前侧三分之四面；Th 与 M 均为中景，露出左前侧三分之四面。</td></tr></tbody></table></div>

<p class="psl-translator-note">译注：人物缩写 M、F、Th 分别表示 Mother（母亲）、Father（父亲）和 Thatcher（撒切尔）。</p>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Developing shot with multiple actors in Citizen Kane</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="14" id="fig-14">

<figcaption><span class="psl-fig-number">图 14</span><h3>PSL 语法的 AND/OR 树</h3></figcaption>

<div class="psl-figure-images psl-stack-images">

<div class="psl-subfigure">

<img alt="PSL 语法 AND/OR 树原图" decoding="async" height="1359" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-14.jpg" width="1536"/>

PSL 语法 AND/OR 树原图

</div>

</div>

<p class="psl-translator-note">译注：AND 表示由多个部分组合，OR 表示在备选项中选择。可对照后面的语法清单和术语表阅读。图中 Subject 与图 15 对应位置的 Agent 命名并不完全一致，这里保留原始图示。</p>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>AND-OR tree representation of the Prose Storyboard Language grammar.</p>

</div>

</details>

</figure>

<span id="appendix-grammar" class="psl-anchor" aria-hidden="true"></span>

## 完整语言语法<small>原文图 15</small>

<figure class="psl-paper-figure" data-figure="15" id="fig-15">

<figcaption><span class="psl-fig-number">图 15</span><h3>PSL 的完整 PEG 语法</h3></figcaption>

<div class="psl-code-wrap">

<div class="psl-code-label">

grammar_Oct2020.bnf.article

</div>

```text
Scene          = Shot*
Shot           = Transition? _ CameraWith? _ Composition? _ WhileEvent?
                  _ (Development?)*
Transition     = ("cut to" / "dissolve to" / "fade in to")
Development    = "then"? _ (Recomposition / Continuation)
Continuation   = Event / FollowEvent
Recomposition  = Cue? _ CameraTo _ Composition
WhileEvent     = "while"_ Event
FollowEvent    = Cue? _ CameraWith _ Agent _ ("and"? _ Agent)*
Cue            = "as" _ Event _ ("and"? _ Event)*
Composition    = (Angle? _ Figure)*
Figure         = Size? _ Subject _ Profile? _ Screen?
Agent          = (Actor / Object) _ (Actor / Object)*
Subject        = Actor / Object / Place
Angle          = "low angle" / "high angle"
Size           = "ECU" / "CU" / "MCU" / "MS" / "MLS" / "FS" / "LS" / "ELS"
Profile        = "left" / "right" / "front" / "back" / "34left" / "34right"
                    / "34backleft" / "34backright"
Screen         = "screen" _ ("top" / "bottom")? _ ("left" / "center"/ "right")?
CameraWith     = Speed? _ (Pan / Dolly / Crane)  _ "with"
CameraTo       = (Hold /(Speed? _ (Pan / Dolly / Crane / Zoom))) _ "to"
Hold           = "hold"
Pan            = "pan"   _ ("left" / "right" / "up" / "down")?
Dolly          = "dolly" _ ("left" / "right" / "in" / "out")?
Crane          = "crane"  _ ("up" / "down") _ ("left"/"right")?
Zoom           = "zoom" _ ("in" / "out")
Speed          = "slow" / "quick"
Enter          = "enters"  _ Screen? _ Place?
Exit           = "exits" _ Screen? _ Place?
Look           = "looks" _ "at"? _ (Subject / Screen)
Move           = "moves" _ "to" _ (Subject / Screen )
Speak          = ("speaks" / ("says" _ String)) _ ("to" _ Subject)?
Use            = "uses" _ Object
Cross          = "crosses" _ ("over" / "under") _ Subject
Touch          = "touches" _ Subject
React          = "reacts to" _ Subject
Turn           = "turns" _ ("left" / "right"
                    / "towards camera" / "away from camera")
Stop           = "stops" _ ("at" / "near") _ Subject
Appear         = "appears" _ (Screen / ("from behind" _ Subject))
Disappear      = "disappears" _ (Screen/ ("behind" _ Subject))
Action         = Enter / Exit / Look / Move / Speak / Use / Cross / Touch
                   / React / Turn / Stop / Appear / Disappear
Event          = Agent _ Action
```

</div>

<p class="psl-translator-note">译注：以下为原文的完整语法清单。? 表示可选，* 表示重复零次或多次，/ 表示按顺序尝试各个选项，双引号内是按字面匹配的词。清单引用了 _ 和 String，却没有给出它们的定义；读者若要运行解析器，应参照论文所链接的实现，不能仅凭这份清单假定语法已经可以独立运行。</p>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Grammar of the prose storyboard language in the Parsing Expression Grammar (PEG) format.</p>

</div>

</details>

</figure>

<span id="glossary" class="psl-anchor" aria-hidden="true"></span>

### 语法、图中术语的中文对照 <small>译者补充</small>

<div aria-label="PSL 术语对照" class="psl-table-scroll" role="region" tabindex="0"><table><thead><tr><th scope="col">原文符号</th><th scope="col">中文</th><th scope="col">含义与取值</th></tr></thead><tbody><tr><th scope="row"><code>Scene</code></th><td>场景</td><td>由零个或多个 Shot（镜头）顺序组成。</td></tr><tr><th scope="row"><code>Shot</code></th><td>镜头</td><td>一段时间连续的画面。语法依次允许转场、CameraWith、初始构图、WhileEvent，以及后续的 Development；具体哪些部分可省略，以图 15 的产生式为准。</td></tr><tr><th scope="row"><code>Transition</code></th><td>转场</td><td>cut to：切到下一镜头；dissolve to：叠化到下一镜头；fade in to：淡入。正文讨论淡入淡出，所列语法仅显式给出淡入。</td></tr><tr><th scope="row"><code>Development</code></th><td>镜内变化</td><td>初始构图之后的展开：可先写 then（然后），再写 Recomposition 或 Continuation。这里的“变化”也包括动作继续而构图不变的情况。</td></tr><tr><th scope="row"><code>Continuation</code></th><td>延续</td><td>由 Event 或 FollowEvent 表达。演员或摄影机继续动作，但构图维持不变。</td></tr><tr><th scope="row"><code>Recomposition</code></th><td>重新构图</td><td>由可选的动作提示 Cue、摄影机动作 CameraTo 和目标构图 Composition 组成。</td></tr><tr><th scope="row"><code>WhileEvent</code></th><td>同时进行的事件</td><td>while 后接 Event，说明呈现某种构图时正在发生的动作。</td></tr><tr><th scope="row"><code>FollowEvent</code></th><td>跟随事件</td><td>可先写 Cue，再写 CameraWith 和一个或多个 Agent，表达摄影机跟随主体以维持构图。</td></tr><tr><th scope="row"><code>Cue</code></th><td>动作提示</td><td>as（当……时）后接一个或多个事件，说明什么动作触发了后续的摄影机操作。</td></tr><tr><th scope="row"><code>Composition</code></th><td>构图</td><td>可选的拍摄角度 Angle，加上一组或多组 Figure 描述。各主体按画面从左到右排列。</td></tr><tr><th scope="row"><code>Figure</code></th><td>一组主体的构图描述</td><td>包括可选的景别、主体组、可选的朝向和画面位置。这里的 Figure 是语法项，不是论文中的图号。</td></tr><tr><th scope="row"><code>Agent</code></th><td>主体组</td><td>一个或多个 Actor 或 Object。同一组中可以连续列出多个名称。</td></tr><tr><th scope="row"><code>Subject</code></th><td>主体</td><td>Actor（行动主体）、Object（物体）或 Place（地点）。不要将语法中的 Subject 与仅包含 Actor、Object 的 Agent 混为一谈。</td></tr><tr><th scope="row"><code>Angle</code></th><td>拍摄角度</td><td>low angle：仰拍；high angle：俯拍。</td></tr><tr><th scope="row"><code>Size</code></th><td>景别</td><td>ECU（Extreme Close-Up）：大特写；CU（Close-Up）：特写；MCU（Medium Close-Up）：中近景；MS（Medium Shot）：中景；MLS（Medium Long Shot）：中远景；FS（Full Shot）：全景；LS（Long Shot）：远景；ELS（Extreme Long Shot）：大远景。景别说明主体在画面中的大小，具体边界参见图 3。</td></tr><tr><th scope="row"><code>Profile</code></th><td>主体朝向</td><td>left/right：以自身左/右侧面朝向摄影机；front/back：正面/背面；34left/34right：左/右前侧三分之四面；34backleft/34backright：左/右后侧三分之四面。34 是 3/4 的连写，不表示 34 度。</td></tr><tr><th scope="row"><code>Screen</code></th><td>画面位置</td><td>screen 后可接 top/bottom（上/下），再可接 left/center/right（左/中/右）。这些方向以画面为准，与主体自身的左右侧不同。</td></tr><tr><th scope="row"><code>CameraWith</code></th><td>维持构图的摄影机动作</td><td>可选速度，加 Pan、Dolly 或 Crane，再加 with（随……）。所列语法不包含 Zoom。</td></tr><tr><th scope="row"><code>CameraTo</code></th><td>转向新构图的摄影机动作</td><td>先写 Hold，或带可选速度的 Pan、Dolly、Crane、Zoom，再写 to，引出目标构图。</td></tr><tr><th scope="row"><code>Hold</code></th><td>摄影机保持静止</td><td>hold：摄影机不动，由主体的动作使画面形成下一种构图。</td></tr><tr><th scope="row"><code>Pan</code></th><td>摇摄</td><td>pan 后可接 left/right/up/down，分别表示向左、向右、向上、向下转动摄影机。PSL 将通常称为 tilt 的上下俯仰也归入 Pan。</td></tr><tr><th scope="row"><code>Dolly</code></th><td>移动摄影</td><td>dolly 后可接 left/right/in/out：摄影机向左、向右、向前、向后移动。它改变机位，与只改变焦距的 Zoom 不同。</td></tr><tr><th scope="row"><code>Crane</code></th><td>升降摄影</td><td>crane 后必须指定 up/down（上升/下降），还可加 left/right（向左/向右）。</td></tr><tr><th scope="row"><code>Zoom</code></th><td>变焦</td><td>zoom in/out：变焦推近/拉远。通过改变焦距改变取景范围，无须移动摄影机。</td></tr><tr><th scope="row"><code>Speed</code></th><td>速度</td><td>slow/quick：缓慢/快速。</td></tr><tr><th scope="row"><code>Enter</code></th><td>进入画面</td><td>enters 后可补充画面位置及地点。</td></tr><tr><th scope="row"><code>Exit</code></th><td>离开画面</td><td>exits 后可补充画面位置及地点。</td></tr><tr><th scope="row"><code>Look</code></th><td>看向</td><td>looks 后可写 at，再指定所看的主体或画面位置。</td></tr><tr><th scope="row"><code>Move</code></th><td>移向</td><td>moves to 后指定目标主体或画面位置。</td></tr><tr><th scope="row"><code>Speak</code></th><td>说话</td><td>使用 speaks，或 says 加台词 String；还可用 to 指定说话对象。</td></tr><tr><th scope="row"><code>Use</code></th><td>使用物体</td><td>uses 后指定使用的物体。</td></tr><tr><th scope="row"><code>Cross</code></th><td>交错通过</td><td>crosses over/under 后指定另一主体，描述双方交错通过、改变画面排列的事件。原文未给出 over/under 的严格几何定义，中文示例保留这两个关键词，需结合对应画面理解。</td></tr><tr><th scope="row"><code>Touch</code></th><td>触碰</td><td>touches 后指定被触碰的主体。</td></tr><tr><th scope="row"><code>React</code></th><td>作出反应</td><td>reacts to 后指定引起反应的主体。</td></tr><tr><th scope="row"><code>Turn</code></th><td>转身</td><td>turns left/right：向左/右转；turns towards camera/away from camera：转向摄影机/转身背向摄影机。</td></tr><tr><th scope="row"><code>Stop</code></th><td>停下</td><td>stops at/near 后指定主体，表示停在该主体所在处/附近。</td></tr><tr><th scope="row"><code>Appear</code></th><td>出现在画面中</td><td>appears 后指定画面位置；也可用 from behind 加主体，表示从该主体后方出现。</td></tr><tr><th scope="row"><code>Disappear</code></th><td>从画面中消失</td><td>disappears 后指定画面位置；也可用 behind 加主体，表示消失在该主体后方。</td></tr><tr><th scope="row"><code>Action</code></th><td>动作</td><td>Enter、Exit、Look、Move、Speak、Use、Cross、Touch、React、Turn、Stop、Appear、Disappear 中的一种。</td></tr><tr><th scope="row"><code>Event</code></th><td>事件</td><td>由 Agent（谁）和 Action（做什么）组成。</td></tr><tr><th scope="row"><code>Actor / Object / Place</code></th><td>场景专用词汇</td><td>分别列出行动主体、物体和地点的名称。图 16–19 给出四部影片各自的词汇表。</td></tr><tr><th scope="row"><code>AND / OR</code></th><td>组合/选择</td><td>图 14 中的连接关系：AND 表示组成关系，OR 表示备选关系。PEG 中的 / 会按书写顺序尝试各选项。</td></tr><tr><th scope="row"><code>continued / then / while / as</code></th><td>续接与时间关系</td><td>continued：接续前文；then：然后；while：与此同时；as：当……时。它们在图例中说明描述如何衔接、动作何时发生。</td></tr></tbody></table></div>

<span id="appendix-elements" class="psl-anchor" aria-hidden="true"></span>

## 四部电影的剧本元素<small>原文图 16–19</small>

<figure class="psl-paper-figure" data-figure="16" id="fig-16">

<figcaption><span class="psl-fig-number">图 16</span><h3>《回到未来》：剧本中的人物、物体与地点</h3></figcaption>

<div class="psl-code-wrap">

<div class="psl-code-label">

script_BTTF.bnf.article

</div>

```text
Actor            = "Marty" / "George" / "Biff" / "Lou" / "Goldie"
                   / "Match" / "Skinhead" / "hands" / "3D"
Object           = "Coffee"/ "Bar" / "Car"
Place            = "Cafe"
```

</div>

<p class="psl-translator-note">译注：Actor 列出行动主体：Marty、George、Biff、Lou、Goldie、Match、Skinhead、hands（手）、3D。Object 列出物体：Coffee（咖啡）、Bar（吧台）、Car（汽车）。Place 列出地点：Cafe（咖啡馆）。这些名称是场景专用的语法词汇，代码中保留原拼写。</p>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Script elements for Back To The Future.</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="17" id="fig-17">

<figcaption><span class="psl-fig-number">图 17</span><h3>《夺魂索》：剧本中的人物、物体与地点</h3></figcaption>

<div class="psl-code-wrap">

<div class="psl-code-label">

script_Rope.bnf.article

</div>

```text
Actor            = "Brandon" / "Philip" / "Atwater" / "Janet" /
                    "Kentley" / "Kenneth" / "Rupert"  / "Wilson"
Object           = "Glass"
Place            = "Salon" / "Dining room" / "Kitchen"
```

</div>

<p class="psl-translator-note">译注：Actor 包括 Brandon、Philip、Atwater、Janet、Kentley、Kenneth、Rupert、Wilson。Object 中的 Glass 是玻璃杯；Place 中的 Salon、Dining room、Kitchen 分别是客厅、餐厅和厨房。人物名称保留原拼写，便于与分镜图对应。</p>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Script elements for Rope.</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="18" id="fig-18">

<figcaption><span class="psl-fig-number">图 18</span><h3>《西北偏北》：剧本中的人物、物体与地点</h3></figcaption>

<div class="psl-code-wrap">

<div class="psl-code-label">

script_nnw.bnf.article

</div>

```text
Actor            = "Thornhill" / "MBS" / "Plane" / "TD1" / "TD2" / "Farmer" /
                   "BC Driver" / "BC Woman" / "BC Man"
Object           = "Bus" / "White car" / "Limo" / "Truck" / "Blue car" /
                   "Green bus" /"Bluewhite car" / "Oil truck" / "Pickup"
                    / "Brown car"
Place            = "Arid plot 1" / "Arid plot 2" / "Arid plot 3" /
                   "Corn field" / "Highway" / "Dirt road"
```

</div>

<p class="psl-translator-note">译注：Actor 包括 Thornhill、MBS、Plane（飞机）、TD1、TD2、Farmer（农夫）、BC Driver（BC 司机）、BC Woman（BC 女乘员）、BC Man（BC 男乘员）。Object 包括 Bus（公共汽车）、White car（白色汽车）、Limo（豪华轿车）、Truck（卡车）、Blue car（蓝色汽车）、Green bus（绿色公共汽车）、Bluewhite car（蓝白色汽车）、Oil truck（油罐车）、Pickup（皮卡）、Brown car（棕色汽车）。Place 包括 Arid plot 1/2/3（旱地 1/2/3）、Corn field（玉米田）、Highway（公路）、Dirt road（土路）。MBS、TD1、TD2、BC 沿用原缩写；飞机被归入 Actor，说明这里的行动主体不限于人。</p>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Script elements for North By Northwest.</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="19" id="fig-19">

<figcaption><span class="psl-fig-number">图 19</span><h3>《历劫佳人》：剧本中的人物、物体与地点</h3></figcaption>

<div class="psl-code-wrap">

<div class="psl-code-label">

script_ToE.bnf.article

</div>

```text
Actor            = "Mike" / "Susan" / "Linnekar" / "Blonde" / "Sanchez" /
                    "Immigration official" / "Customs official"
Object           = "Car" / "Bomb" / "Building" /"Checkpost"
Place            =  "Border control" / "Main street" / "Parking lot"
                    / "Left side street"

```

</div>

<p class="psl-translator-note">译注：Actor 包括 Mike、Susan、Linnekar、Blonde（金发女子）、Sanchez、Immigration official（移民官员）、Customs official（海关官员）。Object 中的 Car、Bomb、Building、Checkpost 分别为汽车、炸弹、建筑、检查哨。Place 中的 Border control、Main street、Parking lot、Left side street 分别为边境检查处、主街、停车场、左侧街道。</p>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Script elements for Touch Of Evil.</p>

</div>

</details>

</figure>

<span id="appendix-rope" class="psl-anchor" aria-hidden="true"></span>

## 《夺魂索》分镜与完整图中文字<small>原文图 20–21</small>

<figure class="psl-paper-figure" data-figure="20" id="fig-20">

<figcaption><span class="psl-fig-number">图 20</span><h3>《夺魂索》：两个段落的草图分镜</h3></figcaption>

<p class="psl-figure-caption">希区柯克《夺魂索》中两个段落的草图分镜。对应的 PSL 标注见下方图 <a class="psl-xref" href="#fig-21">21</a>。</p>

<div class="psl-figure-images psl-stack-images">

<div class="psl-subfigure">

<img alt="第一个段落：平面调度与 C1–C4 构图" decoding="async" height="823" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-20-a.jpg" width="575"/>

第一个段落：平面调度与 C1–C4 构图

</div>

<div class="psl-subfigure">

<img alt="第二个段落：人物调度草图" decoding="async" height="1623" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-20-b.jpg" width="2937"/>

第二个段落：人物调度草图

</div>

</div>

<p class="psl-translator-note">译注：左图中 fridge 为冰箱，table 为餐桌，cam 为摄影机；B、P 分别为 Brandon、Philip，C1–C4 为构图编号。右图标出了 Rupert、Philip、Mrs Atwater（阿特沃特太太）、Janet、Mr Kentley（肯特利先生）和 Brandon；箭头及数字 1、2、3 表示图中的运动与顺序。</p>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Sketch storyboards for two sequences in Alfred Hitchcock's Rope, see Fig. 21 below.</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="21" id="fig-21">

<figcaption><span class="psl-fig-number">图 21</span><h3>《夺魂索》：两个较长段落的完整 PSL 标注</h3></figcaption>

<p class="psl-figure-caption">上方三行对应第一段，时间为 06:55–08:22；下方三行对应第二段，时间为 10:00–12:00。</p>

<div class="psl-figure-images psl-stack-images">

<div class="psl-subfigure">

<img alt="第一个段落 · 06:55–08:22" decoding="async" height="634" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-21-a.jpg" width="1133"/>

第一个段落 · 06:55–08:22

</div>

<div class="psl-subfigure">

<img alt="第二个段落 · 10:00–12:00" decoding="async" height="632" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-21-b.jpg" width="1133"/>

第二个段落 · 10:00–12:00

</div>

</div>

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">第一段 · 1</th><td lang="en"><code>MCU Brandon 34right Philip 34left</code></td><td>中近景，从左到右：Brandon 露出右前侧三分之四面，Philip 露出左前侧三分之四面。</td></tr><tr><th scope="row">第一段 · 2</th><td lang="en"><code>then as Philip moves to screen left and Brandon turns left pan left to</code></td><td>接着，Philip 向画面左侧移动，Brandon 向左转身；摄影机据此向左摇摄，转到下一种构图。</td></tr><tr><th scope="row">第一段 · 3</th><td lang="en"><code>MS Brandon Philip 34backleft</code></td><td>中景，从左到右：Brandon、Philip 均以左后侧三分之四面朝向摄影机。</td></tr><tr><th scope="row">第一段 · 4</th><td lang="en"><code>then dolly in with Brandon Philip</code></td><td>随后，摄影机跟随 Brandon、Philip 向前移动，维持构图。</td></tr><tr><th scope="row">第一段 · 5</th><td lang="en"><code>then as Philip crosses over Brandon dolly in to</code></td><td>接着，Philip 与 Brandon 交错通过（over）；摄影机据此向前移动，转到下一种构图。</td></tr><tr><th scope="row">第一段 · 6</th><td lang="en"><code>MCU Philip Brandon 34backright</code></td><td>中近景，从左到右：Philip、Brandon 均以右后侧三分之四面朝向摄影机。</td></tr><tr><th scope="row">第一段 · 7</th><td lang="en"><code>then as Brandon moves to screen right dolly right to</code></td><td>接着，Brandon 向画面右侧移动；摄影机据此向右移动，转到下一种构图。</td></tr><tr><th scope="row">第一段 · 8</th><td lang="en"><code>MCU Philip 34right Brandon 34left</code></td><td>中近景，从左到右：Philip 露出右前侧三分之四面，Brandon 露出左前侧三分之四面。</td></tr><tr><th scope="row">第一段 · 9</th><td lang="en"><code>then as Brandon touches Glass dolly out to</code></td><td>接着，Brandon 触碰 Glass（玻璃杯）；摄影机据此向后移动，转到下一种构图。</td></tr><tr><th scope="row">第一段 · 10</th><td lang="en"><code>MS Philip 34right Brandon 34left</code></td><td>中景，从左到右：Philip 露出右前侧三分之四面，Brandon 露出左前侧三分之四面。</td></tr><tr><th scope="row">第一段 · 11</th><td lang="en"><code>then as Philip touches Glass dolly in to</code></td><td>接着，Philip 触碰 Glass（玻璃杯）；摄影机据此向前移动，转到下一种构图。</td></tr><tr><th scope="row">第一段 · 12</th><td lang="en"><code>MCU Philip 34right Brandon front</code></td><td>中近景，从左到右：Philip 露出右前侧三分之四面，Brandon 正对摄影机。</td></tr><tr><th scope="row">第二段 · 1</th><td lang="en"><code>LS Philip right Atwater 34left Janet front Kentley 34left Brandon back</code></td><td>远景，从左到右：Philip 露出右侧面；Atwater 露出左前侧三分之四面；Janet 正对摄影机；Kentley 露出左前侧三分之四面；Brandon 背对摄影机。</td></tr><tr><th scope="row">第二段 · 2</th><td lang="en"><code>then slow pan left to</code></td><td>随后，摄影机缓慢向左摇摄，转到下一种构图。</td></tr><tr><th scope="row">第二段 · 3</th><td lang="en"><code>LS Wilson 34left Rupert 34right Philip right Atwater 34left</code></td><td>远景，从左到右：Wilson 露出左前侧三分之四面；Rupert 露出右前侧三分之四面；Philip 露出右侧面；Atwater 露出左前侧三分之四面。</td></tr><tr><th scope="row">第二段 · 4</th><td lang="en"><code>then as Wilson exits screen left and Rupert moves to Philip pan right to</code></td><td>接着，Wilson 从画面左侧离开，Rupert 向 Philip 移动；摄影机据此向右摇摄，转到下一种构图。</td></tr><tr><th scope="row">第二段 · 5</th><td lang="en"><code>LS Philip right Rupert 34backright Atwater Janet Kentley 34left Brandon back</code></td><td>远景，从左到右：Philip 露出右侧面；Rupert 露出右后侧三分之四面；Atwater、Janet、Kentley 均露出左前侧三分之四面；Brandon 背对摄影机。</td></tr><tr><th scope="row">第二段 · 6</th><td lang="en"><code>then as Brandon moves to Rupert dolly in to</code></td><td>接着，Brandon 向 Rupert 移动；摄影机据此向前移动，转到下一种构图。</td></tr><tr><th scope="row">第二段 · 7</th><td lang="en"><code>then as Brandon moves to Rupert dolly in to</code></td><td>接着，Brandon 向 Rupert 移动；摄影机据此向前移动，转到下一种构图。译注：原图相邻两帧使用了相同的这句标注。</td></tr><tr><th scope="row">第二段 · 8</th><td lang="en"><code>MLS Rupert 34right Brandon front Atwater 34left</code></td><td>中远景，从左到右：Rupert 露出右前侧三分之四面；Brandon 正对摄影机；Atwater 露出左前侧三分之四面。</td></tr><tr><th scope="row">第二段 · 9</th><td lang="en"><code>then as Rupert moves to screen right dolly right to</code></td><td>接着，Rupert 向画面右侧移动；摄影机据此向右移动，转到下一种构图。</td></tr><tr><th scope="row">第二段 · 10</th><td lang="en"><code>MS Brandon Rupert right Janet front Kentley 34left</code></td><td>中景，从左到右：Brandon、Rupert 均露出右侧面；Janet 正对摄影机；Kentley 露出左前侧三分之四面。</td></tr><tr><th scope="row">第二段 · 11</th><td lang="en"><code>then as Rupert moves to screen right dolly right to</code></td><td>接着，Rupert 继续向画面右侧移动；摄影机据此向右移动，转到下一种构图。</td></tr><tr><th scope="row">第二段 · 12</th><td lang="en"><code>MCU Rupert right Kentley left</code></td><td>中近景，从左到右：Rupert 露出右侧面，Kentley 露出左侧面。</td></tr></tbody></table></div>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Prose storyboard language annotations of two extended sequences from the movie Rope. Top three rows: First sequence from 06:55 to 08:22. Bottom three rows: Second sequence from 10:00 to 12:00.</p>

</div>

</details>

</figure>

<span id="原文与版本说明" class="psl-anchor" aria-hidden="true"></span>

## 原文与版权说明

原文：<a href="https://arxiv.org/abs/1508.07593v5">The Prose Storyboard Language: A Tool for Annotating and Directing Movies</a>。作者：Rémi Ronfard、Vineet Gandhi、Laurent Boiron、Vaishnavi Ameya Murukutla。

论文正文、图像及所引文献的权利归原作者和相应权利人所有。本页提供中文翻译与阅读注解，保留英文对照和原始图例。

<a href="#top">回到标题 ↑</a>
