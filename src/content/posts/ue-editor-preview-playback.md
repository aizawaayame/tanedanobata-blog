---
title: 'UE 编辑器开发 07：时间驱动、动画采样与音频预览'
slug: ue-editor-preview-playback
published: 2026-10-13
draft: true
description: 为编辑器预览建立明确时间模型，区分播放与定位，处理动画刷新、声音偏移、慢帧跨段和资源失效。
tags: [UE, 编辑器开发, 动画, 音频]
category: UE
lang: zh_CN
kind: post
directory: blog/posts
route: /posts/ue-editor-preview-playback/
---

画面在第 2 秒，声音从第 0 秒开始，通常不是把 Tick 写得更频繁就能修复。编辑器预览需要明确的主时间、片段映射和跳转规则；只有知道当前时间来自哪里，才能让各个输出读取同一个目标。

<!-- more -->

[系列导读](/posts/ue-editor-roadmap/) · 上一篇：[预览视口](/posts/ue-editor-preview-viewport/) · 下一篇：[保存与 Python](/posts/ue-editor-persistence-python/)

> [!NOTE]
> 本文采用 UE 5.3 的标准动画和音频接口，代码是未经过 UE 编译及音画验收的局部实现。普通预览不承诺样本级同步，也不依赖特定角色动画系统。

## 定义一条可预测的时间线

EditorLab 的预览由一组按开始时间排序、互不重叠的片段组成。每个片段有时间范围，以及可选的动画和声音资源。总时间使用 double 秒，资源采样时再转换到对应接口类型。片段区间左闭右开，时间线终点是单独的完成状态。

允许片段之间存在空隙。空隙内不播放声音，视觉回到示例约定的参考状态。这样“保持上一帧”和“没有有效片段”不会混为一谈。若某个工具希望空隙保持上一姿态，也应明确设计，而不是由最后一次更新偶然决定。

文档编辑完成后生成一份预览输入快照。播放期间读取快照，不直接遍历仍在变化的编辑数组。文档相关内容变化时暂停并标记预览需要重新准备；只改变浏览选择则不必使预览失效。

## 状态机先于 Tick

采用 `Unloaded`、`Paused`、`Playing` 和 `Error` 四种状态。准备成功进入 Paused；Play 从当前时间开始；Pause 保留时间；Stop 回到零并停止声音；Seek 校验目标时间后更新采样，默认保持暂停。到达终点则停在末端显示状态，不自动循环。

这套规则使时间轴定位容易理解：拖动游标先暂停，每次移动只采样；松开不会突然出声。想继续播放时用户显式按 Play。若需要定位时短暂试听，应该作为独立功能加入，而不是在每个 Seek 隐式触发音频。

![播放、暂停与定位共享目标时间，跳转走不连续求值并重置音频](/images/ue-editor-series/playback-clock.svg)

错误状态包含无法继续的准备失败或资源失效。无音频设备可以只禁用声音并显示提示，不一定阻止纯视觉预览；动画资源不兼容则不能伪装成成功播放。失败分类应依据功能是否仍成立，而不是所有问题都统一返回一个布尔值。

## 使用单调时钟计算实际经过时间

`FPlatformTime::Seconds()` 适合测量经过时间。不能用“每次 Tick 加固定的 1/60 秒”，因为编辑器负载、后台窗口和调试暂停都会改变实际帧间隔。下面是播放器的时间推进核心，字段属于示例类，不是引擎播放器。

```cpp
#include "HAL/PlatformTime.h"

struct FEditorLabClock
{
    double Time = 0;
    double Duration = 0;
    double LastNow = 0;
    bool bPlaying = false;

    void Play()
    {
        if (Duration <= 0) return;
        if (Time >= Duration) Time = 0;
        LastNow = FPlatformTime::Seconds();
        bPlaying = true;
    }
    void Pause() { bPlaying = false; }
    void Seek(double Target)
    {
        if (!FMath::IsFinite(Target)) return;
        Time = FMath::Clamp(Target, 0.0, Duration);
        LastNow = FPlatformTime::Seconds();
    }
    double Tick()
    {
        if (!bPlaying) return 0;
        const double Now = FPlatformTime::Seconds();
        const double Delta = FMath::Max(0.0, Now - LastNow);
        LastNow = Now;
        const double Before = Time;
        Time = FMath::Min(Time + Delta, Duration);
        if (Time >= Duration) bPlaying = false;
        return Time - Before;
    }
};
```

