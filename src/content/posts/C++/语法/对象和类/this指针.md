---
title: this指针
slug: note-429321393054
published: 2025-04-11
draft: false
description: ''
tags: []
category: C++
lang: zh_CN
kind: note
directory: C++/语法/对象和类
route: /C++/语法/对象和类/this指针/
---

当类的成员函数被调用时，`this` 指针会被自动传递给该函数。

`this` 指针的类型是 `const Type* const`，它是一个只读指针，指向当前对象。

不能修改 `this` 指针的值，但可以通过 `this` 访问对象的成员。

## 空指针调用


**空指针调用不访问this的成员函数**

```cpp
#include<iostream>
using namespace std;

class A {
public:
    void Print() {
        cout << "A::Print()" << endl;
    }
private:
    int _a;
};

int main() {
    A* p = nullptr;
    p->Print();  // 能否正常运行？
    return 0;
}
```

<div class="external-embed" data-pagefind-ignore><button type="button" data-embed-src="https://godbolt.org/e?readOnly=true&amp;hideEditorToolbars=true#g:!((g:!((g:!((h:codeEditor,i:(filename:">点击加载交互代码示例</button><a href="https://godbolt.org/e?readOnly=true&amp;hideEditorToolbars=true#g:!((g:!((g:!((h:codeEditor,i:(filename:" target="_blank" rel="noopener noreferrer">在原网站打开</a></div>


1. 当调用 `p->Print()` 时，`this` 指针实际上等于 `nullptr`，但由于 `Print()` 函数没有访问任何成员变量，因此C++允许这个调用。

2. `this` 指针是隐含的，虽然在函数内部会传递 `this`，但是如果成员函数不访问任何成员变量，C++不需要解引用这个空指针，因此不会出现空指针访问的错误。


**空指针调用访问this的成员函数**

```cpp
#include<iostream>
using namespace std;

class A {
public:
    void Print() {
        cout << "A::Print()" << endl;
        cout << _a << endl;
    }
private:
    int _a;
};

int main() {
    A* p = nullptr;
    p->Print();  // 能否正常运行？
    return 0;
}
```

<div class="external-embed" data-pagefind-ignore><button type="button" data-embed-src="https://godbolt.org/e?readOnly=true&amp;hideEditorToolbars=true#g:!((g:!((g:!((h:codeEditor,i:(filename:">点击加载交互代码示例</button><a href="https://godbolt.org/e?readOnly=true&amp;hideEditorToolbars=true#g:!((g:!((g:!((h:codeEditor,i:(filename:" target="_blank" rel="noopener noreferrer">在原网站打开</a></div>


1. 当 `this` 指针为 `nullptr` 时，访问 `this->_a` 等同于尝试通过空指针访问成员变量。这是一种未定义行为，在大多数系统中会导致程序崩溃。

2. 成员变量 `_a` 存储在对象的内存空间中，而通过空指针访问成员变量时，由于没有实际的对象空间可用，因此程序在运行时会发生崩溃。



> [!NOTE]
> **空指针调用成员函数**
> 总结来说，**空指针调用成员函数本身并不会报错** ，因为成员函数本来就不在类中，所以不是解引用，编译时的汇编代码这里就只是一段函数的地址而已，只是这里没有对象，传过去的 `this` 指针就是空指针，但只要该成员函数不涉及访问成员变量或其他依赖对象内存的操作那就不会报错。
> 
> 然而，一旦成员函数试图通过 `this` 指针访问成员变量，程序就会崩溃，因为 `this` 为 `nullptr`，没有有效的内存空间可供访问。

## this指针存放位置

`this` 指针作为成员函数的一个隐含参数，存储在栈中。每当一个成员函数被调用时，`this` 指针会作为函数参数被压入栈中。



> this指针其实就是函数的参数而已
