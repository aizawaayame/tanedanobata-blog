---
title: 'UE 编辑器开发 08：保存、Python 扩展与自动化验证'
slug: ue-editor-persistence-python
published: 2026-10-13
draft: true
description: 建立可校验、可回读的 JSON 保存流程，接入 SourceControl 与 Python，并用分层验证处理外部变更和异步过期结果。
tags: [UE, 编辑器开发, Python, 自动化]
category: UE
lang: zh_CN
kind: post
directory: blog/posts
route: /posts/ue-editor-persistence-python/
---

用户点下保存，界面没有报错，不足以证明工作已经安全写入。文件可能写到错误位置，也可能已经被别的工具更新；版本控制操作成功，更不代表文件内容正确。保存需要一条能解释成功与失败的链路，脚本入口则应该复用这条链路。

<!-- more -->

[系列导读](/posts/ue-editor-roadmap/) · 上一篇：[时间驱动与播放](/posts/ue-editor-preview-playback/) · 本篇为系列最后一篇。

> [!NOTE]
> 基线为 UE 5.3。代码为局部实现，保存状态机中另行标出的部分是伪代码。没有执行真实版本控制写入、Python 插件编译或 UE 自动化测试；文末提供对应验收方法。

## 先规定什么叫保存成功

EditorLab 保存一份 JSON 文档，包含版本号、稳定节点 ID 和有限的时间数值。选择、滚动位置、预览组件和历史栈不属于可保存内容。本文版本为 1，读取未知版本时报告不支持，不猜测字段含义，也不静默丢弃不认识的数据再覆盖原文件。

成功必须满足：内存数据有效，目标来源仍与加载时一致，目标可写，写入完成，从目标重新读取的数据与预期文档语义一致。完成这些步骤后才更新保存基线。这里采用同步保存，活动手势和其他文档写操作在保存期间不可进入。

序列化成功、文件写入成功和业务保存成功是三个不同结果。序列化只说明生成了文本；写入只说明文件接口返回成功；回读还要验证编码、版本、必需字段和内容。日志应该能够区分失败发生在哪一层。

## JSON 结构与类型约束

下面是教学格式，ID 使用字符串，时间使用秒。不要把超过 JSON 精确整数范围的标识无条件写成 double；稳定 UUID 字符串更适合这个例子。

```json
{
  "version": 1,
  "items": [
    {
      "id": "5a08ced2-370d-4b80-a29e-3602d9f8a104",
      "label": "Node A",
      "startSeconds": 0.0,
      "durationSeconds": 1.5
    }
  ]
}
```

时间必须有限，开始时间非负，时长为正，ID 不重复。读取时对字段缺失、类型错误、非法数值分别报出清晰位置，例如第几个元素的哪个字段有问题。避免给缺失字段补一个零后继续保存，那会把原本可发现的错误变成合法但错误的内容。

序列化使用 `Json` 模块中的 `FJsonObject`、`FJsonValue`、`FJsonSerializer` 与读写器；若确实使用结构体自动转换，再引入 `JsonUtilities`。文件读写依赖 Core 的 `Misc/FileHelper.h` 和 `Misc/Paths.h`。无需为一个简单文档引入额外的配置框架。

以下为构造根对象与生成文本的局部示例，`Items` 是已经完成逐项校验的 JSON 值数组，实际逐项编码使用上面的固定字段。

```cpp
#include "Dom/JsonObject.h"
#include "Serialization/JsonSerializer.h"
#include "Serialization/JsonWriter.h"
#include "Misc/FileHelper.h"

TSharedRef<FJsonObject> Root = MakeShared<FJsonObject>();
Root->SetNumberField(TEXT("version"), 1);
Root->SetArrayField(TEXT("items"), Items);
FString Text;
TSharedRef<TJsonWriter<>> Writer = TJsonWriterFactory<>::Create(&Text);
const bool bEncoded = FJsonSerializer::Serialize(Root, Writer);
// bEncoded 为 true 只表示文本编码完成，尚未写入任何目标文件。
```

读取时优先使用可返回失败的字段访问接口，再进行语义校验。写入排序按稳定 ID 或文档明确顺序执行，使相同内容生成稳定文本，减少版本控制里的无意义差异。数组顺序若本身有意义，就不能为了排序好看而改变它。

## 保存前检查外部变更

加载文档时记录源文件是否存在及其内容摘要。保存前重新读取目标并比较。如果其他程序改动了文件，即使本地草稿没有冲突字段，当前示例也停止保存并报告外部变更，由用户选择重新加载或另存为。不要未经合并就覆盖新版本。

