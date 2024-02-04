# clientTop 与 clientHeight

## 1. clientTop

`clientTop` 同样是一个**只读**属性，其表示一个元素顶部边框 `border` 的宽度，这个宽度并不包括顶部外边距或内边距。

## 2. clientHeight

这个属性同样是是只读属性，对于没有定义CSS高度或者内部元素的元素，该属性值为0。

若定义了高度或内部的元素，则它是**元素内部的高度**(单位像素)，包含**内边距**，但不包括**水平滚动条、边框和外边距**。

实际上，`clientHeight` 就是`height +  padding - 水平滚动条`的值，即**元素内容在视口中展示的高度**

如下图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/d48224fea8774b82bdfdc020aea349fd.png#pic_center)

另外，在根元素（`<html>` 元素）或**怪异模式**下的 `<body>` 元素上使用 `clientHeight` 时，该属性将返回视口高度（不包含任何滚动条）。这是一个 `clientHeight` 的特例。

最后，官方文档中还给提到：

> 此属性会将获取的值四舍五入取整数。如果你需要小数结果，请使用 `element.getBoundingClientRect()`。