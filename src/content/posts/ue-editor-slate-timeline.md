---
title: 'UE 编辑器开发 04：用 Slate 自绘交互时间轴'
slug: ue-editor-slate-timeline
published: 2026-10-13
draft: true
description: 从统一坐标变换出发，实现时间片段绘制、命中、缩放、平移和可取消拖动，理解自绘时间轴与 Sequencer 的边界。
tags: [UE, 编辑器开发, Slate, 时间轴]
category: UE
lang: zh_CN
kind: post
directory: blog/posts
route: /posts/ue-editor-slate-timeline/
---

时间轴的难点通常不在画出矩形，而在确保用户点中的地方就是看见的地方。缩放后片段边界是否还准确，拖出控件再松开是否能结束操作，按 Escape 是否恢复原值，这些问题共同决定了控件是否可靠。

<!-- more -->

[系列导读](/posts/ue-editor-roadmap/) · 上一篇：[GraphEditor](/posts/ue-editor-graph-view/) · 下一篇：[状态与撤销](/posts/ue-editor-state-undo/)

> [!NOTE]
> 基线为 UE 5.3。本文给出局部 C++ 实现及明确标识的算法约定，不提供完整时间轴控件；尚未进行 UE 编译和原生拖动验收。

## 先限定要编辑的内容

EditorLab 的时间轴有多行轨道，每个片段包含稳定 ID、轨道索引、开始时间和时长。本文只实现整体移动、选择和定位，不实现关键帧曲线、片段拉伸或资源混合。时间使用秒，区间采用左闭右开；零时长片段不进入可拖动集合。

片段在同一轨道不允许重叠。拖动时保留原时长和轨道，候选开始时间先吸附到 0.1 秒，再限制到合法范围；若与邻居发生重叠，保持上一次合法候选并显示无效提示。跨轨道拖动和改变时长会引入额外规则，不能悄悄作为鼠标移动的副作用。

点击片段主体选择它；左键拖动片段移动内容；左键点击标尺定位游标；中键拖动绘图区平移；滚轮围绕鼠标时间缩放。先把输入分工写清楚，可以避免同一次按下既开始移动又改变播放时间。

## 为什么使用 SLeafWidget

当轨道、片段和刻度都由一次绘制完成时，`SLeafWidget` 很合适。它没有子控件树，需要实现 `ComputeDesiredSize` 和 `OnPaint`，并自己处理输入。代价是文本编辑、辅助功能和键盘导航不会因为画出一个矩形而自动出现。

如果只有少量固定片段，也可以组合已有 Slate 控件。决定自绘应依据交互密度和性能需求，不是因为自绘“更底层”。本篇使用它，是为了完整展示绘制与命中共享坐标的机制。

依赖 `Core`、`Slate`、`SlateCore`、`InputCore`。常用头文件是 `Widgets/SLeafWidget.h`、`Rendering/DrawElements.h`、`Input/Reply.h`、`Styling/AppStyle.h` 和 `Layout/Clipping.h`。不要在 `OnPaint` 内加载资源或重建文档，它应只读取准备好的显示状态。

## 建立唯一的时间坐标变换

设绘图区左边距为 `OriginX`，可见起始时间为 `ViewStart`，每秒占用 `PixelsPerSecond` 个 Slate 局部单位。所有绘制、命中、刻度和缩放都使用下面这一组互逆关系。

```cpp
struct FEditorLabTimeTransform
{
    double OriginX = 80.0;
    double ViewStart = 0.0;
    double PixelsPerSecond = 100.0; // 必须为有限正数。

    double TimeToX(double Seconds) const
    {
        return OriginX + (Seconds - ViewStart) * PixelsPerSecond;
    }
    double XToTime(double LocalX) const
    {
        return ViewStart + (LocalX - OriginX) / PixelsPerSecond;
    }
};
```

屏幕鼠标位置先通过 `Geometry.AbsoluteToLocal(Event.GetScreenSpacePosition())` 转成局部坐标，再进入 `XToTime`。绘制时也把局部位置交给当前 Geometry。不要在命中函数里另写一套按窗口宽度计算的公式，否则左侧轨道名宽度或 DPI 一变就会错位。

轨道纵向位置也集中计算：`Top + TrackIndex * TrackHeight`。这里的 Top 不包括窗口标题栏，只是时间轴内部的标尺区域高度。窗口坐标、绝对坐标、控件局部坐标和时间坐标分开命名，比写更多修正系数更有效。

