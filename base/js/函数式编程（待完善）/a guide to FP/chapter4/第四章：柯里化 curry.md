# a guide to functional programming

## 第四章：柯里化 curry

这里并不会对什么是柯里化，以及柯里化的优缺点进行详细的介绍，如果想要了解，可以参考[高阶函数以及函数柯里化](../../高阶函数以及函数柯里化.md)

简单理解，柯里化就是：

> 传递一部分的参数来调用函数，它返回一个接收剩余参数的函数

看下面的例子：

[创建一些curry函数](./tests/curryFunctions.js)

```js
const map = curry((f, xs) => xs.map(f));
const getChildren = (x) => x.childNodes;

const allTheChildren = map(getChildren);

const arr1 = [
    {
        childNodes: [1, 2, 3]
    },
    {
        childNodes: [5, 6, 7]
    },
    {
        childNodes: [9, 10, 11]
    }
]

const arr2 = [
    {
        childNodes: [2, 3, 4, 5]
    },
    {
        childNodes: [8, 9, 10]
    },
    {
        childNodes: []
    }
]

allTheChildren(arr1)
allTheChildren(arr2)
```

柯里化后，仅传递给函数一部分的参数，也叫做**局部调用（partial application）**。局部调用能够帮助我们大量减少样板文件代码

在上一章我们讨论纯函数时，我们说：纯函数接收一个输入并返回一个输出，而在上面的例子中，我们会发现，柯里化做的正是这件事，对于柯里化后的函数，每传递一个输入，就返回一个函数处理剩余的参数，所以，**柯里化后的函数就是一个纯函数**。

当然，柯里化也可以接收多个参数，但这仅仅是为了减少柯里化后函数的层数，属于柯里化的特殊情况：偏函数。如果想要了解偏函数，可以参考[偏函数](../../偏函数.md)

总的来说：

* 柯里化 curry 是函数式编程的必备工具
* 柯里化后，我们仅仅通过传递几个参数，就能够动态地创建实用性较高的新函数
* 柯里化后的函数，保留了数学的函数定义，尽管其可能不止接收一个参数

下面是几个练习题：

1. [练习题a](./tests/exercise_a.js)
2. [练习题b](./tests/exercise_b.js)
3. [练习题c](./tests/exercise_c.js)

这些练习题的目的在于，帮助我们理解，柯里化或者说局部调用，实际上是将一个多参数函数的各个参数分步固定的过程。
