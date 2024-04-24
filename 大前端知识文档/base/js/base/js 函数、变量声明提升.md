# JS 变量声明提升 + 函数声明提升

什么是【声明提升】？

> JS 引擎在解释 JavaScript 代码之前会先进行编译，编译中的一部分工作就是找到所有的**声明**，并用合适的作用域将这些变量关联起来，这也是词法作用域的核心。

具体来说，就是 JS 引擎会把一些变量和函数的声明提升到对应作用域的顶部，例如：

```js
console.log(a)  // undefined

var a = 1

// 上面的代码等同于
var a
console.log(a)
a = 1
```

🔴 Tip：变量声明提升仅仅针对**使用 `var` 声明的变量**！对于使用 `let`、`const` 声明的变量，其不会发生变量声明提升，且使用 `let`、`const` 声明的变量会导致【暂时性死区】（在声明变量的语句之前使用该变量会报错），另外，使用 `let`、`const` 声明的变量不允许重复声明！

## 1. 变量声明提升

变量声明提升的特点是：

1. 提升的范围是变量所处的**第一层词法作用域**，即：全局变量提升到全局作用域的顶层，函数内部的变量提升到函数作用域的顶层
2. 声明提升，提升的仅仅是声明，赋值操作属于解释阶段，不会被提升！（这也是为什么被提升过的变量在声明语句之前调用都为 `undefined`）

🔴 应用变量声明提升时，需要注意以下几个点：

* 变量声明提升仅仅针对**使用 `var` 声明的变量**！
  
  对于使用 `let`、`const` 声明的变量，其不会发生变量声明提升，且使用 `let`、`const` 声明的变量会导致【暂时性死区】（在声明变量的语句之前使用该变量会报错），另外，使用 `let`、`const` 声明的变量不允许重复声明！
  
  红宝书中给出了如下解释：

  > 严格来讲，`let` 在 JavaScript 运行时中也会被提升，但由于【暂时性死区(temporal dead zone)】的缘故，实际上不能在声明之前使用 `let` 变量。因此，从写 JavaScript 代码的角度说，`let` 的提升跟 `var` 是不一样的。

* 由于声明提升，所以，在全局中 `var` 声明的变量会在 `window` 身上，`let`、`const` 声明的变量则在 `script` 中，如下图：
  
  [![pFNVym6.png](https://s11.ax1x.com/2024/02/22/pFNVym6.png)](https://imgse.com/i/pFNVym6)

## 2. 函数声明提升

函数声明提升，是指使用 `function` 声明的函数，会被提升到对应作用域的顶部。

🔴 注意！JS 中创建函数有两种方式：**函数声明式**和**函数字面量形式**（又叫函数表达式、匿名函数形式），其中**只有使用函数声明式时才存在函数提升**！

例如：

```js
console.log(f1)     // function f1() {}

console.log(f2)     // undefined

function f1 () {    // 函数声明式
    console.log('f1')
}

var f2 = function () {  // 函数字面量形式
    console.log('f2')
}

// 上面代码的实际执行顺序如下
function f1 () {
    console.log('f1')
}

var f2

console.log(f1)

console.log(f2)

f2 = function () {
    console.log('f2')
}
```

## 3. 变量声明提升和函数声明提升的优先级

❗ 在函数声明和变量声明之间，**函数声明会优先被提升，然后才是变量声明**，且函数声明不会被同名变量声明覆盖：

```js
console.log(xy)     // function xy () {...}

var xy

var z = 'def'

function xy () {
    console.log(z) //undefined
    var z = 'abc'; 
    console.log(z) //abc
}

xy()
```

上述代码的实际执行顺序为：

```js
function xy () {
    var z
    console.log(z)
    z = 'abc'
    console.log(z)
}

var z

console.log(xy)

z = 'def'

xy()
```

❗ 函数提升优先级比变量提升要高，且不会被变量声明覆盖，但是会**被变量赋值覆盖**：

```js
console.log(xy)     // function xy () {...}

var xy = 5

var z = 'def'

function xy () {
    console.log(z)
    var z = 'abc'; 
    console.log(z)
}

xy()    // 报错 Uncaught TypeError: xy is not a function 因为被变量赋值覆盖了
```

上述代码的实际执行顺序为：

```js
function xy () {
    var z
    console.log(z)
    z = 'abc'
    console.log(z)
}

var z

console.log(xy)

xy = 5  // 此时变量 xy 指向了 5，而不是之前的函数体的引用

z = 'def'

xy()
```

## 总结

总的来说：

* 在 js 中变量和函数的声明会提升到最顶部执行
* 函数提升优先级比变量提升要高，且不会被变量声明覆盖，但是会被变量赋值覆盖。
