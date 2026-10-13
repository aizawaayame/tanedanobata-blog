---
title: 'UE 编辑器开发 01：从 Editor 插件到可停靠窗口'
slug: ue-editor-plugin-window
published: 2026-10-13
draft: true
description: 理解 Editor 模块、TabManager、ToolMenus、命令和快捷键的协作，建立可正确关闭与注销的工具入口。
tags: [UE, 编辑器开发, Slate, C++]
category: UE
lang: zh_CN
kind: post
directory: blog/posts
route: /posts/ue-editor-plugin-window/
---

这篇文章的目标是从编辑器菜单打开一个 EditorLab 面板，再用同一个命令响应快捷键。比“能显示一段文字”更重要的是：重复打开不会产生意外副本，窗口关闭后能够重开，模块退出时不留下指向已卸载代码的回调。

<!-- more -->

[系列导读](/posts/ue-editor-roadmap/) · 上一篇：[路线图](/posts/ue-editor-roadmap/) · 下一篇：[Slate 布局与输入](/posts/ue-editor-slate-ui/)

> [!NOTE]
> 基线为 UE 5.3。以下为相互关联的局部实现，不是完整插件工程；省略的职责会在正文中说明。代码未经过 UE 编译或实际窗口验收。

## 插件、模块和窗口不是同一个对象

插件是分发和启用单位，描述文件决定包含哪些模块、是否包含内容以及依赖哪些插件。模块是代码的加载单位，`StartupModule` 和 `ShutdownModule` 负责注册与释放能力。窗口则是用户界面对象，可能在模块加载很久以后才创建，也可能在模块仍然存在时反复关闭。

因此，不要把“模块启动”当成“用户打开工具”。启动阶段适合注册入口，不适合立即加载大资源、扫描所有资产或创建预览世界。把昂贵工作推迟到实际打开后，既减少编辑器启动负担，也使失败更容易反馈到对应界面。

Editor 模块的类型使其面向编辑器目标，但不能代替正确的依赖方向。运行时模块不能反过来依赖编辑器模块。如果数据结构以后需要被游戏读取，应单独审视它的运行时归属；这里的 EditorLab 只做编辑器示例，不提前拆出没有消费者的运行时层。

## 最小目录和模块依赖

建议先用插件向导创建 Editor Standalone Window，再对照下面的目录理解生成内容。文件名和模块名必须一致，尤其是 `Build.cs` 中的类名和插件描述中的 `Name`。下面是目录示意，不是需要复制的完整文件清单。

```text
Plugins/EditorLab/
  EditorLab.uplugin
  Source/EditorLab/
    EditorLab.Build.cs
    Private/EditorLabModule.cpp
    Private/SEditorLabPanel.h
    Private/SEditorLabPanel.cpp
```

插件描述的最小示例：

```json
{
  "FileVersion": 3,
  "Version": 1,
  "VersionName": "0.1",
  "FriendlyName": "EditorLab",
  "CanContainContent": false,
  "Modules": [
    { "Name": "EditorLab", "Type": "Editor", "LoadingPhase": "Default" }
  ]
}
```

`Build.cs` 中以下为构造函数内片段。本文把窗口实现放在 Private，因此依赖也先放到 Private。若公共头文件暴露某个模块的类型，再根据真实接口调整，而不是把所有依赖都设为 Public。

```csharp
PCHUsage = ModuleRules.PCHUsageMode.UseExplicitOrSharedPCHs;
PrivateDependencyModuleNames.AddRange(new[]
{
    "Core", "CoreUObject", "Engine", "Slate", "SlateCore",
    "UnrealEd", "ToolMenus", "InputCore"
});
```

模块依赖解决链接与可见性，`#include` 解决当前编译单元的声明。只加头文件却没有模块依赖，可能在编译通过后出现链接错误；只加模块却依赖某个间接包含的头文件，也可能在清理构建或关闭 Unity Build 后失败。遇到未知符号，先确认声明所属模块和头文件，不要靠扩大包含范围掩盖问题。

