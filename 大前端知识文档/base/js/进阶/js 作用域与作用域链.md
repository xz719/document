# 作用域与作用域链

## 1. 什么是作用域？

**作用域指一个变量的作用的范围** 。通常来说，一段程序代码中所用到的名字并不总是有效和可用的，而限定这个名字的可用性的代码范围就是这个名字的作用域。作用域的使用提高了程序逻辑的局部性，增强了程序的可靠性，减少了名字冲突。

JS中作用域有：

1. **全局作用域**

2. **函数作用域**

最开始并没有**块作用域**的概念。

ES6中新增了**块级作用域**，使用 `let` 声明的变量只能在块级作用域里访问，有“暂时性死区”的特性（也就是说声明前不可用）。

**块作用域由 `{ }` 包括，if语句和for语句里面的 `{ }` 也属于块作用域。**

## 2. 作用域与执行上下文的区别

有不少人会把作用域与【执行上下文】的概念混淆，所以这里先来说一下这两者的区别。

JavaScript属于解释型语言，执行分为解释和执行两个阶段：

**解释阶段：**

* 词法分析
* 语法分析
* 作用域规则确定

**执行阶段：**

* 创建执行上下文
* 执行函数代码
* 垃圾回收

JavaScript 解释阶段便会确定**作用域规则**，因此作用域在函数**定义时**就已经确定了。

执行上下文最明显的就是 `this` 的指向是**执行时**确定的。而作用域访问的变量是编写代码的结构时确定的。

总的来说， 【执行上下文】在**运行时**确定，随时可能改变，【作用域】在**定义时**就确定，并且不会改变。

## 3. 变量与声明变量的关键字

提到作用域，就不得不提到变量与 JS 中声明变量的三个关键字。

> ECMAScript 变量是**松散类型**的，意思是**变量可以用于保存任何类型的数据**。每个变量只不过是一个用于保存任意值的命名占位符。有 3 个关键字可以声明变量：var、const 和 let。其中，var 在 ECMAScript 的所有版本中都可以使用，而 const 和 let 只能在 ECMAScript 6 及更晚的版本中使用。

## 4. `var`

### 4.1 `var` 声明变量的作用域

看下面这段代码：

```js
function test() {
    var message = "hi"; // 局部变量
}
test();
console.log(message); // 出错
```

**使用 `var` 操作符定义的变量会成为包含它的函数的局部变量**。比如，使用 `var` 在一个函数内部定义一个变量，就意味着该变量将在函数退出时被销毁。

不过，在函数内定义变量时**省略 `var` 操作符**，可以创建一个**全局变量**

```js
function test() {
    message = "hi"; // 全局变量
}
test();
console.log(message); // "hi"
```

这里去掉了 `var` 后，变量就成为了全局的，可以在函数外部访问到。

但是在严格模式下，如果像这样给未声明的变量赋值，则会导致抛出 ReferenceError！

### 4.2 `var` 声明提升

使用 `var` 时，下面的代码不会报错，但也不会输出26，而是输出 `undefined`。

```js
function foo() {
 console.log(age);
 var age = 26;
}
foo(); // undefined
```

因为 ECMAScript 运行时把它看成等价于如下代码：

```js
function foo() {
 var age;
 console.log(age);
 age = 26;
}
foo(); // 此时变量赋值在console的后面，所以输出为undefined
```

这就是所谓的【**提升(hoist)**】，也就是**把所有变量声明都拉到函数作用域的顶部**。

此外，反复多次使用 `var` 声明同一个变量也没有问题：

```js
function foo() {
 var age = 16;
 var age = 26;
 var age = 36;
 console.log(age);
}
foo(); // 36
```

## 5. `let`

`let` 跟 `var` 的作用差不多，但有着非常重要的区别。最明显的区别是，`let` 声明的范围是**块作用域**， 而 `var` 声明的范围是**函数作用域**。

这也是 JS 中的新概念。块级作用域由最近的一对**包含花括号 `{}`** 界定。

换句话说，if 块、while 块、function 块，甚至连单独的块也是 `let` 声明变量的作用域.

