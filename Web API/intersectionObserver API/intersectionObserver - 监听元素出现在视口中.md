# Web API - IntersectionObserver

过去，要检测一个元素是否可见或者两个元素是否相交并不容易，比如在实现无限滚动、图片懒加载等等时，传统的实现方式是监听 `scroll` 事件，然后通过目标元素的 `getBoundingClientRect()` 方法，得到它对应于视口左上角的坐标，然后再判断其是否出现在视口中。这种方法的缺点在于：由于 `scroll` 方法密集发生，计算量很大，容易造成**性能问题**！

而现在通过 [IntersectionObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver) 这个 API，我们能够便捷且高效的实现上述功能。

可见，实际上就是指目标元素与视口产生了交叉，这也是为什么这个 API 叫做 IntersectionObserver，即【交叉观察器】。

## 1. 简单使用

首先简单看看这个 API 的使用，第一步先创建一个观察器的实例

```js
// 创建观察器实例
const observer = new IntersectionObserver(callback, option)
```

`IntersectionObserver` 是由浏览器原生提供的构造函数，其接受两个参数：

1. `callback` --- 监听目标可见性变化时的回调函数
2. `option` --- 配置对象（可选）

获取到观察器实例后，我们可以使用其身上的一系列方法：

```js
// 开始观察
observer.observe(document.getElementById('example'))

// 停止观察
observer.unobserve(element1)

// 关闭观察器
observer.disconnect()
```

在上述代码中，`observe` 和 `unobserve` 方法的参数均为 DOM 节点对象。我们可以通过多次执行 `observe` 方法来实现对多个目标节点的观察：

```js
observer.observe(document.getElementById('exampleA'))
observer.observe(document.getElementById('exampleB'))
```

## 2. API 参数介绍

前面提到过，`IntersectionObserver` 方法接受两个参数：

1. callback
2. option

### 2.1 `callback` 参数

当以下情况发生时会调用回调函数 `callback`：

* Observer 第一次监听目标元素的时候（即执行 `observe` 方法时）
* 每当目标元素的可见性发生变化时

```js
let observer = new IntersectionObserver(entries => {
    console.log(entries)
})

observer.observe(document.getElementById("elementA"));
...
```

上述代码中，可以看到，`callback` 函数的参数 `entries` 是一个数组，其中的每个成员都是一个 `IntersectionObserverEntry` 对象。具体来说，`entries` 中存放了所有**可见性发生变化**的观察对象！举例来说，如果同时有4个被观察的对象，其中有两个对象的可见性发生了变化，那么 `entries` 数组中就会有两个成员。

示例见 [callback调用时机以及其参数](./tests/base/callback.js)

前面我们说到，`entries` 数组中的每一个成员都是一个 `IntersectionObserverEntry` 对象，那么，什么是 `IntersectionObserverEntry` 对象？它身上都有哪些属性？

#### 2.1.1 IntersectionObserverEntry 对象

遍历上个例子中的 `entries` 数组，将其中各成员打印出来：

