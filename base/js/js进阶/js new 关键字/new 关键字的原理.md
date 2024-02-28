# JS `new` 原理

## 1. `new` 关键字

众所周知，在 JS 中，`new` 的作用是通过提供的构造函数来创建一个实例对象。

例如：

```js
// 构造函数一般首字母大写，用于和普通函数区分开来
function Foo (name) {
    this.name = name
}
console.log('new Foo 的类型：', typeof new Foo('test'))     // object
console.log('Foo 的类型：', typeof Foo)     // function
```

## 2. 调用 `new` 后做了哪些事情？

`Foo` 只是一个函数，为什么执行 `new Foo()` 后会得到一个对象呢？

首先我们要了解使用 `new` 关键字后做了哪些事情。
