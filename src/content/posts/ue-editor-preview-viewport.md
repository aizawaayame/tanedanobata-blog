---
title: 'UE 编辑器开发 06：自定义预览视口与三维交互'
slug: ue-editor-preview-viewport
published: 2026-10-13
draft: true
description: 用 SEditorViewport、FEditorViewportClient 与 FPreviewScene 组织预览，理解拾取、拖动、世界选择和资源清理。
tags: [UE, 编辑器开发, 视口, C++]
category: UE
lang: zh_CN
kind: post
directory: blog/posts
route: /posts/ue-editor-preview-viewport/
---

EditorLab 需要一个小视口：显示基础几何体，允许选择并沿平面移动，把结果写回文档。这个需求不需要启动游戏，也不需要往当前关卡永久添加 Actor。先选择正确的世界，再讨论相机和鼠标输入，能避免许多难以清理的副作用。

<!-- more -->

[系列导读](/posts/ue-editor-roadmap/) · 上一篇：[状态与撤销](/posts/ue-editor-state-undo/) · 下一篇：[时间驱动与播放](/posts/ue-editor-preview-playback/)

> [!NOTE]
> 本文以 UE 5.3 接口为基线，代码为局部示例。视口渲染、拾取和清理尚未经过实际 UE 验收，不能从文章示意图推断画面已经运行。

## 先决定使用哪个世界

`FPreviewScene` 为工具提供独立预览场景，适合单个资源或一小组对象。Editor World 包含当前编辑关卡，适合需要真实场景上下文的工具。PIE World 是运行中的游戏世界，具有另一套对象实例和生命周期。

同一个资源可能在不同世界中拥有不同实例。全局查找第一个匹配 Actor 再操作它，可能修改错误的世界；用编辑器对象指针直接操作 PIE 实例也不可靠。工具应明确持有当前目标世界，检查对象是否属于它，并在世界切换时使旧引用失效。

本文选择 `FPreviewScene`。它使示例不依赖关卡、World Partition 或 PIE 就绪条件。需要真实关卡遮挡或地形时才考虑 Editor World，并承担加载范围、地图切换和临时对象污染的管理成本。没有场景上下文需求时，不要先把复杂环境接进来。

## 三个核心对象的职责

`SEditorViewport` 是 Slate 容器，嵌入场景视口并参与布局与焦点。`FEditorViewportClient` 处理相机、输入、绘制辅助信息和视口行为。`FPreviewScene` 管理预览世界及加入其中的组件。它们协作，但不是一个对象的三个名字。

典型关系是控件持有客户端和预览场景，客户端观察控件并使用场景。客户端不能在场景销毁后继续 Tick 或 Draw，因此成员析构顺序和主动清理顺序都要考虑。仅仅把成员类型改成智能指针，不会自动得到正确的依赖顺序。

![预览控件、客户端、场景与组件的所有权，以及按依赖逆序清理](/images/ue-editor-series/viewport-lifetime.svg)

## 依赖与构造入口

模块依赖包括 `Core`、`CoreUObject`、`Engine`、`Slate`、`SlateCore`、`UnrealEd` 和 `InputCore`。主要头文件为 `SEditorViewport.h`、`EditorViewportClient.h`、`PreviewScene.h`、`Components/StaticMeshComponent.h`、`Engine/StaticMesh.h`。画辅助线使用 `SceneManagement.h`，拾取类型使用 `HitProxies.h`，画屏幕文字使用 `CanvasItem.h`。

下面给出视口骨架。真实工具还需要输入处理、组件创建和析构协调；这里展示客户端怎样接到独立场景。`MakeEditorViewportClient` 在控件构造时由基础实现调用，因此场景必须在调用 `SEditorViewport::Construct` 之前已经存在。

```cpp
class SEditorLabViewport : public SEditorViewport
{
public:
    SLATE_BEGIN_ARGS(SEditorLabViewport) {}
    SLATE_END_ARGS()

    void Construct(const FArguments&)
    {
        Scene = MakeUnique<FPreviewScene>(
            FPreviewScene::ConstructionValues());
        SEditorViewport::Construct(SEditorViewport::FArguments());
    }

protected:
    virtual TSharedRef<FEditorViewportClient> MakeEditorViewportClient() override
    {
        Client = MakeShared<FEditorViewportClient>(
            nullptr, Scene.Get(), SharedThis(this));
        Client->SetViewLocation(FVector(250, -250, 180));
        Client->SetViewRotation(FRotator(-20, 135, 0));
        Client->SetRealtime(false);
        return Client.ToSharedRef();
    }

private:
    TUniquePtr<FPreviewScene> Scene;
    // Client 使用 SEditorViewport 的 protected 成员，不再声明同名引用。
};
```

