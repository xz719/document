# JS 类型转换

## 1. 显式类型转换

### 1.1 转布尔类型

我们一般不会将某个值显式地转为布尔类型，如果需要显式地进行转换，可以使用转型函数 `Boolean()`

```js
console.log(Boolean(23132132))  // true
console.log(Boolean('123'))     // true
console.log(Boolean(''))        // false
```

转换后会出现 `false` 的情况包括：`''`，`0`，`NaN`，`null`，`undefined`，`false`，除此之外，转换后都为 `true`.

### 1.2 转字符串

如果需要将某个值转为字符串，可以使用如下几种方法：

* `toString()`，注意 `null` 和 `undefined` 是没有这个方法的
* 转型函数 `String()`，这个方法可以把任何值转换为字符串，但是需要注意，`true` 和 `false` 会被转为 `'true'` 和 `'false'`，`null` 和 `undefined` 也会被转为 `'null'` 和 `'undefined'`
  
  ```js
  console.log(String(['red','blue','green'])); // "red,blue,green"
  console.log(String(123));    // "123"
  console.log(String(true));  // "true"
  console.log(String(null));  // "null"
  console.log(String(undefined));  // "undefined"
  ```

### 1.3 转为 Number 类型

其他类型转 number 类型主要有 `Number()`，`parseFloat()`，`parseInt()` 这三种强制类型转换

* 转型函数 `Number()`
  
  `Number()` 属于**严格转换**，当**全部为数字**或者**解析结果全部为数字**时才会转换。
  
  出现非数字或者空格时返回 `NaN`，当遇到空字符串、`null` 或者布尔类型 `false` 时返回 0，当遇到布尔类型 `true` 时返回 1，遇到 `undefined` 时返回 `NaN`。
  
  `NaN` 的意思是 not a number，不是一个数值，但是 `NaN` 属于 number 数据类型，`NaN` 和谁都不相等，包括他自己。判断是否为非有效数字时用 `isNaN()`，非有效数字返回 `true`，有效数字返回 `false`。

  例：

  ```js
  console.log(Number(123));         // 123
  console.log(Number('123'));       // 123
  console.log(Number('123aa'));     // NaN
  console.log(Number(''));          // 0
  console.log(Number([]));          // 0
  console.log(Number(null));        // 0
  console.log(Number(false));       // 0
  console.log(Number(true));        // 1
  console.log(Number(undefined));   // NaN
  ```

* `parseInt()`
  
  该方法可以把其他数据类型转换为**整数**，只取整数部分，当遇到以**非数字开头**的数据类型时，返回 `NaN`。

  例：

  ```js
  console.log(parseInt(123));       // 123
  console.log(parseInt(123.23));    // 123
  console.log(parseInt('123.23'));  // 123
  console.log(parseInt('123aa'));   // 123，如果非数字部分不在开头，则直接去掉
  console.log(parseInt('.123aa'));  // NaN
  console.log(parseInt('abc'));     // NaN
  console.log(parseInt('abc123'));  // NaN
  ```

* `parseFloat()`
  
  `parseFloat()` 和 `parseInt()` 一样属于非严格转换，该方法是保留浮点数。

  例：

  ```js
  console.log(parseFloat(123));             // 123
  console.log(parseFloat(123.23));          // 123.23
  console.log(parseFloat('123.23'));        // 123.23
  console.log(parseFloat('123aa'));         // 123
  console.log(parseFloat('.123aa'));        // 0.123
  console.log(parseFloat('ab123.23aa'));    // NaN
  console.log(parseFloat('abc'));           // NaN
  ```

## 2. 隐式类型转换

https://blog.csdn.net/weixin_45844049/article/details/120576627
https://www.jianshu.com/p/e4ac366ac2fd
https://zhuanlan.zhihu.com/p/592501394
https://blog.csdn.net/vita_min123/article/details/121359602

## 3. 对象转为原始类型

### 3.1 JS 原始类型

`string` 、`number` 、`boolean` 和 `null`、`undefined` 这五种类型统称为『原始类型』（Primitive），表示不能再细分下去的基本类型。

### 3.2 JS 原型类型转换的抽象操作 ToPrimitive

`[Symbol.toPrimitive]` 是一个内置的抽象操作，其是作为对象的函数值属性存在的，当一个对象转换为对应的原始值是，就会调用此函数。但是，我们在编写代码时，时无法看到这个属性值的，直接调用也会报错，那么如何才能实际地感受到这个操作的存在呢？

前面说到，这个操作是作为对象的函数值属性存在的，那么我们能不能重写一下这个函数呢？如下：