时间戳只能作为快速提示，不能证明内容一致。文件系统时间精度、复制工具和恢复操作都可能使它不可靠。内容摘要更适合识别字节变化；语义摘要则适合比较文档内容，但两者职责不同：前者保护来源，后者判断保存基线与脏状态。

保存前检查与最终替换之间仍存在竞争窗口。单纯检查一次摘要不是跨进程事务。本文假设这是单用户本地编辑工具，明确报告这一限制；若需要多个程序同时写入同一文件，就必须引入协作锁或带版本条件的存储接口，而不是声称多查一次文件就保证并发安全。

## 临时文件、目标替换与回读

下面是保存状态机伪代码。其中每行都是需要实现的步骤，不是 UE 自带函数名。失败时返回阶段和原因，不把完整流程压成一个无法定位错误的 false。

```text
确认没有活动手势，并取得本次保存的稳定文档
校验文档，编码为确定的 JSON 文本
检查目标文件来源、目录和写权限
如启用版本控制，确认状态并按策略取得写权限
在目标同目录写入本次唯一临时文件
读取临时文件，解析并核对预期内容
再次确认目标来源未变化，再替换目标
从目标路径回读，解析并核对内容
如有必要，对新文件执行加入版本控制并记录结果
更新实际磁盘摘要和成功保存的内容基线
```

临时文件应位于目标同目录，以减少跨文件系统移动带来的不同语义，并使用唯一名称避免覆盖另一次操作。用 `FFileHelper::SaveStringToFile` 时明确采用 UTF-8 编码。临时文件写完后再替换目标，可以降低直接截断目标后写入失败的风险，但不能把所有平台的 Move 操作都描述为具有同样的原子与耐久性保证。

若替换失败，保留原目标，报告临时文件处理结果；若目标已经替换而最终回读失败，则报告“目标可能已更新，验证失败”，保留本地脏状态，下一次重试先重新观察磁盘。不能继续拿旧摘要直接覆盖，也不能自动假装回滚成功。

本文只保存一个文档。未来拆成多个文件时，需要承认某些文件可能已经成功写入。逐个执行文件操作不是跨文件事务；结果应列出已完成与失败阶段。不要在失败提示后把全部内容标为未写入，让下一次重试重复创建资源。

## SourceControl 是外部能力

UE 的 SourceControl 模块提供 provider 抽象，工具通过它查询状态和执行操作，不应假定所有用户都使用同一种系统。需要包含 `ISourceControlModule.h`、`ISourceControlProvider.h` 和 `SourceControlOperations.h`；常用辅助函数位于 `SourceControlHelpers.h`。

先区分源代码管理未启用、provider 不可用、文件未纳入管理和文件可写等状态。不同 provider 对 checkout、add 和锁定的语义不同，不应对所有文件盲目执行同一个操作。未启用版本控制时，EditorLab 仍可进行普通本地保存，但要如实显示当前没有版本控制协作保障。

如果启用，则在覆盖已跟踪文件前检查 provider 状态并取得所需写权限。新文件一般先成功写出，再按 provider 契约加入管理。加入失败时，“文件已写入”和“版本控制登记失败”必须分别显示；用户的内容不能因为第二步失败而被隐藏。

不要自动提交仓库，也不要为了让保存通过而把只读文件强行改为可写。SourceControl 成功返回只证明对应操作成功，仍需完成文件回读。同步 provider 调用可能阻塞 UI，正式工具应在忙碌状态中给出进度，避免用户重复点击触发并行保存。

## Python 入口复用已定义的能力

Python 适合批处理、检查和编辑器工作流编排。它应调用小而明确的工具接口，不直接操作 Slate 私有成员，也不复制一套输入校验。本文仅暴露无副作用的参数检查，帮助理解反射与 Python 的连接。

先启用 Python Editor Script Plugin。普通反射函数暴露不需要 C++ 直接调用 Python 模块；只有 C++ 需要执行 Python 脚本时才根据实际接口加入 `PythonScriptPlugin` 依赖。头文件使用 `Kismet/BlueprintFunctionLibrary.h`，示例类放在 Editor 模块中。

```cpp
// EditorLabLibrary.h：局部反射类声明。
#include "CoreMinimal.h"
#include "Kismet/BlueprintFunctionLibrary.h"
#include "EditorLabLibrary.generated.h"

UCLASS()
class UEditorLabLibrary : public UBlueprintFunctionLibrary
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintCallable, Category="EditorLab")
    static bool IsValidTimeRange(double StartSeconds, double DurationSeconds);
};

// EditorLabLibrary.cpp：函数实现。
bool UEditorLabLibrary::IsValidTimeRange(double StartSeconds, double DurationSeconds)
{
    return FMath::IsFinite(StartSeconds) && FMath::IsFinite(DurationSeconds)
        && StartSeconds >= 0.0 && DurationSeconds > 0.0;
}
```

