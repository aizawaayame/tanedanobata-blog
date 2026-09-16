---
title: Return Value Optimization
slug: note-d09897e70952
published: 2025-04-10
draft: false
description: ''
tags: []
category: C++
lang: zh_CN
kind: note
directory: C++/编译器/编译器优化
route: /C++/编译器/编译器优化/拷贝省略、RVO、NRVO优化策略/
---

在函数返回值的传递过程中，可能会触发多次对象的拷贝构造或移动操作。为了减少这些不必要的拷贝，C++ 编译器会采用一些优化技术，如 **拷贝省略** (1)、**返回值优化** (2)和 **命名返回值优化** (3)。  


1. Copy Elision
2. Return Value Optimization，RVO
3. Named Return Value Optimization，NRVO

**RVO和NRVO的启用条件**

RVO 和 NRVO 是编译器自动完成的优化，但是这些优化并不总是启用，具体取决于编译器的实现和配置

1. 在 *C++17* 之前，**RVO** 是一个可选优化，但在 *C++17* 标准之后，**RVO** 被强制启用，编译器必须在符合条件的情况下执行拷贝省略。

2. **NRVO** 通常依赖于编译器的智能分析，虽然大多数现代编译器都能支持 **NRVO**，但其效果和激进程度因编译器和版本的不同而有所差异。

## 按值传递和拷贝省略

## 不具名返回值优化

不具名返回值优化发生在返回一个无名对象或者临时对象,，一般是 `Return` 语句中直接创建并返回的对象。

URVO 从 C++98 开始已被许可，但是一直到 C++17 编译器才强制返回值优化。


**无返回值优化**

```cpp title="无返回值优化"  
Data GetData()  
{  
    return Data{};  // ctro1  
                    // copy ctor2, dtor1  
}

int main()
{
    Data d = GetData(); // copy ctor3, dtor2
    return 0;           
                        // dtor3
}
```

对象发生多次拷贝。

其中第三次拷贝和赋值右值相关。



**有返回值优化**

```cpp title="有返回值优化"  
Data GetData()  
{  
    return Data{};  // ctro1  
}

int main()
{
    Data d = GetData(); 
    return 0;           
                        // dtor1
}
```

对象只被构造一次。



## 具名返回值优化

具名返回值优化一般发生在返回一个已经创建的对象。

MSVC默认不开启具名返回值优化，如果需要开启优化，需要在 `/O2` 下编译。

## 容器返回值优化

对于容器来说，若整个容器发生拷贝，代价很高。

因此，非常有必要考虑返回值优化。C++17 开始，强制对容器进行返回值优化。

```cpp title="容器返回值优化"
std::vector<Data> GetDataContainers() {
    //!!! case 1
    // return std::vector<Data>{Data{}};    // ctor 1, copy ctor 2, dtor 1

    //!!! case 2
    std::vector<Data> vec{Data{}};          // ctor 1, copy ctor 2, dtor 1
    return vec;
}                                          

int main() {
    auto d = GetDataContainers();    
    return 0;
}                                           // dtor 2
```