例如：

```js
if (true) {
    var name = 'Matt';
    console.log(name); // Matt
}
console.log(name); // Matt，说明name变量的作用域为全局
if (true) {
    let age = 26;
    console.log(age); // 26
}
console.log(age); // 报错，说明let声明的变量age的作用域只在if块中！
```

同时，`let` 也不允许同一个块作用域中出现冗余声明。这样会导致报错：

```js
var name;
var name; //var是允许重复声明的
let age;
let age;
//SyntaxError: Identifier 'age' has already been declared
```

对声明冗余报错不会因混用 `let` 和 `var` 而受影响。这两个关键字声明的并不是不同类型的变量， 它们只是**指出变量在相关作用域如何存在**。

```js
var name1;
let name1; // SyntaxError
let age1;
var age1; // SyntaxError
```

可以看到，用不同关键字声明同名变量仍然会报错！

### 5.1 暂时性死区

`let` 与 `var` 的另一个重要的区别，就是 **`let` 声明的变量不会在作用域中被提升**。

```js
// name 会被提升
console.log(name); // undefined
var name = 'Matt';
// age 不会被提升
console.log(age); //  Cannot access 'age' before initialization
let age = 26;
```

在解析代码时，JavaScript 引擎也会注意出现在块后面的 `let` 声明，只不过在此之前不能以任何方式来引用未声明的变量。

在 `let` 声明之前，该变量都是不可用的。这在语法上被称为【**暂时性死区(temporal dead zone)**】，使用 `let` 声明的变量都是先声明再使用 ，**不存在变量提升问题**。

同样地，使用 const 声明的变量也存在暂时性死区。那么，**为什么 `let`，`const` 有暂时性死区，而 `var` 没有？**

因为 `var` 有预处理机制，也就是**变量提升**。

### 5.2 `let` 全局声明

与 `var` 不同，使用 `let` 在全局作用域中声明的变量**并不会成为 `window` 对象的属性**。

例如：

```js
var name = 'Matt';
console.log(window.name); // 'Matt'
let age = 26;
console.log(window.age); // undefined
```

不过，`let` 声明仍然是在全局作用域中发生的，相应变量会在页面的生命周期内存续。

即，`let` 声明的变量仍为**全局变量**，但其不会作为 `window` 对象的一个属性！因此，为了 避免 SyntaxError，必须**确保页面不会重复声明同一个变量**。

### 5.3 `let`与条件声明模式

在使用 `var` 声明变量时，由于声明会被提升，JavaScript 引擎会自动**将多余的声明在作用域顶部合并为一个声明**。

而因为 `let` 的作用域是块，所以不可能检查前面是否已经使用 `let` 声明过同名变量，同时也就不可能在没有声明的情况下声明它。

```html
<script>
 var name = 'Nicholas';
 let age = 26;
</script>
<script>
 // 假设脚本不确定页面中是否已经声明了同名变量
 // 那它可以假设还没有声明过
 var name = 'Matt';
 // 这里没问题，因为可以被作为一个提升声明来处理
 // 不需要检查之前是否声明过同名变量
 let age = 36;
 // 但这里age在前面的块中声明过，这里会报错
</script>
```

使用 `try/catch` 语句或 `typeof` 操作符也不能解决，因为条件块中 `let` 声明的作用域仅限于该块。

```html
<!-- 采用条件声明模式 -->
<script>
    let name = 'Nicholas';
    let age = 36;
</script>
<script>
    // 假设脚本不确定页面中是否已经声明了同名变量
    // 那它可以假设还没有声明过
    if (typeof name === 'undefined') {
        let name;
    }
    // name 被限制在 if {} 块的作用域内
    // 因此这个赋值形同全局赋值
    name = 'Matt';
    try {
        console.log(age); // 如果 age 没有声明过，则会报错
    }
    catch (error) {
        let age;
    }
    // age 被限制在 catch {}块的作用域内
    // 因此这个赋值形同全局赋值
    age = 26;
</script>
```

所以，对于 `let` 这个新的 ES6 声明关键字，不能依赖条件声明模式

