---
title: 'UE 编辑器开发 02：Slate 布局、数据绑定与输入处理'
slug: ue-editor-slate-ui
published: 2026-10-13
draft: true
description: 从列表与详情面板出发，解释 Slate 的声明式布局、属性委托、事件路由、刷新和控件生命周期。
tags: [UE, 编辑器开发, Slate, C++]
category: UE
lang: zh_CN
kind: post
directory: blog/posts
route: /posts/ue-editor-slate-ui/
---

EditorLab 的第一个实用界面只有两栏：左侧选择节点，右侧显示详情。选择不改变文档；提交名称修改才产生编辑。这个小例子足以遇到 Slate 开发的大多数基础问题：谁持有列表数据，属性何时求值，回调绑定给谁，以及刷新究竟刷新了什么。

<!-- more -->

[系列导读](/posts/ue-editor-roadmap/) · 上一篇：[插件与窗口](/posts/ue-editor-plugin-window/) · 下一篇：[GraphEditor 图视图](/posts/ue-editor-graph-view/)

> [!NOTE]
> 以 UE 5.3 为基线，代码为未经过 UE 编译验证的局部实现。本文先用普通 C++ 数据说明 Slate；持久化、撤销和 UObject 保活将在后续文章展开。

## 先理解声明式语法在创建什么

`SNew` 创建由共享指针管理的 Slate 控件，链式调用描述构造参数，中括号填入子控件。它看起来像 UI 标记语言，实际仍然是 C++。`Construct` 在创建控件时建立控件树，不是每帧重新执行的绘制函数。

`SCompoundWidget` 提供一个 `ChildSlot`，但这个槽可以放入包含多个子槽的 Panel。比如根节点是 `SSplitter`，里面分别放列表和详情。Slot 是布局约束的载体：伸缩比例、内边距和对齐属于父子关系，不应随意塞进业务数据模型。

布局过程包含期望尺寸与分配位置两部分。子控件可以表达自己需要多大，父控件最终决定可用空间。文本变长后被截断，可能是父容器分配不足；错误地持续修改子控件宽度，反而会让小窗口布局更难预测。先查约束来自哪一级，再决定滚动、换行或裁剪。

## 依赖和最小数据

使用 `Core`、`Slate`、`SlateCore` 和 `InputCore`。若界面放在编辑器模块中，沿用上一篇的基础依赖即可。列表需要 `Widgets/Views/SListView.h` 和 `Widgets/Views/STableRow.h`；分栏需要 `Widgets/Layout/SSplitter.h`；详情文本需要 `Widgets/Text/STextBlock.h`。

以下数据是列表的展示项。稳定 ID 用于恢复选择；名称只是显示内容，不能被当成唯一键。源文档以后可能包含更丰富的信息，展示项只携带当前界面需要的字段。

```cpp
#include "CoreMinimal.h"

struct FEditorLabRow
{
    FGuid Id;
    FString Label;
};
using FEditorLabRowPtr = TSharedPtr<FEditorLabRow>;
```

为什么不用数组下标作为身份？排序、过滤和重建都会改变下标。用户选中的第三行在刷新后可能变成另一个对象。名称同样可以重复或修改。稳定 ID 能让“当前对象”和“当前显示位置”保持区分。

## 构造列表与详情面板

下面是面板的局部声明与实现。示例通过构造参数接收展示项，并将数组复制到控件成员中；共享指针仍指向原来的展示项，所以它不是深复制业务文档。

```cpp
#include "Widgets/SCompoundWidget.h"
#include "Widgets/Layout/SSplitter.h"
#include "Widgets/Views/SListView.h"
#include "Widgets/Views/STableRow.h"
#include "Widgets/Text/STextBlock.h"

class SEditorLabPanel : public SCompoundWidget
{
public:
    SLATE_BEGIN_ARGS(SEditorLabPanel) {}
        SLATE_ARGUMENT(TArray<FEditorLabRowPtr>, Rows)
    SLATE_END_ARGS()

    void Construct(const FArguments& Args);

private:
    TSharedRef<ITableRow> GenerateRow(FEditorLabRowPtr Item,
        const TSharedRef<STableViewBase>& Owner);
    void SelectRow(FEditorLabRowPtr Item, ESelectInfo::Type Reason);
    FText GetSelectionText() const;

    TArray<FEditorLabRowPtr> Rows;
    TSharedPtr<SListView<FEditorLabRowPtr>> List;
    FEditorLabRowPtr Selected;
};

void SEditorLabPanel::Construct(const FArguments& Args)
{
    Rows = Args._Rows;
    ChildSlot
    [
        SNew(SSplitter)
        + SSplitter::Slot().Value(0.35f)
        [
            SAssignNew(List, SListView<FEditorLabRowPtr>)
            .ListItemsSource(&Rows)
            .SelectionMode(ESelectionMode::Single)
            .OnGenerateRow(this, &SEditorLabPanel::GenerateRow)
            .OnSelectionChanged(this, &SEditorLabPanel::SelectRow)
        ]
        + SSplitter::Slot().Value(0.65f)
        [
            SNew(STextBlock)
            .Text(this, &SEditorLabPanel::GetSelectionText)
            .AutoWrapText(true)
        ]
    ];
}

TSharedRef<ITableRow> SEditorLabPanel::GenerateRow(
    FEditorLabRowPtr Item, const TSharedRef<STableViewBase>& Owner)
{
    return SNew(STableRow<FEditorLabRowPtr>, Owner)
    [ SNew(STextBlock).Text(FText::FromString(Item->Label)) ];
}

void SEditorLabPanel::SelectRow(FEditorLabRowPtr Item, ESelectInfo::Type)
{
    Selected = Item;
}

FText SEditorLabPanel::GetSelectionText() const
{
    return Selected.IsValid()
        ? FText::FromString(Selected->Label)
        : NSLOCTEXT("EditorLab", "EmptySelection", "请选择一个节点");
}
```

