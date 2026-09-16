---
title: C++中调用蓝图函数
slug: note-eb13af2e8ac9
published: 2025-05-09
draft: false
description: ''
tags: []
category: UE
lang: zh_CN
kind: note
directory: UE/Core/反射
route: /UE/Core/反射/C++中调用蓝图函数/
---

## BlueprintImplementableEvent and BlueprintNativeEvent

这是在类定义时预先建立C++和蓝图间接口的方法，也是最常用的方式

```cpp
// 在头文件中声明函数
UCLASS()
class MYGAME_API AMyActor : public AActor
{
    GENERATED_BODY()
public:
    // 纯蓝图实现事件 - 没有C++定义
    UFUNCTION(BlueprintImplementableEvent, Category="MyGame")
    void OnBlueprintEvent(int32 Value, const FString& Message);
    
    // 带默认C++实现的蓝图事件
    UFUNCTION(BlueprintNativeEvent, Category="MyGame")
    float CalculateValue(float BaseValue);
    
    // 调用函数示例
    void CallBlueprintFunctions();
};
```

## Interface

使用接口是一种更灵活的方法，特别适用于不同类型对象间的通信。
```cpp
// 定义接口
UINTERFACE(BlueprintType)
class MYGAME_API UMyInterface : public UInterface
{
    GENERATED_BODY()
};

class MYGAME_API IMyInterface
{
    GENERATED_BODY()
public:
    UFUNCTION(BlueprintCallable, BlueprintImplementableEvent)
    void OnInteract(AActor* Instigator);
    
    UFUNCTION(BlueprintCallable, BlueprintNativeEvent)
    bool CanInteract() const;
};

// 实现接口的默认C++方法
bool IMyInterface::CanInteract_Implementation() const
{
    return true;
}

// 在C++中调用接口方法
void AMyActor::InteractWithObject(AActor* TargetActor)
{
    if (TargetActor->GetClass()->ImplementsInterface(UMyInterface::StaticClass()))
    {
        // 检查是否可以交互
        if (IMyInterface::Execute_CanInteract(TargetActor))
        {
            // 调用蓝图实现的方法
            IMyInterface::Execute_OnInteract(TargetActor, this);
        }
    }
}
```

## Delegate

使用动态委托将蓝图函数绑定到C++定义的事件。

```cpp
UCLASS()
class MYGAME_API AMyActor : public AActor
{
    GENERATED_BODY()
public:
    // 声明动态多播委托
    UPROPERTY(BlueprintAssignable, Category="Events")
    FOnCustomEventSignature OnCustomEvent;
    
    // 声明动态委托
    UPROPERTY(BlueprintAssignable, Category="Events")
    FOnCalculateValueSignature OnCalculateValue;
    
    // 触发事件
    void TriggerEvents();
};

// 在CPP中实现
void AMyActor::TriggerEvents()
{
    // 广播多播委托
    OnCustomEvent.Broadcast(42, TEXT("Event triggered"));
    
    // 执行委托并获取结果
    if (OnCalculateValue.IsBound())
    {
        float Result = OnCalculateValue.Execute(100.0f);
    }
}
```

## Reflection

核心是 `FindFunction` 拿到函数指针，然后通过 `ProcessEvent` 接口调用相关函数。
```cpp
// 获取蓝图类实例
AActor* BlueprintActor = /* 获取BP实例的引用 */;

// 方法1: 使用ProcessEvent直接调用
FName FunctionName = "BlueprintFunction";
BlueprintActor->ProcessEvent(BlueprintActor->FindFunction(FunctionName), &Params);

// 方法2: 使用ExecuteUbergraph (仅限事件图表入口点)
BlueprintActor->ExecuteUbergraph(/* 图表入口点索引 */);

// 方法3: 推荐方式 - 使用InvokeFunction模板函数
FOutputParams Result;
UFunction* Function = BlueprintActor->FindFunction(TEXT("MyBlueprintFunction"));
if (Function)
{
    struct
    {
        float InParam1;
        FString InParam2;
        int32 ReturnValue;
    } Params;
    
    Params.InParam1 = 10.0f;
    Params.InParam2 = TEXT("Hello");
    
    BlueprintActor->ProcessEvent(Function, &Params);
    int32 ReturnValue = Params.ReturnValue;
}
```