![鼠标屏幕坐标通过 Geometry 转为局部坐标，再与时间坐标互相转换](/images/ue-editor-series/timeline-transform.svg)

## 绘制与裁剪

下面是 `OnPaint` 中绘制片段的局部片段。`Rect` 来自同一个布局函数，包含局部位置和尺寸；`Color` 是已准备好的显示颜色。绘制返回值应报告实际使用的最大图层，不能假定父控件会替自己修正。

```cpp
// OnPaint 局部：Rect 类型为 FSlateRect。
const FVector2D Position(Rect.Left, Rect.Top);
const FVector2D Size(Rect.Right - Rect.Left, Rect.Bottom - Rect.Top);
if (Size.X > 0 && Size.Y > 0)
{
    FSlateDrawElement::MakeBox(
        OutDrawElements, LayerId + 2,
        AllottedGeometry.ToPaintGeometry(
            Size, FSlateLayoutTransform(Position)),
        FAppStyle::GetBrush(TEXT("WhiteBrush")),
        ESlateDrawEffect::None, Color);
}
// 完整 OnPaint 最后返回自己实际使用的最高层，例如 LayerId + 4。
```

建议固定内部层次：背景、刻度网格、片段、文字、游标。拖动中的片段可以使用同层内后绘制或一个额外层，但不要不断递增 Layer 而失去可预测性。透明选择覆盖层也不能遮掉全部片段文字。

控件边界可以启用 `ClipToBounds`；若左侧轨道名固定、右侧内容横向滚动，则还需对右侧绘图区设置独立裁剪。使用 `FSlateClippingZone` 时，Push 与 Pop 必须配对，不能让裁剪泄漏到后续控件。命中测试也要排除被裁剪的内容，否则屏幕上看不到的片段仍可能抢走点击。

文本宽度和片段宽度不一致时，采用统一的省略或隐藏策略。很窄的片段可以只保留色块，并在详情显示完整名称；不要为了显示整段文字把它的命中区域无限扩大。帮助提示、选择轮廓和文字要分别考虑，不能靠相互覆盖来凑效果。

## 刻度密度与缩放锚点

刻度间距太密会挤成一团，太疏则无法判断时间。可先选一个期望的像素间距，例如 80，然后计算对应秒数，并向 `1、2、5 × 10 的整数次幂` 取整。主刻度负责标签，次刻度只绘制短线。标签使用与刻度步长相匹配的小数位，避免显示一串没有意义的浮点尾数。

滚轮缩放最重要的体验是：鼠标下的时间保持不动。先根据旧比例求出锚点时间，改变比例，再反算新的可见起点。下面的算法不依赖文档内容，适合单独测试。

```cpp
const double AnchorTime = Transform.XToTime(MouseLocalX);
const double NewScale = FMath::Clamp(
    Transform.PixelsPerSecond * FMath::Pow(1.2, WheelDelta),
    10.0, 2000.0);
Transform.PixelsPerSecond = NewScale;
Transform.ViewStart = AnchorTime
    - (MouseLocalX - Transform.OriginX) / NewScale;
Transform.ViewStart = FMath::Max(0.0, Transform.ViewStart);
```

当起点被限制到零时，锚点不再能够绝对保持，这是范围约束的结果，应接受这一明确行为。平移则依据按下时的 `ViewStart` 和累计鼠标偏移计算，而不是逐帧累加经过取整的小增量，以免产生漂移。

## 命中规则必须与绘制一致

将每个片段的局部矩形放在同一份显示布局中，绘制与命中都读取它。不要在绘制时使用吸附后的时间，在命中时却使用未吸附的鼠标位置。轨道分隔、标尺和留白区域也应有明确命中规则。

若未来允许片段重叠，命中顺序必须与视觉层次一致：最后绘制的对象优先。本文禁止同轨重叠，但仍要给选择边框和游标设置较高优先级，避免用户试图定位游标时开始移动下面的片段。

边界测试用时间和位置都恰好落在片段起止点的输入。左闭右开的区间规则意味着相邻片段共享边界时优先归入后一个片段。不要用“哪个循环先碰到就选哪个”隐式决定结果，否则容器顺序变化会改变交互。

## 一次拖动应该是一个完整手势