## 注册一个可停靠 Tab

TabManager 管理 Tab 的生成入口。注册时给出稳定 ID 和创建回调，用户执行打开命令时才真正调用回调。下面的模块类片段展示这条链路，`RegisterMenus` 的实现放在后文。

```cpp
#include "Modules/ModuleManager.h"
#include "Framework/Docking/TabManager.h"
#include "Widgets/Docking/SDockTab.h"
#include "Widgets/Text/STextBlock.h"
#include "ToolMenus.h"

class FEditorLabModule : public IModuleInterface
{
public:
    virtual void StartupModule() override;
    virtual void ShutdownModule() override;

private:
    void RegisterMenus();
    void OpenTab();
    TSharedRef<SDockTab> SpawnTab(const FSpawnTabArgs& Args);
    TWeakPtr<SDockTab> LiveTab;
};

static const FName EditorLabTabId(TEXT("EditorLab.Main"));

void FEditorLabModule::StartupModule()
{
    FGlobalTabmanager::Get()->RegisterNomadTabSpawner(
        EditorLabTabId,
        FOnSpawnTab::CreateRaw(this, &FEditorLabModule::SpawnTab))
        .SetDisplayName(NSLOCTEXT("EditorLab", "Tab", "EditorLab"))
        .SetMenuType(ETabSpawnerMenuType::Hidden);

    UToolMenus::RegisterStartupCallback(
        FSimpleMulticastDelegate::FDelegate::CreateRaw(
            this, &FEditorLabModule::RegisterMenus));
}

void FEditorLabModule::OpenTab()
{
    FGlobalTabmanager::Get()->TryInvokeTab(EditorLabTabId);
}

TSharedRef<SDockTab> FEditorLabModule::SpawnTab(const FSpawnTabArgs&)
{
    TSharedRef<SDockTab> Tab = SNew(SDockTab)
        .TabRole(ETabRole::NomadTab)
        [ SNew(STextBlock).Text(FText::FromString(TEXT("EditorLab"))) ];
    LiveTab = Tab;
    return Tab;
}

IMPLEMENT_MODULE(FEditorLabModule, EditorLab)
```

`CreateRaw` 不拥有模块，也不会在模块销毁时自动让所有注册入口消失。这里能够使用它的前提，是模块负责在结束前解除注册。对于寿命不由模块严格控制的普通对象，应考虑共享指针委托或弱引用，而不能把这个写法无条件照搬。

窗口引用使用弱指针，是因为 TabManager 和 Slate 层级负责其正常持有；模块只需要在清理时尝试找到活跃窗口。否则一个“为了方便重用”的强引用可能让用户关掉的控件一直存在，连带保留会话和资源。

## 将入口挂到 ToolMenus

菜单回调注册后，使用 owner 为本模块创建的菜单项建立归属。这样卸载时可以按 owner 删除自己注册的内容，而不必按显示文字猜测条目。

```cpp
void FEditorLabModule::RegisterMenus()
{
    FToolMenuOwnerScoped Owner(this);
    UToolMenu* Menu = UToolMenus::Get()->ExtendMenu(
        TEXT("LevelEditor.MainMenu.Window"));
    FToolMenuSection& Section = Menu->FindOrAddSection(TEXT("EditorLab"));
    Section.AddMenuEntry(
        TEXT("OpenEditorLab"),
        NSLOCTEXT("EditorLab", "Open", "打开 EditorLab"),
        NSLOCTEXT("EditorLab", "Hint", "打开通用编辑器示例面板"),
        FSlateIcon(),
        FUIAction(FExecuteAction::CreateRaw(
            this, &FEditorLabModule::OpenTab)));
}
```

这是最小菜单入口。使用延迟的 ToolMenus 启动回调，可以避免假设“模块开始执行时，所有编辑器菜单都已经准备好”。不要在任意 Tick 中反复注册菜单；重复注册会使入口和回调难以追踪。显示文本使用本地化文本宏，内部菜单名使用稳定的 `FName`，两者不应互相替代。