[![pFY6yi8.png](https://s11.ax1x.com/2024/02/20/pFY6yi8.png)](https://imgse.com/i/pFY6yi8)

可以看到，`IntersectionObserverEntry` 对象中提供了观察元素的一些信息，其身上共有6个属性：

1. `time` --- 目标元素可见性发生变化的时间，其本身是一个高精度的时间戳，单位为毫秒
2. `target` --- 被观察的目标元素，即 DOM 节点对象
3. `rootBounds` --- 根元素的矩形区域的信息，其实际上与调用根元素的 `getBoundingClientRect()` 所返回的信息一致！如果没有根元素（即目标元素直接相对于视口滚动），则返回 `null`
4. `boundingClientRect` --- 目标元素的矩形区域的信息
5. `intersectionRect` --- 目标元素与视口或根元素的交叉区域的信息
6. `intersectionRatio` --- 目标元素的可见比例，实际上就是 `intersectionRect` 占 `boundingClientRect` 的比例，元素完全可见时为1，完全不可见时则小于等于0。

示例见 [IntersectionObserverEntry 对象](./tests/base/intersectionObserverEntry.js)

#### 2.1.2 实例：图片懒加载

实际上，我们前面学习的内容已经足够帮助我们实现一些简单的功能了。所以，在介绍 `option` 参数之前，我们先来用一个实例进一步熟悉一下这个 API 的用法：

HTML

```html
<style>
    .container {
        width: 100%;
        height: 5000px;
        padding-top: 3000px;
    }
    .lazy_load {
        width: 100px;
        min-height: 100px;
        margin-bottom: 400px;
    }
</style>

<div class="container">
    <div class="lazy_load" style="background-color: antiquewhite;">
        <template>
            <img src="https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="">
        </template>
    </div>
    <div class="lazy_load" style="background-color: aqua;">
        <template>
            <img src="https://images.pexels.com/photos/547115/pexels-photo-547115.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="">
        </template>
    </div>
    <div class="lazy_load" style="background-color: darkcyan;">
        <template>
            <img src="https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="">
        </template>
    </div>
    <div class="lazy_load" style="background-color: fuchsia;">
        <template>
            <img src="https://images.pexels.com/photos/9391321/pexels-photo-9391321.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="">
        </template>
    </div>
</div>
```

JS

```js
function query(selector) {
  return Array.from(document.querySelectorAll(selector));
}

let flag = 0

var observer = new IntersectionObserver((entries) => {
  // 由于回调函数会在调用 observe 方法时就执行一次，而为了实现懒加载，调用 observe 时显然是不能将template中的img插入真实 DOM 中的，所以这里用一个flag来标识一下
  if (!flag) {
    flag = 1
    return
  }
  entries.forEach(entry => {
    var container = entry.target;
    var content = container.querySelector("template").content;
    // 将模板内的img插入真实DOM中，此时才会请求静态资源！
    container.appendChild(content);
    observer.unobserve(container);
  });
});

query(".lazy_load").forEach(item => {
  observer.observe(item);
});
```

上述代码中，用 `IntersectionObserver` 对页面中类名为 `lazy_load` 的元素进行了监听。当这些元素出现在视口中时，会将这些元素内部的 `template` 中的内容作为 content 插入到元素中，进而引发**静态资源的加载**，也就是去请求图片。

此外，需要注意的是，由于回调函数在第一次调用 `observe` 方法时也会执行，所以我们还需要用一个 `flag` 标识一下，让它在第一次调用时不进行操作。

示例见：[懒加载](./tests/lazy%20load)

### 2.2 `Option` 参数

`IntersectionObserver` 构造函数的第二个参数是一个配置对象。它可以设置以下属性：

#### 2.2.1 `threshold` 属性

`threshold` 属性决定了**什么时候触发回调函数**。它是一个数组，每个成员都是一个**门槛值**，默认为 `[0]`，即交叉比例 `intersectionRatio` 达到 0 时触发回调函数。

我们可以自定义这个数组，比如：`[0, 0.25, 0.75, 1]` 就表示当目标元素完全不可见、25%可见、75%可见以及完全可见时，都会触发回调函数，示例：[option 参数](./tests/base/option.js)

#### 2.2.2 `root` 和 `rootMargin` 属性

很多时候，目标元素不仅会随着窗口滚动，还会在容器里面滚动（比如在iframe窗口里滚动）。容器内滚动也会影响目标元素的可见性，参见下图：

![img](https://www.ruanyifeng.com/blogimg/asset/2016/bg2016110201.gif)

IntersectionObserver API 支持**容器内滚动**。`root` 属性指定目标元素所在的容器节点（即根元素）。注意，容器元素必须是目标元素的**祖先节点**。

示例：[root 和 rootMargin 属性](./tests/option/root.js)

此外，除了 `root` 属性，还有 `rootMargin` 属性。后者定义根元素的 `margin`，用来扩展或缩小 `rootBounds` 这个矩形的大小，从而影响 `intersectionRect` 交叉区域的大小。它使用 CSS 的定义方法，比如10px 20px 30px 40px，表示 top、right、bottom 和 left 四个方向的值。

## 3. 注意

* IntersectionObserver API 是**异步的**，不随着目标元素的滚动同步触发。
* 注册的回调函数将会在主线程中被执行，所以该函数执行速度**要尽可能的快**。如果有一些耗时的操作需要执行，建议使用 `window.requestIdleCallback()` 方法。
