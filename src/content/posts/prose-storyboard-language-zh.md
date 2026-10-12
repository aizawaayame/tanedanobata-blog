---
title: 散文分镜语言：用于电影标注与导演的工具（中文全文）
slug: prose-storyboard-language-zh
published: 2026-10-12
draft: false
description: PSL 2.0 论文中文全文，含 8 节正文、21 幅图、完整 PEG 语法、英文对照及 44 条参考文献。
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
<button type="button" data-psl-print>打印本文</button>
<a href="#glossary">查看术语表</a>
</div>

<p class="psl-paper-version">2.0 版 · 修订图解版 · 中文全文</p>

<p class="psl-original-title" lang="en">The Prose Storyboard Language: A Tool for Annotating and Directing Movies<br/>(Version 2.0, Revised and Illustrated Edition)</p>

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

<a href="https://arxiv.org/abs/1508.07593v5">arXiv v5 · 2022-04-29</a>

<a href="https://arxiv.org/pdf/1508.07593v5">英文 PDF</a>

</div>

<p class="psl-edition-note">依据所提供的 v5 源码逐段翻译，保留原图编号、技术限定、统计数字和完整语法。正文中的“我们”指原论文作者；图中 PSL 代码及人物标识符保留原拼写，并提供中文对照。标为“译注”的内容是阅读辅助。</p>

<span id="abstract" class="psl-anchor" aria-hidden="true"></span>

## 摘要<small lang="en">Abstract</small>

<div class="psl-translation-unit" data-source-block="b001" id="b001">

散文分镜语言（Prose Storyboard Language，PSL）是一种逐镜头描述电影的形式语言，其中每个镜头都由一个单独的句子描述。该语言采用简单的语法和有限的词汇，这些词汇借鉴了传统电影制作的工作实践，目的是让机器与人都能够阅读。在过去十年中，我们持续设计这一语言，使其能够充当智能摄影与剪辑系统的高层用户接口。在这篇新论文中，我们介绍该语言的最新演进，以及一次大规模标注实践的结果。这些结果展示了该语言在标注经典电影中精巧的摄影与剪辑手法时所具有的优势。

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

在电影制作中，导演经常使用一种半形式化的自然语言惯用表达，向摄影师传达自己想要的镜头。类似地，电影学者也使用半形式化的自然语言惯用表达，向读者描述已完成电影中镜头的视觉构图。为了构建既智能又富有表现力的虚拟摄影与剪辑系统，我们认为有必要就同类高层描述达成共识。本文提出一种能够承担这一角色的形式语言。提出这一语言的首要目标，是构建能够接收此类形式化描述作为输入、并输出完整实现的镜头的软件摄影智能体。其次，我们希望通过使用所提出的语言自动分析真实电影及其剧本，对电影风格进行深入研究。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>In movie production, directors often use a semi-formal idiom of natural language to convey the shots they want to their cinematographer. Similarly, film scholars use a semi-formal idiom of natural language to describe the visual composition of shots in produced movies to their readers. In order to build intelligent and expressive virtual cinematography and editing systems, we believe the same kind of high-level descriptions need to be agreed upon. In this paper, we propose a formal language that can serve that role. Our primary goal in proposing this language is to build software cinematography agents that can take such formal descriptions as input, and produce fully realized shots as an output. A secondary goal is to perform in-depth studies of film style by automatically analyzing real movies and their scripts in terms of the proposed language.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b004" id="b004">

散文分镜语言是一种从视觉角度描述镜头的形式语言。对声音轨道的描述留待未来研究。散文分镜语言分别描述单个电影画面的空间结构——构图（composition），以及它们的时间结构——镜头（shot）。在电影分析中，镜头与构图经常被混淆。所谓“中景”（medium shot）描述的是一种构图，而非一个完整的镜头。如果演员在同一个镜头中向摄影机靠近，构图就会变为“近景”（close shot），以此类推。因此，用来描述镜头的通用语言不能仅限于描述“中景”“近景”之类的构图，还应该描述在镜头持续过程中引起构图变化的画面事件。在散文分镜语言中，每个镜头都是一个完整句子，包含至少一种构图以及任意数量的画面事件。这为描述和导演电影提供了前所未有的表达能力。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>The prose storyboard language is a formal language for describing shots visually. We leave the description of the soundtrack for future work. The prose storyboard language separately describes the spatial structure of individual movie frames (compositions) and their temporal structure (shots). In film analysis, there is frequent confusion between shots and compositions. A <em>medium shot</em> describes a composition, not a shot. If the actor moves towards the camera in the same shot, the composition will change to a <em>close shot</em> and so on. Therefore, a general language for describing shots cannot be limited to describing compositions such as <em>medium shot</em> or <em>close shot</em> but should also describe screen events which change the composition during the shot. In the prose storyboard language, each shot is a complete sentence with at least one composition and an arbitrary number of screen events. This offers unprecedented expressive power for describing and directing movies.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b005" id="b005">