对外打开操作应该复用 Tab ID。反复执行打开命令时，让 TabManager 尝试唤起已有 Tab；如果要支持多个文档窗口，则应另行定义文档身份与 Tab 实例关系，而不是每次点击都直接创建一个新 `SWindow`。

## 命令与快捷键需要一条完整路由

当入口只有一个时，直接绑定动作已经足够。一旦菜单、工具栏和快捷键要共享执行、可用状态与勾选状态，就适合引入 `TCommands` 和 `FUICommandList`。命令定义是“有什么动作”，命令列表是“这个上下文怎样执行动作”。

以下是命令类局部实现，需要包含 `Framework/Commands/Commands.h`、`Framework/Commands/UICommandList.h`、`Styling/AppStyle.h` 和 `InputCoreTypes.h`。命令类在模块启动时调用 `Register()`，关闭时调用 `Unregister()`。

```cpp
class FEditorLabCommands : public TCommands<FEditorLabCommands>
{
public:
    FEditorLabCommands()
        : TCommands(TEXT("EditorLab"),
            NSLOCTEXT("EditorLab", "Context", "EditorLab"),
            NAME_None, FAppStyle::GetAppStyleSetName()) {}

    virtual void RegisterCommands() override
    {
        // UI_COMMAND 使用当前编译单元的 LOCTEXT_NAMESPACE。
        UI_COMMAND(Open, "EditorLab", "Open EditorLab",
            EUserInterfaceActionType::Button,
            FInputChord(EModifierKey::Control | EModifierKey::Alt, EKeys::L));
    }
    TSharedPtr<FUICommandInfo> Open;
};
```

在这个类所在的编译单元定义 `LOCTEXT_NAMESPACE` 为 `"EditorLab"`，末尾取消宏定义。注册完成后，建立命令列表并将 `Open` 映射到 `OpenTab`。菜单可用带命令信息及命令列表的 `AddMenuEntryWithCommandList`。这是一种替代前面直接 `FUIAction` 的接入方式，不要同时保留两个同名菜单项。

快捷键有描述还不够，键盘事件必须到达命令列表。仅在面板内部使用的动作，可以在面板 `OnKeyDown` 中调用 `ProcessCommandBindings` 并返回处理结果；希望工具尚未打开时也能触发，就要将相同命令映射接入 LevelEditor 的全局动作列表。退出时需要 `UnmapAction`，不能遗留指向模块的执行回调。本文的最小窗口例子没有全局快捷键接线，读者扩展时应明确选择命令作用域。

## 关闭窗口与关闭模块

最小面板没有未保存数据，清理顺序可以写成下面这样。实际工具加入会话后，必须先处理正在进行的手势、异步任务和关闭条件，再释放界面。

```cpp
void FEditorLabModule::ShutdownModule()
{
    UToolMenus::UnRegisterStartupCallback(this);
    UToolMenus::UnregisterOwner(this);
    if (TSharedPtr<SDockTab> Tab = LiveTab.Pin())
    {
        Tab->RequestCloseTab();
    }
    LiveTab.Reset();
    FGlobalTabmanager::Get()->UnregisterNomadTabSpawner(EditorLabTabId);
}
```

这段清理假定相关编辑器服务仍处于可用的正常关闭阶段，也假定没有拒绝关闭的回调。允许动态卸载的复杂工具，需要进一步确保窗口已经关闭、全局委托已解除、计时器和异步结果不会再调用模块代码。如果仍有活跃对象，不能将一次 `RequestCloseTab` 当成卸载安全证明。

用户关闭带脏数据的窗口时，应提供保存、放弃或取消关闭。保存失败就继续保留会话；放弃只影响当前未保存修改；取消关闭应保持窗口可交互。模块退出期间才临时弹出一串交互式对话框通常太晚，因此平时的关闭路径就应承载这套规则。

## SDockTab 和 SWindow 怎么选

`SDockTab` 适合长期驻留的编辑面板，能够参与停靠、布局和切换。`SWindow` 适合独立辅助窗口和特定模态流程，通过 Slate Application 管理。一个按钮仅仅为了显示更多参数，通常没有必要再创建独立顶层窗口。