```js
const obj2 = {
    [Symbol.toPrimitive](hint) {
        // If hint is number
        if (hint === "number") {
        return 0;
        }

        // If the hint is string
        if (hint == "string") {
        return "String";
        }

        // If hint is default
        if (hint == "default") {
        return "Default";
        }
    },
    id: 1,
};
```

但是，需要注意的是，我们并不能显式地调用这个方法，它会在对象被转换为原始值时，自动调用！

```js
console.log(+obj2);         // 0
console.log(`${obj2}`);     // 'String'
console.log(obj2 + "");     // 'Default'
```

可以看到，`[Symbol.toPrimitive]` 这个抽象操作是可以接受一个参数 `hint` 的，这个参数显然不是由我们传入的，而是在将对象转为原始值，自动调用这个方法时，隐式传入的！那么这个参数有什么用呢？

> `hint` 参数指转换后的**期望类型**，当对象有能力转换为不止一种原始类型时，可以使用这个参数来指定期望转换为的类型。

当传入不同的 `hint` 参数时，`[Symbol.toPrimitive]` 内部的处理逻辑也会不同：

如果传入 `String`，即期望转换为字符串，其内部会有如下的处理逻辑：

1. 如果对象中有 `toString()` 方法，则调用这个方法。如果它返回一个原始值(`undefined`、`Boolean`、`Number`、`String`、`BigInt`、`Symbol` 和 `null`)，js 将这个值转换为字符串(如果本身不是字符串的话)，并返回这个字符串结果。
2. 如果对象没有 `toString()` 方法，或者 `toString()` 没有返回一个原始值，那么 js 会调用 `valueOf()` 方法。如果返回值是原始值，js 将这个值转换为字符串，并返回字符串结果。
3. 如果都走不通，则抛出一个**类型错误异常**

[![pFrIOVs.md.png](https://s21.ax1x.com/2024/03/07/pFrIOVs.md.png)](https://imgse.com/i/pFrIOVs)

而当传入 `Number` 或 `Default` 时，则是期望将对象转换为数字，内部的处理逻辑如下：

和上面不同，到数字的转换会先尝试使用 `valueOf()` 方法

1. 如果对象具有 `valueOf()` 方法，后者返回一个原始值，则 js 会将其转换为数字(如果需要的话)并返回这个数字。
2. 否则，如果对象具有 `toString()` 方法，返回一个原始值(字符串直接量)，则 js 将其转换为数字类型，并返回这个数字。
3. 否则，js 抛出一个**类型错误异常**。

关于 `valueOf()` 和 `toString()` 方法，见 [js valueOf toString](./js%20valueOf%20toString.md)

需要注意的是：

> 对于所有非日期对象来说，对象到原始类型的转换基本上都是对象到数字的转换

那么日期对象呢？

### 3.3 日期对象转换为原始类型

日期对象在原型里自定义了 `toString()`，即 `Date.prototype.toString()`。

```js
var date = new Date();
date.toString(); // => "Mon Dec 28 2015 21:58:10 GMT+0800 (中国标准时间)"
```

`Date` 对象覆盖了从 `Object` 继承来的 `Object.prototype.toString()` 方法。`Date` 的 `toString()` 方法总是返回一个**美式英语日期格式**的字符串。当一个日期对象被用来作为文本值或用来进行字符串连接时，`toString()` 方法会被**自动调用**。

日期类型是 JavaScript 语言核心中唯一的**预先定义类型**，它定义了有意义的向字符串和数字类型的转换。

前面我们说到，对于所有非日期对象来说，对象到原始类型的转换基本上都是对象到数字的转换，即首先调用 `valueOf()` 方法。而日期对象则不同，它会采用由对象到字符串的转换模式，即先调用 `toString()` 方法，且其后续的转换也与上面有所不同，其通过 `valueOf()` 或 `toString()` 返回的原始值将被**直接使用**，而不会被强制转换为数字或字符串。

那么这种特殊处理会出现在哪些时候呢？这里要分不同运算符来说。

对于 `+`、`==`，它们都会做对象到原始类型的转换，但它们在对日期类型进行转换时，会出现上面所说的特殊处理！

而对于其它运算符，它们对对象到特定类型的转换都很明确，对于日期对象也不会有特殊处理。例如：`-` 运算符会将其两边的两个操作数都转换为 `Number` 类型！

下面给出几个示例：

```js
let now = new Date()
console.log(typeof (now + 1))   // string
console.log(typeof (now - 1))   // number
console.log(now == now.toString())  // true
console.log(now > (now - 1))    // true
```
