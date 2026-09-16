---
title: TArray
slug: note-f4af4f3a1819
published: 2025-04-25
draft: false
description: ''
tags: []
category: UE
lang: zh_CN
kind: note
directory: UE/Core/容器
route: /UE/Core/容器/TArray/
---

## 概述

###  TArray是值类型

`TArray` 是一种值类型，**不要** 使用 `new` 和 `delete` 创建和销毁 `TArray` 实例。


<details>
<summary>quote</summary>

`TArray` is a value type, meaning that it should be treated similarly as any other built-in type, like `int32` or `float`. It is not designed to be extended, and creating or destroying `TArray` instances with `new` and `delete` is not a recommended practice. The elements are also value types, and the array owns them. Destruction of a `TArray` will result in the destruction of any elements it still contains. Creating a TArray variable from another will copy its elements into the new variable; there is no shared state.


</details>

## 基础接口

###  创建

```cpp
TArray<int32> IntArray;
```

这将创建一个空数组，用于保存整数序列。元素类型可以是任何值类型，这些类型可以根据常规 C++ 值规则进行复制和销毁，例如 int32 、 FString 、 TSharedPtr 等。由于未指定分配器，因此 TArray 将使用默认的基于堆的分配器。此时，尚未分配任何内存。


###  填充

核心有两个系列 `Emplace` 和 `Add`。

####  Emplace

```cpp
template <typename... ArgsType>  
FORCEINLINE SizeType Emplace(ArgsType&&... Args)  
{  
    const SizeType Index = AddUninitialized();  
    new(GetData() + Index) ElementType(Forward<ArgsType>(Args)...);  
    return Index;  
}
```

根据传入参数，创建一个新的实例。

####  Add


**左值**

```cpp  
FORCEINLINE SizeType Add(const ElementType& Item)  
{  
    CheckAddress(&Item);  
    return Emplace(Item);  
}  
```  


**右值**

```cpp  
FORCEINLINE SizeType Add(ElementType&& Item)  
{  
    CheckAddress(&Item);  
    return Emplace(MoveTempIfPossible(Item));  
}  
```


接口最终还是会调用到 `Emplace`，可以注意到，这个过程中会调用拷贝构造函数或移动构造函数，存在可能的开销。

###  删除

#### 触发重排(Shuffling)

包含 `Remove`，`RemoveSingle`，`RemoveAt`，`RemoveAll` 接口。

1. 保持数组中其余元素的原始顺序。

2. 移动被删除位置后的所有元素来填补空缺。

#### 不触发重排(Non-shuffling)

包含 `RemoveSwap`，`RemoveAtSwap`，`RemoveAllSwap` 接口。

1. 不保持数组中其余元素的原始顺序。

2. 用数组末尾的元素来填充被删除的位置

#### 清空所有内容

`Empty` 接口能直接清空所有元素。

###  迭代


**for**

```cpp  
FString JoinedStr;  
for (auto& Str : StrArr)  
{  
    JoinedStr += Str;  
    JoinedStr += TEXT(" ");  
}  
// JoinedStr == "Hello Brave World of Tomorrow ! "  
```



**读写迭代器**

```cpp  
for (auto It = StrArr.CreateConstIterator(); It; ++It)  
{  
    JoinedStr += *It;  
    JoinedStr += TEXT(" ");  
}  
```



**只读迭代器**

``` cpp  
for (auto It = StrArr.CreateIterator(); It; ++It)  
{  
    JoinedStr += *It;  
    JoinedStr += TEXT(" ");  
}  
```


###  查询

####  Num

```cpp
FORCEINLINE SizeType Num() const  
{  
    return ArrayNum;  
}
```

####  GetData

```cpp
FORCEINLINE ElementType* GetData() UE_LIFETIMEBOUND  
{  
    return (ElementType*)AllocatorInstance.GetAllocation();  
}
```

获取数组的原始指针，此指针仅在数组存在期间以及对数组进行任何修改操作之前有效。


<details>
<summary>quote</summary>

If you need direct access to the array memory, perhaps for interoperability with a C-style API, you can use the `GetData` function to return a pointer to the elements in the array. This pointer is only valid as long as the array exists and before any mutating operations are made to the array. Only the first `Num` indices from the `StrPtr` are dereferenceable


</details>

####  IsValidIndex

```cpp
FORCEINLINE bool IsValidIndex(SizeType Index) const  
{  
    return Index >= 0 && Index < ArrayNum;  
}
```

####  Contains

包含 `Contains` 和 `ContainsByPredicate`，检查特定元素是否存在。

####  Find和IndexOf系列

查找特定元素。具体可见源码。遇到坑再记录。

####  Filter系列

函数检索与特定谓词匹配的元素数组。