按下时记录片段原始时间、鼠标起点和文档版本，并请求会话开始手势。移动时使用“原始开始时间＋累计时间偏移”形成候选，再依次吸附、范围校验和邻居检查。原始值不能每帧覆盖，否则向前拖再拖回来可能无法精确回到起点。

松开时提交候选；若前后完全一致，就不产生撤销记录。Escape 或捕获丢失时恢复起始快照。提交前先清除控件的活动手势标记，再释放鼠标捕获，避免正常释放被误当作异常取消。会话负责数据恢复，控件负责输入所有权，二者通过一个明确的手势标识协作。

拖动过程中若其他窗口修改了同一份文档，应停止并取消本手势，然后显示可理解的原因。本篇选择同一会话只允许一个活动手势，因此第二个窗口不能悄悄覆盖第一个窗口的起始快照。多窗口协作不等于必须同时接受两个冲突的连续编辑。

## 游标定位与编辑撤销分开

播放游标是会话中的浏览状态，不属于片段的持久化数据。拖动标尺时先暂停，再发送目标时间给播放器；松开后默认保持暂停。这样连续定位不会反复启动声音，也不会在撤销片段移动时顺带恢复一个过期的播放状态。

可以使用带 `double` 时间和 `bool` 提交标记的自定义委托向外发送定位意图。委托只表达时间，播放器负责总时长、片段映射和不连续求值。时间轴本身不应知道动画组件和音频组件的存在。

键盘路径也要有语义：左右键按固定步长定位游标，Home 和 End 到达边界，Escape 取消手势。可访问性上，自绘内容至少提供选中项名称、当前时间和可聚焦的操作入口；画出文本并不等于辅助技术能理解它。

## 什么时候应该使用 Sequencer

只有片段选择和简单移动时，自绘控件可以很直接。需求若进一步包含绑定对象、关键帧曲线、多轨求值、嵌套序列或成熟资产编辑流程，就需要评估 Sequencer 扩展。不要为了维持一个早期选择，把已有框架的每项功能重新实现一遍。

也不能仅因为界面长得像时间轴，就把自绘控件称为 Sequencer。本文的控件没有 MovieScene 求值能力，显示的是普通数据；第 07 篇的播放器同样是明确受限的教学模型。

## 一个数值例子贯穿整个操作

假设左边距为八十个局部单位，可见起点是第二秒，每秒一百个单位，那么第三秒位于横向一百八十的位置。宽度五十的片段代表半秒。将鼠标从一百八十移到二百三十，候选开始时间增加半秒；这个增量由原始鼠标位置与原始片段时间计算，不能受到中途绘制取整的影响。

接着把缩放比例加倍，鼠标仍停在二百三十的位置。先记录鼠标下的原时间，再调整可见起点，才能保持鼠标指向的内容不变。若直接只改变比例，所有内容会向左边距收缩或展开，看起来像被拖走。用这个例子分别测试绘制位置、命中时间和缩放锚点，能在没有复杂资源的情况下定位计算错误。

拖动状态还应暴露明确的视觉反馈。有效候选显示正常轮廓，无效候选保留最后合法位置并显示原因；用户松开时提交的是最后合法候选，而不是某个仅存在于鼠标坐标里的非法时间。若希望无效位置松开直接取消，则要改变约定和测试，不能让界面显示一种行为、文档提交另一种行为。

边缘自动滚动是另一个容易被低估的扩展。加入后，拖动中的可见起点不断变化，候选时间仍应根据当前鼠标时间与按下时的抓取偏移计算。本文未实现自动滚动，因此拖出绘图区只保持捕获并约束候选，不声称支持无限拖动。功能边界写清楚，往往比加入未经验证的特殊分支更可靠。

## 验证步骤与排错

纯算法检查包括时间到像素再返回的误差、缩放前后的鼠标锚点、零时长与非法比例拒绝、相邻区间边界、吸附后冲突和视图起点限制。输入检查包括拖出边界松开、Escape、捕获丢失、窗口缩放，以及拖动前后返回同一值时不增加历史。

图形正确但点击偏移时先查坐标空间；松开后跳回时查取消路径；滚轮后游标跳动时查锚点反算；某些片段无法选中时查裁剪和层级。官方接口与背景可参考 [Slate 裁剪系统](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-slate-clipping-system-in-unreal-engine?application_version=5.3) 和 [Slate 框架](https://dev.epicgames.com/documentation/en-us/unreal-engine/slate-user-interface-programming-framework-for-unreal-engine?application_version=5.3)。
