---
title: 实现一个基础的智能指针
slug: smart-pointer
published: 2025-04-08
draft: false
description: ''
tags:
- cpp
category: cpp
lang: zh_CN
kind: post
directory: blog/posts
route: /posts/smart-pointer/
---

实现一个基础的智能指针。
<!-- more -->
## 智能指针想要解决的问题

```cpp title="假设有一个对象"
class TestObject //测试用对象
{
public:
    //构造函数
    TestObject()
    {
        cout << "构造TestObject" << endl;
    }
    //析构函数
    ~TestObject()
    {
        cout << "析构TestObject" << endl;
    }
    //测试函数
    void TestFunc()
    {
        cout << "TestFunc" << endl;
    }
};

```

可以选择在“栈”中创建这个对象，或是在“堆”中创建这个对象（即用 `new`），但他们都面临各自的问题。


**在栈中创建对象**

```cpp  
int main()  
{  
    TestObject* ptr;    //声明一个对象指针  
    {  
        TestObject test;//创建一个对象  
        ptr = &test;    //指针指向这个对象  
    }  
    ptr->TestFunc();//此处虽然尝试调用，但是“test”已经被销毁了  
}  
```  
  
1. 如果在“栈”中创建这个对象，那么对象保证可以释放掉内存。

2. 但缺点是：它只能在作用域内起效，离开了作用域就将销毁。




**在堆中创建对象**

```cpp  
int main()  
{  
    TestObject* ptr = new TestObject();  
    ptr->TestFunc();  
}  
```  
  
1. 在“堆”中创建对象，可以保证对象在离开作用域后仍然存在。

2. 但缺点是：需要手动释放内存。



## 智能指针

智能指针既能在离开作用域之后继续使用，又不用额外的设计来放置对象不被销毁。  
一种实现这种理想的方式是：**引用计数** 。

思路是维护一个 **引用计数器** 来统计这个对象被引用的次数，一旦其值变为0则销毁它。

```cpp title="实现一个智能指针类"
template<typename T>
class SmartPointer //智能指针
{
private: //内部的定义：
    class Counter   //引用计数器，一个对象的所有智能指针应该公用一个计数器
    {
    public:
        T* ObjectPtr;       //对象的指针
        int ReferenceCount; //引用计数

        Counter(T* Ptr)//构造函数中得到对象指针，引用计数设为1
        {
            ObjectPtr = Ptr;
            ReferenceCount = 1;
        }
        ~Counter()//析构函数中销毁对象
        {
            delete ObjectPtr;
        }
    };

private: //私有成员：
    Counter* MyCounter;     //指向引用计数器的指针

public:
    //构造函数（使用普通对象指针）
    SmartPointer(T* Ptr)
    {
        MyCounter = new Counter(Ptr);
        cout << "使用普通对象指针来构造" << endl;
    }
    //构造函数（使用其他智能指针）
    SmartPointer(const SmartPointer &Other)
    {
        MyCounter = Other.MyCounter;
        MyCounter->ReferenceCount++;
        cout << "使用其他智能指针来构造，引用计数："<< MyCounter->ReferenceCount << endl;
    }
    //析构函数
    ~SmartPointer()
    {
        MyCounter->ReferenceCount--;
        cout << "智能指针对象析构，当前引用计数：" << MyCounter->ReferenceCount << endl;
        if (MyCounter->ReferenceCount == 0)
            delete MyCounter;   
    }
    //重载“->”运算符，让它能像普通对象指针一样使用
    T* operator->() const
    {
        return MyCounter->ObjectPtr;
    }
};

```