### 5.4 for循环中的 `let` 声明

`let` 出现之前，for循环定义的迭代变量会渗透到循环体外部：

```js
for (var i = 0; i < 5; ++i) {
    // 循环逻辑
}
console.log(i); // 5
```

改成使用 `let` 之后，这个问题就消失了，因为迭代变量的作用域仅限于for循环块内部

```js
for (let i = 0; i < 5; ++i) {
    // 循环逻辑
}
console.log(i);// i is not defined
```

### 6. `const`

`const` 的行为与 `let` 基本相同，唯一一个重要的区别是用它声明变量时必须**同时初始化变量**，且尝试修改 `const` 声明的变量会导致运行时错误。

它与 `let` 的相似点在于以下两点：

```js
// const 也不允许重复声明
const name1 = 'Matt';
const name1 = 'Nicholas'; 
```

```js
// const 声明的作用域也是块
const name2 = 'Matt';
if (true) {
    const name2 = 'Nicholas';
}
console.log(name2);//Matt
```

但注意：`const` 声明的限制只适用于它指向的变量的**引用**。

换句话说，如果 `const` 变量引用的是一个对象，那么修改这个对象内部的属性并不违反 `const` 的限制！

例如：

```js
const person = {};
person.name = 'Matt'; // ok
```

同时 `const` 也不能用于声明for循环中的迭代变量，因为迭代变量会自增。

## 6. 作用域链

### 6.1 了解作用域链

