# 显式绑定与硬绑定 — `call`、`apply` 和 `bind`

## 1. 显式绑定 — `call`、`apply`

JS中有一个关键概念叫**执行上下文**，也就是 **JS 代码被解析和执行时的环境**。

在执行上下文的创建阶段，会**确定当前执行上下文中 this 指针的指向**。

而 `call()`，`apply()`，`bind()` 的作用，就是调⽤⼀个对象的⽅法，**改变函数执行时的上下文，即改变函数内部的this指向**。

其中，用 `call()`，`apply()` 改变 `this` 指向的操作，被称为**显式绑定**。

### 1.1 `call()`

`call()` 方法实际上是函数对象 Function 的原型上的一个方法，可以用来调用普通函数、父类构造函数、匿名函数等。

同时，使用 `call()` 方法让我们可以只写一次某个函数，然后在另一个对象中用 `call()` 方法调用它从而继承这个方法，而不用在这个对象中重复写该方法。

其语法如下：

```js
f1.call(thisArg, arg1, arg2, ...)
```

其参数如下：

1. `thisArg`：接收一个对象，即调用 `call()` 后，函数内部的 `this` 将会指向这个对象。

   这个参数是**可选的**，当不传入该参数时(或将该值指定为 `null` 或者 `undefined` 时)，在**非严格模式**下，函数内部的 `this` 会指向全局对象 `window` ；而在**严格模式**下，  `this` 会指向 `undefined`。

   例如：

   ```js
   //非严格模式下
   var sData = 'marshall';
   
   function display(){
       console.log("sData's value is %s",this.sData);
   }
   
   display.call();  // sData value is marshall
   ```

   ```js
   //严格模式下
   var sData = 'marshall';
   
   function display(){
       console.log("sData's value is %s",this.sData);
   }
   
   display.call();  // Cannot read the property of 'sData' of undefined
   ```

2. `arg1`, `arg2`, …

   即调用函数时指定的参数列表。

   例如：

   ```js
   let arr1 = [1, 2, 3];
   //用call方法调用数组对象原型上的push方法
   Array.prototype.push.call(arr1, 4, 5, 6);
   //这里也可以使用ES6中的扩展运算符
   let arr2 = [4, 5, 6];
   Array.prototype.push.call(arr1, ...arr2);
   ```

### 1.2 `apply()`

`apply()` 方法也是函数对象 Function 的原型上的一个方法。其效果与 `call()` 几乎完全一样。

其语法如下：

```js
f1.apply(thisArg)
f1.apply(thisArg, argsArray)
```

其参数如下：

1. `thisArg`：接收一个对象，即调用 `apply()` 后，函数内部的 `this` 将会指向这个对象。

   这个参数是**可选的**，当不传入该参数时(或将该值指定为 `null` 或者 `undefined` 时)，在**非严格模式**下，函数内部的 `this` 会指向全局对象 `window`；而在**严格模式**下， `this` 会指向 `undefined`。

   例如：

   ```js
   //非严格模式下
   var sData = 'marshall';
   
   function display(){
       console.log("sData's value is %s",this.sData);
   }
   
   display.call();  // sData value is marshall
   ```

   ```js
   //严格模式下
   var sData = 'marshall';
   
   function display(){
       console.log("sData's value is %s",this.sData);
   }
   
   display.call();  // Cannot read the property of 'sData' of undefined
   ```

2. `argsArray`

   一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 `f1` 函数。如果该参数的值为 `null` 或 `undefined`，则表示不需要传入任何参数。

   例如：

   ```js
   var array = ['marshall','eminem'];
   var elements = [0,1,2];
   array.push.apply(array,elements);
   console.log(array);  //['marshall','eminem',0,1,2]
   ```

## 2. `call`和`apply`的区别

### 区别

它们的作用一模一样，区别仅在于**传入参数形式**的不同。

`apply` 接受两个参数，第一个参数指定了函数体内 `this` 对象的指向，第二个参数为一个带下标的集合，这个集合可以为数组，也可以为类数组，`apply` 方法把这个集合中的元素作为参数传递给调用的函数：

```js
const func = function(a,b,c){
    console.log([a,b,c]);
}
func.apply(null, [1,2,3]);
```

这段代码中，参数 1、2、3 被放在数组中一起传入 func 函数，它们分别对应 func 参数列表中的 a 、b 、c。

