# JS 事件模型

JavaScript 中的事件模型是一种用于处理用户交互和其他类型事件的机制。它允许开发人员对特定事件做出响应，并执行相应的代码，实际上，事件模型其实就是**观察者模式**的体现。

## 1. 了解事件模型

JS 的事件模型基于事件驱动编程的概念，它主要有以下几个组成部分：

* 【事件目标（Event Target）】--- 事件目标是**触发事件的对象**，它可以是文档、窗口、HTML 元素或其他 JS 对象。每个事件目标都可以监听和触发事件。
* 【事件监听器（Event Listener）】--- 事件监听器是一个**函数**，用于**定义事件发生时要执行的代码**。通过将事件监听器附加到事件目标上，可以告诉 JS 在事件发生时调用指定的函数。
* 【事件类型（Event Type）】--- 每一种特定的事件都有其对应的事件类型，比如：点击事件（click）、键盘按下事件（keydown）、鼠标移动事件（mousemove）等等。**每个事件类型都有其特定的属性和行为**。
* 【事件处理程序（Event Handler）】--- 类似事件监听器，事件处理程序也是一个**函数**，它被分配给特定事件类型的监听器，当事件发生时，事件处理程序会被调用，并执行相关的代码。
* 【事件对象（Event Object）】--- 事件对象是一个包含**有关事件的信息**的对象。它提供了与事件相关的属性和方法，可以用于获取事件的详细信息，如事件目标、事件类型等等。

事件模型的基本流程如下：

1. 定位到要监听事件的目标对象
2. 定义事件监听器，并提供事件处理程序
3. 将事件监听器附加到目标对象的特定事件类型上
4. 当事件发生时，事件目标将触发相应的事件，并调用相应的事件处理程序函数
5. 在事件处理程序函数中，进行相应的处理。

事件模型可以分为三种：

* 原始事件模型（DOM0级）
* 标准事件模型（DOM2级）
* IE事件模型

但在具体介绍这三种事件模型之前，我们还需要了解**事件流**的概念。

## 2. 事件流

由于 DOM 是一个树结构，如果在父子节点绑定事件时候，当触发子节点的时候，就存在一个顺序问题，这就涉及到了事件流的概念，而不同的事件模型中，事件流是不同的。

所谓**事件流（Event Flow）**，是指描述事件在 DOM 树中传播和触发的顺序。当事件发生时，它会在 DOM 树的不同节点间传播，最终触发相应的事件处理程序。

事件流同样有两种主要的模型：

* **事件冒泡（Bubbling）**：在冒泡模型中，事件首先在目标元素上触发，然后沿着 DOM 树**向上**冒泡，依次触发父元素的同类事件，即，事件开始时在最具体的元素上触发，然后逐步向上触发，直到到达最顶层的祖先元素。事件冒泡是**默认**的事件流模型，也是最常用的模型。
* **事件捕获（Capturing）**：在捕获模型中，事件从最顶层的祖先元素开始，然后沿着 DOM 树**向下**传播，直到到达触发事件的元素。然后，事件在目标元素上触发，最后不再继续传播。捕获模型在实际开发中使用较少，但可以手动开启。

它们的具体传播过程可以看下面这张图：

