# Vue.js 3 的设计思路

本章从全局视角了解 Vue.js 3 的设计思路、工作机制以及其重要组成部分。

## 3.1 声明式地描述 UI

Vue 中的 UI 被分为两个部分：

1. 声明式的模板描述：

    ```vue
    <div :id="id" :class="{ tClass: true }" @click="onClick"></div>
    ```

2. 命令式的 render 函数：

   ```js
      import { h } from 'vue'

      export default {
        render() {
            return h('h1', { onClick: handler });
        }
      }
   ```

这里的模板实际上就是我们所说的 template 模板，其会被编译器进行编译，从而得到一个组件的渲染函数，也就是上面的命令式的 render 函数。

这里解释一下【组件的渲染函数】，其是一个用于描述组件要渲染的内容的函数，它**由组件模板编译而来，最终返回一个虚拟 DOM**，然后 Vue.js 就可以将组件的内容渲染出来了。

## 3.2 初识渲染器

现在我们得到了由组件编译而来的虚拟 DOM，其中描述了组件需要渲染的内容，也就是真实 DOM 的结构，但我们还需要将虚拟 DOM 转化为真实 DOM 并渲染到浏览器中，这就需要用到【渲染器】了。

渲染器的作用就是把虚拟 DOM 渲染为真实 DOM。需要注意的是，在 Vue.js 真正的实现中，渲染器本质上是函数 createRender 的返回值，**一个名为 renderer 的对象**，其身上包含一个 render 方法，也就是真正实现渲染功能的方法。

例如下面的虚拟 DOM：

```js
const vnode = {
    tag: 'div',
    props: {
        onclick: () => alert('hello'),
    },
    children: 'click me'
}
```

我们可以编写下面的 render 方法：

```js
function render(vnode, container) {
    // 1. 创建 DOM 元素
    const el = document.createElement(vnode.tag);
    // 2. 遍历 props 属性，将其添加到元素身上
    for (const key in object) {
        // 如果以 on 开头，则是事件
        if (/^on/.test(key)) {
            el.addEventListener(
                key.substr(2).toLowerCase(),    // 事件名称
                vnode.props[key],               // 事件处理函数
            )
        }
        // ...
    }

    // 处理子结点
    if (typeof vnode.children === 'string') {
        const text = document.createTextNode(vnode.children);
        el.appendChild(text);
    } else if (vnode.children) {
        vnode.children.forEach(child => render(child, el));
    }

    container.appendChild(el);
}
```

当然，这里只是最为简单的实现，不过通过这个方法，我们可以大致理清渲染器的实现思路：

1. 创建元素
2. 为元素添加属性和事件
3. 处理元素子结点

不过我们现在做的仅仅是创建节点，渲染器真正的精髓都在更新节点的阶段，当我们对 vnode 做一些修改时，渲染器需要精确地找到 vnode 对象的变更点并且只更新变更的内容，而不需要再走一遍完整的创建流程。这些内容后续章节会详细讲解。

## 3.3 组件的本质

在前面的学习中，我们了解了虚拟 DOM、渲染器，那么组件又是什么呢？

我们需要知道：**虚拟 DOM 除了能够描述 DOM 之外，还能够描述组件**。

此外，我们还需要搞清楚组件的本质：**一组 DOM 元素的封装**，而这一组 DOM 元素，就是组件需要渲染的内容。

我们可以使用**函数或对象**来描述一个组件，当我们用对象来描述组件时，其内部有一个 render 方法，根据前面的学习我们知道，这个 render 方法实际上就是组件的渲染函数，执行这个方法，就会得到组件的虚拟 DOM，也即组件要渲染的内容。

实际上，Vue.js 中的有状态组件就是以对象形式来描述的，至于用函数描述组件，这个后续的章节会介绍。

## 3.4 模板（template）的工作原理

在[第一章](./第一章：权衡的艺术.md)中探讨运行时 + 编译时框架的时候，我们提到过，在用户提供模板后，我们需要一个 Compiler 程序，将模板编译为描述 DOM 的树型数据对象。

结合本章的学习，我们实际上可以发现，描述 DOM 的树型数据对象对应的就是虚拟 DOM，Compiler 程序对应的就是我们的编译器。当然，更进一步，编译器会将模板编译为组件的渲染函数，而渲染函数通过返回值来提供组件内需要渲染的内容，也即虚拟 DOM。

> 所以，无论是使用模板还是直接手写渲染函数，对于一个组件来说，它要渲染的内容最终都是通过**渲染函数**产生的，然后渲染器再把渲染函数返回的虚拟 DOM 渲染为真实 DOM，这就是模板的工作原理，也是 Vue.js 渲染页面的大致流程。