这里的 Seek 只负责时钟，外层控制器按本文规则先 Pause，再停止旧音频并执行不连续求值。Duration 必须在准备阶段校验为有限非负值。恢复播放时重置 `LastNow`，否则暂停期间经过的时间会在第一帧全部累加进去。

调试停顿后跳过一大段，是按真实时间推进的自然结果。本文保留真实时间，并直接采样新的目标位置，不把大间隔悄悄裁成很小的 Delta。若产品希望失焦自动暂停，应在失焦事件显式改变状态，避免用不透明的时钟截断规则掩盖行为。

## 慢帧可能跨过多个片段

当前时间从 1.8 秒跳到 4.3 秒时，可能跨过不止一个片段。不能只写“超过当前结束就切到下一个”，因为下一段也可能已经结束。应根据最终目标时间重新查找所属区间，数据量较大时使用二分查找。

局部时间为目标时间减去片段开始时间，资源偏移再在此基础上计算。刚进入片段时如果局部时间已经是 0.7 秒，动画和声音都应以这个偏移为目标，而不是一个从 0.7 秒采样、另一个从零开始。

跳过的片段不补播声音，也不逐一触发游戏事件。编辑器浏览采样与运行时事件执行不是同一任务。若工具需要预览事件，应定义专门的编辑器安全事件范围，不能通过追赶所有 Notify 来模拟完整游戏逻辑。

## 动画时间设置与姿态刷新

依赖 `Engine`；主要头文件包括 `Components/SkeletalMeshComponent.h`、`Animation/AnimSingleNodeInstance.h` 和 `Animation/AnimSequence.h`。示例使用标准单节点动画预览：组件有兼容的骨骼网格与动画资源，注册在预览场景中，自动组件 Tick 关闭，由控制器统一驱动。

```cpp
// 准备阶段局部实现：Component 已注册，Sequence 已检查 Skeleton 兼容性。
Component->SetComponentTickEnabled(false);
Component->SetAnimationMode(EAnimationMode::AnimationSingleNode);
Component->SetAnimation(Sequence);
if (UAnimSingleNodeInstance* Instance = Component->GetSingleNodeInstance())
{
    Instance->SetPlaying(false);
}

// 定位或暂停刷新路径；LocalSeconds 已按资源长度约束。
if (UAnimSingleNodeInstance* Instance = Component->GetSingleNodeInstance())
{
    Instance->SetPosition(LocalSeconds, false); // 拖动定位不触发 Notify。
    Component->TickAnimation(0.f, false);
    Component->RefreshBoneTransforms();
    Component->UpdateComponentToWorld();
    Component->MarkRenderTransformDirty();
    Component->MarkRenderDynamicDataDirty();
}
```

这段路径只说明标准单节点绝对时间采样。`SetPosition` 并不意味着所有渲染、附属组件和复杂动画系统都已刷新。实际组件配置、可见性更新策略、后处理动画、并行求值和引擎版本都会影响细节，必须在目标环境观察最终骨骼与画面。

暂停时视觉应该保留当前姿态，而不是切回参考姿势。对纯时间采样可以用零增量重新刷新；对布料、物理和依赖历史的模拟，零增量并不能重建过去的状态。本文不声称能通过一次 Seek 恢复任意模拟，需要这些能力时必须设计重置、预热或缓存策略。

## 避免双重驱动与累计漂移

如果组件自动 Tick 同时推进动画，而控制器每帧又设置目标时间，就出现两个时间来源。画面可能抖动，暂停可能仍然变化，通知也可能触发两次。应明确由谁推进时间，其他层只采样和刷新。

本文每帧根据主时间算出资源位置，所以标准动画不会靠不断累加小 Delta 漂移。相机或基础对象运动也应采用同样的绝对时间采样。依赖历史的节点则另行管理，不要把所有求值都包装成一个不解释副作用的“更新场景”。

动态编译临时 AnimBlueprint、实现自定义 AnimGraph 节点都属于更高级的扩展。它们会增加编译、缓存、GC 和线程边界，不是展示标准动画的必要前提。本篇不引入这些路径，以便读者先验证单一时间源。

## 音频不是每帧可以重新采样的图片

`UAudioComponent::Play(float StartTime)` 提供起始时间参数，但实际定位能力受声音类型、压缩格式、流式加载、资源设置和平台影响。存在这个参数，不代表所有资源都可以样本级准确地跳到任意位置。需要使用目标资源和设备验证。

