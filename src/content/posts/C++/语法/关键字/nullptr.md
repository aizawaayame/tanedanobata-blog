---
title: nullptr
slug: note-e1b35c3eb454
published: 2025-04-10
draft: false
description: ''
tags: []
category: C++
lang: zh_CN
kind: note
directory: C++/语法/关键字
route: /C++/语法/关键字/nullptr/
---

在 C++11 之前，使用 `NULL` 来表示空指针。`NULL` 在模版匹配和重载函数匹配语义不清晰，而 `nullptr` 具有更加确定和清晰的语义。

`nullptr` 是 c 11 中引入的新关键字，专门表示空指针，且具有特殊的类型 `nullptr_t`。  
    1. `nullptr_t` 是一个类型，`nullptr` 是一个实例。  
    2. `nullptr_t` 并不是指针类型，但能隐式转换为任意指针类型。  
    3. `nullptr_t` 能和指针类型进行关系运算。  
<br/>

```cpp title="MSVC中NULL定义"
#ifndef NULL  
    #ifdef __cplusplus        
        #define NULL 0  
    #else  
        #define NULL ((void *)0)  
    #endif  
#endif
```



1. cpp 中 `void*` 类型不能隐式转换成其他的类型指针。`int* p = (void*)0` 在 cpp 中是非法的。

2. cpp 中 `0` 或 `NULL` 是能隐式转换成指针类型的。`int* p = NULL` 和 `int* p = 0` 是合法的。

3. cpp 中认为一个指针变量为 0 时为空指针。  

MSVC 中如果存在函数 `f(int)` 和重载版本 `f(int*)`，那么 `NULL` 会被匹配到 `f(int)`，而 `int* p = NULL` 会被匹配到 `f(int*)`。




> [!NOTE]
> **Difference**
> 
> 
> - `nullptr`
> 
>     ---
> 
>     模版推导中，`nullptr` 会被推导为 `nullptr_t` 类型。且可隐式转换为指针类型。
> 
> - `NULL`
> 
>     ---
> 
>     模版推导中，`NULL` 会被推导为 `int` 类型。作为 `int` 类型，可以隐式转换为指针类型。
>