`ListItemsSource` 持有的是数组地址，因此数组必须比列表活得久，不能传入 `Construct` 里的临时变量。表格行则由列表在需要时生成，行控件不应拥有整个文档或触发昂贵加载。列表有虚拟化行为，滚动时行可能被重新建立，不能把关键编辑状态仅存在某个行控件里。

注意示例中两种文本写法的差别。右侧绑定 getter，读取当前选择；左侧行文本在创建时取得一个值。若名称后来改变，左侧静态文本不会仅因为字段变了就自动更新。这个有意保留的区别，可以帮助我们理解刷新策略。

## 属性、事件和修改的方向

属性表达“现在应该显示什么”，事件表达“用户想做什么”。文本 getter 应该便宜、可重复调用且没有副作用。不要在 getter 中保存文件、改变选择或重建列表，因为布局和绘制可能多次求值，调用次数不是业务操作次数。

`SLATE_ARGUMENT` 接收构造时参数，`SLATE_ATTRIBUTE` 可以表示值或绑定的读取方式，`SLATE_EVENT` 接收委托。定义新控件时，先判断需要的是一次性交付的数据、持续变化的属性还是向外发送的动作，不必把所有输入都做成属性。

编辑框通常同时提供连续变化与提交事件。连续变化适合临时输入预览；提交适合语义校验和历史记录。若用户输入名称时每个字符都形成一次撤销，实际体验会很差。另一方面，焦点离开与按 Enter 都可能提交，处理函数应避免在值没有变化时制造历史。

跨窗口共享编辑时，让事件调用会话的修改入口，再由界面读取结果。例如提交名称时携带稳定 ID 和候选文本，会话判断对象仍存在、文本有效且实际发生变化，然后更新文档。不要先在本地改展示项，再期望稍后某个刷新把它“同步回去”。

## 刷新不等于重新创建整个窗口

列表新增、移除或排序后可以请求 `RequestListRefresh()`，让列表重新处理数据源。若仅改变已有展示项的名称，应选择绑定文本属性，或显式更新现有显示。不要假设请求列表刷新一定重新创建所有仍然可见的行；已有行可能被保留。

对于行内名称，简单方式是在创建文本控件时捕获该展示项的弱指针并绑定文本 getter。弱引用失效时返回空文本。另一种方式是让展示项不可变，在模型变更后生成新的展示项数组，并按稳定 ID 恢复选择。选择哪一种取决于更新频率，不能同时把旧实例当身份、新 ID 当身份却不定义映射。

几何尺寸变化需要布局失效，纯颜色或游标移动可能只需要绘制失效。自绘控件会更直接地接触 `Invalidate`。应把失效原因与实际变化匹配，而不是每帧销毁整个控件树。频繁重建容易丢失焦点、滚动位置和输入法状态，性能问题只是其中一部分。

## FReply 是输入协议，不只是一个 bool

`Handled` 表示当前控件处理了事件，`Unhandled` 允许事件继续路由。返回结果还可以携带鼠标捕获、释放和焦点请求。只有确实认领了这次操作时才返回处理成功；否则父级的滚动、快捷键或导航可能莫名失效。

拖动控件通常需要在按下时捕获鼠标，使鼠标离开控件边界后仍能收到移动和松开。开始前要先命中可拖动目标，空白区域不能无条件捕获。下面仅演示回复形式，`bDragging` 是控件成员状态，不是引擎自动维护的手势状态。

```cpp
// 放入派生控件的鼠标处理函数；目标命中检查在前。
bDragging = true;
return FReply::Handled()
    .CaptureMouse(SharedThis(this))
    .SetUserFocus(SharedThis(this), EFocusCause::Mouse);

// 在确认本控件拥有拖动的松开路径中：
bDragging = false;
return FReply::Handled().ReleaseMouseCapture();
```

