---
title: TopK
slug: note-87655dc65f72
published: 2025-05-04
draft: false
description: ''
tags: []
category: Algorithm
lang: zh_CN
kind: note
directory: Algorithm/排序
route: /Algorithm/排序/TopK/
---

## 线性找第 k 大的数

在下面的代码示例中，第 $k$ 大的数被定义为序列排成升序时，第 $k$ 个位置上的数（编号从 0 开始）。

找第 $k$ 大的数（K-th order statistic），最简单的方法是先排序，然后直接找到第 $k$ 大的位置的元素。这样做的时间复杂度是 $O(n\log n)$，对于这个问题来说很不划算。

我们可以借助快速排序的思想解决这个问题。考虑快速排序的划分过程，在快速排序的「划分」结束后，数列 $A_{p}\dots A_{r}$ 被分成了 $A_{p}\dots A_{q}$ 和 $A_{p+1}\dots A_{r}$，此时可以按照左边元素的个数（$q-p+1$）和 $k$ 的大小关系来判断是只在左边还是只在右边递归地求解。

和快速排序一样，该方法的时间复杂度依赖于每次划分时选择的分界值。如果采用随机选取分界值的方式，可以证明在期望意义下，程序的时间复杂度为 $O(n)$。

## 实现

    ```cpp
    // 模板的 T 参数表示元素的类型，此类型需要定义小于（<）运算
    template <typename T>
    // arr 为查找范围数组，rk 为需要查找的排名（从 0 开始），len 为数组长度
    T find_kth_element(T arr[], int rk, const int len) {
    if (len <= 1) 
        return arr[0];
    // 随机选择基准（pivot）
    const T pivot = arr[rand() % len];
    // i：当前操作的元素下标
    // arr[0, j)：存储小于 pivot 的元素
    // arr[k, len)：存储大于 pivot 的元素
    int i = 0, j = 0, k = len;
    // 完成一趟三路快排，将序列分为：
    // 小于 pivot 的元素 ｜ 等于 pivot 的元素 ｜ 大于 pivot 的元素
    while (i < k) {
        if (arr[i] < pivot)
            swap(arr[i++], arr[j++]);
        else if (pivot < arr[i])
            swap(arr[i], arr[--k]);
        else
            i++;
    }
    // 根据要找的排名与两条分界线的位置，去不同的区间递归查找第 k 大的数
    // 如果小于 pivot 的元素个数比k多，则第 k 大的元素一定是一个小于 pivot 的元素
    if (rk < j) 
        return find_kth_element(arr, rk, j);
    // 否则，如果小于 pivot 和等于 pivot 的元素加起来也没有 k 多，
    // 则第 k 大的元素一定是一个大于 pivot 的元素
    else if (rk >= k)
        return find_kth_element(arr + k, rk - k, len - k);
    // 否则，pivot 就是第 k 大的元素
    return pivot;
    }
    ```
