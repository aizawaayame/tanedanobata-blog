---
title: 'UE 编辑器开发 05：编辑状态、对象生命周期与撤销重做'
slug: ue-editor-state-undo
published: 2026-10-13
draft: true
description: 分离 Document、Session 与 View，正确处理 UObject 引用、快照历史、原生事务、多窗口协作和保存基线。
tags: [UE, 编辑器开发, 撤销重做, C++]
category: UE
lang: zh_CN
kind: post
directory: blog/posts
route: /posts/ue-editor-state-undo/
---

两个窗口都能编辑同一份数据后，问题往往不再是控件怎么写，而是“这次修改到底属于谁”。如果每个窗口都有自己的草稿、撤销栈和脏标记，那么一次跨窗口操作就可能把它们拆成两个互相覆盖的世界。

<!-- more -->

[系列导读](/posts/ue-editor-roadmap/) · 上一篇：[自绘时间轴](/posts/ue-editor-slate-timeline/) · 下一篇：[预览视口](/posts/ue-editor-preview-viewport/)

> [!NOTE]
> 以 UE 5.3 为接口基线。本文明确区分普通 C++ 数据的示例快照历史与 UE 的 UObject 事务。代码未经原生编译与撤销交互验收。

## Document、Session、View 的分工

Document 保存用户真正编辑的内容：节点、连接、片段与变换。它应该能够脱离界面校验和序列化。Session 保存一次编辑过程中的选择、历史、活动手势、保存基线和预览失效状态。View 保存自己的缩放、滚动、焦点与布局，将操作交给 Session。

并不是所有字段都必须唯一共享。两个窗口可以有不同的滚动位置；如果产品要求选择联动，就把选择放到会话；如果各自浏览，则选择放在视图。关键是主动规定归属，不能靠“谁先写了这个字段”决定。

EditorLab 共享内容、历史与主选择，视图独立保留缩放和平移。一次编辑只能有一个活动手势。会话工厂按规范化的文档身份复用对象，注册表存弱引用，窗口持有强引用；最后一个窗口关闭后，会话在没有其他有效持有者时释放。不能用全局强引用表把所有打开过的文档永久留在内存。

## UObject 和共享指针是两种所有权模型

Slate 控件及普通 C++ 会话可以使用 `TSharedPtr`、`TSharedRef` 和 `TWeakPtr`。这些引用通过引用计数管理寿命。UObject 则参与引擎垃圾回收，不能用 `MakeShared` 创建，也不能因为它被放进普通结构的裸指针字段就假设能够存活。

| 所在位置或目的 | 适合的方式 | 需要注意的边界 |
|---|---|---|
| 反射 UObject 中持有 UObject | `UPROPERTY` 下的对象引用 | 持有者本身也必须可达 |
| 普通 C++ 持有临时 UObject | `TStrongObjectPtr` 或实现 `FGCObject` 引用收集 | 明确释放时点，避免长期保活 |
| 观察世界中的对象 | `TWeakObjectPtr` | 使用前检查有效性，不延长寿命 |
| 引用尚未加载的资源 | 软对象引用 | 保存路径不等于加载或保活实例 |
| Slate 与普通 C++ 对象互相观察 | `TWeakPtr` | 避免双方强引用形成环 |

`Outer` 表达对象归属关系，但不能被当成任意普通 C++ 持有场景下的 GC 根。`RF_Transient` 影响持久化行为，也不负责自动销毁。一个对象既可能不被保存，又因为强引用一直存在；也可能没有可靠引用而在窗口尚未关闭时被回收。

基础头文件包括 `UObject/StrongObjectPtr.h`、`UObject/WeakObjectPtr.h` 和 `UObject/GCObject.h`，对应 `CoreUObject`。使用原生事务还需要 `UnrealEd` 与 `ScopedTransaction.h`。只在真正需要保活时选择强引用，比到处 `AddToRoot` 后再猜何时移除更容易管理。

## 原生事务适合可事务化 UObject

如果编辑的是引擎资产或其他可事务化 UObject，优先理解原生事务路径。典型顺序是开始 `FScopedTransaction`，对要修改的对象调用 `Modify()`，再改变被事务序列化的数据。下面假定 `UEditorLabAsset` 是自定义资产类，`Label` 是它的反射属性。