静态预览不需要持续刷新；内容或相机改变时使视口失效即可。动画预览则需要明确的刷新驱动。`SetRealtime(true)` 主要涉及视口刷新行为，不能被当成“所有预览对象都已经按需要推进”的保证。世界 Tick、组件求值和绘制刷新必须分别确认。

上面的骨架不能直接作为复杂工具的完整寿命实现。基础控件内部也持有客户端与 SceneViewport。正式封装要在释放场景前停止渲染入口，并解除客户端对场景和视口的使用；不要只观察自己定义的 `Client` 成员引用计数。

## 添加基础几何体

使用一个静态网格组件即可展示基础对象，不必为每个编辑项创建完整游戏 Actor。下面是创建与加入场景的局部流程。假定 `Scene` 已初始化，`Mesh` 已经由资源选择或加载流程取得，`PreviewMesh` 是持有者的 `TStrongObjectPtr<UStaticMeshComponent>` 成员。

```cpp
PreviewMesh.Reset(NewObject<UStaticMeshComponent>(
    GetTransientPackage(), NAME_None, RF_Transient));
PreviewMesh->SetStaticMesh(Mesh);
PreviewMesh->SetCollisionEnabled(ECollisionEnabled::NoCollision);
Scene->AddComponent(PreviewMesh.Get(), FTransform::Identity);

// 退出时，在 Scene 仍有效且渲染/输入已经停止后执行：
Scene->RemoveComponent(PreviewMesh.Get());
PreviewMesh.Reset();
```

网格为空时应显示空状态，而不是继续构造依赖其包围盒的相机参数。资源加载失败与渲染不可见也要区分：前者检查资源结果，后者检查变换、相机、可见性和场景注册。不要为了排错把同一个组件重复 Add 到场景。

这里关闭碰撞，因为拾取使用自定义 HitProxy，并不是射线碰撞查询。如果工具需要物理射线，应创建必要物理场景、启用对应碰撞并设置过滤规则。看到网格并不证明物理查询能命中它，两者是不同的数据通路。

## 相机和取景

预览相机由视口客户端控制，通常不需要在预览世界额外生成 Camera Actor。聚焦对象时根据包围盒中心、半径和视场角估算距离，并留出边距；异常包围盒则使用确定的默认位置。窗口宽高比改变也会影响横向容纳范围，不能只用一个固定距离适配所有布局。

如果工具的目标就是预览物理镜头参数，可以使用 CineCamera 相关类型，并明确将其参数同步给视图。但焦距、传感器尺寸和最终视场角不是可随意混用的三个独立旋钮。基础对象编辑器应先用普通透视视图，把镜头模型作为独立扩展。

选中轮廓、地面网格和坐标轴有助于理解空间关系。使用颜色时同时保留形状或文字，不让可操作性只依赖颜色差异。辅助线应随着对象变换更新，却不进入可保存的源数据，也不应在关卡中生成额外资产。

## HitProxy 解决“点中了哪个编辑元素”

HitProxy 可以把一次绘制关联到一个可识别的编辑元素。比如拖动柄对应 `FEditorLabHandleHitProxy`，里面携带稳定 ID 和轴类型。绘制时设置代理，画完立即清空，避免后续辅助线错误继承同一拾取身份。

```cpp
struct HEditorLabHandle : public HHitProxy
{
    DECLARE_HIT_PROXY();
    FGuid ItemId;
    explicit HEditorLabHandle(const FGuid& InId)
        : HHitProxy(HPP_UI), ItemId(InId) {}
};
IMPLEMENT_HIT_PROXY(HEditorLabHandle, HHitProxy);

// 客户端 Draw(View, PDI) 中的局部片段。
PDI->SetHitProxy(new HEditorLabHandle(ItemId));
PDI->DrawPoint(HandlePosition, FLinearColor::Yellow, 12.f, SDPG_Foreground);
PDI->SetHitProxy(nullptr);
```

输入时从视口取得命中代理，检查类型后读取 ID，再回到当前文档查找目标。不要让代理保存一个会在重建中失效的文档数组元素地址。HitProxy 结果也可能因为视口未刷新而过期，因此关键编辑入口仍要校验目标存在。

它与碰撞射线查询的用途不同。HitProxy 更适合选择屏幕上绘制的编辑控件；射线查询更适合获得场景表面或空间关系。把二者区分开，可以避免为一个小操作柄创建不必要的碰撞 Actor。

## 从屏幕移动到世界移动