普通预览的基本策略是：开始播放或切换片段时设置声音，并从当前局部偏移调用一次 Play；连续播放时让音频系统运行；暂停或 Seek 时停止旧声音；恢复时根据主时间重新启动。暂停通过停止和重新定位实现是本文的简化约定，不等同于设备原生保留解码状态的暂停。

```cpp
#include "Components/AudioComponent.h"

// 切换或恢复时执行一次；声音和偏移由当前有效片段计算。
Audio->Stop();
Audio->SetSound(CurrentSound);
Audio->Play(static_cast<float>(LocalSeconds));

// 连续 Tick 不再反复调用 Play；结束、取消和定位时停止旧实例。
```

音频组件必须有明确的注册环境、有效设备和持有关系。预览场景需要允许音频播放，但这一开关本身不能保证所有设备条件成立。关闭窗口时要停止声音；资源释放与组件解绑也要在对应场景仍然有效时完成。

## 同一主时间不等于样本级同步

编辑器主线程与音频渲染线程拥有不同的调度。游戏线程发出播放命令到设备实际输出存在延迟，帧率变化也会影响发命令的时刻。主时间模型让行为一致且可诊断，但不会消除硬件与缓冲延迟。

不要每帧 Stop/Play 来“校正”声音，这会造成反复起音和中断。对普通浏览预览，先验证延迟是否在可接受范围；需要音乐节拍或精确调度时，再研究 Quartz 等音频时钟机制及具体资源能力。两种需求的验收标准不同，不能用“听起来差不多”证明精确同步。

相同声音片段内仅改变视角时，声音应连续；真正的时间跳转、片段切换和资源变化才重新定位。用稳定片段 ID 与播放代次区分这些事件，比在每帧比较指针更可靠。异步加载完成后也必须检查它是否仍属于当前代次，避免旧声音突然启动。

## 用可观察标记验证时间模型

测试资源应该包含明显的时间标记，例如在第一秒抬起基础骨骼、第二秒放下，并在相应位置加入短促声音。先单独验证动画定位，再单独验证音频起点，最后检查二者同时播放。若直接使用长而连续的动作与背景声音，人很难判断偏差来自资源本身、主时间映射还是设备延迟。

记录目标时间、片段 ID、局部时间和音频启动次数，能够发现很多肉眼不容易定位的问题。连续播放同一片段时，音频启动次数应保持不变；拖动游标期间不应持续增加；跨越片段时只启动最终有效片段。这个计数比“这一帧听到了声音”更能验证控制器的行为边界，但仍不能代替实际输出检查。

循环是一个独立功能，不要用到达终点后直接把时间设为零来草率加入。循环还涉及声音重启、动画不连续状态、根运动和边界事件。本文默认不循环，因此终点行为可以明确测试。未来增加循环时，应先定义区间边界和重新进入规则，再扩展状态机及资源处理。

播放速度同样如此。把主时间增量乘二，并不能保证声音以两倍速度且音高符合预期。音频播放速度、音高与时间伸缩是不同能力，依赖具体资源和处理路径。本篇保持正常速度，避免把一个数学上的倍率变量描述为完整的多媒体变速方案。

最后检查准备快照与文档版本。当用户修改片段长度后，旧播放器仍然可能持有原来的总时长。界面应显示需要重新准备，并阻止继续使用过期输入，而不是一边显示新刻度一边播放旧序列。只改变列表选择则不应触发这种失效，这再次体现了浏览、编辑和播放状态分离的价值。

## 验证和故障定位

准备带明显瞬态声音和清晰动作标记的测试资源，检查从零播放、句中开始、暂停恢复、连续拖动、跨多个片段的慢帧、空隙、到达终点和重播。禁用音频设备时确认视觉仍按约定工作；删除或替换资源时确认旧实例被停止。

声音从头开始时查启动偏移与资源定位支持；暂停仍有动作时查双重 Tick；跨段不同步时查最终区间选择；关闭后仍有声音时查组件所有权。最终需要真实视口与扬声器或录制证据，时间变量正确并不能代替画面和声音验证。

公开接口可参考 [UAudioComponent](https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/UAudioComponent?application_version=5.3) 以及目标版本的 `AnimSingleNodeInstance.h`、`SkeletalMeshComponent.h`。本文状态机和跨段策略是示例约定，不是引擎自动提供的同步保证。