重新编译并确认模块加载后，在编辑器 Python 环境调用：

```python
import unreal

assert unreal.EditorLabLibrary.is_valid_time_range(0.0, 1.5)
assert not unreal.EditorLabLibrary.is_valid_time_range(0.0, -1.0)
assert not unreal.EditorLabLibrary.is_valid_time_range(float("nan"), 1.0)
```

Python 中名称会按反射绑定规则转换；未出现接口时检查插件启用、模块加载、UHT 结果和 Python 生成信息，而不是直接猜另一个方法名。新增反射声明后，仅靠已有会话中的旧模块不一定能观察到新类型，应按目标开发环境完成正确编译与加载。

## 编辑器环境和线程边界

Python Editor Script Plugin 面向编辑器脚本，不是打包游戏里的通用脚本运行时。PIE 运行时即使编辑器仍在，也不能据此把脚本当成游戏逻辑系统。要操作哪个世界，仍必须显式选择与校验；本文不提供运行时 Python 能力。

UObject、Slate 和大多数编辑器操作应在游戏线程执行。耗时的纯数据计算可以放到后台，但应先复制不含活跃 UObject 访问的输入，再把结果送回游戏线程应用。不要在后台线程持有一个 UObject 裸指针并读取它的字段，以为“只是读取”就天然安全。

Python 调用改变文档时，同样进入会话操作入口：检查忙碌状态、验证参数、产生历史、更新版本。脚本不应绕过保存来源检查，也不应在异常后留下半个活动手势。返回值用明确的数据和错误说明，供批处理决定是否停止。

## 取消与迟到结果

后台操作启动时记录请求代次、文档身份和输入版本。取消时先使该代次失效；完成回调回到游戏线程后，检查会话仍存在、文档仍是同一份、输入版本仍匹配且请求未取消，然后才应用。

取消不一定立即终止后台计算，但必须阻止过期结果修改当前会话。仅用一个全局 `bCancelled` 容易在新任务开始时被重置，让旧任务误以为自己有效；请求 ID 或递增代次能区分新旧操作。关闭窗口也应撤销它拥有的请求，不能让结果回调重新打开一个已经关闭的工具。

保存涉及外部写入，更不能把忽略回调当成撤销写入。如果后台阶段已经写入文件，取消结果应说明实际进度。本文使用同步文档保存，将异步限定为纯检查或准备过程，避免示例引入不必要的写入状态组合。

## 让错误结果可以被用户处理

保存提示至少说明失败阶段、目标文档和当前内容是否可能已经写入。对于来源冲突，提供重新加载或另存为；对于权限错误，保留草稿并允许用户修正环境后重试；对于写入后回读失败，先重新观察目标，不能直接重复覆盖。提示应使用用户理解的操作名称，同时在日志保留底层错误，避免把一长串 provider 信息当作唯一反馈。

## 分层自动化与故障注入

模型层测试非法时间、重复 ID、序列化回读和语义相等；历史层测试取消、撤销与保存基线；文件层用临时目录测试外部修改、目标只读、写入失败和回读失败；界面层检查按钮状态、错误提示与重开恢复。测试写入只能使用专门临时目录，不以真实内容目录作为失败实验场地。

UE Automation 的纯参数检查可以使用 `Misc/AutomationTest.h` 中的简单自动化测试入口，但相关模块必须先成功编译。文件失败注入可以通过一个窄的存储适配接口控制特定阶段失败，不应改动引擎全局文件行为。真实 provider 的授权、网络和 checkout 则需要独立集成验证，模拟成功不能代替它。

完整验收链是修改、保存、关闭、从磁盘重新加载并比较结果，再重复一次外部变更冲突和失败重试。Python 验收要实际导入并调用反射接口；线程与取消验收要让旧请求在新请求之后完成，确认不会回写。公开边界见 [Epic Python 编辑器脚本指南](https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-the-unreal-editor-using-python?application_version=5.3)，具体 provider 接口以目标版本 SourceControl 头文件为准。

完成这条链路后，工具的入口、界面、数据、预览和保存才形成可以逐层验证的整体。返回[系列导读](/posts/ue-editor-roadmap/)可查看各篇对应的职责和阅读路径。