拾取只确认了目标，拖动还需要定义约束。本文选择固定平面移动：按下时记录对象原始变换、拖动平面和鼠标射线与平面的交点；后续求新的交点，用两次交点差更新原始位置。保留按下时平面，避免拖动过程中约束跟着对象一起变化。

射线可由当前 SceneView 的屏幕位置反投影得到。透视与正交视图的射线起点不同，但都可以表示为起点加方向乘参数。求交时要处理方向几乎平行于平面、交点位于不接受的范围以及射线参数不合法；这些情况下保持上次合法位置，不生成巨大的跳变。

拖动坐标还要区分世界空间与文档空间。如果文档保存局部变换，就先把候选世界位置通过父变换转换回局部坐标，再执行约束和提交。不要在一个分支保存世界位置，在另一个分支读取时再当作局部位置，错误通常要等父对象旋转后才暴露。

## 输入、撤销与场景更新如何连接

按下操作柄后请求会话开始手势，成功才捕获输入。移动时更新文档草稿并将候选变换应用到预览组件；松开产生一次历史；取消恢复文档，然后由恢复后的文档更新组件。预览组件不是最终数据来源，不从它的当前变换反向覆盖全部文档。

如果资源重载或窗口关闭发生在拖动中，先取消本视口拥有的手势。若对象在另一个窗口被删除，停止继续应用变换。会话版本和稳定 ID 可以帮助检测过期输入，单纯检查组件指针非空并不足够。

自定义平面拖动适合教学和简单控件。需要成熟的多轴操纵器、吸附、旋转缩放与复杂选择时，应进一步评估编辑模式或 Interactive Tools Framework。直接手写一个看起来像标准 gizmo 的图形，并不会自动获得它的交互规则。

## 清理要沿依赖逆序进行

关闭时先禁止新的输入与异步结果，取消活动手势，停止播放和组件更新，然后解除预览组件与场景的关系，释放客户端及场景。客户端和 SceneViewport 的关联、全局委托、计时器都属于清理范围。对外注册过的回调需要解除，不只是把指针设为空。

Editor World 工具还必须处理地图卸载与切换，及时销毁自己创建的临时对象并撤销加载请求。`RF_Transient` 不会替你销毁 Actor，也不会阻止错误代码修改关卡中的已有对象。这里选择隔离预览，正是为了让示例避免这些不必要的环境依赖。

## 把空间问题拆成几个可测量的量

开始调试拖动时，先输出当前视口尺寸、鼠标局部位置、射线起点与方向、交点以及提交到文档的坐标。这里的日志用于开发排错，不需要出现在最终用户界面。若射线与预期不符，先检查视图和坐标空间；射线正确而对象跳动，再检查平面约束与抓取偏移。直接反复调整移动倍率通常只会隐藏真正错误。

一个有用的实验是旋转父变换后再次拖动子对象。若源文档保存局部位置，转换结果应随父变换正确变化；撤销后原始局部值和最终世界显示都应恢复。再把视口改为不同宽高比，确认操作柄的视觉尺寸与命中范围仍合理。三维交互的错误常常只在非默认姿态和非默认窗口尺寸下出现。

场景更新可以按稳定 ID 复用已有组件，避免每次移动都销毁重建。只有资源类型变化或对象删除时才替换组件，并同步清理对应命中信息。重建整个场景虽然实现简单，却可能重置相机、加载状态和动画时间。优化前先建立正确的增删映射，不能让已经从文档删除的对象因缓存残留继续可选。

还应把关窗测试视作功能测试的一部分。打开、编辑、关闭、强制回收、再次打开，重复观察对象数量和委托数量是否回到预期。只看任务管理器内存未下降不能直接判定泄漏，因为引擎可能缓存资源；应结合本工具持有的组件、世界和回调证据判断。反过来，没有明显内存增长也不代表不存在迟到回调访问失效对象。

## 验证步骤与故障定位

依次检查空资源、正常网格、极小与极大包围盒、窗口缩放、相机聚焦、拾取与平面拖动。拖动时取消、切换焦点或关闭窗口，确认文档和画面同时恢复。关闭重开多次，观察是否存在重复组件、残留音频或仍然活跃的回调。

原生验证还应包含强制 GC、资源替换和预览世界销毁。画面不动先区分文档未变、组件未更新和视口未刷新；点击无效先区分 HitProxy 未绘制、代理类型不符和源 ID 已失效。官方接口可参考 [FPreviewScene](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/FPreviewScene?application_version=5.3) 及实际版本的 `SEditorViewport.h`、`EditorViewportClient.h`。
