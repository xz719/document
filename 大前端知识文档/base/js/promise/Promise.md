# ES6 Promise

## 1.概述

Promise 是异步编程的一种解决方案，可以替代传统的解决方案，即【回调函数】和【事件】。在 ES6 中统一了用法，并原生提供了 Promise 对象。作为对象，Promise 拥有以下两个特点：

* 状态不受外界影响
* 一旦状态改变，就不会再变化，即任何时候，Promise 对象只有一种状态

## 2.Promise的状态

Promise 有三种状态，分别是`Pending`、`Resolved`、`Rejected`。

Promise 从`Pending`状态开始，如果成功就会转到`Resolved`，并且执行 resolve 回调函数；如果失败就会转到`Rejected`，并执行 reject 回调函数。

## 3.Promise基本用法

通过 Promise 构造函数创建 Promise 对象。

```js
var promise = new Promise((resolve,reject) => {
  // ...
})
```

Promise 构造函数接收一个函数`func`作为参数，该函数有两个参数，它们由JS引擎提供：

* `resolve`：当 Promise 对象转移到**成功**状态，调用 **resolve 回调函数**并将在**`func`函数中的操作结果**作为该回调的参数传递出去。
* `reject`：当 Promise 对象转移到**失败**状态，调用 **resolve 回调函数**并将在**`func`函数中的操作报出的错误**作为该回调的参数传递出去。

例：

```js
function greet(){
  var promise = new Promise(function(resolve,reject){
    var greet = "hello world"
    resolve(greet)  // 将操作结果以参数的形式传递出去
})
  return promise
}
// then方法是Promise转到成功状态后会执行的函数
greet().then(result =>{
  console.log(result)  //hello world
})
```

需要注意的是，虽然 Promise 用于解决异步编程的问题，但是`new Promise(function(){...})`**创建一个 Promise 对象时，函数中的内容会立即执行**！

因此，为了更好地控制代码的运行时机，我们可以将创建 Promise 对象的代码包含在一个函数中，然后通过调用函数的方式控制其执行时机。

## 4.Promise的`then`方法

Promise 的`then`方法接收三个参数：成功的回调、失败的回调、前进的回调。

一般情况下，只需要实现第一个，后面可选。

* 成功的回调函数：接收一个参数，该参数为执行`then`方法的 Promise 对象通过`resolve`方法传出的数据(或者说 Promise 对象的结果)。
* 失败的回调函数：接收一个参数，该参数为执行`then`方法的 Promise 对象通过`reject`方法传出的数据。

在 Promise 转到对应的状态后，就会执行`then`方法中对应的回调函数。

在控制台中执行下面的代码：

```js
function greet () {
  var promise = new Promise (function(resolve, reject){
    var greet = "hello world"
    resolve(greet)
  })
  return promise
}

var p1 = greet()
var p2 = greet().then((v) => {
  console.log(v)
  return 1
})

console.log(p1)
console.log(p2)

// 输出结果
// Promise { <fulfilled>: 'hello world' }
// Promise { <pending> }
// hello world
```

看上面这段代码，首先可以知道，Promise 执行`then`方法后，还是一个 Promise，但是是一个新创建的 Promise。

而关于最终的输出结果，解释如下：

首先是输出的顺序，由于 Promise 的执行，即`then`方法是**异步**的，而最后两句输出语句为同步任务，所以先输出，`console.log(v)`则是在then方法中，属于异步微任务，所以最后输出。

至于输出的数据：

* 这里`p1`获取的 Promise 对象是由greet()函数中返回的 Promise 对象，此时，我们已经通过`resolve`函数将其状态转为了`resolved`(实际上就是`fulfilled`)，所以输出结果为`Promise { <fulfilled>: 'hello world' }`。
* 而`p2`获取的 Promise 对象，则是`then`方法返回的一个新 Promise 对象。此时，`then`方法暂未执行回调，仅仅是返回一个新建的 Promise 对象，所以这里输出`Promise { <pending> }`。
* 最后，`console.log(v)`在then方法中，输出传递进来的信息，没有问题。

