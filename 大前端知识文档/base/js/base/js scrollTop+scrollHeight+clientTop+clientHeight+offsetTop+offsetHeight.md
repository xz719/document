# scrollTop、scrollHeight、clientTop、clientHeight、offsetTop以及offsetHeight

## 1. scrollTop 与 scrollHeight

### 1.1 scrollTop

scrollTop 是这六个属性中唯一一个可写的属性。

`Element.scrollTop` 属性可以获取或设置一个元素的内容**垂直滚动的像素数**。

一个元素的 `scrollTop` 值是**这个元素的顶部到视口可见内容（的顶部）的距离的度量**。当一个元素的内容没有产生垂直方向的滚动条，那么它的 `scrollTop` 值为0。

如下图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/37d134d290564cb19367ce739cf901ee.png#pic_center)

由于这个属性是可写的，其可以被设置为任何整数值，但在赋值时有以下注意点：

* 如果一个元素不能被滚动，那么赋值后，`scrollTop` 属性仍将被设置为0
* 设置`scrollTop`的值小于0，则赋值后，`scrollTop` 被设为0
* 如果设置了超出这个容器可滚动的值, `scrollTop` 会被设为最大值.

同时，由于该属性可写的特性，我们经常会使用该属性来实现回到顶部的效果：`element.scrollTop = 0`

### 1.2 scrollHeight

`Element.scrollHeight` 这个**只读**属性是一个元素**内容高度的度量**，包括由于溢出导致的视图中不可见内容。

`scrollHeight` 的值等于**该元素在不使用滚动条的情况下为了适应视口中所有内容所需的最小高度**，即元素内容的真实高度。

没有垂直滚动条的情况下，`scrollHeight`值与元素视图填充所有内容所需要的最小值`clientHeight`相同。

`scrollHeight` 包括元素的`padding`，但不包括元素的`border`和`margin`。另外，`scrollHeight`也包括 `::before` 和 `::after`这样的伪元素。

如下图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/fb72858c789d4d62abf04b5ac49cdc35.png#pic_center)

根据该属性的定义，我们常常利用该属性与 `scrollTop`、`clientHeight` 之间的关系来判断元素是否滚动到底部：`element.scrollHeight - element.scrollTop === element.clientHeight`

## 2. clientTop 与 clientHeight

### 2.1 clientTop

clientTop 同样是一个只读属性，其表示一个元素顶部边框的宽度，这个宽度并不包括顶部外边距或内边距。

### 2.2 clientHeight

这个属性同样是是只读属性，对于没有定义CSS高度或者内部元素的元素，该属性值为0。

若定义了高度或内部的元素，则它是**元素内部的高度**(单位像素)，包含**内边距**，但不包括**水平滚动条、边框和外边距**。

实际上，`clientHeight` 就是`height +  padding - 滚动条`的值，即**元素内容在视口中展示的高度**

如下图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/d48224fea8774b82bdfdc020aea349fd.png#pic_center)

## 3. offsetTop 与 offsetHeight

### 3.1 offsetTop

要了解 `offsetTop` 属性，首先需要了解 `Element.offsetParent` 属性。

 `Element.offsetParent` 属性指向**最近的包含该元素的定位元素**。如果找不到，则指向最近的 tabel 或 table cell 元素，或者是**根元素**（标准模式下为`html`；quirks 模式下为`body`）。另外，当元素的 `display` 属性设置为 `none` 时，`offsetParent` 属性指向 `null`。

而 `offsetTop` 属性，其表示了当前元素相对于其 `offsetParent` 元素的**顶部内边距**的距离。

### 3.2 offsetHeight

`HTMLElement.offsetHeight` 同样是一个只读属性，它返回该元素的**像素高度**，高度包含该元素的**垂直内边距和边框**，且是一个整数。

通常，元素的`offsetHeight`是一种元素CSS高度的衡量标准，包括元素的边框、内边距和元素的水平滚动条（如果存在且渲染的话），但不包含`:before`或`:after`等伪类元素的高度。或者说，`offsetHeight` 是**元素内容、元素边框以及滚动条在视口中展示的高度**。

如下图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/1af02d4ffd944ffaa96a8da9563ddc2c.png#pic_center)

另外，需要注意的是，当一个元素被隐藏时，该属性返回0。