![image](https://s.poetries.work/gitee/2019/10/319.png)

为了更加具体地了解这两种模型之间的区别，我们可以看下面这两个实例：

首先准备好 DOM 结构：

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Event Bubbling</title>
    </head>
    <body>
        <button id="clickMe">Click Me</button>
    </body>
</html>
```

先来尝试冒泡模型：

```js
const button = document.getElementById('clickMe');

button.addEventListener("click", function() {
    console.log('1.Button');
});
document.body.addEventListener("click", function() {
    console.log('2.body');
});
document.addEventListener("click", function() {
    console.log('3.document');
});
window.addEventListener("click", function() {
    console.log('4.window');
});
```

点击按钮后，输出如下：

```cmd
1.Button
2.body
3.document
4.window
```

可以看到，事件的自下往上传播并依次触发事件处理程序的。

接下来试试事件捕获模型，我们可以在调用 `addEventListener` 时，传入第三个参数来区分捕获阶段和冒泡阶段。该参数称为 `useCapture`，它是一个布尔值，默认为 false（冒泡阶段）。

```js
button.addEventListener("click", function() {
    console.log('1.Button');
}, true);
document.body.addEventListener("click", function() {
    console.log('2.body');
}, true);
document.addEventListener("click", function() {
    console.log('3.document');
}, true);
window.addEventListener("click", function() {
    console.log('4.window');
}, true);
```

点击按钮后，输出如下：

```cmd
4.window
3.document
2.body
1.Button
```

显然，事件是自上往下传播并依次触发事件处理程序的。

具体例子见：[事件冒泡与事件捕获](./tests/index.html)

从上面的例子可以很明显的看出事件冒泡模型和事件捕获模型之前的区别，但更重要的是，它们都体现了**事件传播**的特性。

## 3. 三种事件模型

了解了事件流，我们就可以进一步来学习三种事件模型了，前面说到过，事件模型可以分为三种：

* 原始事件模型（DOM0级）
* 标准事件模型（DOM2级）
* IE事件模型

下面就分别对这三种模型进行介绍

### 3.1 原始事件模型（DOM0级）

原始事件模型绑定监听函数的方式比较简单，有两种方式：

* HTML代码中直接绑定
  
  ```html
  <input type="button" onclick="fun()">
  ```

* 通过JS代码绑定
  
  ```js
  var btn = document.getElementById('.btn');
  btn.onclick = fun;
  ```

原始事件模型的特性在于：**绑定速度快，且具有很好的跨浏览器优势**。

但由于绑定速度太快，可能出现页面还未完全加载出来，以至于事件无法正常运行的情况。

另外，原始事件模型：

1. 只支持事件冒泡，不支持事件捕获
2. 每一元素，同一类型的事件只能绑定一次，当希望为同一元素的某一类事件绑定多个监听函数时，后绑定的会覆盖先绑定的。

要删除 DOM0 级事件的事件处理程序也很简单，只需要将目标元素的对应事件属性置为 null 即可：

```js
btn.onclick = null;
```

### 3.2 标准事件模型（DOM2级）

在标准事件模型中，一次事件共有三个过程：

* **事件捕获阶段**：事件从 document 一直向下传播到目标元素，依次检查经过的节点是否绑定了事件监听函数，如果有则执行
* **事件处理阶段**：事件到达目标元素，触发目标元素的监听函数
* **事件冒泡阶段**：事件从目标元素冒泡到 document，依次检查经过的节点是否绑定了事件监听函数，如果有则执行

标准事件模型中，为事件绑定监听函数的方式如下：

```js
addEventListener(eventType, handler, useCapture)
```

各参数如下：

* `eventType`：指定事件类型
* `handler`：事件处理函数
* `useCapture`：boolean类型，用于指定是否在捕获阶段进行处理（实际上就是采用何种事件流模型），置为 false 时，采用事件冒泡；置为 true 时，采用事件捕获。默认值为 false。

移除事件监听函数的方式如下：

```js
removeEventListener(eventType, handler, useCapture)
```

注意，**在移除事件监听器时，这三个参数必须与绑定事件监听器时传入的一致！**

标准事件模型主要有两个特性：

1. 可以在一个DOM元素上绑定多个事件处理器，各自并不会冲突
2. 可以不同的阶段中处理事件，从而控制事件处理程序的执行顺序，这一点在前面的例子中实际上已经有所体现了。

### 3.3 IE事件模型

不同于标准事件模型，IE事件模型只有两个阶段：

* **事件处理阶段**：事件到达目标元素, 触发目标元素的监听函数。
* **事件冒泡阶段**：事件从目标元素冒泡到 document, 依次检查经过的节点是否绑定了事件监听函数，如果有则执行

因此，**IE事件模型是不支持事件捕获的**。

IE事件模型中，绑定事件监听函数的方式如下：

```js
attachEvent(eventType, handler)
```

要移除事件监听，与标准事件模型中类似，同样要求**参数与绑定时完全一致**：

```js
detachEvent(eventType, handler)
```

## 4. 事件对象

当事件触发时，默认会创建一个新的对象，并且该对象携带一些属性和方法。并且该对象会作为第一个参数传递给监听函数。

至于事件对象身上的各个属性，可以参考 [官方文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Event)

在这里我们只介绍各事件模型中事件对象的常见属性。

首先是 IE 事件模型中事件对象的常见属性：

* `type`：用于获取事件类型
* `srcElement`：用于获取事件目标
* `cancelBubble`：将该属性置为 true，可以用于阻止事件冒泡
* `returnValue`：将该属性置为 false，可以用于阻止事件默认行为

接下来是原始事件模型和标准事件模型中事件对象的常见属性：

* `type`：用于获取事件类型
* `target`：用于获取事件目标
* `stopPropagation()`：阻止事件冒泡
* `preventDefault()`：阻止事件默认行为
* `stopImmediatePropagation()`：新加入的方法，**阻止监听同一事件的其他事件监听器被调用**，可以用于阻止事件冒泡，也可以阻止事件捕获。但需要注意的是，当同一元素身上有多个同类型事件的监听函数，当此事件触发时，如果其中一个监听器中执行了该方法，那么剩下的监听器都不会被调用！

## 5. 事件流阻止

在实际开发中，经常会遇到需要阻止事件流继续传播或阻止事件的默认行为的情况。

### 5.1 阻止默认行为

一般我们会使用 `event.preventDefault()` 来阻止事件的默认行为。

对于该方法，官方文档中给出的介绍如下：

> Event 对象的 `preventDefault()` 方法：如果此事件没有被显式处理，它默认的动作也不应该照常执行。

此外，官方文档中还提到了两个值得注意的点：

1. `preventDefault()` 方法并不能阻止事件的继续传播！
2. 对于不可取消的事件（例如通过 `EventTarget.dispatchEvent()` 分派的、没有指定 `cancelable: true` 的事件），`preventDefault()` 方法不起作用！

示例参考：[阻止事件默认行为](./tests/阻止事件默认行为.html)

### 5.2 阻止事件冒泡

一般我们会使用 `event.stopPropagation()` 来阻止事件冒泡。

官方文档中是这样描述的：

> Event 对象 `stopPropagation()` 方法阻止捕获和冒泡阶段中当前事件的进一步传播。但是，它不能防止任何默认行为的发生

如果在 IE 事件模型中，则可以使用：

```js
event.returnValue = false;
```

### 5.3 阻止事件捕获

如果我们在标准事件模型中，采用了事件捕获的事件流模型，同时，我们又希望能够阻止事件捕获的进一步传播，我们要怎么做呢？

根据官方文档中的内容， `stopPropagation()` 也可以用于阻止事件捕获。

### 5.4 `stopPropagation` 与 `stopImmediatePropagation` 的区别

一般来说，只希望事件只触发在目标上，这时候可以使用 `stopPropagation` 来阻止事件的进一步传播。

通常认为 `stopPropagation` 是用来阻止事件冒泡的，其实该函数也可以阻止捕获事件。而 `stopImmediatePropagation` 同样也能实现阻止事件冒泡和捕获，但其还能阻止该事件目标执行别的注册事件

即，`stopImmediatePropagation()` 和 `stopPropagation()` 的区别在于：后者只会阻止冒泡或者是捕获。但是前者除此之外还会阻止该元素的其他监听器被触发，但是后者就不会。

如果想要进一步了解 `stopImmediatePropagation()` 这个方法，可以参考 [Event stopImmediatePropagation](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/stopImmediatePropagation)

## 6. 事件代理/事件委托

### 6.1 为什么需要事件委托？

假设一个 ul 下有 100 个 li 元素，每个 li 有相同的点击事件。如果为每个 li 都添加事件，则会造成 dom 访问次数过多，引起浏览器重绘与重排的次数过多，性能则会降低。

事件委托就是为了解决这样的问题。此外，使用事件委托后，我们也不需要一个一个地为子元素注销事件。

### 6.2 事件委托的原理是什么？

事件委托实际上是通过**事件冒泡**来实现的，当触发内部元素的点击事件时，点击事件会冒泡到最外层节点上，这样，我们就只需要监听最外层节点的点击事件，并为其准备好事件处理程序，然后在函数中对不同目标进行处理即可！

实例参考：[事件委托](./tests/事件委托.html)

### 6.3 事件委托的优势在于？

从上面其实我们已经知道了事件委托的优势：

* 减少了 DOM 操作
* 节省内存
* 不需要单独为子节点注册、注销事件