主动松开只是结束的一种情况。窗口失去焦点、模态对话框出现或其他控件接管捕获，都可能触发捕获丢失。自定义控件应重写 `OnMouseCaptureLost(const FCaptureLostEvent&)`，把未完成手势恢复到确定状态。Escape 则通过键盘路径取消，控件还需要支持键盘焦点。

不要在捕获丢失回调里无条件撤销上一条历史。它只应取消本控件当前拥有的活动手势；正常提交时先清除所有权，再释放捕获。否则正常释放也可能触发取消逻辑，出现“松手后对象跳回原处”的问题。

## 坐标转换和 DPI

鼠标事件的屏幕位置与控件的局部坐标不是同一个空间。正确做法是使用当前 `FGeometry` 的 `AbsoluteToLocal` 转换，再与在相同局部空间建立的命中矩形比较。手动减去窗口左上角会遗漏布局变换、缩放或嵌套容器的影响。

同样不要对已经进入 Slate 局部空间的坐标再次乘除显示缩放比例。高 DPI 下的错位常常来自重复缩放，而不是需要更多特殊补偿。验证时改变编辑器窗口大小和系统缩放，查看点击位置是否仍与图形一致。

## 对象寿命与回调闭环

父控件持有子控件通常没有问题，但子控件通过强引用捕获父控件，就可能构成环。会话被窗口强持有是合理的，若会话中的回调又强持有窗口，关掉窗口也无法释放双方。对外事件订阅应保存句柄，并在退出时解除；异步回调则先检查弱引用。

这里的共享指针管理的是普通 C++ 对象。UObject 使用垃圾回收模型，不要用 `MakeShared` 创建 UObject，也不要假设某个捕获的裸指针会因此被 GC 保护。第 05 篇会具体解释不同持有方式；在这一篇里，先保持展示项是明确的普通数据。

## 把界面更新拆成可观察的步骤

可以给列表添加一个“反转排序”按钮作为练习。点击后改变展示数组顺序，请求列表刷新，再按源 ID 找回选择。观察右侧详情是否仍显示同一个对象，而不是新的第三行。随后删除当前选中对象，确认列表和详情都进入无选择状态。这个练习不需要文件系统，却能快速暴露把行号当身份的实现。

第二个练习是让名称变长。分别检查列表中的静态文本和详情中的绑定文本何时变化，然后选择一种明确的更新方式统一行为。不要通过每秒重建面板来使两个文本“最终一致”。如果使用绑定，读取路径只负责格式化当前值；如果使用显式通知，确保所有修改入口都经过会话并发出通知。混用两种方式可以，但必须知道每一块显示依赖哪条更新链路。

对输入框要区分正在编辑的临时字符串和已提交文档值。用户输入到一半时，另一个视图刷新不应无条件重置其文本；提交失败时也不应丢掉正在修正的输入。简单方案是在获得焦点后保留编辑缓冲，提交时校验，成功后更新缓冲基线，取消时恢复。这是控件局部状态的合理用途，因为它尚未成为文档事实。

滚动和焦点同样是用户工作上下文。列表更新前记住选中对象，通常比记住滚动条绝对像素更重要；新增项后是否自动滚动到它，应由该操作明确决定。后台刷新不应该每次都把用户拉回顶部。界面虽然只是文档的视图，也有需要保护的交互状态，不能把所有状态都当成可随时丢弃的缓存。

性能优化可以从计数开始：一秒内生成多少行，文本 getter 调用多少次，一次改名触发多少次完整重建。高频调用不一定是错误，但高频调用里发生磁盘访问、排序或全量序列化就值得调整。先把昂贵计算移到数据变化时，再让界面读取结果，比给每个 getter 加复杂缓存更容易保持一致。

## 验证与排错

先用三个节点验证选择与详情联动，再添加删除、排序和重名节点。删除选中对象后，详情应回到空状态，不能继续操作悬空的展示项。程序恢复选择时可能再次触发选择回调，必要时区分用户操作和程序更新，避免形成递归刷新。

输入验收包括鼠标拖出窗口后松开、拖动时按 Escape、拖动中弹出对话框，以及键盘在列表与详情间切换。布局验收包括窄窗口、长名称和高 DPI。性能检查先观察 getter、行生成和重建的调用位置，确认没有把磁盘访问放进高频 UI 路径。

官方资料可参考 [Slate 概览](https://dev.epicgames.com/documentation/en-us/unreal-engine/slate-overview-for-unreal-engine?application_version=5.3) 与 [Slate 架构](https://dev.epicgames.com/documentation/en-us/unreal-engine/understanding-the-slate-ui-architecture-in-unreal-engine?application_version=5.3)。本文的列表设计、选择身份和提交策略是示例约定，不是 Slate 自动提供的文档模型。