```cpp
#include "ScopedTransaction.h"

// 局部实现：Asset 已有效，支持事务，NewLabel 已校验。
if (Asset->Label != NewLabel)
{
    const FScopedTransaction Transaction(
        NSLOCTEXT("EditorLab", "Rename", "重命名节点"));
    Asset->Modify();
    Asset->Label = NewLabel;
    Asset->MarkPackageDirty();
}
```

资产类还需要在撤销恢复后通知界面和预览，例如使用适当的 `PostEditUndo` 更新路径。修改属性是否要触发额外属性变更通知，由资产自身契约决定，不能把所有 UObject 都当成同一种容器。若修改连带影响其他对象，它们也需要进入正确的事务范围。

连续拖动不能每次 MouseMove 都创建一个局部事务。事务应跨越整个手势，开始时记录相关对象，结束时关闭；取消时恢复手势前值，并处理事务记录。特别要注意：`FScopedTransaction::Cancel()` 取消事务记录，不应被当成已经修改对象的自动业务回滚。恢复数据与取消记录是两件事。

## 普通数据采用快照历史

EditorLab 的教学文档采用普通 C++ 值类型，因此这一条路径自己管理历史。它不冒充原生 UObject 事务，也不同时给同一次修改再套一层引擎撤销，否则用户按一次 Undo 可能只撤掉一半状态。

快照只包含可编辑内容。不要把世界指针、窗口对象、音频组件和异步任务一起复制进去。恢复快照后，由会话使预览失效，再根据恢复后的文档重建输出。这样历史保持可解释，也避免恢复一个已经销毁的世界对象。

下面为单数值文档的完整历史核心片段，实际文档需要补充语义相等比较及深复制规则。它演示开始、更新、提交、取消、撤销和重做的顺序。

```cpp
#include "CoreMinimal.h"

struct FEditorLabValueHistory
{
    double Value = 0;
    TOptional<double> BeforeGesture;
    TArray<double> UndoValues;
    TArray<double> RedoValues;
    uint64 Revision = 0;

    bool Begin()
    {
        if (BeforeGesture.IsSet()) return false;
        BeforeGesture = Value;
        return true;
    }
    void Update(double Candidate)
    {
        if (BeforeGesture.IsSet() && FMath::IsFinite(Candidate)
            && Value != Candidate)
        {
            Value = Candidate;
            ++Revision;
        }
    }
    void End(bool bCancel)
    {
        if (!BeforeGesture.IsSet()) return;
        const double Before = BeforeGesture.GetValue();
        BeforeGesture.Reset();
        if (bCancel)
        {
            if (Value != Before) { Value = Before; ++Revision; }
        }
        else if (Value != Before)
        {
            UndoValues.Add(Before);
            RedoValues.Reset();
        }
    }
    bool Undo()
    {
        if (BeforeGesture.IsSet() || UndoValues.IsEmpty()) return false;
        RedoValues.Add(Value);
        Value = UndoValues.Pop();
        ++Revision;
        return true;
    }
    bool Redo()
    {
        if (BeforeGesture.IsSet() || RedoValues.IsEmpty()) return false;
        UndoValues.Add(Value);
        Value = RedoValues.Pop();
        ++Revision;
        return true;
    }
};
```

无变化的提交不增加历史，也不清空已有 Redo。取消同样保留原来的历史分支。只有一次实际新编辑才使旧的重做分支失效。这些细节可直接通过纯逻辑测试确认，不需要先把 Slate 窗口写出来。

## 快照相等比较不能依赖偶然字节顺序

复杂文档若序列化为 JSON 再比较快照，必须固定字段与集合的语义。哈希容器迭代顺序、无意义空白和临时缓存不应使相同内容被判为不同。可以对稳定 ID 排序后编码，或直接比较文档中的有序值字段。

浮点值也要先定义编辑语义。本文时间轴先把时间规范化到固定步长，再提交文档；不是在所有比较中随意套一个很大的容差。过大的容差可能吞掉用户真实的微小编辑，过小的容差则可能把运算噪声变成历史记录。

大型文档的完整快照有内存成本，可以设定历史条数或字节预算。若改用命令差量，需要每条命令能够正确反向执行，还要处理对象删除与依赖顺序。先把快照方案的边界验证清楚，再基于测量决定优化，避免一开始就建立难以审计的补丁系统。

## Dirty 不等于 Revision 不为零

Revision 是变化信号，撤销和重做都可以增加它。Dirty 则回答当前文档与最后一次成功保存的内容是否不同。保存后修改，再撤销到保存状态，Revision 仍然更大，但 Dirty 应该变回 false。