`call` 传入的参数数量不固定，跟 `apply` 相同的是，第一个参数也是代表函数体内的 `this` 指向，从第二个参数开始往后，每个参数被依次传入函数：

```js
const func = function(a,b,c){
    console.log([a,b,c]);
}
func.call(null, 1, 2, 3);
```

调用一个函数时，JavaScript 的解释器并不会计较形参和实参在数量、类型以及顺序上的区别，JavaScript 的参数在内部就是用一个数组来表示的。

从这个意义上说，`apply` 比 `call` 的使用率更高，不关心具体多少参数被传入函数，只要用 `apply` 一股脑地推过去就可以了。

### 什么时候用 `call()`？

`call` 是包装在 `apply` 上的一颗**语法糖**，如果明确地知道函数接收多少个参数，而且想一目了然地表达形参和实参的对应关系，那么可以用 `call` 来传送参数。

## 3. `call` 和 `apply` 的应用场景

### a. 函数之间的相互调用

### b. 构造函数之间的调用 — 实现属性的继承

### c. 多重继承

1. 场景一：利用 `apply` 实现 `Math.max` 找出数组的最大值

   因为 `Math.max` 不支持 `Math.max([param1,param2])` 也就是传入数组，但是它支持 `Math.max(param1,param2...)`，所以可以根据 `apply` 的特点来解决。

   `var max=Math.max.apply(null,array)`，这样就轻易的可以得到一个数组中的最大项（apply会将一个数组转换为一个参数接一个参数的方式传递给方法）

2. 场景二：利用 `apply` 实现 `Array.prototype.push` 合并数组

   其实这里也是同理，`push` 方法没有提供push一个数组，但是它提供了 `push(param1,param2...paramN)`，同样也可以用 `apply` 来转换一下这个数组，即：

   ```js
   var arr1 = new Array('1', '2', '3');
   var arr2 = new Array('4', '5', '6');
   Array.prototype.push.apply(arr1, arr2);
   ```

### d. 类数组共用数组方法

## 4. `bind` 基础语法

**`bind()`** 方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

其语法如下：

```js
function.bind(thisArg[, arg1[, arg2[, ...]]])
```

参数：

1. `thisArg`：调用绑定函数时作为 `this` 参数传递给目标函数的值。如果使用 `new` 运算符构造绑定函数，则忽略该值。当使用 `bind` 在 `setTimeout` 中创建一个函数（作为回调提供）时，作为 `thisArg` 传递的任何原始值都将转换为 `object`。如果 `bind` 函数的参数列表为空，或者 `thisArg` 是 `null` 或 `undefined`，执行作用域的 `this` 将被视为新函数的 `thisArg`。
2. `arg1, arg2, ...`：当目标函数被调用时，被预置入绑定函数的参数列表中的参数。

`bind()` 方法会返回一个原函数的拷贝，并拥有指定的 `this` 值和初始参数。

## 5. `bind` 方法的效果

**`bind()`** 函数会创建一个新的【**绑定函数（bound function，BF）**】。绑定函数是一个 exotic function object（怪异函数对象，ECMAScript 2015 中的术语），它包装了原函数对象。调用**绑定函数**通常会导致执行**包装函数**。 **绑定函数**具有以下内部属性：

* **[[BoundTargetFunction]]** - 包装的函数对象
* **[[BoundThis]]** - 在调用包装函数时始终作为 **this** 值传递的值。
* **[[BoundArguments]]** - 列表，在对包装函数做任何调用都会优先用列表元素填充参数列表。
* **[[Call]]** - 执行与此对象关联的代码。通过函数调用表达式调用。内部方法的参数是一个**this**值和一个包含通过调用表达式传递给函数的参数的列表。

当调用绑定函数时，它调用 **[[BoundTargetFunction]]** 上的内部方法 **[[Call]]**。

就像这样 **`xx.call(boundThis, args)`**。其中，**`boundThis`** 就是 **[[BoundThis]]**，**`args`** 则是 **[[BoundArguments]]** 加上通过函数调用传入的参数列表，而 `xx` 就是被包装的函数对象，即 **[[BoundTargetFunction]]** 。

## 6. `bind` 方法的应用场景

### 1. 创建(硬)绑定函数

`bind()` 最简单的用法是创建一个绑定函数，**不论怎么调用，这个函数都有同样的 `this` 值**。

