---
title: 'UE 编辑器开发 03：用 GraphEditor 展示自定义图结构'
slug: ue-editor-graph-view
published: 2026-10-13
draft: true
description: 构建只读原生图视图，理解 UEdGraph、节点、Pin、Schema 和 Slate 节点工厂，并正确处理分支、汇合与循环。
tags: [UE, 编辑器开发, GraphEditor, C++]
category: UE
lang: zh_CN
kind: post
directory: blog/posts
route: /posts/ue-editor-graph-view/
---

节点关系已经存在于一份文档里，现在希望在 UE 编辑器中缩放、平移、选择并查看它。最容易走偏的做法，是为了获得图界面，顺手把原始数据改成某种蓝图结构。本篇选择更小的边界：将文档投射为临时 `UEdGraph`，让 GraphEditor 负责展示。

<!-- more -->

[系列导读](/posts/ue-editor-roadmap/) · 上一篇：[Slate 布局与输入](/posts/ue-editor-slate-ui/) · 下一篇：[自绘时间轴](/posts/ue-editor-slate-timeline/)

> [!NOTE]
> 本文采用 UE 5.3 公开图编辑器类型。代码为局部实现，包含示例自定义类型，未经过 UHT、编译和原生图视图验收。

## 明确只读视图的边界

“只读”表示用户不能通过图操作改变文档拓扑，不表示不能平移、缩放和选择。选择节点用于显示详情，打开全文或定位相关内容；它不应隐式触发播放，也不应该改变当前预览输入。

源文档中的节点拥有稳定 ID、标题和连接关系。显示节点可能还拥有位置、折叠状态和搜索命中颜色。二者有不同的生命周期：源节点在文档里长期存在，显示节点可以在一次刷新后全部被替换。让二者共用指针身份，会使重建后的选择和跨视图联动变得脆弱。

本文将显示节点中的 `SourceId` 指回源文档。用户选择多个显示节点时，先转换为一组源 ID，再交给会话。如果为了表示回边而生成额外的“返回节点”，它可以共享源 ID，但还需要独立的显示身份，否则位置映射会相互覆盖。

## 五类对象分别负责什么

| 类型 | 职责 | 不自动提供的能力 |
|---|---|---|
| `UEdGraph` | 保存显示节点集合与 Schema 类型 | 外部数据加载和布局策略 |
| `UEdGraphNode` | 节点标题、位置、Pin 等结构 | 业务身份与显示样式 |
| `UEdGraphPin` | 连接端点及连接关系 | 任意连线是否合法 |
| `UEdGraphSchema` | 图规则、连接策略和菜单行为 | 完整的数据模型 |
| `SGraphEditor` | 原生图面板、选择、缩放和交互 | 把任意数据自动排成可读图 |

自定义节点外观由 `SGraphNode` 及节点工厂参与创建。复杂连线还可以使用连接绘制策略。先采用简单矩形节点和默认连线，确认数据与交互正确后再加入装饰，往往比一开始同时调试结构与样式更有效。

## 模块、头文件与反射

基础依赖包括 `Core`、`CoreUObject`、`Engine`、`Slate`、`SlateCore`、`UnrealEd` 和 `GraphEditor`。图数据声明位于 `EdGraph/EdGraph.h`、`EdGraph/EdGraphNode.h` 与 `EdGraph/EdGraphSchema.h`；界面入口是 `GraphEditor.h`。节点工厂使用 `EdGraphUtilities.h`，自绘节点使用 `SGraphNode.h`。

自定义 `UCLASS` 声明必须放在 UHT 扫描的头文件中，包含自己的 generated 头，且 generated 头放在最后。下面展示节点和 Schema 的最小职责，不包含完整模块导出组织。示例假定它们仅被同一模块使用。

```cpp
// EditorLabGraphTypes.h 的局部内容
#include "CoreMinimal.h"
#include "EdGraph/EdGraphNode.h"
#include "EdGraph/EdGraphSchema.h"
#include "EditorLabGraphTypes.generated.h"

UCLASS()
class UEditorLabGraphNode : public UEdGraphNode
{
    GENERATED_BODY()
public:
    UPROPERTY() FGuid SourceId;
    UPROPERTY() FString Label;

    virtual void AllocateDefaultPins() override
    {
        CreatePin(EGPD_Input, TEXT("EditorLab.Flow"), TEXT("In"));
        CreatePin(EGPD_Output, TEXT("EditorLab.Flow"), TEXT("Out"));
    }
    virtual FText GetNodeTitle(ENodeTitleType::Type) const override
    {
        return FText::FromString(Label);
    }
};

UCLASS()
class UEditorLabGraphSchema : public UEdGraphSchema
{
    GENERATED_BODY()
public:
    virtual const FPinConnectionResponse CanCreateConnection(
        const UEdGraphPin*, const UEdGraphPin*) const override
    {
        return FPinConnectionResponse(CONNECT_RESPONSE_DISALLOW,
            NSLOCTEXT("EditorLab", "ReadOnlyGraph", "此图仅用于浏览"));
    }
};
```