![当前内容与保存基线决定 Dirty，Undo 和 Redo 改变当前内容但不等同于保存](/images/ue-editor-series/state-history.svg)

因此保存成功后记录内容基线，Dirty 根据当前内容与基线比较。保存失败不能更新基线。若只把历史索引当作保存位置，用户撤销后创建新分支时，需要正确使旧索引失效；内容基线更直接，但也要保证比较稳定。

保存期间最好禁止新的修改，或者明确捕获一个保存版本并记录写出的究竟是哪份内容。本文采用同步保存及忙碌状态：活动手势未结束时不允许保存；保存失败保留草稿；成功回读后再更新基线。这样不会出现“新修改发生在写入中途，却被一起标记为已保存”的情况。

## 跨窗口编辑与派生状态

两个窗口使用同一 Session 后，Undo 从任一窗口执行都作用于同一历史。更新通知可以携带 Revision，视图仅在版本改变时刷新相关部分。通知时不要在持锁状态下执行任意 UI 回调；编辑器对象操作仍应留在游戏线程上。

选择通常不进入文档历史，但恢复文档后必须校验选择 ID 是否仍存在。删除节点后撤销可以恢复节点，是否恢复原选择由会话规则决定。本文保留仍有效的选择，失效则清空，不自动跳转到无关节点。

预览是派生状态。会话修改文档后使预览失效，播放入口重新准备有效输入。不要把“当前图上高亮的节点”作为恢复动画的依据；浏览选择和预览来源不同。窗口关闭时，正在进行的手势必须由其拥有者取消或提交，不能留在共享会话中阻止另一个窗口继续操作。

## 从一条历史推导复杂操作

以数值初始为零为例，开始手势后依次更新为一、二、三，提交后撤销栈只保存零，当前值是三。撤销时把三放入重做栈，恢复零；重做再恢复三。这种简单的状态表比只观察按钮是否变灰更能说明历史正确。加入第二个窗口后，执行相同序列并交换操作窗口，结果不应改变。

取消也要覆盖已经发生多次更新的情况。手势中先改成一，再改成二，取消后恢复零，同时保留开始手势之前的重做栈。若更新时就清空重做，用户仅仅尝试拖动又取消，也会失去历史分支。把清空放在真正提交新内容时，可以避免这种不必要的信息丢失。

复合操作需要一个共同边界。例如删除一个节点，同时删除引用它的连接和片段选择。撤销必须恢复完整的一致文档，而不是只恢复节点名称。对普通快照来说，把这些内容放进同一个文档快照较直接；对命令差量来说，必须定义恢复顺序和依赖。选择的修复可以发生在恢复之后，但不能留下指向不存在对象的可编辑入口。

历史描述应来自用户意图，例如“移动片段”或“重命名节点”，不要暴露内部函数名。拖动过程中更新描述没有必要，提交时固定下来即可。若一次操作影响多个对象，显示数量比列出所有内部 ID 更可读。错误提示则相反，需要足够精确地指出哪个对象与哪个约束不满足，方便用户修正。

最后考虑保存基线的寿命。用户保存后继续编辑，即使最早的历史因为容量限制被丢弃，也必须仍能判断当前内容是否等于已保存内容。保存基线不应只是指向撤销数组某个可能被弹出的元素。将其作为独立的不可变内容或稳定摘要，能把历史容量策略与脏状态判断解耦。

## 验证清单与故障定位

最重要的历史测试包括：无变化操作、连续拖动只产生一次记录、取消恢复原值、撤销后新编辑清空 Redo、保存后修改再撤销恢复干净状态、保存失败仍然脏，以及两个窗口交替修改后共同撤销。

寿命验证包括关闭一个窗口后另一个仍可编辑、关闭全部窗口后释放临时图与预览、强制 GC 后界面仍有效，以及异步完成时目标会话已失效。界面不刷新查版本通知，撤销内容错误查快照范围，关闭后泄漏查强引用环，不要用重复重建窗口掩盖所有问题。

引擎接口可参考 [FScopedTransaction](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Editor/UnrealEd/FScopedTransaction?application_version=5.3)；对象模型背景见 [Unreal 对象处理](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-object-handling-in-unreal-engine?application_version=5.3)。Document、Session 和上述值历史是本文的工具设计，不是需要读者寻找的引擎内置类。