而如果我们此时再在控制台中执行下面的代码：

```js
console.log(p2)
```

其输出为：`Promise {<fulfilled>: 1}`

因为此时，`then`方法执行回调完毕，将其返回的 Promise 对象状态置为成功，并**将回调返回的结果作为该 Promise 对象的操作结果**。

而如果此时我们再在后面加上一个then方法：

```js
var p3 = greet().then(v => {
  console.log(v)
  return 1
}).then((v) => {
  // ...
})
console.log(p3)
```

可以看到，p3又是一个新的 Promise 对象。

这样，我们实际上就能够体会到 Promise 最大的特点：**链式调用**。

在上面的例子中，有三个 Promise 对象：

* p1：由`greet()`函数中创建并返回
* p2：执行`p1`的`then`方法后创建并返回
* p3：执行`p2`的`then`方法后创建并返回

其中，**`p2`的创建代表着`p1`中任务的完成**，而`p2`状态转为**成功**则代表着我们传入`p1`的`then`方法中的**成功回调**的完成。`p3`也是同理。

这样，p1、p2、p3实际上形成了一个**链式结构**：

p1 ➡ p2 ➡ p3 ➡ …

其中，**每一个 Promise 都代表了链中另一个异步过程的完成**。

那么，为什么需要这样一个结构呢？

因为在实际开发中，连续执行两个或者多个异步操作是一个很常见的需求，这些需求中往往要求在上一个操作执行成功之后，开始下一个操作，并且还需要**携带上一次操作所返回的结果**，这时，就需要通过 Promise 链来实现了。

而上面的例子中可以看到，在我们向前一个 Promise 对象的`then`方法传入的**回调**中，可以通过**参数**的形式，拿到**前一个 Promise 对象的执行结果**，并在回调中进行下一步的操作。

即写成下面这种形式：

```js
greet().then(v => {
 console.log(v);
 // ...进一步处理
    return ... // 将操作结果返回作为Promise对象的结果
}).then(v => {
    console.log(v);
 // ...进一步处理
    return ... // 将操作结果返回作为Promise对象的结果
}).then(v => {
    console.log(v);
 // ...进一步处理
    return ... // 将操作结果返回作为Promise对象的结果
})...
```

这样就满足了上面的需求。

注意，`then`方法中要有返回值，后续的`then`方法中才能获得上一个 Promise 对象的结果！

## 5.Promise的其它方法

### 5.1 `reject`用法

`reject`方法的作用就是把 Promise 的状态从`pending`置为`rejected`。

前面我们说到过，then方法有三个参数，第二个就是失败的回调，而执行`reject`会在`then`方法中触发执行失败的回调函数。

例：

```js
function judgeNumber (num) {
  var promise = new Promise (function(resolve, reject) {
    num = 5
    if(num < 5){
      resolve("num小于5，值为" + num)
    } else {
      reject("num不小于5，值为" + num)
    }
  })
  return promise
}
 
judgeNumber().then(
  function (message) {
    console.log(message)
  },
  function (message) {
    console.log(message)
  }
)
// 输出：num不小于5，值为5
```

### 5.2 `catch`用法

看下面这段代码：

```js
function judgeNumber(num){
    var promise1 = new Promise(function(resolve,reject){
        num =5;
        if(num<5){
            resolve("num小于5，值为："+num);
        }else{
            reject("num不小于5，值为："+num);
        }
    });
    return promise1;
}
 
judgeNumber().then(
    function(message){
        console.log(message);
    }
)
.catch(function(message){
    console.log(message);
})
```

注意，`catch(failureCallback)` 可以视为`then(null, failureCallback)`的缩略形式。即，这个时候`catch`执行的是和`reject`一样的，也就是说如果 Promise 的状态变为`reject`时，会被`catch`捕捉到。

不过需要特别注意的是，如果**前面`then`方法中设置了`reject`方法的回调函数，则`catch`不会捕捉到状态变为`reject`的情况**。