<div class="external-embed" data-pagefind-ignore><button type="button" data-embed-src="https://godbolt.org/e#z:OYLghAFBqd5QCxAYwPYBMCmBRdBLAF1QCcAaPECAMzwBtMA7AQwFtMQByARg9KtQYEAysib0QXACx8BBAKoBnTAAUAHpwAMvAFYTStJg1DIApACYAQuYukl9ZATwDKjdAGFUtAK4sGIM2akrgAyeAyYAHI%2BAEaYxP7SAA6oCoRODB7evv6ByamOAqHhUSyx8WbSdpgO6UIETMQEmT5%2BAbaY9gUMdQ0ERZExcQm29Y3N2W0Ko31hA6VDFQCUtqhexMjsHOYAzGHI3lgA1Cbbbk5TxJisJ9gmGgCCO3sHmMenyFPoWFQ3d49muwY%2By8RxObg%2BBGIYWAvweTyBLzebi8jlohAAnrD/oDgaDTgA3apEYhYv5TJiOZCHMIEQ5oLyCOInCyHAD0rLpq0ZxEORGpWEEeCo6OpDHJQMwCkOqCohyEfzJkK8DkOABEKUxjgB2KwPQ760W0vAmHWHDTa1XMv4Gw38q1wvUG9X1CCLQ4gO2m6zWenci3a3X3G02z4gFCrWlgsHHAIOEgxsxI6N4dBJ04JkwAVjcDHMZntQYNJstDsL%2BudTAgaDFtIr5gAbIcFG6PcbTQoAHR4C2kT0s72WX0EOL%2Bk2B4MG0PhlFptwJtCJEVxnl52f8td5rM5zfbcdFrUlx6O8sahvSxJxCkkE6qqsCKZq09mRvoDVusfWifUt6qw6v%2BpdgWX5NgQ6BhvSkanNGeYLiKTAKKkwAMAma7/kwXaplG6arnyq5YXOKYbgEW65sRu6fhOlwEGsyEAFQEAgeAKEB%2B6HhRhwAH4Vq6AbsSGoHgRGRFmOgxIofh64SZu2akfm5HHhaCoHgWipgSAhLLmCdbbNghwAOKYAQFYeIITCzMQCg8R%2BCnsmAdn2XS8GvFw7HsocVE0SBakacSWmnjpY51jqxYhbuNpucuhxcL2sF0mJgR/mJLmluFrL2Q5ohKIc%2BYKVOPnXqc2m6RpgWnsFynKWFwFshykXRZyi5xfGCWifGyVlu5hmeSV8mPAe1UDYNQ0Kg8NKHCwZkMFZwUKUwKKoH%2BP76YZxmyJNcSWYszI2uxHnEMhGgqf1Q0nadBpua1PJmBwyy0Jwma8H4HBaKQqCcG4A4sgoqzrK8Ow8KQBCaDdywANYSBoGj6Jwki8CwICZlDT0vW9HC8AoIBQ0Dz03aQcCwEgmCqNU81kBQEANMACjKIYHRCAgqAAO5PQDaAsIkdAUukNPhLQ9NM8jvBsxz9DxMAXBtMLdBxBErCbELqDs9LxAAPIovzzPA0ExPIPcxBU5wvBE9UdT4E9vD8IIIhiOwUgyIIigqOoOOkLo0UGEYKCffoeDRBjkDLKgiRdBjHAALSfDepiWNYZjmmHADqYi0IcidE5Cmphxer6CsgvCoISxBQlg/uuqQxAMo4bAACqoJ4pfLN9awbHonxhDzdMM5r3C8JCmCbADjPEEwiScDwt33Y9Wuo9gOuk4cqgABz1mH9aSIcwDIFSEsdomEAfTHli9rghDxv9iy98DizLAgVxYPEZd3RwsOkPDiOkILr2G7YmOA1fE8cG2FPF2qNL442vqQQuqRnCSCAA%3D%3D">点击加载交互代码示例</button><a href="https://godbolt.org/e#z:OYLghAFBqd5QCxAYwPYBMCmBRdBLAF1QCcAaPECAMzwBtMA7AQwFtMQByARg9KtQYEAysib0QXACx8BBAKoBnTAAUAHpwAMvAFYTStJg1DIApACYAQuYukl9ZATwDKjdAGFUtAK4sGIM2akrgAyeAyYAHI%2BAEaYxP7SAA6oCoRODB7evv6ByamOAqHhUSyx8WbSdpgO6UIETMQEmT5%2BAbaY9gUMdQ0ERZExcQm29Y3N2W0Ko31hA6VDFQCUtqhexMjsHOYAzGHI3lgA1Cbbbk5TxJisJ9gmGgCCO3sHmMenyFPoWFQ3d49muwY%2By8RxObg%2BBGIYWAvweTyBLzebi8jlohAAnrD/oDgaDTgA3apEYhYv5TJiOZCHMIEQ5oLyCOInCyHAD0rLpq0ZxEORGpWEEeCo6OpDHJQMwCkOqCohyEfzJkK8DkOABEKUxjgB2KwPQ760W0vAmHWHDTa1XMv4Gw38q1wvUG9X1CCLQ4gO2m6zWenci3a3X3G02z4gFCrWlgsHHAIOEgxsxI6N4dBJ04JkwAVjcDHMZntQYNJstDsL%2BudTAgaDFtIr5gAbIcFG6PcbTQoAHR4C2kT0s72WX0EOL%2Bk2B4MG0PhlFptwJtCJEVxnl52f8td5rM5zfbcdFrUlx6O8sahvSxJxCkkE6qqsCKZq09mRvoDVusfWifUt6qw6v%2BpdgWX5NgQ6BhvSkanNGeYLiKTAKKkwAMAma7/kwXaplG6arnyq5YXOKYbgEW65sRu6fhOlwEGsyEAFQEAgeAKEB%2B6HhRhwAH4Vq6AbsSGoHgRGRFmOgxIofh64SZu2akfm5HHhaCoHgWipgSAhLLmCdbbNghwAOKYAQFYeIITCzMQCg8R%2BCnsmAdn2XS8GvFw7HsocVE0SBakacSWmnjpY51jqxYhbuNpucuhxcL2sF0mJgR/mJLmluFrL2Q5ohKIc%2BYKVOPnXqc2m6RpgWnsFynKWFwFshykXRZyi5xfGCWifGyVlu5hmeSV8mPAe1UDYNQ0Kg8NKHCwZkMFZwUKUwKKoH%2BP76YZxmyJNcSWYszI2uxHnEMhGgqf1Q0nadBpua1PJmBwyy0Jwma8H4HBaKQqCcG4A4sgoqzrK8Ow8KQBCaDdywANYSBoGj6Jwki8CwICZlDT0vW9HC8AoIBQ0Dz03aQcCwEgmCqNU81kBQEANMACjKIYHRCAgqAAO5PQDaAsIkdAUukNPhLQ9NM8jvBsxz9DxMAXBtMLdBxBErCbELqDs9LxAAPIovzzPA0ExPIPcxBU5wvBE9UdT4E9vD8IIIhiOwUgyIIigqOoOOkLo0UGEYKCffoeDRBjkDLKgiRdBjHAALSfDepiWNYZjmmHADqYi0IcidE5Cmphxer6CsgvCoISxBQlg/uuqQxAMo4bAACqoJ4pfLN9awbHonxhDzdMM5r3C8JCmCbADjPEEwiScDwt33Y9Wuo9gOuk4cqgABz1mH9aSIcwDIFSEsdomEAfTHli9rghDxv9iy98DizLAgVxYPEZd3RwsOkPDiOkILr2G7YmOA1fE8cG2FPF2qNL442vqQQuqRnCSCAA%3D%3D" target="_blank" rel="noopener noreferrer">在原网站打开</a></div>


## Reference

- [sigcpp | Special Interest Group on C++](https://link.juejin.cn?target=https%3A%2F%2Fsigcpp.github.io%2F "https://sigcpp.github.io/")
- [Return Value Optimization | Shahar Mike's Web Spot](https://link.juejin.cn?target=https%3A%2F%2Fshaharmike.com%2Fcpp%2Frvo%2F "https://shaharmike.com/cpp/rvo/")
- [c++ - What are copy elision and return value optimization? - Stack Overflow](https://link.juejin.cn?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F12953127%2Fwhat-are-copy-elision-and-return-value-optimization "https://stackoverflow.com/questions/12953127/what-are-copy-elision-and-return-value-optimization")
- [Copy elision - cppreference.com](https://en.cppreference.com/w/cpp/language/copy_elision)
- [/O options (Optimize code) \| Microsoft Learn](https://learn.microsoft.com/en-us/cpp/build/reference/o-options-optimize-code?view=msvc-170)