选择也会影响焦点、快捷键和销毁路径。顶层窗口的关闭不等于会话销毁；可停靠 Tab 的恢复可能比资源准备更早。界面应能表示“尚未准备”和“加载失败”，而不是要求任何创建时刻都已经有完整文档。

## 做一次可复现的入口实验

先在空白 C++ 工程中通过向导创建插件，让向导生成的默认窗口正常打开，再逐步替换菜单名、Tab 标识和面板内容。每次只改变一个边界：先确认模块可以加载，再确认注册回调运行，最后确认生成函数被调用。这样出现错误时，能判断是工程配置、入口注册还是面板构造，而不必从一个庞大工具中猜测。

调试日志也应按边界记录。启动和退出各记录一次，菜单注册记录一次，窗口生成与销毁分别记录。重复点击打开命令时，预期看到多次命令执行，但通常不应看到同等次数的新窗口生成。关闭后重开则应重新生成界面。若日志显示窗口销毁后仍收到面板回调，就沿事件订阅和计时器句柄检查引用来源。

快捷键实验先限制在面板焦点内。确认控件支持焦点、命令列表已经映射，并在键盘入口处理按键；再考虑接入全局动作。若全局映射成功却面板内不触发，可能是子控件先消费了事件；若只有面板内可用，则不能宣称全局入口已经接通。文本编辑框中的常见编辑快捷键尤其需要避免冲突，不应为了工具方便抢走用户正在输入的内容。

在正式编辑工具中，窗口标题可以显示当前文档名和脏标记，但 Tab 的内部标识不应随着标题改变。显示名会本地化，也可能包含重复名称；内部身份必须稳定。对于多文档工具，先建立文档键和窗口实例的映射，再设计“激活已有窗口”与“新建窗口”的行为。不要依赖比较标题字符串来判断窗口是否已经打开。

另一个常见陷阱是把编译方式当成加载方式。新增反射类型、修改模块依赖或插件描述后，需要确保对应生成、编译和模块加载都发生了；看到旧窗口仍能打开，不意味着新代码已经生效。验证应在日志或明确的新行为上确认版本，而不是反复点击一个早已存在的 Tab。关闭编辑器再完成干净编译适合排除旧实例干扰，但不应未经确认就关闭用户正在编辑的工程。

窗口关闭策略也应通过有意制造失败来检查。让保存函数返回错误，尝试关闭窗口，确认提示保留、草稿仍在且可以继续编辑；选择取消时，焦点能够回到可操作控件。若只验证成功保存路径，很容易漏掉关闭回调提前释放会话、错误提示出现后窗口仍然消失等问题。入口的职责虽然很薄，却决定了用户能否可靠地进入和离开工具。

调试结束后移除临时菜单和无关日志，保留有助于定位加载失败的诊断。示例入口应保持小而清晰，避免把临时排错命令变成无人维护的永久接口。

## 常见问题与验证步骤

菜单消失时先检查模块是否加载、启动回调是否运行以及扩展菜单名是否正确。点击后无反应，再检查注册和调用使用的 Tab ID 是否完全一致。模块卸载后崩溃，优先查全局注册与委托，而不是仅检查最后一个控件的析构函数。

验收时依次执行：打开两次并确认复用预期 Tab；关闭后重开；改变停靠位置后重启编辑器；使用菜单和快捷键触发同一动作；在窗口打开时检查模块关闭策略。加入脏数据后，再测试保存失败与取消关闭。若这些步骤尚未运行，应保留“待原生验证”的记录。

官方入口可参考 [Slate 编辑器窗口快速入门](https://dev.epicgames.com/documentation/en-us/unreal-engine/slate-editor-window-quickstart-guide-for-unreal-engine?application_version=5.3)。查找具体签名时从 `TabManager.h`、`ToolMenus.h` 和 `UICommandList.h` 开始，避免把插件向导的生成代码当成永久不变的接口契约。