`catch`还有一点不同的是，如果在`resolve`或者`reject`发生错误的时候，会被`catch`捕捉到，这与java，c++的错误处理时一样的，这样就能避免程序卡死在回调函数中了。

### 5.3 `all`用法

官方文档中对all方法的描述如下：

> 接受一个 Promise 可迭代对象作为输入，并返回单个 Promise。返回的 Promise 在**所有输入的 Promise 都兑现**时（包括传入的可迭代对象为空时）被兑现，其值为一个包含所有兑现值的数组。如果**输入的任何 Promise 被拒绝**，返回的 Promise 也会被拒绝，并返回第一个拒绝的原因。

即`all`方法提供了**并行执行异步操作**的能力 — 在`all`方法中的所有异步操作结束后，才将返回的 Promise 对象置为成功。

例：

```js
function p1(){
    var promise1 = new Promise(function(resolve,reject){
        console.log("p1的第一条输出语句");
        console.log("p1的第二条输出语句");
        resolve("p1完成");
    })
    return promise1;
}
 
function p2(){
    var promise2 = new Promise(function(resolve,reject){
        console.log("p2的第一条输出语句");
        setTimeout(()=>{
            console.log("p2的第二条输出语句");
            resolve("p2完成")},
        2000);
    })
    return promise2;
}
 
function p3(){
    var promise3 = new Promise(function(resolve,reject){
        console.log("p3的第一条输出语句");
        console.log("p3的第二条输出语句");
        resolve("p3完成")
    });
    return promise3;
}
 
Promise.all([p1(),p2(),p3()]).then(function(data){
    console.log(data);
})
```

结果如下：
![在这里插入图片描述](https://img-blog.csdnimg.cn/e68a98b3cbb2441c856a4fe243f90ab6.png#pic_center)
可以看到，异步操作实现了并行执行，且输出结果为一个数组，其中包含了所有 Promise 对象的结果！

### 5.4 `race`用法

官方文档中对race方法的描述如下：

> 接受一个 Promise 可迭代对象作为输入，并返回单个 `Promise`。返回的 Promise **与第一个敲定的 Promise 的最终状态保持一致**。

与`all`方法不同，`race`方法更像是多个并行的异步操作在“赛跑”，而最终返回的 Promise 对象的状态由“赛跑”的“冠军”决定！

例：

将上面代码中的`all`方法改为race方法

```js
Promise.race([p1(),p2(),p3()]).then(function(data){
    console.log(data);
})
```

### 5.5 `any`用法

官方文档中对any方法的描述如下：

> 接受一个 Promise 可迭代对象作为输入，并返回单个 `Promise`。返回的 Promise **在任何输入的 Promise 兑现**时兑现，其值为**第一个兑现的值**。如果**所有输入的 Promise 都被拒绝**（包括传入的可迭代对象为空时），返回的 Promise 将以带有一个包含拒绝原因的数组的 [`AggregateError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/AggregateError) 拒绝。

所以其实际上刚好与`all`方法相反。

### 5.6 `finally`用法

对于`finally`方法，不管 Promise 最后的状态，在**执行完`then`或`catch`指定的回调函数以后，都会执行`finally`方法指定的回调函数**。

这个方法实际上也比较重要，想象一下下面这个场景：

对于一些加载效果的功能，一般请求前页面显示加载效果，请求完成后取消页面加载效果，如果将标识放到`then`里面去处理，那么会导致如果请求出错的情况下，页面一直加载没办法取消。此时就需要将标识放到`finally`中去处理，从而解决了问题！

## 注意

由于 Promise 的执行为异步，所以尤其需要注意下面这种情况：

```js
var i
var promise = new Promise(function(resolve,reject){
    resolve("hello");
})
promise.then(data=>{
    i = 2;
})

console.log(i);
```

 得到的结果是`undefined`,这不是因为 Promise 不能改变外部的值，而是因为当执行`console.log(i)`时，`then()`方法还没执行完！

所以，**不要在 Promise 后面执行一些依赖 Promise 执行而改变的代码**！因为可能 Promise 中的代码并未执行完，或者你可以选择将其延迟输出。

## 补充：async/await语法