Schema 拒绝用户连接，界面还会设置 `IsEditable(false)`。二者解决不同层面的问题：一个约束结构编辑规则，一个控制面板交互。只把节点颜色变灰没有只读语义；只禁用右键菜单也无法阻止其他输入路径。

## 把源数据投射为临时图

构建分两遍更容易处理前向引用。第一遍创建所有显示节点并建立 ID 映射，第二遍查找边两端并连接 Pin。某条边引用不存在的 ID 时，应记录文档诊断并跳过该边，不能解引用空对象，也不应悄悄创建一个看似合法的源节点。

以下是创建一个节点的局部实现。`Graph` 和 `Node` 都是 UObject；把 Graph 的 Outer 设置为临时包并不等于它会自动永久存活。承载图的普通 C++ 对象需要明确保活方式。

```cpp
#include "EdGraph/EdGraph.h"
#include "UObject/StrongObjectPtr.h"

// 持有者成员：TStrongObjectPtr<UEdGraph> Graph;
Graph.Reset(NewObject<UEdGraph>(GetTransientPackage(), NAME_None, RF_Transient));
Graph->Schema = UEditorLabGraphSchema::StaticClass();

UEditorLabGraphNode* Node = NewObject<UEditorLabGraphNode>(
    Graph.Get(), NAME_None, RF_Transient);
Node->SourceId = FGuid::NewGuid(); // 实际投影应复制源文档的稳定 ID。
Node->Label = TEXT("Node A");
Node->CreateNewGuid();            // 这是显示节点自身的 GUID。
Graph->AddNode(Node, false, false);
Node->AllocateDefaultPins();
Node->NodePosX = 0;
Node->NodePosY = 0;
```

在已经验证的投影构建器内，可以用输出 Pin 的 `MakeLinkTo` 建立已有源边，它不会替你执行全部 Schema 校验。因此它适合这个内部构建阶段，不适合直接暴露给任意用户编辑命令。本文固定每个节点一个输入、一个输出；扩展为多类型 Pin 后，应按方向与名称查找，不能继续依赖数组下标。

构建完成后将图交给面板。选择事件中读取 `FGraphPanelSelectionSet`，只接受本工具的节点类型并映射为源 ID；其他对象不要做未经检查的强制转换。

```cpp
// 放在 Slate 控件构造中；Events 是本工具设置的图事件集合。
SGraphEditor::FGraphEditorEvents Events;
ChildSlot
[
    SNew(SGraphEditor)
    .GraphToEdit(Graph.Get())
    .IsEditable(false)
    .ShowGraphStateOverlay(false)
    .GraphEvents(Events)
];
```

完整界面还需绑定 `OnSelectionChanged`；这里留空是为了突出图的持有关系。GraphEditor 的控件引用不应被当成 GC 保活的充分条件。安全销毁时先让显示层脱离旧图，再释放旧图强引用，避免后续绘制仍访问旧对象。

## 自定义节点外观的入口

当默认节点表达不够清楚时，可以派生 `SGraphNode`，在 `Construct` 中设置 `GraphNode`，再通过 `UpdateGraphNode` 建立标题与 Pin 区域。节点工厂继承 `FGraphPanelNodeFactory`，仅对 `UEditorLabGraphNode` 返回自定义控件；遇到其他节点必须返回空结果，让其他工厂继续处理。

工厂通过 `FEdGraphUtilities::RegisterVisualNodeFactory` 注册，模块关闭时对同一个工厂实例注销。不要在每次打开窗口时全局注册一个新工厂，也不要写成对所有 `UEdGraphNode` 都返回自己的节点样式，那会影响其他编辑器。

节点宽度应由可读性约束决定。标题太长可以折行或截断，并在详情面板显示完整内容。图承担关系浏览，详情承担全文阅读；把全部内容塞到一个节点里，会让缩放和布局越来越难控制。搜索命中、高亮和当前选择也应使用不同标识，避免一种颜色同时代表三种状态。

## 图并不一定是树

![源图中的循环与只读显示中的返回引用，保留源 ID 而不复制业务数据](/images/ue-editor-series/graph-projection.svg)

对于只有分支的树，按层排列很直观；加入汇合后，一个节点有多个前驱；加入循环后，递归“遍历所有后继直到结束”可能永不返回。必须在布局前明确处理图的性质，而不能把循环当成偶发坏数据。