想了解作用域链，首先需要了解[执行上下文与执行栈](https://blog.csdn.net/cannotbecounted/article/details/131524102)的概念。

而至于作用域链，在《你不知道的JavaScript》中给出了描述：

> 当一个块或函数嵌套在另一个块或函数中时，就发生了**作用域的嵌套**。因此，在当前作用域中无法找到某个变量时，引擎就会在外层嵌套的作用域中继续查找，直到找到该变量，或抵达最外层的作用域（也就是全局作用域）为止。

来看下面这个例子：

```js
var color = "blue";
function changeColor() {
    console.log(color)//blue
    if (color === "blue") {
        color = "red";
    } else {
        color = "blue";
    }
}
changeColor();
```

函数 `changeColor()` 的作用域链包含两个对象：一个是**它自己的变量对象**（就是定义 arguments 对象的那个），另一个是**全局上下文的变量对象**。这个函数内部之所以能够访问变量 `color`，就是因为可以在作用域链中找到它

使用 `let` 和 `const` 时也是一样的：

```js
let color = "blue";
const color_b = 'red'
function changeColor() {
    console.log(color)//blue
    console.log(color_b)//red
}
changeColor();
```

那如果在函数的内部重新声明一个同名变量呢？

```js
let color = "blue";
const color_b = 'red'
function changeColor() {
    let color = 'yellow'
    console.log(color)//yellow
    const color_b = 'black'
    console.log(color_b)//black
}
changeColor();
console.log(color)//blue
console.log(color_b)//red
```

所以，可以看出，搜索过程始终**从作用域链的最前端开始，然后逐级往后，直到找到标识符**。

而这里，在执行后面两句 log 时，函数内部的变量已经被销毁了，因此此时只能拿到全局变量对象身上的两个属性！

同时注意，**函数参数被认为是当前上下文中的变量，因此也跟上下文中的其他变量遵循相同的访问规则。**

### 6.2 标识符查找

实际上，上面的几个例子都可以通过**标识符查找**来解释

> 当在特定上下文中为读取或写入而引用一个标识符时，必须通过**搜索**确定这个标识符表示什么。
>
> 搜索开始于作用域链前端，以给定的名称搜索对应的标识符。如果在局部上下文中找到该标识符，则搜索停止，变量确定；如果没有找到变量名，则继续沿作用域链搜索。（注意，作用域链中的对象也有一个 原型链，因此搜索可能涉及每个对象的原型链。）
>
> 这个过程一直持续到搜索至全局上下文的变量对象，如果仍然没有找到标识符，则说明其未声明。

下面来看一个例子：

```js
var color = 'blue';
function getColor() {
 return color;
}
console.log(getColor()); // 'blue' 
```

在这个例子中，调用函数 `getColor()` 时会引用变量 `color`。为确定 `color` 的值会进行两步搜索。

* 第一步，搜索 `getColor()` 的变量对象，查找名为 `color` 的标识符，没找到。
* 第二步，继续搜索下一个变量对象（来自**全局上下文**），因为全局变量对象上有  `color` 的定义，然后就找到了名为 `color` 的标识符，进而搜索结束。

对这个搜索过程而言，引用局部变量会让搜索停止，而不继续搜索下一级变量对象。也就是说， **如果局部上下文中有一个同名的标识符，那就不能在该上下文中引用父上下文中的同名标识符**。

再看下面这个例子：

```js
var color = 'blue';
function getColor() {
 let color = 'red';
 return color;
}
console.log(getColor()); // 'red'
```

上面这个例子，`getColor()` 执行时，返回了 `color`，它会优先在当前的上下文中查找，而此时 `getColor()` 的变量对象上有其定义，所以此时引用局部变量 `color` 即可，搜索结束。

而当我们进一步添加层级时：

```js
var color = 'blue';
function getColor() {
 let color = 'red';
 {
     let color = 'green';
     return color;
 }
}
console.log(getColor()); // 'green' 
```

在这个修改后的例子中，`getColor()` 内部声明了一个名为 `color` 的局部变量。

在调用这个函数时，首先在函数作用域中声明了值为 red 的 `color`，但是后续，又添加了一个块作用域，并在里面声明了一个值为 green 的变量 `color`。在执行到函数返回语句时，代码引用了变量 `color`。

于是开始在局部上下文中搜索这个标识符，结果找到了值为 green 的变量 `color`。因为变量已找到，搜索随即停止，所以就使用这个局部变量。这意味着函数会返回 green 。

因此，在局部变量 `color` 声明之后，在这个块中的任何代码都无法访问全局变量 `color`，除非使用完全限定的写法 `window.color`。

这就是【标识符查找】。

> 注意，**标识符查找并非没有代价**。访问局部变量比访问全局变量要快，因为不用切换作用域。不过，JavaScript 引擎在优化标识符查找上做了很多工作，将来这个差异可能就微不足道了。

### 6.3 作用域增强

虽然执行上下文主要有全局上下文和函数上下文两种（eval()调用内部存在第三种上下文），但有其他方式来**增强作用域链**。

某些语句会导致**在作用域链前端临时添加一个上下文**，这个上下文在代码执行后会被删除。通常在两种情况下会出现这个现象，即代码执行到下面任意一种情况时：

* `try/catch` 语句的 catch 块
* `with` 语句

这两种情况下，都会在作用域链前端添加一个变量对象。

对 `with` 语句来说，会向**作用域链前端添加指定的对象**

对 `catch` 语句而言，则会**创建一个新的变量对象**，这个变量对象会包含要抛出的错误对象的声明。

看下面这个例子：

```js
function buildUrl() {
     let qs = "?debug=true";
     with(location){
  // let url = href + qs;
      var url = href + qs;
     }
     return url;
} 
```

这里，`with` 语句将 `location` 对象作为上下文，因此 `location` 会被添加到作用域链前端。`buildUrl()` 函数中定义了一个变量 `qs`。

当 `with` 语句中的代码引用变量 `href` 时，实际上引用的是 `location.href`，也就是自己作用域的变量对象身上的属性。在引用 `qs` 时，引用的则是定义在 `buildUrl()` 中的那个变量，它定义在函数上下文的变量对象上。

另外，在 `with` 语句中使用 `var` 声明的变量 `url` 会成为函数上下文的一部分，可以作为函数的值被返回；但像使用 `let` 声明的变量 `url`，因为被限制在块级作用域，所以在 `with` 块之外没有定义.

这里只是简单地介绍作用域链增强，更加具体的内容可以参加下面的文章。

## 7.深入了解

[JS作用域](https://blog.csdn.net/qq_42012626/article/details/120328731)