JavaScript 新手经常犯的一个错误是将一个方法从对象中拿出来，然后再调用，期望方法中的 `this` 是原来的对象（比如在回调中传入这个方法）。如果不做特殊处理的话，一般会丢失原来的对象，实际上也就是 `this` 绑定丢失的问题。

例如：

```js
function afun() {
    console.log(this.a);
}

var obj = {
    a: 1,
    afun: afun
};

var a = "hello";

setTimeout(obj.afun, 100);//"hello"
```

可以看到，这里将 `obj.fun` 传入作为回调函数后，`this` 的绑定丢失，导致输出了作为全局变量的 `a`。

而 `bind` 可以用来解决这一问题：

```js
this.x = 9;    // 在浏览器中，this 指向全局的 "window" 对象
var module = {
  x: 81,
  getX: function() { return this.x; }
};

module.getX(); // 81

var retrieveX = module.getX;
retrieveX();
// 返回 9 - 因为函数是在全局作用域中调用的

// 利用bind把 'this' 绑定到 module 对象
// 创建一个对象，接收bind返回的函数
// 新手可能会将全局变量 x 与 module 的属性 x 混淆
var boundGetX = retrieveX.bind(module);
boundGetX(); // 81
```

### 2. 偏函数

`bind()` 的另一个最简单的用法是使一个函数拥有**预设的初始参数**。只要将这些参数（如果有的话）作为 `bind()` 的参数写在 `this` 后面。当绑定函数被调用时，这些初始的参数会被插入到目标函数的参数列表的**开始位置**，而**调用时传递给绑定函数的参数会跟在它们后面**。

```js
function list() {
  return Array.prototype.slice.call(arguments);
}

function addArguments(arg1, arg2) {
    return arg1 + arg2
}

var list1 = list(1, 2, 3); // [1, 2, 3]

var result1 = addArguments(1, 2); // 3

// 创建一个函数，它拥有预设参数列表。
var leadingThirtysevenList = list.bind(null, 37);

// 创建一个函数，它拥有预设的第一个参数
var addThirtySeven = addArguments.bind(null, 37);

var list2 = leadingThirtysevenList();
// [37]

var list3 = leadingThirtysevenList(1, 2, 3);
// [37, 1, 2, 3]，可以看到后来传入的参数是跟在预设参数后面的

var result2 = addThirtySeven(5);
// 37 + 5 = 42

var result3 = addThirtySeven(5, 10);
// 37 + 5 = 42，后来传入的参数是跟在预设参数后面，而原函数仅接收两个参数，所以第二个参数被忽略
```

### 3. 配合 `setTimeout`

在默认情况下，使用 [`window.setTimeout()`](https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout) 时，`this` 关键字会指向 [`window`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window)（或 `global`）对象。当类的方法中**需要 `this` 指向类的实例**时，你可能需要显式地把 `this` 绑定到回调函数，就不会丢失该实例的引用。

```js
function LateBloomer() {
  this.petalCount = Math.ceil(Math.random() * 12) + 1;
}

// 在 1 秒钟后声明 bloom
LateBloomer.prototype.bloom = function() {
  window.setTimeout(this.declare.bind(this), 1000);
};

LateBloomer.prototype.declare = function() {
  console.log('I am a beautiful flower with ' +
    this.petalCount + ' petals!');
};

var flower = new LateBloomer();
flower.bloom();  // 一秒钟后，调用 'declare' 方法
```

### 4. 快捷调用

在你想要为一个需要特定的 **`this`** 值的函数创建一个**捷径（shortcut）**的时候，`bind()` 也很好用。

你可以用 [`Array.prototype.slice`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) 来将一个类似于数组的对象（array-like object）转换成一个真正的数组，就拿它来举例子吧。你可以简单地这样写：

```js
var slice = Array.prototype.slice;

// ...

slice.apply(arguments);
```

用 `bind()`可以使这个过程变得简单。在下面这段代码里面，`slice` 是 [`Function.prototype`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/prototype) 的 [`apply()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) 方法的绑定函数，并且将 `Array.prototype` 的 [`slice()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) 方法作为 **`this`** 的值。这意味着我们压根儿用不着上面那个 `apply()`调用了。

```js
// 与前一段代码的 "slice" 效果相同
var unboundSlice = Array.prototype.slice;
var slice = Function.prototype.apply.bind(unboundSlice);

// ...

slice(arguments);
```
