# offsetTop 与 offsetHeight

## 1. offsetTop

要了解 `offsetTop` 属性，首先需要了解 `Element.offsetParent` 属性。

`Element.offsetParent` 属性指向**最近的包含该元素的定位元素（即位置属性为relative, absolute, fixed或sticky的一个元素）**。如果找不到，则指向最近的 `tabel` 或 `table cell` 元素，或者是**根元素**（标准模式下为`<html>`；quirks 模式下为`<body>`）。另外，当元素的 `display` 属性设置为 `none` 时，`offsetParent` 属性指向 `null`。

根据其定义，有如下几种情况：

1. 元素自身有 fixed 定位，父元素不存在定位，则 `offsetParent` 的结果为 `null`（firefox中为：body，其他浏览器返回为null）
2. 元素自身无 fixed 定位，且父元素也不存在定位，`offsetParent` 为 `<body>` 元素
3. 元素自身无 fixed 定位，且父元素存在定位，`offsetParent` 为离自身最近且经过定位的父元素（即最近的包含该元素定位元素）
4. `<body>` 元素的 `offsetParent` 是 `null`

而 `offsetTop` 属性，其表示了当前元素相对于其 `offsetParent` 元素的**顶部内边距**的距离。

## 2. offsetHeight

`HTMLElement.offsetHeight` 同样是一个只读属性，它返回该元素的**像素高度**，高度包含该元素的**垂直内边距和边框**，且是一个整数。

通常，元素的`offsetHeight`是一种元素CSS高度的衡量标准，包括元素的边框 `border`、内边距 `padding` 和元素的水平滚动条（如果存在且渲染的话），但不包含 `:before` 或 `:after` 等伪类元素的高度。或者说，`offsetHeight` 是**元素内容、元素边框以及滚动条在视口中展示的高度**。

如下图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/1af02d4ffd944ffaa96a8da9563ddc2c.png#pic_center)

另外，需要注意的是，当一个元素被**隐藏**时，该属性返回0。
