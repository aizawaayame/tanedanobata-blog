---
title: 声明式摄影机控制：理解 DCCL 与自动摄影
slug: declarative-camera-control
published: 2026-10-14
draft: true
description: 从“甲走近乙”的原创小场景理解 DCCL 的摄影意图、镜头分层与 CPS 规划流程，并对照六项自动摄影研究，讨论游戏演出工具的设计边界。
tags: [自动摄影, 镜头语言, 论文阅读]
category: 游戏开发
lang: zh_CN
kind: post
directory: ''
route: /posts/declarative-camera-control/
---

做游戏演出工具时，我们很容易从摄影机参数开始设计界面：位置、朝向、焦距、关键帧、插值曲线。可编导描述一个镜头时，常常先说的是另一件事：“让观众看清楚他在接近谁”“等他进入画面再切”“两人停下来时，留下能读到表情的构图”。

参数描述摄影机怎样运动；这些话描述画面应当完成什么。自动摄影要连接的，正是这两种表达。

1996 年的 *Declarative Camera Control for Automatic Cinematography* 提供了一种很值得重读的连接方式。它提出声明式摄影机控制语言 **DCCL**，并实现摄影机规划系统 **CPS**：把可复用的摄影描述，与具体演员轨迹结合，生成可播放的摄影机规格。本文从这条关系出发，讨论它对今天游戏演出工具的启发。[原论文，AAAI 1996，148–155 页](https://cdn.aaai.org/AAAI/1996/AAAI96-022.pdf)

<p class="psl-edition-note">本文是原创解读。文献中的 <code>[CAwH*96]</code> 是引用键；本文用“DDCA”简称这篇论文，其中的正式语言名称是 DCCL，系统名称是 CPS。需要逐段阅读原文，可以转到<a href="/posts/declarative-camera-control-zh/">中文全译与英文对照</a>。下文的小场景、三幅示意图及现代工具建议均为本文编写，不是论文原图或实现记录。</p>

## 先写下希望观众看到什么

设想一段八秒的动画：甲穿过庭院，走向站在门旁的乙，两人在门边停下。我们已经有角色轨迹，现在要决定怎么拍。

可以先写这样一份很短的分镜意图：

```text
拍摄目标：让观众看懂甲正在接近乙，以及两人最终的相对位置。

镜头一：双人远景。乙在门旁等待，甲从庭院另一侧走近。
镜头二：中景。甲从画面左侧进入，停在乙身旁；停稳后结束。
```

这份描述暂时没有摄影机世界坐标。它给出的信息却足以支持讨论：观众何时看见乙，甲从哪一侧进入，什么动作意味着镜头结束。如果编导觉得第二个镜头切得太早，讨论对象也是“甲还没进入两人关系”这样的画面事件。

反过来，一条从坐标 A 插值到坐标 B 的摄影机曲线，通常不会告诉后来接手的人：这一移动是为了跟随甲、揭示乙，还是避开门框。角色速度或站位一变，关键帧还在，拍摄目的可能已经丢了。

声明式表达的价值，是把这个目的保存下来，让生成过程有据可依。它也要求作者说清楚足够多的条件。“拍得紧张”仍然过于宽泛；“甲停下时，两人都在画面里，保留乙的反应”就更容易转成可以检查的结果。

## 把摄影描述拆成可组合的层次

DCCL 用 **片段（fragment）、镜头（shot）、摄影惯用式（idiom）** 组织摄影描述。片段描述一段固定机位或单一简单运动；一个镜头可以由一个或多个片段组成；摄影惯用式则把若干镜头组织成适用于某类活动的拍摄方案。片段的变化不必产生剪切，镜头之间的变化才属于镜头组接。[原论文：DCCL](https://cdn.aaai.org/AAAI/1996/AAAI96-022.pdf)

<figure class="psl-paper-figure" data-figure="1" id="fig-language-layers">

<figcaption><span class="psl-fig-number">图 01</span><h3>从拍摄方案到镜头内运动</h3></figcaption>

<img src="/images/posts/declarative-camera-control/01-language-layers.svg" width="1200" height="660" loading="lazy" decoding="async" alt="原创层级示意：一个拍摄方案由多个镜头组成，每个镜头又可以包含连续的摄影片段，片段边界不等于剪切点" />

<p class="psl-figure-caption">原创概念图。层次分别回答“怎样组织这件事的拍摄”“在哪里切镜头”“镜头内部怎样运动”。</p>

</figure>

把这三个层次放回庭院例子，会更容易分清职责。

**在拍摄方案这一层，决定如何交代接近过程。** 两个镜头的版本先建立两人关系，再靠近观察停步。另一个方案可以始终留在双人远景里。两者都能覆盖这段动作，但传达的节奏不同。这里讨论的是一组镜头如何共同完成任务。

**在镜头这一层，决定观众连续看见什么。** 如果第二个镜头从甲进入画面一直拍到停下，期间没有剪切，那么摄影机中途改变运动方式，它仍然是同一个镜头。

**在片段这一层，描述简单、可计算的摄影行为。** 例如，先固定机位观察甲进入，再开始平移跟随甲。这是本文为说明组合关系写的例子；具体如何衔接，还需要检查运动速度与构图是否连续。把片段拼起来，只是表达了意图，并不自动保证衔接自然。

DCCL 原型定义了五种片段，可用下面这张小表建立直觉。这里的“固定”说的是摄影机，不能据此推断演员也不动。[原论文：Fragments 与 Figure 4](https://cdn.aaai.org/AAAI/1996/AAAI96-022.pdf)

<div class="psl-table-scroll" role="region" aria-label="DCCL 五种摄影片段" tabindex="0">

| 片段 | 摄影机行为 | 读图时应注意什么 |
| --- | --- | --- |
| static | 位置和朝向固定 | 这是摄影机状态，演员仍可能运动。 |
| go-by | 摄影机固定，演员穿过画面 | 关注演员在画面中的进入与离开。 |
| panning | 位置固定，改变朝向 | 摇摄产生的画面运动与演员运动有关。 |
| tracking | 改变位置，保持朝向 | 原型采用与演员运动相关的平移跟拍。 |
| point of view（POV） | 随指定演员的视点变化 | 视点由演员状态确定。 |

</div>

这种分层对工具设计的启发是：不要让一个“镜头模板”同时承担叙事安排、切镜时机和逐帧插值。出了问题时，作者需要知道该换拍摄方案、改切点，还是调整镜头内部的运动。

## 屏幕位置为什么会决定镜头时间

“甲从左边进入，停在乙身旁”看起来是构图描述，其实也在限定时间。

对于已经确定的摄影机，甲的世界轨迹可以投影成屏幕轨迹。假设在本文的示例中，甲在第 24 帧到达画面左侧边界，在第 72 帧到达指定位置。如果按每秒 24 帧播放，两个事件之间相隔两秒。这个时长来自画面条件与角色运动的组合；改变甲的速度，条件成立的帧就会改变。

<figure class="psl-paper-figure" data-figure="2" id="fig-screen-time">

<figcaption><span class="psl-fig-number">图 02</span><h3>画面中的端点，也是时间上的事件</h3></figcaption>

<img src="/images/posts/declarative-camera-control/03-screen-time.svg" width="1200" height="660" loading="lazy" decoding="async" alt="原创运动示意：演员沿世界轨迹移动，投影到画面中的进入位置与结束位置后，对应出镜头的起止时间" />

<p class="psl-figure-caption">原创说明。时间应从同一份角色轨迹与摄影机投影中求得，不能把屏幕位置直接当作世界坐标。</p>

</figure>

这正是 DCCL 中 movement endpoint 值得注意的地方：对于 go-by 和 panning，画面中的起止位置参与计算片段时长。static、tracking 和 POV 的时长则由规格显式给定。不能把“通过画面端点求时间”泛化到所有片段类型。[原论文：Movement Endpoints 与 The DCCL Compiler](https://cdn.aaai.org/AAAI/1996/AAAI96-022.pdf)

另一项配套信息是 **基准时刻（primary moment）**。运动中的演员与摄影机会不断改变相对关系，“中景、某种相对机位”必须在一个明确时刻成立。原型为 go-by、panning 和 tracking 指定片段的开始或结束作为基准时刻，再据此求解机位与后续运动。它不是随意加上的一个动画关键帧，而是摄影描述落到几何计算上的时间锚点。[原论文：The DCCL Compiler](https://cdn.aaai.org/AAAI/1996/AAAI96-022.pdf)

回到门边的两人：如果我们最关心“甲停下时，两人的构图成立”，就应先检查停下时刻，再向前检查进入过程。若只在起步时得到漂亮画面，甲走到门边以后却遮住乙，开头正确并不能证明整个镜头正确。

这里还藏着一个很实际的设计问题：甲的轨迹可能根本不会经过要求的位置。本文的工具建议是让预览明确报告“指定画面事件没有发生”，并定位到相关条件。悄悄给它填一个默认时长，会使作者误以为拍摄意图已经满足。

## CPS 怎样把描述变成可播放结果

DCCL 负责描述，CPS 负责把描述应用到具体动画。论文的输入包含演员随时间变化的位置、活动等信息，以及拍摄对象与时间范围；因此，输入侧已经承担了一部分“发生了什么”的语义组织。系统内部经过序列规划、DCCL 编译和启发式评估，再输出摄影机规格供播放器渲染。[原论文：The Camera Planning System](https://cdn.aaai.org/AAAI/1996/AAAI96-022.pdf)

<figure class="psl-paper-figure" data-figure="3" id="fig-planning-pipeline">

<figcaption><span class="psl-fig-number">图 03</span><h3>语义安排、几何计算与候选选择</h3></figcaption>

<img src="/images/posts/declarative-camera-control/02-planning-pipeline.svg" width="1200" height="640" loading="lazy" decoding="async" alt="CPS 职责关系的原创示意：动画轨迹进入序列规划，结合 idiom 库形成候选，由 DCCL 编译器生成逐帧规格，再经启发式评估选择并交给播放器" />

<p class="psl-figure-caption">根据论文职责关系重新组织的示意，不是原图复刻。输入语义、候选生成与最终播放之间存在不同的验证边界。</p>

</figure>

**序列规划先确定拍摄活动。** 原型按主角活动划分场景，并为场景匹配适用的 idiom。这个阶段依赖具体应用：在庭院例子中，必须有人或某个上游模块说明这段活动是“甲接近乙”，以及甲、乙和时间范围分别是什么。仅提供两条坐标曲线，并不足以自动获得完整的叙事含义。

**编译阶段把候选展开为逐帧规格。** 编译器利用演员几何、相对机位、景别、基准时刻和片段规则，求出摄影机位置、朝向与视场角数组。它还要处理片段时间及片段之间的依赖。论文将这一阶段与剧情语义分开：同一种几何计算可以服务不同应用中的双人互动。

**评估阶段在实际结果中选择。** 同一套拍摄方案用于不同站位时，可能产生很不同的画面。因此，论文先编译候选，再根据片段衔接、轴线、时长等启发式条件筛选。最后拼接被选中的帧数组，交给播放器。分数代表这套评估规则下的偏好，不能直接解释成观众理解程度或艺术质量。[原论文：Sequence Planner、DCCL Compiler、Heuristic Evaluator](https://cdn.aaai.org/AAAI/1996/AAAI96-022.pdf)

对今天的演出编辑器而言，这条流程最值得保留的是可追踪的中间结果。作者点开门边的镜头时，最好能看见：它来自哪个拍摄方案，绑定了哪两个演员，在哪个时刻求解构图，又为什么胜过另一个候选。这样，“生成得不好”才可能转成具体可修的问题。

## 把 DCCL 放回自动摄影研究中

相关研究经常被放在同一张“自动导演”清单里，但它们接收的输入、负责的决策和允许等待的时间并不相同。下面按这些差异比较六项工作。最后一列是本文的工程判断；它表示阅读上的关联，不表示存在未经证明的直接继承关系。

<div class="psl-table-scroll" role="region" aria-label="六项自动摄影相关研究比较" tabindex="0">

| 工作 | 一手材料所述重点 | 与本文问题的联系 | 对工具设计的提示 |
| --- | --- | --- | --- |
| [Drucker / Zeltzer，1994](https://www.microsoft.com/en-us/research/publication/intelligent-camera-control-in-a-virtual-environment/) | 从虚拟博物馆中的任务出发，把摄影机控制组织成模块。 | 同样尝试让人从任务层表达需求。 | 先辨认作者要完成的操作，再决定暴露哪些摄影参数。 |
| [CamDroid，1995](https://www.microsoft.com/en-us/research/publication/camdroid-a-system-for-implementing-intelligent-camera-control/) | 封装可编程、可编排的 camera module，并用于对话和虚拟足球拍摄。 | 关注摄影控制行为如何组合与复用。 | 模块的输入、持续条件和结束条件需要清楚。 |
| [Virtual Cinematographer，1996](https://www.microsoft.com/en-us/research/publication/the-virtual-cinematographer-a-paradigm-for-automatic-real-time-camera-control-and-directing/) | 用层次有限状态机组织摄影惯用式，响应正在发生的事件。 | 同样编码 idiom，但强调实时控制与镜头转换。 | 角色行为不可预知时，要单独设计事件响应与中断规则。 |
| [Cambot，2007](https://cdn.aaai.org/ojs/18774/18774-52-22466-1-10-20210929.pdf) | 面向离线 machinima，从符号剧本与场地组织演员调度、拍摄和剪辑。 | 把演员调度也纳入可选择的制作要素。 | 先确定系统是否有权改变演员站位，搜索空间会随之变化。 |
| [Darshak，2010](https://cs.uky.edu/~sgware/reading/papers/jhala2010cinematic.pdf) | 结合故事与传播目标，规划摄影叙事，并研究观众理解。 | 将“希望观众理解什么”放进规划问题。 | 构图检查之外，还要评估信息是否传达。 |
| [PSL，2022 正式修订版](https://diglib.eg.org/items/6600dfc3-fbcf-4784-8166-b299e2cb5a2b) | 用人和机器可读的语言逐镜头描述构图及其发展，用于标注与导演表达。 | 更侧重摄影描述作为交流接口的能力。 | 可读的分镜描述可以连接作者与工具，但仍需执行系统落实。 |

</div>

这张表可以用来给项目划分责任。例如，庭院动画已经锁定时，适合先研究“如何拍摄给定轨迹”；如果工具还能改变甲停在哪里，就必须把调度与摄影一起考虑；如果玩家随时能够让甲转身离开，则必须明确运行时如何响应新事件。

这些是不同的问题。把它们都压进一个“生成镜头”按钮，作者很难判断失败发生在哪一层，开发者也难以建立可靠验收标准。

关于 PSL 的细节，可以接着阅读站内的[《散文分镜语言》中文全文](/posts/prose-storyboard-language-zh/)。本文的版本比较以 2022 年 WICED 正式出版记录及修订图解版为准。

## 需要带着哪些边界阅读这篇论文

首先，**论文中的交互示例包含规划等待**。作者明确说，演示视频为了展示效果剪掉了 CPS 所需的规划时间。因此，流畅播放的录像证明了生成结果能被播放，不能单凭录像推断系统能够在每个运行时帧预算内完成规划。[原论文：Sample Application](https://cdn.aaai.org/AAAI/1996/AAAI96-022.pdf)

其次，**系统从有限的候选中选择**。DCCL 的拍摄形式与场景几何限定了候选集合，减少了通用搜索的需要，也缩小了可能得到的摄影结果。它有助于生成常见的镜头形式，但候选库没有表达的方案，不会仅凭调高某个评分权重自然出现。[原论文：Related Work](https://cdn.aaai.org/AAAI/1996/AAAI96-022.pdf)

最后，**通用几何模块仍然需要合适的输入**。活动识别、角色身份、时间范围和拍摄对象，都可能携带应用知识。更换故事领域时，需要检查这些输入是否仍然成立，不能只因为编译器不理解剧情，就认定整个系统与应用无关。

如果今天在这套思路上加入大语言模型，让它提出候选分镜，那是新的工程选择。模型可以帮助形成描述，但描述是否可解析、演员是否存在、时间是否成立，以及生成结果能否在实际场景中播放，都需要独立验证。这些能力不属于 1996 年论文已经完成的工作。

## 用一个小场景检验现代实现

以下是本文提出的验证办法，适合用“甲走近乙”建立最小实验，并非原论文的实验复现步骤。

先固定一份可重复播放的动画轨迹、两个人物标识和两种拍摄方案。让工具同时保留拍摄描述、编译后的摄影机序列和预览结果。第一次只需要回答：同一份输入是否稳定得到同一结果，作者是否能看懂它选择这个结果的原因。

然后一次只改变一个条件：

- **让甲走慢一点。** 检查依赖画面事件的切点是否随轨迹更新；显式给定的时长是否按原有约定处理。
- **把乙移到门的另一侧。** 检查人物绑定、相对机位与镜头衔接，观察旧方案是否仍然适用。
- **让甲提前停下。** 检查未达到的画面端点能否被明确报告，而不是被默认值掩盖。
- **在机位附近增加遮挡。** 检查预览中真实可见的画面。几何位置算出来，不等于人物已经被清楚拍到。
- **直接播放完整镜头组。** 检查连续运动和剪切节奏；单帧截图无法揭示切点过早、衔接突跳或持续时间不合适。

最后再评估观众：看完以后，能否指出甲在接近谁、乙在哪里、两人何时形成互动。这个问题需要观看结果来回答。一个通过约束检查的镜头，和一段被人理解的演出，是两个都值得保留的验收结果。

DCCL 留给今天工具开发者的一个实用起点，是让“我希望画面发生什么”成为可编辑、可检查的内容。先在一个小场景里把意图、求解和播放连接起来，摄影知识才有机会变成作者能够信任的工具。

<span id="glossary" class="psl-anchor" aria-hidden="true"></span>

## 阅读术语表

<div class="psl-table-scroll" role="region" aria-label="中英摄影术语表" tabindex="0">

| 英文 | 本文译法 | 使用范围 |
| --- | --- | --- |
| Declarative Camera Control Language（DCCL） | 声明式摄影机控制语言 | 描述摄影要求的语言。 |
| Camera Planning System（CPS） | 摄影机规划系统 | 将描述应用到动画轨迹的系统。 |
| fragment | 片段 | 镜头内部的一段简单摄影行为。 |
| shot | 镜头 | 两次剪切之间的连续画面。 |
| idiom | 摄影惯用式 | 适用于某类活动的可复用拍摄方案。 |
| placement | 机位布置 | 摄影机相对于演员的放置关系。 |
| primary moment | 基准时刻 | 指定机位要求成立的时间锚点。 |
| movement endpoint | 运动端点 | 用于限定画面中运动范围的位置。 |
| animation trace | 动画轨迹 | 带时间索引的演员状态与活动信息。 |
| heuristic evaluator | 启发式评估器 | 按规则对已生成候选进行评估与选择。 |

</div>

## 参考文献与原文入口

1. **Christianson, D. B.; Anderson, S. E.; He, Li-wei; Salesin, D. H.; Weld, D. S.; Cohen, M. F.** *Declarative Camera Control for Automatic Cinematography*. AAAI, 1996, pp. 148–155. 文献键：`[CAwH*96]`。[AAAI 原文](https://cdn.aaai.org/AAAI/1996/AAAI96-022.pdf) · [中文全译与英文对照](/posts/declarative-camera-control-zh/)。
2. **Drucker, S. M.; Zeltzer, D.** *Intelligent Camera Control in a Virtual Environment*. Graphics Interface, 1994。[研究页面](https://www.microsoft.com/en-us/research/publication/intelligent-camera-control-in-a-virtual-environment/) · [会议 PDF](https://graphicsinterface.org/wp-content/uploads/gi1994-23.pdf)。
3. **Drucker, S. M.; Zeltzer, D.** *CamDroid: A System for Implementing Intelligent Camera Control*. Symposium on Interactive 3D Graphics, 1995。[研究页面与 PDF 入口](https://www.microsoft.com/en-us/research/publication/camdroid-a-system-for-implementing-intelligent-camera-control/)。
4. **He, Li-wei; Cohen, M. F.; Salesin, D. H.** *The Virtual Cinematographer: A Paradigm for Automatic Real-Time Camera Control and Directing*. SIGGRAPH, 1996。[研究页面与 PDF 入口](https://www.microsoft.com/en-us/research/publication/the-virtual-cinematographer-a-paradigm-for-automatic-real-time-camera-control-and-directing/)。
5. **Elson, D. K.; Riedl, M. O.** *A Lightweight Intelligent Virtual Cinematography System for Machinima Production*. AIIDE, 2007。系统名称：Cambot。[AAAI 原文](https://cdn.aaai.org/ojs/18774/18774-52-22466-1-10-20210929.pdf)。
6. **Jhala, A.; Young, R. M.** *Cinematic Visual Discourse: Representation, Generation, and Evaluation*. IEEE Transactions on Computational Intelligence and AI in Games, 2(2), 2010, pp. 69–81。系统名称：Darshak。[DOI](https://doi.org/10.1109/TCIAIG.2010.2046486) · [论文 PDF](https://cs.uky.edu/~sgware/reading/papers/jhala2010cinematic.pdf)。
7. **Ronfard, R.; Gandhi, V.; Boiron, L.; Murukutla, V. A.** *The Prose Storyboard Language: A Tool for Annotating and Directing Movies*. Workshop on Intelligent Cinematography and Editing, 2022, pp. 13–27。正式修订图解版。[出版记录](https://diglib.eg.org/items/6600dfc3-fbcf-4784-8166-b299e2cb5a2b) · [正式版 PDF](https://diglib.eg.org/bitstream/handle/10.2312/wiced20221048/013-027.pdf)。
