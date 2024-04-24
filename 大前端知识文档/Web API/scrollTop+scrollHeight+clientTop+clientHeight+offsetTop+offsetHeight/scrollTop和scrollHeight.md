# scrollTop 与 scrollHeight

## 1. scrollTop

`scrollTop` 是一个可写的属性，其存在于 DOM 元素身上，属于 DOM API，官方文档中的描述如下：

> `Element.scrollTop` 属性可以获取或设置一个元素的内容**垂直滚动的像素数**。
>
> 一个元素的 `scrollTop` 值是**这个元素的顶部到视口可见内容（的顶部）的距离的度量**。当一个元素的内容没有产生垂直方向的滚动条，那么它的 `scrollTop` 值为0。

如下图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/37d134d290564cb19367ce739cf901ee.png#pic_center)

由于这个属性是可写的，其可以被设置为任何整数值，但在赋值时有以下注意点：

* 如果一个元素**不能被滚动**，那么赋值后，`scrollTop` 属性仍将被设置为0
* 设置`scrollTop`的值小于0，则赋值后，`scrollTop` 被设为0
* 如果设置了超出这个容器可滚动的值, `scrollTop` 会被设为**最大值**.

同时，由于该属性可写的特性，我们经常会使用该属性来实现回到顶部的效果：`element.scrollTop = 0`。

但是，官方文档中同样给出了一个注意事项：

> 警告： 在使用显示比例缩放的系统上，scrollTop可能会提供一个**小数**!

## 2. scrollHeight

`scrollHeight` 同样属于 DOM API，官方文档中的描述如下：

> `Element.scrollHeight` 这个**只读**属性是一个元素**内容高度的度量**，包括由于溢出导致的视图中不可见内容。
>
> `scrollHeight` 的值等于**该元素在不使用滚动条的情况下为了适应视口中所有内容所需的最小高度**，即元素内容的**真实高度**。

没有垂直滚动条的情况下，`scrollHeight` 值与元素视图填充所有内容所需要的最小值 `clientHeight` 相同。

另外，其的高度度量方式也与 `clientHeight` 相同，`scrollHeight` 包括元素的内边距 `padding`，但不包括元素的边框 `border`、外边距 `margin` 以及水平滚动条。另外，`scrollHeight` 也包括 `::before` 和 `::after` 这样的伪元素。

如下图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/fb72858c789d4d62abf04b5ac49cdc35.png#pic_center)

根据该属性的定义，我们常常利用该属性与 `scrollTop`、`clientHeight` 之间的关系来判断元素是否滚动到底部：`element.scrollHeight - element.scrollTop === element.clientHeight`，但这种方式并不是最佳写法，因为 `scrollTop` 可能包含小数！

比较实用的写法如下：

```js
Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) < 1;
```