EditorLab 采用一个可解释的教学策略：从入口遍历，用路径中的访问集合识别回边；主图保留每个源节点的一份主显示，回边画为单独返回引用。汇合指向同一个源节点，不展开成无限的子树。没有入口或存在不可达节点时，按稳定 ID 排序后把剩余连通部分放到独立区域。

注意“本次递归路径正在访问”和“之前已经访问过”不是同一概念。后者既可能表示汇合，也可能表示循环。用一个全局 visited 集合把所有重复访问都称为循环，会误导读者。更通用的方案可以先计算强连通分量，再对压缩后的图分层，但对于小型教学工具，明确标注回边已足以解释关系。

## 重建、选择与布局稳定性

文档结构变化后，最简单的做法是重建显示图。重建前记录源选择 ID、视图位置与缩放，重建后查找仍然存在的 ID 并恢复。被删除的节点从选择里移除，同时更新详情面板。不能仅仅保留旧 `UEdGraphNode*`，因为它代表已经过期的显示对象。

如果变更只影响标题或状态颜色，则不必重新布局。通过源 ID 找到显示节点并通知图更新即可。改变选择也不应该重新布局，否则用户每点击一次，画面都会跳动。布局应尽量确定：相同输入产生相同位置，节点排序使用稳定规则，不依赖哈希容器遍历顺序。

随着图变大，可以缓存布局或局部更新，但优化前先确认身份映射和失效条件。维护一套无法解释何时过期的缓存，通常比重建一个小图更难排错。性能测量应分别观察投影构建、布局、Slate 节点创建和绘制，不要把总耗时都归咎于 GraphEditor。

## 用小图逐步验证投影

不要一开始就导入几千个节点。先固定三个源节点和两条边，打印每个源 ID 对应的显示节点数量，以及每条边找到的输入输出端点。确认投影结果后再加入汇合：两条路径指向同一个节点，主显示数量应该仍等于源节点数量。这个数量约束能快速发现错误复制节点的问题。

再加入一条从末端返回起点的边。布局必须结束，回边必须可辨认，点击返回引用能够定位主显示节点，同时保留同一源 ID。为返回引用提供单独的显示键，例如源边身份和引用类型的组合，避免它覆盖主节点的位置记录。保存源文档时不写出这类显示辅助节点，因为它们可以从源边重新推导。

搜索也应该在源数据和显示投影之间建立明确关系。搜索名称可以得到多个源 ID，随后高亮对应显示节点；定位到某个结果再调整视图。取消搜索只清除搜索高亮，不清空用户选择，也不改变文档。若搜索当前折叠区域中的节点，应明确展开或显示“位于折叠区域”的结果，而不是假装没有找到。

对于大量节点，先区分用户要看整体关系还是逐个阅读内容。缩小时隐藏次要文字、聚焦时显示详情，通常比无限提高绘制复杂度更有效。显示摘要不能改变源拓扑，折叠状态也不能使保存时丢掉隐藏节点。只读图的价值在于让关系可见，而不是将每个源字段都复制到画布上。

刷新期间还要避免选择回调形成反馈。恢复选择可能触发与用户点击相同的事件；如果该事件又请求重建图，就会形成递归更新。可以给同步过程设置明确的重入保护，并让会话在选择值未变时不广播。保护应只覆盖这次程序同步，不能用一个永远开启的“忽略事件”开关掩盖所有输入。

最后测试一个断开的子图和一个缺失目标引用。前者是合法但不在入口路径中的内容，应可浏览；后者是文档错误，应诊断。不能因为二者都没有从入口显示出来就采用相同处理。把这些案例固定下来，再修改节点样式和连线路径，可以确认视觉调整没有改变投影语义。

这些固定案例应长期保留，作为后续布局调整的回归输入，而不只在第一次实现时手动观察一次。

## 验证与常见故障

准备六种固定图：单节点、链、分支、汇合、循环、包含无效引用的图。分别检查节点数、连线数、稳定布局和选择映射。对循环图反复重建，确认不会无限递归；对汇合图确认没有把它错误标记成循环；对断开的节点确认它仍可被搜索到。

原生交互需要检查平移缩放、框选、点击回边、键盘导航和重建后保持视角。GC 问题则应在开发环境中主动触发垃圾回收后继续操作，再关闭重开。标题不刷新先检查更新路径，整个图消失则先查持有关系；二者不是同一类故障。

官方类型索引包括 [UEdGraphSchema](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UEdGraphSchema?application_version=5.3) 和 [SGraphEditor](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Editor/UnrealEd/SGraphEditor?application_version=5.3)。这里的投影、回边布局与身份映射是本文设计，不是引擎自动提供的行为。
