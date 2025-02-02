# JS 中的扩展运算符（...）和剩余运算符（...）

## 1. 介绍

在JS中，扩展运算符（spread）是三个点 `(...)` ，剩余运算符（rest）也是三个点 `(...)`！

下面就来介绍一下这两个运算符以及两者的不同应用场景。

## 2. 扩展运算符

### 2.1 基本使用

扩展运算符的主要作用是将一个数组转为用**逗号分隔的参数序列**，它类似于 `rest` 的逆运算。

下面是它的几个基本使用场景：

```js
// 1.更为便捷地传递参数
var arr = [1, 2, 3]
const test = (a, b, c) => {
    // ...
}
test(...arr);

// 2.将数组插入另一个数组
var arr1 = [1, 2, 3];
var arr2 = [...arr1, 4, 5, 6]; // 123456

// 3.字符串转数组
var str = "hello"
var arr3 = [...str] // ["h", "e", "l", "l", "o"]
```

### 2.2 注意

**扩展运算符 `…` 会调用默认的 `Iterator` 接口！**

示例：

```js
// 例一
var str = 'hello';
[...str] //  ['h','e','l','l','o']

// 例二
let arr = ['b', 'c'];
['a', ...arr, 'd']
// ['a', 'b', 'c', 'd']
```

在上面的代码中，扩展运算符内部就调用了 `str`、`arr` 对象的 `Iterator` 接口。

实际上，这提供了一种简便机制，可以将任何部署了 `Iterator` 接口的数据结构，转为数组。也就是说，**只要某个数据结构部署了 `Iterator` 接口，就可以对它使用扩展运算符，将其转为数组！**

### 2.3 用扩展运算符替代 `apply` 方法

我们知道，对于`apply`方法，其会接收一个参数数组，并在执行目标函数时将该参数数组中的内容作为参数传入。

所以，实际上我们在特定场景中，可以用扩展运算符替代`apply`方法！

```js
// ES5 的写法
function f(x, y, z) {
  // ...
}
var args = [0, 1, 2];
f.apply(null, args);

// ES6 的写法
function f(x, y, z) {
  // ...
}
let args = [0, 1, 2];
f(...args);
```

下面是一个实际的例子，用扩展运算符简化 `Math.max` 求数组最大元素的方法：

```js
// ES5 的写法
Math.max.apply(null, [14, 3, 77])

// ES6 的写法
Math.max(...[14, 3, 77])

// 等同于
Math.max(14, 3, 77);
```

## 3. 剩余运算符

剩余运算符用于把**用逗号隔开的值序列**组合成一个**数组**

下面是剩余运算符的几个常见使用场景：

```js
// 当函数参数个数不确定时，用rest运算符
function f1(...args) {
  console.log(args); // [1,2,3]
}

f1(1,2,3);

// 当函数参数个数部分确定，剩余部分不确定时
function f2(item, ...arr) {
  console.log(item); // 1
  console.log(arr);  // [2,3]
}
f2(1, 2, 3);

// rest运算符配合解构使用
let [a,...temp]=[1, 2, 4];
console.log(a);    // 1
console.log(temp); // [2,4]
```

## 4. 如何辨认？

**扩展运算符（spread）** 用三个点号 `…` 表示，功能是把数组或类数组对象展开成一系列用逗号隔开的值。

**剩余运算符（rest）** 也是三个点号 `…`，不过其功能与扩展运算符恰好相反，把逗号隔开的值序列组合成一个数组。

那么既然两者都是三个点号，应该如何区分呢？

* 当 `...` 在等号**左边**，或者放在**形参**上，为 rest 运算符

* 当 `...` 在等号**右边**，或者放在**实参**上，是 spread 运算符

或者说：**放在被赋值一方是 rest 运算符。放在赋值一方式 spread 运算符**。