我们的语言同样适用于前期制作阶段的镜头描述（此时电影只存在于编剧和导演的脑海中）、拍摄阶段的镜头描述（摄影机记录导演喊“开机”和“停机”之间的连续“镜头”）、后期制作阶段的镜头描述（剪辑师对镜头进行裁切与组接），以及对已有电影的描述。一整部电影的描述是一个有序句子列表，每个镜头对应一句。作为特例，单镜头电影——例如阿尔弗雷德·希区柯克的《夺魂索》（Rope）——可以用一个很长的句子描述。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Our language can be used indifferently to describe shots in pre-production (when the movie only exists in the screen-writer and director's minds), during production (when the camera records a continuous "shot" between the times when the director calls "camera" and "cut"), in post-production (when shots are cut and assembled by the film editor) or to describe existing movies. The description of an entire movie is an ordered list of sentences, one per shot. Exceptionally, a movie with a single shot, such as Rope by Alfred Hitchcock, can be described with a single, long sentence.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b006" id="b006">

本文假定所有镜头描述都由人工创建。从已有电影自动生成散文分镜这一重要问题留待未来研究；这项工作可以利用多种已有技术 <a aria-label="参考文献 Bra97" class="psl-cite" href="#ref-Brand97">\[Bra97\]</a> <a aria-label="参考文献 DMR05" class="psl-cite" href="#ref-DMR05">\[DMR05\]</a> <a aria-label="参考文献 GCSS06" class="psl-cite" href="#ref-GoldmanCSS06">\[GCSS06\]</a> <a aria-label="参考文献 GR13" class="psl-cite" href="#ref-GR13">\[GR13\]</a>。我们也将根据散文分镜自动生成电影这一困难问题留待未来研究，其中可以使用已有的虚拟摄影机控制技术 <a aria-label="参考文献 HCS96" class="psl-cite" href="#ref-He96">\[HCS96\]</a> <a aria-label="参考文献 CAwH*96" class="psl-cite" href="#ref-Christianson96">\[CAwH\*96\]</a> <a aria-label="参考文献 JY06" class="psl-cite" href="#ref-Jhala06">\[JY06\]</a> <a aria-label="参考文献 CO06" class="psl-cite" href="#ref-CO06">\[CO06\]</a> <a aria-label="参考文献 GCR*13" class="psl-cite" href="#ref-Galvane2013">\[GCR\*13\]</a> <a aria-label="参考文献 GRCS14" class="psl-cite" href="#ref-Galvane2014">\[GRCS14\]</a> <a aria-label="参考文献 GCLR15" class="psl-cite" href="#ref-Galvane2015">\[GCLR15\]</a>。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>In this paper, we assume that all shot descriptions are manually created. We leave for future work the important issue of automatically generating prose storyboards from existing movies, where a number of existing techniques can be used <a aria-label="参考文献 Bra97" class="psl-cite" href="#ref-Brand97">[Bra97]</a> <a aria-label="参考文献 DMR05" class="psl-cite" href="#ref-DMR05">[DMR05]</a> <a aria-label="参考文献 GCSS06" class="psl-cite" href="#ref-GoldmanCSS06">[GCSS06]</a> <a aria-label="参考文献 GR13" class="psl-cite" href="#ref-GR13">[GR13]</a>. We also leave for future work the difficult problems of automatically generating movies from their prose storyboards, where existing techniques in virtual camera control can be used <a aria-label="参考文献 HCS96" class="psl-cite" href="#ref-He96">[HCS96]</a> <a aria-label="参考文献 CAwH*96" class="psl-cite" href="#ref-Christianson96">[CAwH*96]</a> <a aria-label="参考文献 JY06" class="psl-cite" href="#ref-Jhala06">[JY06]</a> <a aria-label="参考文献 CO06" class="psl-cite" href="#ref-CO06">[CO06]</a> <a aria-label="参考文献 GCR*13" class="psl-cite" href="#ref-Galvane2013">[GCR*13]</a> <a aria-label="参考文献 GRCS14" class="psl-cite" href="#ref-Galvane2014">[GRCS14]</a> <a aria-label="参考文献 GCLR15" class="psl-cite" href="#ref-Galvane2015">[GCLR15]</a>.</p>

</div>

</details>

</div>

<figure class="psl-paper-figure" data-figure="1" id="fig-1">

<figcaption><span class="psl-fig-number">图 01</span><h3>《精疲力尽》中的复杂镜头</h3></figcaption>

<img alt="图 1：《精疲力尽》中的复杂镜头，含原始画面和完整解析树" decoding="async" height="679" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-01.png" width="1756"/>

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">Composition · 初始构图</th><td lang="en"><code>high angle LS Pat 34backleft</code></td><td>俯拍远景：Pat 以左后方 3/4 朝向出现在画面中。</td></tr><tr><th scope="row">Event · 事件</th><td lang="en"><code>while Pat moves to screen left</code></td><td>同时，Pat 向画面左侧移动。</td></tr><tr><th scope="row">Recomposition 1 / CameraTo</th><td lang="en"><code>then pan left to</code></td><td>然后向左摇摄，转至以下构图。</td></tr><tr><th scope="row">Recomposition 1 / Composition</th><td lang="en"><code>high angle LS Mi Pat left</code></td><td>俯拍远景：从左到右为 Mi、Pat，呈左侧面。</td></tr><tr><th scope="row">Recomposition 2 / Cue</th><td lang="en"><code>then as Mi moves to screen left</code></td><td>随后，当 Mi 向画面左侧移动时。</td></tr><tr><th scope="row">Recomposition 2 / CameraTo</th><td lang="en"><code>pan left to</code></td><td>向左摇摄，转至以下构图。</td></tr><tr><th scope="row">Recomposition 2 / Composition</th><td lang="en"><code>high angle LS Mi 34backleft</code></td><td>俯拍远景：Mi 呈左后方 3/4 朝向。</td></tr></tbody></table></div>

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

我们的语言大体借鉴了已有的电影制作实践 <a aria-label="参考文献 TB09b" class="psl-cite" href="#ref-Thompson09a">\[TB09b\]</a> <a aria-label="参考文献 TB09a" class="psl-cite" href="#ref-Thompson09b">\[TB09a\]</a>，以及此前关于电影风格史的研究 <a aria-label="参考文献 Bor98" class="psl-cite" href="#ref-Bordwell98">\[Bor98\]</a> <a aria-label="参考文献 Sal09" class="psl-cite" href="#ref-Salt09">\[Sal09\]</a>。它也与常见的图形分镜实践有关。在图形分镜中，每种构图用一幅图画表示。摄影机与演员的场面调度，可以通过每格画面中的约定箭头系统、另一组平面调度图，或者画格之间的文字标题来描绘。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Our language is loosely based on existing practices in movie-making <a aria-label="参考文献 TB09b" class="psl-cite" href="#ref-Thompson09a">[TB09b]</a> <a aria-label="参考文献 TB09a" class="psl-cite" href="#ref-Thompson09b">[TB09a]</a> and previous research in the history of film style <a aria-label="参考文献 Bor98" class="psl-cite" href="#ref-Bordwell98">[Bor98]</a> <a aria-label="参考文献 Sal09" class="psl-cite" href="#ref-Salt09">[Sal09]</a>. Our language is also related to the common practice of graphic storyboards. In a graphic storyboard, each composition is illustrated with a single drawing. The blocking of the camera and actors can be depicted with a conventional system of arrows within each frame, or with a separate set of floor plan views, or with titles between frames.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b009" id="b009">

在我们的方案中，构图之间的转变采用一小组画面事件词汇，其中包括摄影机动作：摇摄（pan）、移动摄影（dolly）、升降摄影（crane）、保持机位（hold）和继续（continue）；以及演员动作：说话（speak）、作出反应（react）、移动（move）和交叉通过（cross）。尽管动作词汇很容易扩充，我们仍有意保持较小的词汇量，因为本文关注的范围是演员与摄影机的场面调度，而非叙事的高层语义。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>In our case, the transitions between compositions use a small vocabulary of screen events including camera actions (pan, dolly, crane, hold, continue) and actor actions (speak, react, move, cross). Although the action vocabulary could easily be extended, we voluntarily keep it small because our focus in this paper is restricted to the blocking of actors and cameras, not the high-level semantics of the narrative.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b010" id="b010">

“散文分镜”（prose storyboard）一词借自 Proferes <a aria-label="参考文献 Pro08" class="psl-cite" href="#ref-Proferes08">\[Pro08\]</a>。他将其作为一种把电影剧本分解为镜头序列、并用自然语言表达的技术。其他作者使用法语词“découpage”来描述电影制作中的这一重要步骤。这个名称体现了一种直觉：这种语言应该能够直接转化为画面。与 Proferes 的方法不同，我们的散文分镜语言是一种具有明确定义的语法和语义的形式语言，适合用于未来的智能摄影与剪辑研究。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>We borrow the term prose storyboard from Proferes <a aria-label="参考文献 Pro08" class="psl-cite" href="#ref-Proferes08">[Pro08]</a> who used it as a technique for decomposing a films script into a sequence of shots, expressed in natural language. Other authors use the French term "decoupage" to describe this important step in film production. The name catches the intuition that the language should directly translate to images. In contrast to Proferes, our prose storyboard language is a formal language, with a well-defined syntax and semantics, suitable for future work in intelligent cinematography and editing.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b011" id="b011">

我们的方案与电影剧本标记语言（Movie Script Markup Language，MSML）<a aria-label="参考文献 RKV*09" class="psl-cite" href="#ref-RijsselbergenKVMW09">\[RKV\*09\]</a> 互为补充，后者对电影剧本的结构进行编码。在 MSML 中，剧本被分解为对白块和动作块，但它不描述如何把每个块转化为镜头。我们的散文分镜语言可以联系由 MSML 编码的电影剧本，描述电影镜头的场面调度。为此，MSML 预留了制作模型（Manufacturing model）和动画模型（Animation model），但只对它们作了粗略描述。散文分镜语言可以视为 MSML 中制作模型与动画模型的另一种表示方式。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Our proposal is complementary to the Movie Script Markup Language (MSML) <a aria-label="参考文献 RKV*09" class="psl-cite" href="#ref-RijsselbergenKVMW09">[RKV*09]</a>, which encodes the structure of a movie script. In MSML, a script is decomposed into dialogue and action blocks but does not describe how each block is translated into shots. Our prose storyboard language can be used to describe the blocking of the shots in a movie in relation to an MSML-encoded movie script. For this purpose, MSML makes provision for a Manufacturing model and Animation model, which are only loosely described. The prose storyboard language can be seen as an alternative representation for both the Manufacturing and Animation models in MSML.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b012" id="b012">

我们的方案也与声明式摄影机控制语言（Declarative Camera Control Language，DCCL）有关。DCCL 使用屏幕坐标中的镜头来描述电影惯用手法，而非使用世界坐标中的摄影机 <a aria-label="参考文献 CAwH*96" class="psl-cite" href="#ref-Christianson96">\[CAwH\*96\]</a>。DCCL 会被编译为一棵电影树（film tree），其中包含对输入动作的所有可能剪辑方式，而动作表示为“主语—动词—宾语”三元组。我们的散文分镜语言可以与这类结构配合使用，指导更广泛的镜头类别，包括复杂镜头和发展镜头。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Our proposal is also related to the Declarative Camera Control Language (DCCL) which describes film idioms, not in terms of cameras in world coordinates but in terms of shots in screen coordinates <a aria-label="参考文献 CAwH*96" class="psl-cite" href="#ref-Christianson96">[CAwH*96]</a>. The DCCL is compiled into a film tree, which contains all the possible editings of the input actions, where actions are represented as subject-verb-object triples. Our prose storyboard language can be used in coordination with such constructs to guide a more extensive set of shot categories, including complex and developing shots.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b013" id="b013">

我们的方法还与 Jhala 和 Young 的工作有关。他们使用阿尔弗雷德·希区柯克的《夺魂索》，说明应该如何向自动剪辑系统表示故事情节和导演的目标 <a aria-label="参考文献 JY06" class="psl-cite" href="#ref-Jhala06">\[JY06\]</a>。他们采用一种偏序因果链规划器 Crossbow，依据维持节奏、表现情绪等多种策略，求解最佳剪辑方式。他们展示了求解器能够以不同剪辑风格呈现同一段落。但他们的方法并不尝试描述可能镜头的集合。我们的散文分镜语言试图填补这一空白。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Our approach is also related to the work of Jhala and Young who used the movie Rope by Alfred Hitchcock to demonstrate how the storyline and the director's goal should be represented to an automatic editing system <a aria-label="参考文献 JY06" class="psl-cite" href="#ref-Jhala06">[JY06]</a>. They used Crossbow, a partial order causal link planner, to solve for the best editing, according to a variety of strategies, including maintaining tempo and depicting emotion. They demonstrated the capability of their solver to present the same sequence in different editing styles. But their approach does not attempt to describe the set of possible shots. Our prose storyboard language attempts to fill that gap.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b014" id="b014">

以往其他虚拟摄影研究 <a aria-label="参考文献 SMAY03" class="psl-cite" href="#ref-Shen03">\[SMAY03\]</a> <a aria-label="参考文献 JY05" class="psl-cite" href="#ref-Jhala05">\[JY05\]</a> <a aria-label="参考文献 FF06" class="psl-cite" href="#ref-Friedman06">\[FF06\]</a> <a aria-label="参考文献 ORN09" class="psl-cite" href="#ref-ONeillRN09">\[ORN09\]</a> <a aria-label="参考文献 MJSB11" class="psl-cite" href="#ref-MarkowitzKSB11">\[MJSB11\]</a> <a aria-label="参考文献 GRCS14" class="psl-cite" href="#ref-Galvane2014">\[GRCS14\]</a> <a aria-label="参考文献 GCLR15" class="psl-cite" href="#ref-Galvane2015">\[GCLR15\]</a> <a aria-label="参考文献 LDTA17" class="psl-cite" href="#ref-Leake2017">\[LDTA17\]</a>，只涉及摄影机静止或采用单一均匀运动的简单镜头。我们的散文分镜语言与这些工作互为补充，可用于为大多数已有虚拟摄影系统定义更高层的电影策略，包括任意复杂的摄影机运动与演员运动组合。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Other previous work in virtual cinematography <a aria-label="参考文献 SMAY03" class="psl-cite" href="#ref-Shen03">[SMAY03]</a> <a aria-label="参考文献 JY05" class="psl-cite" href="#ref-Jhala05">[JY05]</a> <a aria-label="参考文献 FF06" class="psl-cite" href="#ref-Friedman06">[FF06]</a> <a aria-label="参考文献 ORN09" class="psl-cite" href="#ref-ONeillRN09">[ORN09]</a> <a aria-label="参考文献 MJSB11" class="psl-cite" href="#ref-MarkowitzKSB11">[MJSB11]</a> <a aria-label="参考文献 GRCS14" class="psl-cite" href="#ref-Galvane2014">[GRCS14]</a> <a aria-label="参考文献 GCLR15" class="psl-cite" href="#ref-Galvane2015">[GCLR15]</a> <a aria-label="参考文献 LDTA17" class="psl-cite" href="#ref-Leake2017">[LDTA17]</a> has been limited to simple shots with either a static camera or a single uniform camera movement. Our prose storyboard language is complementary to such previous work and can be used to define higher-level cinematic strategies, including arbitrarily complex combinations of camera and actor movements, for most existing virtual cinematography systems.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b015" id="b015">

文本到电影（或文本到场景）创作，是为根据自然语言文本自动生成三维图形与动画而提出的一大类方法。在一些受限领域中，这些方法已经取得良好结果，例如根据自然语言交通事故报告生成三维场景 <a aria-label="参考文献 ASSN03" class="psl-cite" href="#ref-Akerberg2003">\[ASSN03\]</a>，或者根据写好的对白场景生成卡通动画 <a aria-label="参考文献 SY06" class="psl-cite" href="#ref-Seversky2006">\[SY06\]</a>。商业化的文本到电影系统包括 NawmalMAKE 和 Plotagon Studio。这类系统接收经过标记的对白作为输入，生成摄影机运动和剪辑都很少的简单镜头。同一路线上的其他相关工作包括：Ye 和 Baldwin <a aria-label="参考文献 YB08" class="psl-cite" href="#ref-Ye2008">\[YB08\]</a> 介绍了根据电影剧本生成分镜的方法；Marti 等人 <a aria-label="参考文献 MVW*18" class="psl-cite" href="#ref-Marti2018">\[MVW\*18\]</a> 介绍了同样根据电影剧本生成预演动画（previz animation）的方法。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Text-to-movie (or text-to-scene) authoring is a general class of methods that have been proposed for automatically generating 3D graphics and animation from natural language text. Good results have been obtained in limited domains, such as generating 3D scenes from natural language accident reports <a aria-label="参考文献 ASSN03" class="psl-cite" href="#ref-Akerberg2003">[ASSN03]</a> or generating cartoon animation from scripted dialogue scenes <a aria-label="参考文献 SY06" class="psl-cite" href="#ref-Seversky2006">[SY06]</a>. Commercially available text-to-movie systems include NawmalMAKE and Plotagon Studio Such systems use marked-up dialogues as input and generate simple shots with minimal camera movements and editing. Other related work along the same lines includes Ye and Baldwin <a aria-label="参考文献 YB08" class="psl-cite" href="#ref-Ye2008">[YB08]</a> who describe a method for generating storyboards from movie scripts; Marti et al. <a aria-label="参考文献 MVW*18" class="psl-cite" href="#ref-Marti2018">[MVW*18]</a> who describe methods for generating previz animation, also from movie scripts.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b016" id="b016">

与我们的方法更接近的是 Director Notation（导演记谱法，DN）<a aria-label="参考文献 Yan13" class="psl-cite" href="#ref-Yannopoulos2013">\[Yan13\]</a>，它是一种旨在表达电影（活动影像）内容的符号语言，就像乐谱为音乐写作提供语言一样。不过，DN 是一种图形记法，而 PSL 是一种拟自然语言；DN 描述电影的制作过程，而 PSL 像分镜一样描述电影本身。TIMISTO <a aria-label="参考文献 VHL*13" class="psl-cite" href="#ref-Vogt2013">\[VHL\*13\]</a> 和 SLAP <a aria-label="参考文献 BS16" class="psl-cite" href="#ref-Braga2016">\[BS16\]</a> 则是从分镜创建动画的模式语言。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Closer to our approach, Director Notation <a aria-label="参考文献 Yan13" class="psl-cite" href="#ref-Yannopoulos2013">[Yan13]</a> is a symbolic language intended to express the content of film (motion pictures), much as musical notation provides a language for the writing of music. But DN is a graphical notation whereas PSL is a pseudo-natural language, and DN describes the movie production process, whereas PSL describes the movie itself, as in a storyboard. TIMISTO <a aria-label="参考文献 VHL*13" class="psl-cite" href="#ref-Vogt2013">[VHL*13]</a> and SLAP <a aria-label="参考文献 BS16" class="psl-cite" href="#ref-Braga2016">[BS16]</a> are pattern languages for creating animation from storyboards.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b017" id="b017">

散文分镜语言的早期版本于 2012 年在智能摄影与剪辑国际研讨会（WICED）上发表。此后，PSL 的若干变体已经用于：为严肃游戏生成电影化回放 <a aria-label="参考文献 GRCS14" class="psl-cite" href="#ref-Galvane2014">\[GRCS14\]</a>；根据实拍视频素材生成合成的复杂镜头 <a aria-label="参考文献 GRG14" class="psl-cite" href="#ref-GR14">\[GRG14\]</a> <a aria-label="参考文献 GR15" class="psl-cite" href="#ref-GR15">\[GR15\]</a>；在三维动画中调度复杂场景 <a aria-label="参考文献 LCL18" class="psl-cite" href="#ref-Louarn18">\[LCL18\]</a>；指挥电影摄影无人机 <a aria-label="参考文献 GLC*18" class="psl-cite" href="#ref-Galvane2018">\[GLC\*18\]</a>；以及从示例中学习电影剪辑模式 <a aria-label="参考文献 WPRC18" class="psl-cite" href="#ref-Wu2018">\[WPRC18\]</a>。在这次修订版中，我们给出语言的定稿版本，配以大量示例和参考实现，希望推动未来关于电影自动标注与生成的研究。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>A previous version of the prose storyboard language was presented at the international workshop on intelligent cinematography and editing (WICED) in 2012. Since then, several variations of PSL have been used for generating cinematic replays in serious games <a aria-label="参考文献 GRCS14" class="psl-cite" href="#ref-Galvane2014">[GRCS14]</a>, for generating synthetic complex shots from live video material <a aria-label="参考文献 GRG14" class="psl-cite" href="#ref-GR14">[GRG14]</a> <a aria-label="参考文献 GR15" class="psl-cite" href="#ref-GR15">[GR15]</a>, for staging complex scenes in 3D animation <a aria-label="参考文献 LCL18" class="psl-cite" href="#ref-Louarn18">[LCL18]</a>, for directing cinematographic drones <a aria-label="参考文献 GLC*18" class="psl-cite" href="#ref-Galvane2018">[GLC*18]</a> and for learning film editing patterns from examples <a aria-label="参考文献 WPRC18" class="psl-cite" href="#ref-Wu2018">[WPRC18]</a>. In this revised edition, we provide a definitive version of the language, illustrated with a large number of examples and a reference implementation, in the hope that it will stimulate future work in automatic annotation and generation of movies.</p>

</div>

</details>

</div>

<figure class="psl-paper-figure" data-figure="2" id="fig-2">

<figcaption><span class="psl-fig-number">图 02</span><h3>阿尔弗雷德·希区柯克《西北偏北》中两个标志性镜头的 PSL 描述</h3></figcaption>

<img alt="图 2：阿尔弗雷德·希区柯克《西北偏北》中两个标志性镜头的 PSL 描述，含原始画面和完整解析树" decoding="async" height="553" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-02.png" width="843"/>

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">Scene / Shot 1 / Composition</th><td lang="en"><code>low angle FS Plane MS Th front</code></td><td>仰拍：飞机为全景；Th 为中景、正面。</td></tr><tr><th scope="row">Scene / Shot 2 / Transition</th><td lang="en"><code>cut to</code></td><td>切至下一个镜头。</td></tr><tr><th scope="row">Scene / Shot 2 / Composition</th><td lang="en"><code>MLS Th 34right</code></td><td>中远景：Th 呈右前方 3/4 朝向。</td></tr></tbody></table></div>

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

散文分镜语言的设计目标是具有充分的表达能力，即能够描述任意复杂的镜头，同时保持紧凑、直观。我们的方法是让简单镜头的描述尽可能简单，并在需要时允许更复杂的描述。例如，我们按从左到右的顺序描述构图中的演员，这在大多数情况下都是一种简洁直观的相对位置表达方式。因此，我们的散文分镜语言非常接近自然语言，示例见图 <a class="psl-xref" href="#fig-21">21</a>。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>The prose storyboard language is designed to be expressive, i.e. it should describe arbitrarily complex shots, while at the same time being compact and intuitive. Our approach has been to keep the description of simple shots as simple as possible, and allowing for more complex descriptions when needed. Thus, for example, we describe actors in composition from left to right, which is an economical and intuitive way of specifying relative actor positions in most cases. As a result, our prose storyboard language is very close to natural language (see Fig.<a class="psl-xref" href="#fig-21">21</a> for examples).</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b020" id="b020">

这门语言应该易于解析成无歧义的语义表示，并且该表示能够与视频内容匹配：既可以用于描述已有内容，也可以用于生成符合描述的新内容。因此，至少在理论上，应该能够把这门语言中的任意句子转化为草图分镜，再转化为完整的动画段落。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>It should be easy to parse the language into a non-ambiguous semantic representation that can be matched to video content, either for the purpose of describing existing content or for generating novel content that matches the description. It should therefore be possible (at least in theory) to translate any sentence in the language into a sketch storyboard, then to a fully animated sequence.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b021" id="b021">

从理论上说，也应该能够把已有视频内容转化为散文分镜。这对语言提出了另一项要求：仅通过观看，就应该能够描述已有镜头。除了地点和人物名称，不应需要其他上下文信息。因此，散文分镜语言也可作为标注完整电影以及在后期制作前记录镜头的工具。由于标注者即使在后期制作阶段也无法获知拍摄计划的细节 <a aria-label="参考文献 Mur86" class="psl-cite" href="#ref-Murch86">\[Mur86\]</a> <a aria-label="参考文献 Ond04" class="psl-cite" href="#ref-Ondaatje04">\[Ond04\]</a>，我们必须使镜头能够在屏幕坐标中描述，而不必引用世界坐标。

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

散文分镜语言是一种上下文无关语言，其终结符包括通用术语和特定术语。通用终结符用于描述画面事件的主要类别，包括摄影机动作（pan、dolly、cut、dissolve 等）和演员动作（enter、exit、cross、move、speak、react 等）。特定终结符则是构成画面并参与故事的人物、地点和物体的名称。该语言的非终结符包括重要的镜头类别（简单、复杂、发展）、画面构图和发展过程。完整语法用图 <a class="psl-xref" href="#fig-14">14</a> 的 AND/OR 图说明，并在图 <a class="psl-xref" href="#fig-15">15</a> 中以 PEG 记法给出。使用 Parsimonious 工具包、以 Python 解析 PSL 句子的参考实现见<a href="https://gitlab.inria.fr/vmurukut/psl">PSL 参考实现仓库</a>。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>The prose storyboard language is a context-free language, whose terminals include generic and specific terms. Generic terminals are used to describe the main categories of screen events including camera actions (pan, dolly, cut, dissolve, etc.) and actor actions (enter, exit, cross, move, speak, react, etc.). Specific terminals are the names of characters, places and objects that compose the image and play a part in the story. Non-terminals of the language include important categories of shots (simple, complex, developing), image compositions and developments. The complete grammar for the language is illustrated with the AND/OR graph in Fig. <a class="psl-xref" href="#fig-14">14</a> and described in the PEG notation in Fig.<a class="psl-xref" href="#fig-15">15</a>. A reference implementation using the Parsimonious toolkit for parsing PSL sentences using the Python language can be found at <a href="https://gitlab.inria.fr/vmurukut/psl">https://gitlab.inria.fr/vmurukut/psl</a>.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b024" id="b024">

散文分镜语言的语义，最适合用时间 Petri 网（Timed Petri Net，TPN）描述。在其中，构图和摄影机动作等持续性事件表示为库所（places），而剪切以及其他事件的开始、结束等瞬时事件表示为变迁（transitions）。我们使用时间 Petri 网而非有限状态机，作为散文分镜中镜头的语义表示，是为了充分表达演员和摄影机同时进行精细运动编排的发展镜头，例如奥逊·威尔斯《历劫佳人》（Touch of Evil）的开场镜头。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>The semantics of the prose storyboard language is best described in terms of a Timed Petri Net (TPN) where durative events such as compositions and camera actions are represented as <em>places</em> ; and instantaneous events (such as cuts and the start and end of other events) are represented as <em>transitions</em>. We use timed Petri nets, rather than finite state machines, as a semantic representation of shots in a prose storyboard, in order to adequately represent developing shots with an elaborate choreography of actor and camera movements taking place simultaneously, such as the opening shot in Orson Welles' "Touch of evil".</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b025" id="b025">

此前，TPN 已被用于表示电影剧本的时间结构 <a aria-label="参考文献 RKV*09" class="psl-cite" href="#ref-RijsselbergenKVMW09">\[RKV\*09\]</a>、角色动画 <a aria-label="参考文献 MRR98" class="psl-cite" href="#ref-Magalhaes98">\[MRR98\]</a> <a aria-label="参考文献 BvKR01" class="psl-cite" href="#ref-Blackwell01">\[BvKR01\]</a>、游戏创作 <a aria-label="参考文献 BBAG08" class="psl-cite" href="#ref-BalasBAG08">\[BBAG08\]</a>、对话中的轮流发言 <a aria-label="参考文献 Cha12" class="psl-cite" href="#ref-Chao12">\[Cha12\]</a>，以及多媒体系统的同步与存储模型 <a aria-label="参考文献 LG90" class="psl-cite" href="#ref-Little1990SynchronizationAS">\[LG90\]</a>。我们的模型与以往工作不同之处在于：把所有持续性事件都表示为库所，并使用变迁使它们同步。受篇幅限制，我们将散文分镜语言的 Petri 网解释留待未来工作详细描述。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>TPNs have been proposed for representing the temporal structure of movie scripts <a aria-label="参考文献 RKV*09" class="psl-cite" href="#ref-RijsselbergenKVMW09">[RKV*09]</a>, character animation <a aria-label="参考文献 MRR98" class="psl-cite" href="#ref-Magalhaes98">[MRR98]</a> <a aria-label="参考文献 BvKR01" class="psl-cite" href="#ref-Blackwell01">[BvKR01]</a>, game authoring <a aria-label="参考文献 BBAG08" class="psl-cite" href="#ref-BalasBAG08">[BBAG08]</a>, turn-taking in conversation <a aria-label="参考文献 Cha12" class="psl-cite" href="#ref-Chao12">[Cha12]</a> and synchronisation and storage models for multimedia systems <a aria-label="参考文献 LG90" class="psl-cite" href="#ref-Little1990SynchronizationAS">[LG90]</a>. Our model differs from previous work by representing all durative events with places and using transitions to synchronize them. For lack of space, we differ the description of the Petri Net interpretation of the prose storyboard language to future work.</p>

</div>

</details>

</div>

<figure class="psl-paper-figure" data-figure="3" id="fig-3">

<figcaption><span class="psl-fig-number">图 03</span><h3>景别与主体朝向角</h3></figcaption>

<p class="psl-figure-caption">（a）散文分镜中的景别，转载自 <a aria-label="参考文献 Sal06" class="psl-cite" href="#ref-Salt06">[Sal06]</a>。（b）演员的朝向角定义了其相对于摄影机的朝向。例如，朝向角为 left 的演员，以自己的左侧朝向摄影机。</p>

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

<p class="psl-translator-note"><strong>图中文字 / 译注</strong> 图内词语：front＝正面；back＝背面；left／right＝主体的左／右侧面；3/4 left／right＝左／右前方三分之四视角；3/4 backleft／backright＝左／右后方三分之四视角。PSL 中把 3/4 连写为 34。景别缩写的完整对照见文末术语表。</p>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>(a) shows shot sizes in the prose storyboard (reproduced from [Sal06]). (b) shows the profile angle of an actor defines his orientation relative to the camera. For example, an actor with a left profile angle is oriented with his left side facing the camera.</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="4" id="fig-4">

<figcaption><span class="psl-fig-number">图 04</span><h3>景别的依据与屏幕坐标</h3></figcaption>

<p class="psl-figure-caption">如（a）所示，景别取决于摄影机与演员的距离，以及摄影机的焦距。（b）展示了如何用屏幕坐标表示构图中演员的水平位置。</p>

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

<p class="psl-translator-note"><strong>图中文字 / 译注</strong> 图内词语：Placement＝位置分布；screenleft／screenright＝画面左侧／右侧；center＝中央；cam＝摄影机。1/4、1/3 保留原图的比例标记。（a）中的 BCU 是原图使用的大特写缩写；图 15 的 Size 规则未列出 BCU，此处保留原图。</p>

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

画面构图是在电影画格中组织视觉元素、向观众传递特定信息的方式。在本研究中，我们提出一种形式化的画面构图描述方法，以屏幕中出现的演员和物体，以及它们之间的空间与时间关系来进行描述。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Image composition is the way to organise visual elements in the motion picture frame to deliver a specific message to the audience. In our work, we propose a formal way to describe image composition in terms of the actors and objects present on the screen and the spatial and temporal relations between them.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b028" id="b028">

遵循 Thomson 和 Bowen 的定义 <a aria-label="参考文献 TB09b" class="psl-cite" href="#ref-Thompson09a">\[TB09b\]</a>，我们把构图定义为：被称为主体（`Subject`）的视觉元素，在屏幕坐标中的相对位置和朝向。在简单的平面调度（flat staging）中，所有主体大致位于同一平面，呈现相同的大小；而在纵深调度（deep staging）中，不同主体位于不同平面，呈现不同的大小。出于通用性的考虑，我们选择分别指出每个主体的景别大小。因此，每个主体都由景别、朝向角和屏幕位置来定义。直观说明见图 <a class="psl-xref" href="#fig-3">3b</a> 和图 <a class="psl-xref" href="#fig-3">3b</a>。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Following Thomson and Bowen <a aria-label="参考文献 TB09b" class="psl-cite" href="#ref-Thompson09a">[TB09b]</a>, we define a composition as the relative position and orientation of visual elements called <em>Subject</em>, in screen coordinates. In the simple case of <em>flat staging</em>, all subjects are more or less in the same plane with the same size, but in the case of <em>deep staging</em>, different subjects are seen at different sizes, in different planes. For the sake of generality, we therefore choose to indicate the size of each subject separately. As a result, each subject is defined by its size, profile angle, and screen position. See Fig. <a class="psl-xref" href="#fig-3">3b</a> and <a class="psl-xref" href="#fig-3">3b</a> for a visual explanation.</p>

</div>

</details>

</div>

<p class="psl-translator-note">译注：本段原文连续两次指向同一幅图 3(b)，此处保留该重复引用。</p>

<div class="psl-translation-unit" data-source-block="b029" id="b029">

作为约定，我们假设主体按从左到右的顺序描述。这意味着演员和物体从左到右的排列顺序本身就是构图的一部分。事实上，这一顺序在摄影与电影剪辑中非常重要，因此我们引入专用关键字 `cross`，表示一个主体从另一个主体的上方或下方交叉通过的画面事件。景别用于描述主体的相对大小，而不依赖于摄影机所用的镜头，如图 <a class="psl-xref" href="#fig-4">4a</a> 所示。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>As a convention, we assume that the subjects are described from left to right. This means that the left-to-right ordering of actors and objects is part of the composition. Indeed, because the left-to-right ordering of subjects is so important in cinematography and film editing, we introduce a special keyword <em>cross</em> for the screen event of one subject crossing over or under another subject. Shot sizes are used to describe the relative sizes of subjects independently of the camera lens as illustrated in Fig.<a class="psl-xref" href="#fig-4">4a</a>.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b030" id="b030">

`Screen` 项描述主体在屏幕坐标中的位置。通过把主体位置移向左侧或右侧角落，它允许对通用取景作小幅调整，如图 <a class="psl-xref" href="#fig-4">4b</a> 所示。`Screen` 的默认值用于描述主体从左到右均匀分布的对称构图；非默认值用于描述非对称构图，例如考虑头顶留白、视线前方留白或三分法的构图。我们也能描述非常规取景，以形成不平衡的艺术构图，或展示场景中的其他视觉元素。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>The <code>Screen</code> term describe the subject position in screen coordinate. It allows to slightly modify the generic framing by shifting the subject position to the left or right corner as shown in Fig.<a class="psl-xref" href="#fig-4">4b</a>. Default <code>Screen</code> values are used to describe symetric compositions where subjects are evenly distributed from left to right. Non-default <code>Screen</code> values are used to describe asymetric compositions, e.g. taking into account head room and look room or the rules of thirds. We can also describe unconventional framing to create unbalanced artistic composition or to show other visual elements in the scene.</p>

</div>

</details>

</div>

<figure class="psl-paper-figure" data-figure="5" id="fig-5">

<figcaption><span class="psl-fig-number">图 05</span><h3>散文分镜语言中的单人构图</h3></figcaption>

<p class="psl-figure-caption">散文分镜语言中的单人构图。这一画格取自布莱恩·德·帕尔马的《剃刀边缘》（Dressed to Kill，1980），展示从低角度仰拍的大特写。</p>

<div class="psl-figure-images">

<div class="psl-subfigure">

<img alt="low angle ECU Girl 34left" decoding="async" height="299" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-05.jpg" width="501"/>

low angle ECU Girl 34left

</div>

</div>

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">构图</th><td lang="en"><code>low angle ECU Girl 34left</code></td><td>仰拍大特写：女孩呈左前方 3/4 朝向。</td></tr></tbody></table></div>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Single actor composition in Prose Storyboard Language. This frame from Brian De Palma's Dressed To Kill (1980) shows an extreme close up shot from a low angle.</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="6" id="fig-6">

<figcaption><span class="psl-fig-number">图 06</span><h3>散文分镜语言中的双人构图</h3></figcaption>

<p class="psl-figure-caption">散文分镜语言中的双人构图。（a）文森特·明奈利 1953 年的音乐片《篷车队》（The Band Wagon），以及（b）让-吕克·戈达尔 1965 年的法国新浪潮电影《狂人皮埃罗》（Pierrot le Fou）中的构图，都在一帧中呈现了不同大小的两名演员。</p>

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

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">（a）</th><td lang="en"><code>FS Cyd 34right Fred front</code></td><td>全景：从左到右，Cyd 呈右前方 3/4 朝向，Fred 呈正面。</td></tr><tr><th scope="row">（b）</th><td lang="en"><code>MS Girl 34backright Ferdinand front</code></td><td>中景：从左到右，女孩呈右后方 3/4 朝向，Ferdinand 呈正面。</td></tr></tbody></table></div>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Two actor composition in Prose Storyboard Language. Compositions from Vincente Minnelli's 1953 musical, The Band Wagon (a) and Jean-Luc Godard's 1965 French New Wave film, Pierrot Le Fou (b) feature two actors in a frame at different sizes.</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="7" id="fig-7">

<figcaption><span class="psl-fig-number">图 07</span><h3>包含无生命物体的构图</h3></figcaption>

<p class="psl-figure-caption">（a）和（b）的构图包含无生命物体：让-吕克·戈达尔《狂人皮埃罗》中的剪刀，以及奥逊·威尔斯《历劫佳人》中的炸弹。</p>

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

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">（a）</th><td lang="en"><code>ECU Scissors MCU Marianne front</code></td><td>剪刀为大特写；Marianne 为中近景、正面。</td></tr><tr><th scope="row">（b）</th><td lang="en"><code>CU Sanchez hands front as hands hold Bomb</code></td><td>近距离特写：Sanchez 的双手呈正面，同时双手握着炸弹。</td></tr></tbody></table></div>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Compositions in (a) and (b) include inanimate objects (scissors in Jean-Luc Godard's Pierrot Le Fou and a bomb in Orson Welles's Touch Of Evil).</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="8" id="fig-8">

<figcaption><span class="psl-fig-number">图 08</span><h3>多人、不同纵深的复杂构图</h3></figcaption>

<p class="psl-figure-caption">（a）奥逊·威尔斯 1941 年的《公民凯恩》（Citizen Kane）和（b）阿尔弗雷德·希区柯克 1959 年的《西北偏北》中的复杂构图，展示多名演员处于距摄影机不同远近的位置。按从左到右的顺序描述他们，并用景别大小表明其在构图中的纵深。</p>

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

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">（a）</th><td lang="en"><code>MLS Father 34right screen left ELS Kane 34left screen center MS Thatcher Mother 34left screen right</code></td><td>画面左侧：父亲为中远景、右前方 3/4 朝向；画面中央：凯恩为大远景、左前方 3/4 朝向；画面右侧：撒切尔与母亲为中景、左前方 3/4 朝向。</td></tr><tr><th scope="row">（b）</th><td lang="en"><code>MCU Eve 34left MS Thornhill 34right Vandam 34left Leonard 34backleft</code></td><td>从左到右：Eve 为中近景、左前方 3/4 朝向；Thornhill 为中景、右前方 3/4 朝向；Vandam 呈左前方 3/4 朝向；Leonard 呈左后方 3/4 朝向。</td></tr></tbody></table></div>

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

镜头（shot）是连续时间段内的一串画面。为了让叙事衔接顺畅、连贯，各个镜头必须以一种能让观众在头脑中重建故事的方式连接 <a aria-label="参考文献 Cut16" class="psl-cite" href="#ref-Cutting2016NarrativeTA">\[Cut16\]</a>。转场（Transition）描述一个镜头如何推进到下一个镜头，或一个镜头如何开始、结束。我们的模型包含三种最常用的转场技术：切（cut）、叠化（dissolve）和淡入淡出（fade）。我们采用最简单的切换形式，即两个镜头依次播放。同一套记法也用于描述其他类型的切换，例如插入镜头（cutaway）：镜头 A 之后接一个构图不同的短暂镜头，然后再返回镜头 A。叠化与淡入淡出用于描述镜头的进入或退出，其中构图分别逐渐出现或逐渐消失。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>A <em>shot</em> is a sequence of frames over a continuous time period. For a cohesive and coherent narration the individual shots have to be joined in a manner so as to allow the spectator to mentally recreate the story <a aria-label="参考文献 Cut16" class="psl-cite" href="#ref-Cutting2016NarrativeTA">[Cut16]</a>. Transition describes the progression of a shot to the subsequent one or the starting and ending of a shot. In our model we include three of the most widely used transition techniques: <em>cut</em>, <em>dissolve</em> and <em>fade</em>. We use the simplest form of cut transition in which the two shots are played one after another. We also use the same notation to describe other types of cuts, such as cutaways in which shot A is followed by a intermittent shot with a different composition and then returns back to shot A. Dissolves and fades are used to describe the entry or exit of a shot in which the composition either slowly appears or disappears respectively.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b033" id="b033">

进入一个镜头时，初始构图可以有两种类型：一种是演员未执行动作的“静态”构图，另一种是直接切入正在发生的动作。前一种情况下，我们描述镜头第一帧的构图；后一种情况下，我们结合正在执行的动作描述构图，如图 <a class="psl-xref" href="#fig-1">1</a>。这由非终结符 `whileEvent` 描述：在演员执行某项 `Action` 的同时（while），描述镜头的第一个构图。切入动作时，构图也可以伴随摄影机运动。在图 <a class="psl-xref" href="#fig-11">11</a> 中，我们直接切入演员动作，同时摄影机也在运动。摄影机跟随演员移动，因此整个动作镜头始终维持单一构图，没有后续发展过程。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>As we enter the shot the initial composition can be of two types. It can either be a 'static' composition in which the actors are not performing any action or we can transition into action. In the former case, we describe the composition in the first frame of the shot. In the latter, we describe the composition in relation to the action that is being performed (figure <a class="psl-xref" href="#fig-1">1</a>). This is described under the non-terminal <em>whileEvent</em> which describes the first composition of the shot <em>while</em> the actors are performing an <em>Action</em>. As we transition into action, the composition can also be accompanied by a camera movement. In Fig. <a class="psl-xref" href="#fig-11">11</a> we transition directly into an actor action with camera movement. Here the camera tracks with the actor thereby resulting in maintaining a single composition in the entire action shot with no developments.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b034" id="b034">

这门语言的关键特点是：所有镜头都是自包含的实体。从转场到最终构图，包括摄影机动作和剧本动作，每个散文分镜句子都独立于前一个或后一个镜头。书写和阅读一个镜头描述时，始终不需要了解电影中前后镜头的内容。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>The key feature of the language is that all shots are self contained entities. Starting from a transition to the final composition, including camera and script actions, each prose storyboard sentence is independent of the previous or the next shot. A shot description can always be written and read without requiring knowledge from the previous or next shot in a movie.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b035" id="b035">

根据 Thomson 和 Bowen 提出的镜头分类 <a aria-label="参考文献 TB09b" class="psl-cite" href="#ref-Thompson09a">\[TB09b\]</a>，散文分镜语言可以精确描述三种主要镜头类别：

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Based on the taxonomy of shots proposed by Thomson and Bowen <a aria-label="参考文献 TB09b" class="psl-cite" href="#ref-Thompson09a">[TB09b]</a>, the prose storyboard language allows to describe precisely three main categories of shots :</p>

</div>

</details>

</div>

<ul class="psl-paper-list"><li class="psl-translation-unit" data-source-block="b037" id="b037"><p class="psl-zh">简单镜头（simple shot）：摄影机既不移动，也不转动。构图中的任何变化都来自演员相对于摄影机的运动。</p><details class="psl-english"><summary>英文原文</summary><div lang="en"><p>A simple shot is taken with a camera that does not move or turn. Any change in the composition is from the movements of the actors in relation to the camera.</p></div></details></li><li class="psl-translation-unit" data-source-block="b038" id="b038"><p class="psl-zh">复杂镜头（complex shot）：摄影机围绕固定点运动，例如水平摇摄（pan）、俯仰摇摄（tilt）和变焦（zoom）。我们引入摄影机动作 <code>pan</code> 和 <code>zoom</code> 来描述这些运动。因此，摄影机可以向左、向右摇摄，也可以向上、向下摇摄（即俯仰摇摄），以及变焦推近或拉远。</p><details class="psl-english"><summary>英文原文</summary><div lang="en"><p>A complex shot is taken with a camera that has movements around a fixed point such as pan, tilt and zoom. We introduce camera actions pan and zoom to describe such movements. Thus the camera can pan left and right, up and down (as in a tilt) and zoom in and out.</p></div></details></li><li class="psl-translation-unit" data-source-block="b039" id="b039"><p class="psl-zh">发展镜头（developing shot）：使用移动中的摄影机拍摄。我们引入 <code>dolly</code>（移动摄影）和 <code>crane</code>（升降摄影）两种摄影机动作来描述这类镜头。在移动或升降摄影过程中，也允许摇摄和变焦，由此形成有趣的视觉效果。</p><details class="psl-english"><summary>英文原文</summary><div lang="en"><p>A developing shot is taken with a moving camera. We introduce two camera actions (dolly and crane) to describe these shots. Pan and zoom are allowed during dolly and crane movements thereby creating interesting visual effects.</p></div></details></li></ul>

<div class="psl-translation-unit" data-source-block="b041" id="b041">

有些镜头从头到尾只包含一种构图。但在许多情况下，初始构图之后还会出现若干发展过程（developments）。发展过程分为两类：延续（continuation）与重新构图（recomposition）。延续是对演员或摄影机动作的 PSL 描述，这些动作不会使构图相对于前一种构图发生变化。延续可以源于说话、注视等动作：它们对剧本很重要，需要被提及，但并不引起构图改变。这些情况由非终结符 `event` 描述。延续也可以源于跟随事件（follow event）：主体在提示（cue）中开始执行动作，摄影机随主体运动、跟踪其移动，以维持构图。这类摄影机动作归入非终结符 `camera with`。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Some shots consist of a single composition from beginning to end. In many cases, however, the initial composition is followed by a number of <em>developments</em>. They are of two types, <em>continuation</em> or <em>recomposition</em>. A <em>continuation</em> is the PSL description of actions, either actor or camera, that do not lead to a change in composition from the previous one. It can be from an <em>action</em> such as speaking or looking that is important to the screenplay to mention but that does not cause a change in composition. These are described under the <em>event</em> non-terminal. Or the <em>continuation</em> can be due to a <em>follow event</em> in which the subjects start to perform an action in the <em>cue</em> and the camera moves with the subjects and tracks their movements so as to maintain the composition. This camera action is categorized under the <em>camera with</em> non-terminal.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b042" id="b042">

第二类发展过程是重新构图（recomposition），顾名思义，它会引起构图变化。这种变化可以由主体的动作、摄影机的动作或两者共同造成，但两种运动不会像 `camera with` 中那样同步。这类摄影机动作归入非终结符 `camera to`。如果构图变化仅由演员移动造成，例如简单镜头中的情况（图 <a class="psl-xref" href="#fig-9">9</a>），摄影机会“保持”（holds）机位，直到形成下一个构图。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>The second type of <em>development</em> is the <em>recomposition</em> where there is, as the name suggests, a change in composition. This change can either be due to an action performed by the <em>subject</em> or by the camera or both but these two movements are not synchronized as in <em>camera with</em>. These camera actions are categorized under the <em>camera to</em> non-terminal. In the case of a change in composition only because of actor movements such as in simple shots (figure <a class="psl-xref" href="#fig-9">9</a>), the camera "holds" to the next composition.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b043" id="b043">

在初始构图之后，两类发展过程都可以出现任意多次。据我们所知，散文分镜语言是第一个能够正确描述任意长度、任意复杂度的发展镜头的描述框架。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>After the initial composition, there can be any number of developments of either type. To the best of our knowledge, the prose storyboard language is the first description framework that correctly describes developing shots of arbitrary length and complexity.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b044" id="b044">

对于上述三种镜头类别，我们都提出了一个简化模型：镜头由一系列构图、提示和画面事件构成。提示（cue）是触发摄影机运动的演员动作。在传统电影制作中，摄影机运动经常由故事驱动，因此提示是一种重要结构。提示是可选的，这使我们也可以描述发生在动作之前、没有动作动机的摄影机运动，或者与演员运动无关的描述性摄影机运动。画面事件既可以是摄影机相对于演员的动作，也可以是演员相对于摄影机的动作。画面事件分为两大类：改变构图的事件（events-to-composition），以及维持构图的事件（events-with-composition）。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>For each of the three cases we propose a simplified model of a shot which consists of a sequence of compositions, cues and screen events. Cues are actor movement which trigger camera movements. They are an important construct in classical movie-making where camera movements are frequently motivated by the story. Cues are optional, which makes it possible to also describe unmotivated camera movements preceding the action, or descriptive camera movements not related to actor movements. Screen events can be actions of the camera relative to the actors, or actions of the actors relative to the camera. Screen events come in two main categories - those which change the composition (<em>events-to-composition</em>) and those which maintain the composition (<em>events-with-composition</em>).</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b045" id="b045">

在我们的模型中，任一时刻只能处于以下四种状态之一：

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>In our model, we can be in only one of four different states:</p>

</div>

</details>

</div>

<ol class="psl-paper-list"><li class="psl-translation-unit" data-source-block="b047" id="b047"><p class="psl-zh">摄影机不动，构图不变。</p><details class="psl-english"><summary>英文原文</summary><div lang="en"><p>Camera does not move and composition does not change.</p></div></details></li><li class="psl-translation-unit" data-source-block="b048" id="b048"><p class="psl-zh">摄影机不动，构图因演员运动而改变。</p><details class="psl-english"><summary>英文原文</summary><div lang="en"><p>Camera does not move and composition changes due to actor movements.</p></div></details></li><li class="psl-translation-unit" data-source-block="b049" id="b049"><p class="psl-zh">摄影机运动，构图不变。</p><details class="psl-english"><summary>英文原文</summary><div lang="en"><p>Camera moves and composition does not change</p></div></details></li><li class="psl-translation-unit" data-source-block="b050" id="b050"><p class="psl-zh">摄影机运动，构图改变。</p><details class="psl-english"><summary>英文原文</summary><div lang="en"><p>Camera moves and composition changes.</p></div></details></li></ol>

<div class="psl-translation-unit" data-source-block="b052" id="b052">

在情况（1）中，用单一构图就可以描述整个镜头。在情况（2）中，我们引入专用动词 `hold`，表示摄影机保持静止，而演员移动，从而形成新的构图。在情况（3）中，我们使用通用结构 `CameraWith`（pan with、dolly with、crane with），说明摄影机如何运动以维持构图。在情况（4）中，我们使用通用结构 `CameraTo`，说明摄影机如何运动以改变构图。

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

为了验证所提出的语言，我们手工标注了已有电影中的较长场景，覆盖许多不同风格和时期。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>As a validation of the proposed language, we have manually annotated extended scenes from existing movies covering many different styles and periods.</p>

</div>

</details>

</div>

<figure class="psl-paper-figure" id="table-1">

<figcaption><span class="psl-fig-number">表 1</span><h3>标注结果</h3></figcaption>

<p class="psl-figure-caption">对于每部电影，给出已标注镜头、构图及发展过程的总数，以及主要摄影机运动类别的计数。</p>

<div aria-label="标注结果统计表" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-stats-table"><thead><tr><th rowspan="3" scope="col">电影</th><th rowspan="3" scope="col">镜头</th><th rowspan="3" scope="col">构图</th><th colspan="8" scope="colgroup">发展过程 Development</th></tr><tr><th colspan="3" scope="colgroup">延续 Continuation</th><th colspan="5" scope="colgroup">重新构图 Recomposition</th></tr><tr><th scope="col">摇摄<br/>Pan</th><th scope="col">移动<br/>Dolly</th><th scope="col">升降<br/>Crane</th><th scope="col">保持<br/>Hold</th><th scope="col">变焦<br/>Zoom</th><th scope="col">摇摄<br/>Pan</th><th scope="col">移动<br/>Dolly</th><th scope="col">升降<br/>Crane</th></tr></thead><tbody><tr><th scope="row">《回到未来》</th><td>41</td><td>69</td><td>—</td><td>—</td><td>—</td><td>12</td><td>1</td><td>6</td><td>10</td><td>—</td></tr><tr><th scope="row">《西北偏北》</th><td>133</td><td>209</td><td>2</td><td>7</td><td>—</td><td>49</td><td>1</td><td>8</td><td>16</td><td>—</td></tr><tr><th scope="row">《历劫佳人》</th><td>1</td><td>40</td><td>—</td><td>2</td><td>1</td><td>6</td><td>—</td><td>1</td><td>18</td><td>13</td></tr><tr><th scope="row">《夺魂索》</th><td>2</td><td>12</td><td>—</td><td>1</td><td>—</td><td>—</td><td>—</td><td>3</td><td>7</td><td>—</td></tr><tr class="psl-total"><th scope="row">合计</th><td>177</td><td>330</td><td>2</td><td>10</td><td>1</td><td>67</td><td>2</td><td>18</td><td>51</td><td>13</td></tr></tbody></table></div>

<p class="psl-translator-note">破折号与全部计数按原表保留。</p>

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

标注首先从多次观看场景开始。随后，把场景划分为构成它的各个镜头，并用散文分镜语言描述这些镜头。每个句子通过时间码，与镜头中相应的关键帧匹配。例如，镜头的第一帧对应 PSL 中的初始构图，我们会记录该关键帧的时间码。随着镜头推进，我们继续记录后续构图及其时间码。这份带有关键帧时间码的 PSL 句子列表，会在文字处理软件中写成字幕，并保存为 SubRip（`.srt`）文件，以便与被标注的场景一起播放。为了使 PSL 句子更易阅读，通常将其拆分成片段：先描述起始（from）构图，以及该构图持续时段的时间码；下一个 PSL 片段包含由摄影机、演员或两者共同执行、并改变这一初始构图的动作；此后，再描述上述动作导致的目标（to）构图。所有片段都附有时间码。这一标注过程的输出，就是保存在 `.srt` 文件中的、带时间码的场景 PSL 描述。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>We start the annotation process by viewing the scenes multiple times. The scene is then divided into its consisting shots which we describe in Prose Storyboard Language. Each of these sentences is matched to their corresponding keyframe in the shot via timecodes. For example, the first frame of the shot matches the initial composition in PSL. The time code for this keyframe is noted. As the shot progresses, we make a note of the subsequent compositions and their time codes. This list of PSL sentences with time codes for keyframes is written as subtitles in a word processor and saved as SubRip(.srt) files that can be played with the annotated scene. To make the PSL sentences easier to read they are generally broken down into fragments that start with a 'from' composition and the time codes for the duration this composition lasts. Then the next PSL fragment contains the action that either the camera or actor or both perform that changes this initial composition. After this, we describe the 'to' composition that the previously mentioned action leads to. All these fragments are accompanied by their time codes. The output of this process of annotation is a time-coded PSL description of the scene in a .srt file.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b057" id="b057">

随后，使用图 <a class="psl-xref" href="#fig-14">14</a> 的 AND/OR 树所描述的 PSL 语法，对这些句子进行解析。解析工作使用 Python 和 Parsimonious 工具包完成。解析器基于解析表达式文法（Parsing Expression Grammars，PEG），其中词法分析和语法分析同时进行。PEG 的关键特点，是使用具有优先顺序的选择运算符 `/`，而非无序运算符 `|`。这意味着各备选项的书写顺序很重要。例如，在规则 `A = a / b / c` 中，解析器首先检查输入是否匹配 `a`，只有失败后才会尝试下一个选项。这种优先顺序消除了歧义，确保给定输入只有一棵输出解析树。PSL 解析器的参考实现与本文提到的全部 PSL 句子一起，可在<a href="https://gitlab.inria.fr/vmurukut/psl">PSL 参考实现仓库</a>免费获取。

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

我们标注了从四部电影中选取的场景：罗伯特·泽米吉斯的《回到未来》（Back to the Future）、阿尔弗雷德·希区柯克的《夺魂索》（Rope）与《西北偏北》（North by Northwest），以及奥逊·威尔斯的《历劫佳人》（Touch of Evil）。对于每个案例，我们都提供原始剧本、为所有构图和发展过程加上完整 PSL 描述字幕的电影片段，以及每种构图或每个发展过程对应一个关键帧的分镜。标注结果汇总于表 <a class="psl-xref" href="#table-1">1</a>，也可在在线<a href="https://team.inria.fr/anima/prose-storyboard-language/">论文配套材料</a>中找到。这些结果共包含 177 个镜头和 330 种构图，对语言的表达能力和通用性构成了非正式验证，同时展示了使用这门语言精确标注电影镜头的良好实践。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>We annotated scenes extracted from four movies : Back To The Future by Robert Zemekis, Rope and North By Northwest by Alfred Hitchcock, and Touch Of Evil by Orson Welles. In each case, we give the original screenplay, the movie subtitled with a complete PSL description of all compositions and developments, and a storyboard with one keyframe per composition or development. Annotation results are summarized in Table <a class="psl-xref" href="#table-1">1</a> and can be found in the accompanying material available online at <a href="https://team.inria.fr/anima/prose-storyboard-language/">https://team.inria.fr/anima/prose-storyboard-language/</a>. With 177 shots and 330 compositions, they constitute an informal validation of the expressivity and generality of the language, as well as an illustration of good practices for precisely annotating movie shots using the language.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b060" id="b060">

《回到未来》（1985）中的咖啡馆段落是一个室内场景，包含 8 位主要人物的动作和对白。该片的场景元素列于图 <a class="psl-xref" href="#fig-16">16</a>，并追加到 PSL 语法中用于标注。我们公开该场景全部 41 个镜头的散文分镜，以供日后参考。希区柯克的单镜头电影《夺魂索》（1948）同样呈现 8 位人物之间的动作和对白，但这里使用的是精细的场面调度与摄影机运动，而不是切换镜头。该片的场景元素列于图 <a class="psl-xref" href="#fig-17">17</a>。这是一个具有挑战性的标注案例，我们展示了两个较长段落的完整 PSL 标注示例，结果见图 <a class="psl-xref" href="#fig-20">20</a> 和图 <a class="psl-xref" href="#fig-21">21</a>。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>The cafe scene in Back To The future (1985) is an interior scene with a combination of action and dialogues involving 8 main characters. Scene elements for this movie are enumerated in Fig. <a class="psl-xref" href="#fig-16">16</a> and appended to the PSL grammar for annotation. We are making the prose storyboard for all 41 shots in the scene available for future reference. Rope (1948), a single shot movie by Alfred Hitchcock, also shows action and dialogue between 8 characters, this time using elaborate blocking and camera movements rather than employing cuts. Scene elements for this movie are enumerated in Fig. <a class="psl-xref" href="#fig-17">17</a>. This is challenging example for annotation, and we show examples from two extended sequences fully annotated with PSL. Results are shown in Fig. <a class="psl-xref" href="#fig-20">20</a> and <a class="psl-xref" href="#fig-21">21</a>.</p>

</div>

</details>

</div>

<div class="psl-translation-unit" data-source-block="b061" id="b061">

我们还标注了《西北偏北》（1959）中喷药飞机追逐的段落，以突出该语言在描述包含大量非人类元素的复杂室外场景时的适用性。在这个场景中，飞行员的意图通过飞机的运动被拟人化地表现出来。我们为这个技艺精湛的场景中的全部 133 个镜头标注了散文分镜，以展示这一大部分时间没有对白的段落所使用的多样镜头。该片的场景元素列于图 <a class="psl-xref" href="#fig-18">18</a>。最后，我们标注了奥逊·威尔斯《历劫佳人》（1958）的开场长镜头：多种摄影机运动与精心安排的人物调度交织在一起，形成丰富而动态的视觉构图。该片的场景元素列于图 <a class="psl-xref" href="#fig-19">19</a>。尽管这些场景相当复杂，这些案例仍表明散文分镜相当易读，也容易生成。

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

我们提出了一种能够描述电影空间与时间结构的语言，它适用于包含任意复杂镜头的电影。该语言可以从许多方面扩展，例如纳入镜头选择、景深、照明，以及包括对白在内的叙事内声音。未来工作将致力于一对相互对应的问题：在机器电影（machinima）环境中根据散文分镜自动生成电影，以及自动描述已有电影中的镜头。我们也计划把这一框架扩展到立体电影；为此，需要扩展画面构图的表示，纳入构图中主体的深度和视差。进一步将这门语言扩展到全景视频和沉浸式虚拟现实电影，也会很有意义。在现阶段，我们认为所提出的语言能够帮助已有智能摄影与剪辑方法采用更富表现力的策略和惯用手法，并弥合真实电影制作与虚拟电影制作之间的鸿沟。

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>We have presented a language for describing the spatial and temporal structure of movies with arbitrarily complex shots. The language can be extended in many ways, e.g. by taking into account lens choices, depth-of-field and lighting, and diegetic sound including speech. Future work will be devoted to the dual problems of automatically generating movies from prose storyboards in machinima environments, and automatically describing shots in existing movies. We are also planning to extend our framework for the case of stereoscopic movies, where image composition needs to be extended to include the depth and disparity of subjects in the composition. It would also be interesting to extend the language even further for the case of panoramic video and immersive virtual reality movies. At this stage, we believe that the proposed language can be useful to extend existing approaches in intelligent cinematography and editing towards more expressive strategies and idioms, and to bridge the gap between real and virtual movie-making.</p>

</div>

</details>

</div>

<span id="references" class="psl-anchor" aria-hidden="true"></span>

## 参考文献<small>References · 44 条</small>

<p class="psl-section-intro">保留原文的作者、标题、出版信息与页码；中文标题为阅读辅助译名。引用编号沿用论文。</p>

<ol class="psl-references"><li data-reference="Akerberg2003" id="ref-Akerberg2003"><span class="psl-reference-label">[ASSN03]</span><div><p class="psl-reference-zh">CarSim：应用于道路事故报告的自动三维文本到场景转换系统</p><p class="psl-reference-original" lang="en">Akerberg O., Svensson H., Schulz B., Nugues P.: Carsim: An automatic 3d text-to-scene conversion system applied to road accident reports. In Proceedings of the Tenth Conference on European Chapter of the Association for Computational Linguistics - Volume 2 (2003), EACL '03, pp. 191–194.</p></div></li><li data-reference="BalasBAG08" id="ref-BalasBAG08"><span class="psl-reference-label">[BBAG08]</span><div><p class="psl-reference-zh">用于包含虚拟人物的故事情节的层次化 Petri 网</p><p class="psl-reference-original" lang="en">Balas D., Brom C., Abonyi A., Gemrot J.: Hierarchical petri nets for story plots featuring virtual humans. In AIIDE (2008).</p></div></li><li data-reference="Bordwell98" id="ref-Bordwell98"><span class="psl-reference-label">[Bor98]</span><div><p class="psl-reference-zh">论电影风格的历史</p><p class="psl-reference-original" lang="en">Bordwell D.: On the History of Film Style. Harvard University Press, 1998.</p></div></li><li data-reference="Brand97" id="ref-Brand97"><span class="psl-reference-label">[Bra97]</span><div><p class="psl-reference-zh">“逆好莱坞问题”：通过因果分析从视频生成剧本与分镜</p><p class="psl-reference-original" lang="en">Brand M.: The "inverse hollywood problem": From video to scripts and storyboards via causal analysis. In AAAI/IAAI (1997), pp. 132–137.</p></div></li><li data-reference="Braga2016" id="ref-Braga2016"><span class="psl-reference-label">[BS16]</span><div><p class="psl-reference-zh">SLAP：用于动画编程的分镜语言</p><p class="psl-reference-original" lang="en">Braga P. H. C., Silveira I. F.: Slap: Storyboard language for animation programming. IEEE Latin America Transactions 14, 12 (Dec 2016), 4821–4826.</p></div></li><li data-reference="Blackwell01" id="ref-Blackwell01"><span class="psl-reference-label">[BvKR01]</span><div><p class="psl-reference-zh">Petri 网脚本：描述动作、行为与情节的视觉语言</p><p class="psl-reference-original" lang="en">Blackwell L., von Konsky B., Robey M.: Petri net script: a visual language for describing action, behaviour and plot. In Australasian conference on Computer science (2001), ACSC '01.</p></div></li><li data-reference="Christianson96" id="ref-Christianson96"><span class="psl-reference-label">[CAwH*96]</span><div><p class="psl-reference-zh">用于自动摄影的声明式摄影机控制</p><p class="psl-reference-original" lang="en">Christianson D. B., Anderson S. E., wei He L., Salesin D. H., Weld D. S., Cohen M. F.: Declarative camera control for automatic cinematography. In AAAI (1996).</p></div></li><li data-reference="Chao12" id="ref-Chao12"><span class="psl-reference-label">[Cha12]</span><div><p class="psl-reference-zh">面向人机协作的多模态轮次交替时序安排</p><p class="psl-reference-original" lang="en">Chao C.: Timing multimodal turn-taking for human-robot cooperation. In Proceedings of the 14th ACM international conference on Multimodal interaction (New York, NY, USA, 2012), ICMI '12, ACM, pp. 309–312.</p></div></li><li data-reference="CO06" id="ref-CO06"><span class="psl-reference-label">[CO06]</span><div><p class="psl-reference-zh">计算机图形学中的摄影机控制</p><p class="psl-reference-original" lang="en">Christie M., Olivier P.: Camera control for computer graphics. In Eurographics State of the Art Reports (2006), Eurographics 2006, Blackwell.</p></div></li><li data-reference="Cutting2016NarrativeTA" id="ref-Cutting2016NarrativeTA"><span class="psl-reference-label">[Cut16]</span><div><p class="psl-reference-zh">叙事理论与大众电影的动态规律</p><p class="psl-reference-original" lang="en">Cutting J. E.: Narrative theory and the dynamics of popular movies. In Psychonomic Bulletin &amp; Review (2016).</p></div></li><li data-reference="DMR05" id="ref-DMR05"><span class="psl-reference-label">[DMR05]</span><div><p class="psl-reference-zh">自动反向分镜技术</p><p class="psl-reference-original" lang="en">Dony R., Mateer J., Robinson J.: Techniques for automated reverse storyboarding. IEE Journal of Vision, Image and Signal Processing 152, 4 (2005), 425–436.</p></div></li><li data-reference="Friedman06" id="ref-Friedman06"><span class="psl-reference-label">[FF06]</span><div><p class="psl-reference-zh">关于摄影机行为的自动电影化推理</p><p class="psl-reference-original" lang="en">Friedman D., Feldman Y. A.: Automated cinematic reasoning about camera behavior. Expert Syst. Appl. 30, 4 (May 2006), 694–704.</p></div></li><li data-reference="Galvane2015" id="ref-Galvane2015"><span class="psl-reference-label">[GCLR15]</span><div><p class="psl-reference-zh">Camera-on-rails：受约束摄影机路径的自动计算</p><p class="psl-reference-original" lang="en">Galvane Q., Christie M., Lino C., Ronfard R.: Camera-on-rails: Automated Computation of Constrained Camera Paths. In ACM SIGGRAPH Conference on Motion in Games (Paris, France, Nov. 2015), ACM, pp. 151–157.</p></div></li><li data-reference="Galvane2013" id="ref-Galvane2013"><span class="psl-reference-label">[GCR*13]</span><div><p class="psl-reference-zh">自主摄影机的转向行为</p><p class="psl-reference-original" lang="en">Galvane Q., Christie M., Ronfard R., Lim C.-K., Cani M.-P.: Steering Behaviors for Autonomous Cameras. In MIG 2013 - ACM SIGGRAPH conference on Motion in Games (Dublin, Ireland, Nov. 2013), MIG '13 Proceedings of Motion on Games, ACM, pp. 93–102.</p></div></li><li data-reference="GoldmanCSS06" id="ref-GoldmanCSS06"><span class="psl-reference-label">[GCSS06]</span><div><p class="psl-reference-zh">用于视频可视化与剪辑的示意分镜</p><p class="psl-reference-original" lang="en">Goldman D. B., Curless B., Salesin D., Seitz S. M.: Schematic storyboarding for video visualization and editing. ACM Trans. Graph. 25, 3 (2006), 862–871.</p></div></li><li data-reference="Galvane2018" id="ref-Galvane2018"><span class="psl-reference-label">[GLC*18]</span><div><p class="psl-reference-zh">指挥电影摄影无人机</p><p class="psl-reference-original" lang="en">Galvane Q., Lino C., Christie M., Fleureau J., Servant F., Tariolle F.-l., Guillotel P.: Directing cinematographic drones. ACM Trans. Graph. 37, 3 (July 2018), 34:1–34:18.</p></div></li><li data-reference="GR13" id="ref-GR13"><span class="psl-reference-label">[GR13]</span><div><p class="psl-reference-zh">使用生成式外观模型检测并识别电影中的演员</p><p class="psl-reference-original" lang="en">Gandhi V., Ronfard R.: Detecting and naming actors in movies using generative appearance models. In CVPR (2013).</p></div></li><li data-reference="GR15" id="ref-GR15"><span class="psl-reference-label">[GR15]</span><div><p class="psl-reference-zh">纵向视频剪辑的计算框架</p><p class="psl-reference-original" lang="en">Gandhi V., Ronfard R.: A Computational Framework for Vertical Video Editing. In 4th Workshop on Intelligent Camera Control, Cinematography and Editing (Zurich, Switzerland, May 2015), Eurographics, Eurographics Association, pp. 31–37.</p></div></li><li data-reference="Galvane2014" id="ref-Galvane2014"><span class="psl-reference-label">[GRCS14]</span><div><p class="psl-reference-zh">面向计算机游戏电影化回放的叙事驱动摄影机控制</p><p class="psl-reference-original" lang="en">Galvane Q., Ronfard R., Christie M., Szilas N.: Narrative-Driven Camera Control for Cinematic Replay of Computer Games. In MIG'14 - 7th International Conference on Motion in Games (Los Angeles, United States, Nov. 2014), ACM, pp. 109–117.</p></div></li><li data-reference="GR14" id="ref-GR14"><span class="psl-reference-label">[GRG14]</span><div><p class="psl-reference-zh">从单一视点进行多片段视频剪辑</p><p class="psl-reference-original" lang="en">Gandhi V., Ronfard R., Gleicher M.: Multi-Clip Video Editing from a Single Viewpoint. In CVMP 2014 - European Conference on Visual Media Production (London, United Kingdom, Nov. 2014), ACM, p. Article No. 9.</p></div></li><li data-reference="He96" id="ref-He96"><span class="psl-reference-label">[HCS96]</span><div><p class="psl-reference-zh">虚拟摄影师：自动实时摄影机控制与导演的范式</p><p class="psl-reference-original" lang="en">He L.-w., Cohen M. F., Salesin D. H.: The virtual cinematographer: a paradigm for automatic real-time camera control and directing. In Proceedings of the 23rd annual conference on Computer graphics and interactive techniques (New York, NY, USA, 1996), SIGGRAPH '96, ACM, pp. 217–224.</p></div></li><li data-reference="Jhala05" id="ref-Jhala05"><span class="psl-reference-label">[JY05]</span><div><p class="psl-reference-zh">面向虚拟环境叙事的电影摄影机控制的话语规划方法</p><p class="psl-reference-original" lang="en">Jhala A., Young R. M.: A discourse planning approach to cinematic camera control for narratives in virtual environments. In AAAI (2005).</p></div></li><li data-reference="Jhala06" id="ref-Jhala06"><span class="psl-reference-label">[JY06]</span><div><p class="psl-reference-zh">基于规划的自动摄影机控制方法的表示要求</p><p class="psl-reference-original" lang="en">Jhala A., Young R. M.: Representational requirements for a plan based approach to automated camera control. In AIIDE'06 (2006), pp. 36–41.</p></div></li><li data-reference="Louarn18" id="ref-Louarn18"><span class="psl-reference-label">[LCL18]</span><div><p class="psl-reference-zh">用于虚拟摄影的自动场面调度</p><p class="psl-reference-original" lang="en">Louarn A., Christie M., Lamarche F.: Automated staging for virtual cinematography. In Proceedings of the 11th Annual International Conference on Motion, Interaction, and Games, MIG 2018, Limassol, Cyprus, November 08-10, 2018 (2018), pp. 4:1–4:10.</p></div></li><li data-reference="Leake2017" id="ref-Leake2017"><span class="psl-reference-label">[LDTA17]</span><div><p class="psl-reference-zh">对白驱动场景的计算式视频剪辑</p><p class="psl-reference-original" lang="en">Leake M., Davis A., Truong A., Agrawala M.: Computational video editing for dialogue-driven scenes. ACM Trans. Graph. 36, 4 (July 2017), 130:1–130:14.</p></div></li><li data-reference="Little1990SynchronizationAS" id="ref-Little1990SynchronizationAS"><span class="psl-reference-label">[LG90]</span><div><p class="psl-reference-zh">多媒体对象的同步与存储模型</p><p class="psl-reference-original" lang="en">Little T. D. C., Ghafoor A.: Synchronization and storage models for multimedia objects. IEEE Journal on Selected Areas in Communications 8 (1990), 413–427.</p></div></li><li data-reference="MarkowitzKSB11" id="ref-MarkowitzKSB11"><span class="psl-reference-label">[MJSB11]</span><div><p class="psl-reference-zh">使用行为树的智能摄影机控制</p><p class="psl-reference-original" lang="en">Markowitz D., Jr. J. T. K., Shoulson A., Badler N. I.: Intelligent camera control using behavior trees. In MIG (2011), pp. 156–167.</p></div></li><li data-reference="Magalhaes98" id="ref-Magalhaes98"><span class="psl-reference-label">[MRR98]</span><div><p class="psl-reference-zh">使用 Petri 网进行动画建模</p><p class="psl-reference-original" lang="en">Magalhaes L. P., Raposo A. B., Ricarte I. L.: Animation modeling with petri nets. Computers and Graphics 22, 6 (1998), 735 – 743.</p></div></li><li data-reference="Murch86" id="ref-Murch86"><span class="psl-reference-label">[Mur86]</span><div><p class="psl-reference-zh">眨眼之间</p><p class="psl-reference-original" lang="en">Murch W.: In the blink of an eye. Silman-James Press, 1986.</p></div></li><li data-reference="Marti2018" id="ref-Marti2018"><span class="psl-reference-label">[MVW*18]</span><div><p class="psl-reference-zh">Cardinal：计算机辅助电影剧本创作</p><p class="psl-reference-original" lang="en">Marti M., Vieli J., Witoń W., Sanghrajka R., Inversini D., Wotruba D., Simo I., Schriber S., Kapadia M., Gross M.: Cardinal: Computer assisted authoring of movie scripts. In 23rd International Conference on Intelligent User Interfaces (2018), IUI '18, pp. 509–519.</p></div></li><li data-reference="Ondaatje04" id="ref-Ondaatje04"><span class="psl-reference-label">[Ond04]</span><div><p class="psl-reference-zh">对话：沃尔特·默奇与电影剪辑艺术</p><p class="psl-reference-original" lang="en">Ondaatje M.: The Conversations: Walter Murch and the Art of Film Editing. Random House, 2004.</p></div></li><li data-reference="ONeillRN09" id="ref-ONeillRN09"><span class="psl-reference-label">[ORN09]</span><div><p class="psl-reference-zh">迈向机器电影创作的智能创作工具</p><p class="psl-reference-original" lang="en">O'Neill B., Riedl M. O., Nitsche M.: Towards intelligent authoring tools for machinima creation. In CHI Extended Abstracts (2009), pp. 4639–4644.</p></div></li><li data-reference="Proferes08" id="ref-Proferes08"><span class="psl-reference-label">[Pro08]</span><div><p class="psl-reference-zh">电影导演基础：在拍摄前看见你的电影</p><p class="psl-reference-original" lang="en">Proferes N.: Film Directing Fundamentals - See your film before shooting it. Focal Press, 2008.</p></div></li><li data-reference="RijsselbergenKVMW09" id="ref-RijsselbergenKVMW09"><span class="psl-reference-label">[RKV*09]</span><div><p class="psl-reference-zh">电影剧本标记语言</p><p class="psl-reference-original" lang="en">Rijsselbergen D. V., Keer B. V. D., Verwaest M., Mannens E., de Walle R. V.: Movie script markup language. In ACM Symposium on Document Engineering (2009), pp. 161–170.</p></div></li><li data-reference="Salt06" id="ref-Salt06"><span class="psl-reference-label">[Sal06]</span><div><p class="psl-reference-zh">走进影像</p><p class="psl-reference-original" lang="en">Salt B.: Moving Into Pictures. Starword, 2006.</p></div></li><li data-reference="Salt09" id="ref-Salt09"><span class="psl-reference-label">[Sal09]</span><div><p class="psl-reference-zh">电影风格与技术：历史及分析（第 3 版）</p><p class="psl-reference-original" lang="en">Salt B.: Film Style and Technology: History and Analysis (3 ed.). Starword, 2009.</p></div></li><li data-reference="Shen03" id="ref-Shen03"><span class="psl-reference-label">[SMAY03]</span><div><p class="psl-reference-zh">智能数字电影制作系统 DMP</p><p class="psl-reference-original" lang="en">Shen J., Miyazaki S., Aoki T., Yasuda H.: Intelligent digital filmmaker dmp. In ICCIMA (2003).</p></div></li><li data-reference="Seversky2006" id="ref-Seversky2006"><span class="psl-reference-label">[SY06]</span><div><p class="psl-reference-zh">根据自然语言语音与文字描述实时自动生成三维场景</p><p class="psl-reference-original" lang="en">Seversky L. M., Yin L.: Real-time automatic 3d scene generation from natural language voice and text descriptions. In Proceedings of the 14th ACM International Conference on Multimedia (2006), MM '06, pp. 61–64.</p></div></li><li data-reference="Thompson09b" id="ref-Thompson09b"><span class="psl-reference-label">[TB09a]</span><div><p class="psl-reference-zh">剪辑的语法</p><p class="psl-reference-original" lang="en">Thompson R., Bowen C.: Grammar of the Edit. Focal Press, 2009.</p></div></li><li data-reference="Thompson09a" id="ref-Thompson09a"><span class="psl-reference-label">[TB09b]</span><div><p class="psl-reference-zh">镜头的语法</p><p class="psl-reference-original" lang="en">Thompson R., Bowen C.: Grammar of the Shot. Focal Press, 2009.</p></div></li><li data-reference="Vogt2013" id="ref-Vogt2013"><span class="psl-reference-label">[VHL*13]</span><div><p class="psl-reference-zh">TIMISTO：从分镜中提取使用序列的技术</p><p class="psl-reference-original" lang="en">Vogt J., Haesen M., Luyten K., Coninx K., Meier A.: Timisto: A technique to extract usage sequences from storyboards. In Proceedings of the 5th ACM SIGCHI Symposium on Engineering Interactive Computing Systems (2013), EICS '13, pp. 113–118.</p></div></li><li data-reference="Wu2018" id="ref-Wu2018"><span class="psl-reference-label">[WPRC18]</span><div><p class="psl-reference-zh">像导演一样思考：用于虚拟电影化叙事的电影剪辑模式</p><p class="psl-reference-original" lang="en">Wu H.-Y., Palù F., Ranon R., Christie M.: Thinking like a director: Film editing patterns for virtual cinematographic storytelling. ACM Trans. Multimedia Comput. Commun. Appl. 14, 4 (Oct. 2018), 81:1–81:22.</p></div></li><li data-reference="Yannopoulos2013" id="ref-Yannopoulos2013"><span class="psl-reference-label">[Yan13]</span><div><p class="psl-reference-zh">DirectorNotation：专业电影导演的艺术与技术系统</p><p class="psl-reference-original" lang="en">Yannopoulos A.: DirectorNotation: Artistic and technological system for professional film directing. J. Comput. Cult. Herit. 6, 1 (Apr. 2013), 2:1–2:34.</p></div></li><li data-reference="Ye2008" id="ref-Ye2008"><span class="psl-reference-label">[YB08]</span><div><p class="psl-reference-zh">迈向自动动画分镜</p><p class="psl-reference-original" lang="en">Ye P., Baldwin T.: Towards automatic animated storyboarding. In Proceedings of the 23rd National Conference on Artificial Intelligence - Volume 1 (2008), AAAI'08, pp. 578–583.</p></div></li></ol>

<span id="appendix-shots" class="psl-anchor" aria-hidden="true"></span>

## 补充镜头示例<small>原文图 9–14</small>

<figure class="psl-paper-figure" data-figure="9" id="fig-9">

<figcaption><span class="psl-fig-number">图 09</span><h3>简单镜头：《西北偏北》中的演员运动</h3></figcaption>

<img alt="图 9：简单镜头：《西北偏北》中的演员运动，含原始画面和完整解析树" decoding="async" height="924" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-09.png" width="1756"/>

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">Composition</th><td lang="en"><code>MS Th 34 right</code></td><td>中景：Th 呈右前方 3/4 朝向。</td></tr><tr><th scope="row">Recomposition / Cue</th><td lang="en"><code>then as Th turns away from camera</code></td><td>随后，当 Th 转身背向摄影机时。</td></tr><tr><th scope="row">Recomposition / CameraTo</th><td lang="en"><code>hold to</code></td><td>摄影机保持机位，直到以下构图。</td></tr><tr><th scope="row">Recomposition / Composition</th><td lang="en"><code>MS Th 34backright</code></td><td>中景：Th 呈右后方 3/4 朝向。</td></tr></tbody></table></div>

<p class="psl-translator-note"><strong>图中文字 / 译注</strong> 原图将 34 right 写成两个词，图 15 的词法写作 34right；此处按图保留。</p>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Simple shot: with actor movement in North By Northwest</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="10" id="fig-10">

<figcaption><span class="psl-fig-number">图 10</span><h3>《回到未来》中的发展镜头</h3></figcaption>

<img alt="图 10：《回到未来》中的发展镜头，含原始画面和完整解析树" decoding="async" height="886" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-10.png" width="1756"/>

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">Composition</th><td lang="en"><code>MS Mar Go 34right Ge 34left</code></td><td>中景，从左到右：Mar、Go 呈右前方 3/4 朝向，Ge 呈左前方 3/4 朝向。</td></tr><tr><th scope="row">Recomposition / Cue</th><td lang="en"><code>then as Go crosses under Ge</code></td><td>随后，当 Go 从 Ge 下方交叉通过时。</td></tr><tr><th scope="row">Recomposition / CameraTo</th><td lang="en"><code>dolly right to</code></td><td>摄影机向右移动，转至以下构图。</td></tr><tr><th scope="row">Recomposition / Composition</th><td lang="en"><code>MS Mar 34right Ge front Go 34left</code></td><td>中景，从左到右：Mar 呈右前方 3/4 朝向，Ge 呈正面，Go 呈左前方 3/4 朝向。</td></tr></tbody></table></div>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Developing shot in Back To The Future</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="11" id="fig-11">

<figcaption><span class="psl-fig-number">图 11</span><h3>发展镜头：《闪灵》中跟随演员的移动摄影</h3></figcaption>

<img alt="图 11：发展镜头：《闪灵》中跟随演员的移动摄影，含原始画面和完整解析树" decoding="async" height="1004" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-11.png" width="1756"/>

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">Transition</th><td lang="en"><code>cut to</code></td><td>切入。</td></tr><tr><th scope="row">CameraWith</th><td lang="en"><code>dolly with</code></td><td>摄影机随主体移动，保持构图。</td></tr><tr><th scope="row">Composition</th><td lang="en"><code>FS Dan back</code></td><td>全景：Dan 呈背面。</td></tr><tr><th scope="row">Event</th><td lang="en"><code>while Dan moves to screen center</code></td><td>同时，Dan 向画面中央移动。</td></tr></tbody></table></div>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Developing shot: Dolly with actor in The Shining</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="12" id="fig-12">

<figcaption><span class="psl-fig-number">图 12</span><h3>发展镜头：《正午》中的升降摄影机上升</h3></figcaption>

<img alt="图 12：发展镜头：《正午》中的升降摄影机上升，含原始画面和完整解析树" decoding="async" height="1053" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-12.png" width="1756"/>

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">Composition</th><td lang="en"><code>MS Sh left</code></td><td>中景：Sh 呈左侧面。</td></tr><tr><th scope="row">Recomposition / Cue</th><td lang="en"><code>then as Sh moves to screen top</code></td><td>随后，当 Sh 向画面上方移动时。</td></tr><tr><th scope="row">Recomposition / CameraTo</th><td lang="en"><code>crane up to</code></td><td>摄影机向上升起，转至以下构图。</td></tr><tr><th scope="row">Recomposition / Composition</th><td lang="en"><code>high angle ELS Sh back</code></td><td>俯拍大远景：Sh 呈背面。</td></tr></tbody></table></div>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Developing shot: Crane up in High Noon</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="13" id="fig-13">

<figcaption><span class="psl-fig-number">图 13</span><h3>《公民凯恩》中包含多名演员的发展镜头</h3></figcaption>

<img alt="图 13：《公民凯恩》中包含多名演员的发展镜头，含原始画面和完整解析树" decoding="async" height="2191" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-13.png" width="1756"/>

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">Shot… / Composition</th><td lang="en"><code>LS Kane</code></td><td>远景：凯恩。</td></tr><tr><th scope="row">Recomposition 1 / Cue</th><td lang="en"><code>then as M appears screen left</code></td><td>随后，当 M 出现在画面左侧时。</td></tr><tr><th scope="row">Recomposition 1 / CameraTo</th><td lang="en"><code>dolly out to</code></td><td>摄影机向后移动，转至以下构图。</td></tr><tr><th scope="row">Recomposition 1 / Composition</th><td lang="en"><code>MS M right LS Kane 34backleft MS Th left</code></td><td>从左到右：M 为中景、右侧面；凯恩为远景、左后方 3/4 朝向；Th 为中景、左侧面。</td></tr><tr><th scope="row">（续）Recomposition 2 / Cue</th><td lang="en"><code>then as F appears screen left and M crosses over Th</code></td><td>随后，当 F 出现在画面左侧，且 M 从 Th 上方交叉通过时。</td></tr><tr><th scope="row">Recomposition 2 / CameraTo</th><td lang="en"><code>dolly out to</code></td><td>摄影机向后移动，转至以下构图。</td></tr><tr><th scope="row">Recomposition 2 / Composition</th><td lang="en"><code>LS F MS M</code></td><td>F 为远景，M 为中景。</td></tr><tr><th scope="row">（续）Recomposition 3 / Cue</th><td lang="en"><code>then as Th F moves to M</code></td><td>随后，当 Th 和 F 向 M 移动时。</td></tr><tr><th scope="row">Recomposition 3 / CameraTo</th><td lang="en"><code>pan down to</code></td><td>摄影机向下摇摄，转至以下构图。</td></tr><tr><th scope="row">Recomposition 3 / Composition</th><td lang="en"><code>MLS F 34right ELS Kane 34left MS Th M 34left</code></td><td>从左到右：F 为中远景、右前方 3/4 朝向；凯恩为大远景、左前方 3/4 朝向；Th 和 M 为中景、左前方 3/4 朝向。</td></tr></tbody></table></div>

<p class="psl-translator-note"><strong>图中文字 / 译注</strong> 人物简写按图保留：M＝Mother（母亲），F＝Father（父亲），Th＝Thatcher（撒切尔）。</p>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Developing shot with multiple actors in Citizen Kane</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="14" id="fig-14">

<figcaption><span class="psl-fig-number">图 14</span><h3>散文分镜语言语法的 AND/OR 树表示</h3></figcaption>

<div class="psl-figure-images psl-stack-images">

<div class="psl-subfigure">

<img alt="PSL 语法 AND/OR 树原图" decoding="async" height="1359" loading="lazy" src="/images/posts/prose-storyboard-language-zh/fig-14.jpg" width="1536"/>

PSL 语法 AND/OR 树原图

</div>

</div>

<p class="psl-translator-note"><strong>图中文字 / 译注</strong> AND 表示组合，OR 表示选择。图中各节点的中文对照见紧随其后的完整语法与术语表；原图的所有节点与连接均予保留。图中的 Subject 与图 15 中 Agent 的写法差异按原文保留。</p>

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

<figcaption><span class="psl-fig-number">图 15</span><h3>以解析表达式文法（PEG）格式给出的散文分镜语言完整语法</h3></figcaption>

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

<p class="psl-translator-note"><strong>图中文字 / 译注</strong> 以下 44 行按用户提供的语法源文件原样呈现，保留全部产生式、大小写、引号与操作符。译注：图中引用了 <code>_</code> 和 <code>String</code>，但该清单未给出它们的定义；不在译文中擅自补写。符号说明：<code>?</code> 为可选，<code>*</code> 为重复零次或多次，<code>/</code> 为按顺序尝试的优先选择，双引号包围字面终结符。</p>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Grammar of the prose storyboard language in the Parsing Expression Grammar (PEG) format.</p>

</div>

</details>

</figure>

<span id="glossary" class="psl-anchor" aria-hidden="true"></span>

### 语法、图中术语的中文对照 <small>译者补充</small>

<div aria-label="PSL 术语对照" class="psl-table-scroll" role="region" tabindex="0"><table><thead><tr><th scope="col">原文符号</th><th scope="col">中文</th><th scope="col">含义与取值</th></tr></thead><tbody><tr><th scope="row"><code>Scene</code></th><td>场景</td><td>由零个或多个 Shot 构成。</td></tr><tr><th scope="row"><code>Shot</code></th><td>镜头</td><td>按原规则由可选转场、可选 CameraWith、可选构图、可选 WhileEvent，以及后续发展过程组成。</td></tr><tr><th scope="row"><code>Transition</code></th><td>转场</td><td>cut to：切至；dissolve to：叠化至；fade in to：淡入至。</td></tr><tr><th scope="row"><code>Development</code></th><td>发展过程</td><td>可选 then（然后），之后是 Recomposition 或 Continuation。</td></tr><tr><th scope="row"><code>Continuation</code></th><td>延续</td><td>Event 或 FollowEvent；依正文定义维持构图。</td></tr><tr><th scope="row"><code>Recomposition</code></th><td>重新构图</td><td>可选 Cue，加 CameraTo，再加目标 Composition。</td></tr><tr><th scope="row"><code>WhileEvent</code></th><td>同时事件</td><td>while（在……的同时）加 Event。</td></tr><tr><th scope="row"><code>FollowEvent</code></th><td>跟随事件</td><td>可选 Cue、CameraWith、Agent，以及可能追加的 Agent。</td></tr><tr><th scope="row"><code>Cue</code></th><td>提示／动作触发</td><td>as（当……时）加一个或多个事件。</td></tr><tr><th scope="row"><code>Composition</code></th><td>构图</td><td>由可选 Angle 和 Figure 的重复组合构成。</td></tr><tr><th scope="row"><code>Figure</code></th><td>主体的构图描述项</td><td>可选景别、主体、可选朝向角和可选屏幕位置。此处 Figure 不是图号。</td></tr><tr><th scope="row"><code>Agent</code></th><td>行动主体组</td><td>Actor 或 Object，可连续列出多个。</td></tr><tr><th scope="row"><code>Subject</code></th><td>构图主体</td><td>Actor（人物／行动主体）、Object（物体）或 Place（地点）。</td></tr><tr><th scope="row"><code>Angle</code></th><td>拍摄角度</td><td>low angle：低角度／仰拍；high angle：高角度／俯拍。</td></tr><tr><th scope="row"><code>Size</code></th><td>景别</td><td>ECU：Extreme Close-Up，大特写；CU：Close-Up，特写；MCU：Medium Close-Up，中近景；MS：Medium Shot，中景；MLS：Medium Long Shot，中远景；FS：Full Shot，全景；LS：Long Shot，远景；ELS：Extreme Long Shot，大远景。中文译名用于本页区分，PSL 关键字保持原样。</td></tr><tr><th scope="row"><code>Profile</code></th><td>朝向角</td><td>left／right：主体的左／右侧面；front／back：正面／背面；34left／34right：左／右前方 3/4 朝向；34backleft／34backright：左／右后方 3/4 朝向。</td></tr><tr><th scope="row"><code>Screen</code></th><td>屏幕位置</td><td>screen 加可选 top／bottom（上／下），再加可选 left／center／right（左／中／右）。</td></tr><tr><th scope="row"><code>CameraWith</code></th><td>保持构图的摄影机动作</td><td>可选速度，加 Pan／Dolly／Crane，再加 with（随……）；不含 Zoom。</td></tr><tr><th scope="row"><code>CameraTo</code></th><td>转至新构图的摄影机动作</td><td>Hold，或带可选速度的 Pan／Dolly／Crane／Zoom，之后加 to。</td></tr><tr><th scope="row"><code>Hold</code></th><td>保持机位</td><td>hold：保持摄影机静止。</td></tr><tr><th scope="row"><code>Pan</code></th><td>摇摄</td><td>pan 加可选 left／right／up／down：向左／右／上／下摇摄。上下摇摄涵盖 tilt。</td></tr><tr><th scope="row"><code>Dolly</code></th><td>移动摄影</td><td>dolly 加可选 left／right／in／out：向左／右／前／后移动摄影。</td></tr><tr><th scope="row"><code>Crane</code></th><td>升降摄影</td><td>crane 加必选 up／down（上升／下降），之后可选 left／right（向左／右）。</td></tr><tr><th scope="row"><code>Zoom</code></th><td>变焦</td><td>zoom in／out：变焦推近／拉远。</td></tr><tr><th scope="row"><code>Speed</code></th><td>速度</td><td>slow／quick：慢／快。</td></tr><tr><th scope="row"><code>Enter</code></th><td>进入</td><td>enters，加可选屏幕位置和可选地点。</td></tr><tr><th scope="row"><code>Exit</code></th><td>退出</td><td>exits，加可选屏幕位置和可选地点。</td></tr><tr><th scope="row"><code>Look</code></th><td>注视</td><td>looks，加可选 at，再加主体或屏幕位置。</td></tr><tr><th scope="row"><code>Move</code></th><td>移动</td><td>moves to，加主体或屏幕位置。</td></tr><tr><th scope="row"><code>Speak</code></th><td>说话</td><td>speaks，或 says 加 String；其后可选 to 加说话对象。</td></tr><tr><th scope="row"><code>Use</code></th><td>使用</td><td>uses，加物体。</td></tr><tr><th scope="row"><code>Cross</code></th><td>交叉通过</td><td>crosses over／under，加主体：从另一主体上方／下方交叉通过。</td></tr><tr><th scope="row"><code>Touch</code></th><td>触碰</td><td>touches，加主体。</td></tr><tr><th scope="row"><code>React</code></th><td>作出反应</td><td>reacts to，加反应所针对的主体。</td></tr><tr><th scope="row"><code>Turn</code></th><td>转身</td><td>turns left／right：向左／右转；towards camera／away from camera：转向／转离摄影机。</td></tr><tr><th scope="row"><code>Stop</code></th><td>停下</td><td>stops at／near，加主体：停在主体处／附近。</td></tr><tr><th scope="row"><code>Appear</code></th><td>出现</td><td>appears，加屏幕位置，或 from behind 加主体（从其后方出现）。</td></tr><tr><th scope="row"><code>Disappear</code></th><td>消失</td><td>disappears，加屏幕位置，或 behind 加主体（消失在其后方）。</td></tr><tr><th scope="row"><code>Action</code></th><td>动作</td><td>Enter、Exit、Look、Move、Speak、Use、Cross、Touch、React、Turn、Stop、Appear、Disappear 之一。</td></tr><tr><th scope="row"><code>Event</code></th><td>事件</td><td>Agent 加 Action。</td></tr><tr><th scope="row"><code>Actor / Object / Place</code></th><td>特定场景的终结符</td><td>由图 16–19 为各部电影分别列出。</td></tr><tr><th scope="row"><code>AND / OR</code></th><td>组合／选择</td><td>图 14 的连接关系标签；PEG 的 / 选择具有优先顺序。</td></tr><tr><th scope="row"><code>continued / then / while / as</code></th><td>续／然后／同时／当……时</td><td>图中描述时间衔接或事件触发的词语。</td></tr></tbody></table></div>

<span id="appendix-elements" class="psl-anchor" aria-hidden="true"></span>

## 四部电影的剧本元素<small>原文图 16–19</small>

<figure class="psl-paper-figure" data-figure="16" id="fig-16">

<figcaption><span class="psl-fig-number">图 16</span><h3>《回到未来》的剧本元素</h3></figcaption>

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

<p class="psl-translator-note"><strong>图中文字 / 译注</strong> Actor（行动主体）：Marty、George、Biff、Lou、Goldie、Match、Skinhead、hands（手）、3D。Object（物体）：Coffee（咖啡）、Bar（吧台）、Car（汽车）。Place（地点）：Cafe（咖啡馆）。人名作为语法标识符保留。</p>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Script elements for Back To The Future.</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="17" id="fig-17">

<figcaption><span class="psl-fig-number">图 17</span><h3>《夺魂索》的剧本元素</h3></figcaption>

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

<p class="psl-translator-note"><strong>图中文字 / 译注</strong> Actor（行动主体）：Brandon、Philip、Atwater、Janet、Kentley、Kenneth、Rupert、Wilson。Object（物体）：Glass（玻璃杯）。Place（地点）：Salon（客厅）、Dining room（餐厅）、Kitchen（厨房）。</p>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Script elements for Rope.</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="18" id="fig-18">

<figcaption><span class="psl-fig-number">图 18</span><h3>《西北偏北》的剧本元素</h3></figcaption>

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

<p class="psl-translator-note"><strong>图中文字 / 译注</strong> Actor（行动主体）：Thornhill、MBS、Plane（飞机）、TD1、TD2、Farmer（农夫）、BC Driver（BC 司机）、BC Woman（BC 女乘员）、BC Man（BC 男乘员）。Object（物体）：Bus（公共汽车）、White car（白色汽车）、Limo（豪华轿车）、Truck（卡车）、Blue car（蓝色汽车）、Green bus（绿色公共汽车）、Bluewhite car（蓝白色汽车）、Oil truck（油罐车）、Pickup（皮卡）、Brown car（棕色汽车）。Place（地点）：Arid plot 1／2／3（旱地 1／2／3）、Corn field（玉米田）、Highway（公路）、Dirt road（土路）。MBS、TD1、TD2、BC 的简称原样保留。注意原文把 Plane 放在 Actor 中。</p>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Script elements for North By Northwest.</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="19" id="fig-19">

<figcaption><span class="psl-fig-number">图 19</span><h3>《历劫佳人》的剧本元素</h3></figcaption>

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

<p class="psl-translator-note"><strong>图中文字 / 译注</strong> Actor（行动主体）：Mike、Susan、Linnekar、Blonde（金发女子）、Sanchez、Immigration official（移民官员）、Customs official（海关官员）。Object（物体）：Car（汽车）、Bomb（炸弹）、Building（建筑）、Checkpost（检查哨）。Place（地点）：Border control（边境检查处）、Main street（主街）、Parking lot（停车场）、Left side street（左侧街道）。</p>

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

<figcaption><span class="psl-fig-number">图 20</span><h3>阿尔弗雷德·希区柯克《夺魂索》中两个段落的草图分镜</h3></figcaption>

<p class="psl-figure-caption">阿尔弗雷德·希区柯克《夺魂索》中两个段落的草图分镜，见下方图 <a class="psl-xref" href="#fig-21">21</a>。</p>

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

<p class="psl-translator-note"><strong>图中文字 / 译注</strong> 左图标注：fridge＝冰箱；table＝餐桌；cam＝摄影机；B＝Brandon，P＝Philip，C1–C4 为构图编号。右图人物标签：Rupert、Philip、Mrs Atwater（阿特沃特太太）、Janet、Mr Kentley（肯特利先生）、Brandon；箭头及 1、2、3 的顺序标记按原图保留。</p>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Sketch storyboards for two sequences in Alfred Hitchcock's Rope, see Fig. 21 below.</p>

</div>

</details>

</figure>

<figure class="psl-paper-figure" data-figure="21" id="fig-21">

<figcaption><span class="psl-fig-number">图 21</span><h3>《夺魂索》中两个较长段落的散文分镜语言标注</h3></figcaption>

<p class="psl-figure-caption">《夺魂索》中两个较长段落的 PSL 标注。上方三行：第一个段落，06:55–08:22。下方三行：第二个段落，10:00–12:00。</p>

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

<div aria-label="图中文字与中文对照" class="psl-table-scroll" role="region" tabindex="0"><table class="psl-annotation-table"><thead><tr><th scope="col">位置 / 结构</th><th scope="col">PSL 原文</th><th scope="col">中文对照</th></tr></thead><tbody><tr><th scope="row">第一段 · 1</th><td lang="en"><code>MCU Brandon 34right Philip 34left</code></td><td>中近景，从左到右：Brandon 呈右前方 3/4 朝向，Philip 呈左前方 3/4 朝向。</td></tr><tr><th scope="row">第一段 · 2</th><td lang="en"><code>then as Philip moves to screen left and Brandon turns left pan left to</code></td><td>随后，当 Philip 向画面左侧移动、Brandon 向左转身时，向左摇摄至下一构图。</td></tr><tr><th scope="row">第一段 · 3</th><td lang="en"><code>MS Brandon Philip 34backleft</code></td><td>中景：从左到右为 Brandon、Philip，呈左后方 3/4 朝向。</td></tr><tr><th scope="row">第一段 · 4</th><td lang="en"><code>then dolly in with Brandon Philip</code></td><td>然后随 Brandon、Philip 向前移动摄影，保持构图。</td></tr><tr><th scope="row">第一段 · 5</th><td lang="en"><code>then as Philip crosses over Brandon dolly in to</code></td><td>随后，当 Philip 从 Brandon 上方交叉通过时，向前移动摄影至下一构图。</td></tr><tr><th scope="row">第一段 · 6</th><td lang="en"><code>MCU Philip Brandon 34backright</code></td><td>中近景：从左到右为 Philip、Brandon，呈右后方 3/4 朝向。</td></tr><tr><th scope="row">第一段 · 7</th><td lang="en"><code>then as Brandon moves to screen right dolly right to</code></td><td>随后，当 Brandon 向画面右侧移动时，摄影机向右移动至下一构图。</td></tr><tr><th scope="row">第一段 · 8</th><td lang="en"><code>MCU Philip 34right Brandon 34left</code></td><td>中近景：Philip 呈右前方 3/4 朝向，Brandon 呈左前方 3/4 朝向。</td></tr><tr><th scope="row">第一段 · 9</th><td lang="en"><code>then as Brandon touches Glass dolly out to</code></td><td>随后，当 Brandon 触碰玻璃杯时，摄影机向后移动至下一构图。</td></tr><tr><th scope="row">第一段 · 10</th><td lang="en"><code>MS Philip 34right Brandon 34left</code></td><td>中景：Philip 呈右前方 3/4 朝向，Brandon 呈左前方 3/4 朝向。</td></tr><tr><th scope="row">第一段 · 11</th><td lang="en"><code>then as Philip touches Glass dolly in to</code></td><td>随后，当 Philip 触碰玻璃杯时，摄影机向前移动至下一构图。</td></tr><tr><th scope="row">第一段 · 12</th><td lang="en"><code>MCU Philip 34right Brandon front</code></td><td>中近景：Philip 呈右前方 3/4 朝向，Brandon 呈正面。</td></tr><tr><th scope="row">第二段 · 1</th><td lang="en"><code>LS Philip right Atwater 34left Janet front Kentley 34left Brandon back</code></td><td>远景，从左到右：Philip 呈右侧面，Atwater 呈左前方 3/4 朝向，Janet 呈正面，Kentley 呈左前方 3/4 朝向，Brandon 呈背面。</td></tr><tr><th scope="row">第二段 · 2</th><td lang="en"><code>then slow pan left to</code></td><td>然后缓慢向左摇摄至下一构图。</td></tr><tr><th scope="row">第二段 · 3</th><td lang="en"><code>LS Wilson 34left Rupert 34right Philip right Atwater 34left</code></td><td>远景，从左到右：Wilson 呈左前方 3/4 朝向，Rupert 呈右前方 3/4 朝向，Philip 呈右侧面，Atwater 呈左前方 3/4 朝向。</td></tr><tr><th scope="row">第二段 · 4</th><td lang="en"><code>then as Wilson exits screen left and Rupert moves to Philip pan right to</code></td><td>随后，当 Wilson 从画面左侧离开、Rupert 向 Philip 移动时，向右摇摄至下一构图。</td></tr><tr><th scope="row">第二段 · 5</th><td lang="en"><code>LS Philip right Rupert 34backright Atwater Janet Kentley 34left Brandon back</code></td><td>远景，从左到右：Philip 呈右侧面，Rupert 呈右后方 3/4 朝向；Atwater、Janet、Kentley 呈左前方 3/4 朝向；Brandon 呈背面。</td></tr><tr><th scope="row">第二段 · 6</th><td lang="en"><code>then as Brandon moves to Rupert dolly in to</code></td><td>随后，当 Brandon 向 Rupert 移动时，摄影机向前移动至下一构图。</td></tr><tr><th scope="row">第二段 · 7</th><td lang="en"><code>then as Brandon moves to Rupert dolly in to</code></td><td>随后，当 Brandon 向 Rupert 移动时，摄影机向前移动至下一构图。（原图在相邻两帧重复此标注。）</td></tr><tr><th scope="row">第二段 · 8</th><td lang="en"><code>MLS Rupert 34right Brandon front Atwater 34left</code></td><td>中远景：Rupert 呈右前方 3/4 朝向，Brandon 呈正面，Atwater 呈左前方 3/4 朝向。</td></tr><tr><th scope="row">第二段 · 9</th><td lang="en"><code>then as Rupert moves to screen right dolly right to</code></td><td>随后，当 Rupert 向画面右侧移动时，摄影机向右移动至下一构图。</td></tr><tr><th scope="row">第二段 · 10</th><td lang="en"><code>MS Brandon Rupert right Janet front Kentley 34left</code></td><td>中景，从左到右：Brandon、Rupert 呈右侧面，Janet 呈正面，Kentley 呈左前方 3/4 朝向。</td></tr><tr><th scope="row">第二段 · 11</th><td lang="en"><code>then as Rupert moves to screen right dolly right to</code></td><td>随后，当 Rupert 向画面右侧移动时，摄影机向右移动至下一构图。</td></tr><tr><th scope="row">第二段 · 12</th><td lang="en"><code>MCU Rupert right Kentley left</code></td><td>中近景：Rupert 呈右侧面，Kentley 呈左侧面。</td></tr></tbody></table></div>

<details class="psl-english">
<summary>英文原文</summary>

<div lang="en">

<p>Prose storyboard language annotations of two extended sequences from the movie Rope. Top three rows: First sequence from 06:55 to 08:22. Bottom three rows: Second sequence from 10:00 to 12:00.</p>

</div>

</details>

</figure>

## 原文与版本说明

原文版本：<a href="https://arxiv.org/abs/1508.07593v5">arXiv:1508.07593v5</a>。输入文件：arXiv-1508.07593v5.tar.gz；正文来源：psl\_wiced.inc。已核对正式 PDF 的 15 页内容。

原文刊头：Eurographics Workshop on Intelligent Cinematography and Editing (2022), pp. 1–9；R. Ronfard and H.-Y. Wu (Editors)。原文页脚注明 submitted to Eurographics Workshop on Intelligent Cinematography and Editing (2022)。原刊头页码范围与含补充图的 PDF 总页数分别保留。

正文、图注与参考文献归原作者及相应权利人所有。此中文阅读版保留原论文内容；未将源码包中的出版模板、授权表单、其他论文及已注释草稿混入正文。全文与图像可离线阅读，外部资料链接需要网络。

<a href="#top">回到标题 ↑</a>
