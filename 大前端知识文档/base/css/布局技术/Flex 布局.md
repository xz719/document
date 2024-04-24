# Flex 弹性布局

## 了解 Flex 布局

Flex — Flexible Box，即【弹性布局】。

任何一个容器均可以指定为 Flex 布局。

```css
.box {
    display: flex;
}
/* 行内元素也可以使用 Flex 布局 */
.box {
    display: inline-flex;
}
/* 对于Webkit内核的浏览器，需要加上 -webkit- 前缀 */
.box {
    display: -webkit-flex; /* 例如：Safari */
}
```

需要注意的是：**将某一元素设置为 Flex 布局后，子元素的 `float` 、`clear` 以及 `vertical-align` 属性将会失效！**

## Flex 布局中的几个基本概念

对于采用 Flex 布局的元素，其被称为 **Flex 容器(Flex container)**，简称为【容器】。它的所有子元素自动成为容器的成员，称为 **Flex 项目(Flex item)**，简称【项目】。

![请添加图片描述](https://img-blog.csdnimg.cn/1a842df6866941ada615dbed524a07b3.png)

如上图， Flex 容器中，默认存在两根轴：

1. 水平的**主轴(main axis)**
2. 垂直的**交叉轴(cross axis)**

主轴的**开始位置(即与容器边框的交点)叫做 main start**，而**结束位置则叫做 main end**。

交叉轴的**开始位置叫做cross start**，**结束位置叫做cross end**。

其中，Flex item 默认沿主轴排列。

对于单个项目，其所占据的**主轴空间叫做 main size**，其所占据的**交叉轴空间叫做 cross size**。

## 容器 (Flex container) 的属性

容器有6个属性：

* flex-direction
* flex-wrap
* flex-flow
* justify-content
* align-items
* align-content

### 1. `flex-direction` 属性

`flex-direction` 属性用于决定容器主轴的方向。(由于项目默认沿主轴排列，所以实际上也是决定项目的排列方向)。

```css
.box {
 display: flex;
    flex-direction: row | row-reverse | column | column-reverse;
}
```

`flex-direction` 属性有4个值

* `row`（默认）：主轴为**水平方向**，起点在**左端**（项目从左往右排列）。
* `row-reverse`：主轴为**水平方向**，起点在**右端**（项目从右往左排列）。
* `column`：主轴为**垂直方向**，起点在**上沿**（项目从上往下排列）。
* `column-reverse`：主轴为**垂直方向**，起点在**下沿**（项目从下往上排列）。

这个属性比较好理解，这里就不上图了。

### 2. `flex-wrap` 属性

在默认情况下，项目都排在主轴上。而 `flex-wrap` 属性则是用于定义，当一条轴线排不下时，如何进行换行。

```css
.box {
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```

`flex-wrap` 属性有3个值

* `nowrap`（默认）：不换行（列）。
* `wrap`：
  1. 主轴为**横向**时：**从上到下换行**。
  2. 主轴为**纵向**时：**从左到右换列**。
* `wrap-reverse`：
  1. 主轴为**横向**时：**从下到上换行**。
  2. 主轴为**纵向**时：**从右到左换列**。

换行（列）时，项目仍按照**设定的主轴方向**排列！

效果如下图所示：

![请添加图片描述](https://img-blog.csdnimg.cn/5f5be63ad9ac4563ab4d40662aadf605.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/103628a1b869467381e8ddf53183c04c.png#pic_center)

注意：当设置

```css
.box {
 display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
}
```

时，换行方式与上图相同。

![在这里插入图片描述](https://img-blog.csdnimg.cn/fde718e191eb4004b3b94b5e9547b4ce.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/0692c52dac8a4f5d919a0825bf1c433d.png#pic_center)

注意：当设置

```css
.box {
 display: flex;
    flex-direction: column-reverse;
    flex-wrap: wrap;
}
```

时，换行方式与上图相同。

### 3. `flex-flow` 属性

`flex-flow` 属性是 `flex-direction` 属性和 `flex-wrap` 属性的简写形式，**默认值为 `row` `nowrap`**：

```css
.box {
    display: flex;
  flex-flow: <flex-direction> <flex-wrap>;
}
```

### 4. `justify-content` 属性

`justify-content` 属性用于定义项目在**主轴**上的对齐方式。

```css
.box {
  ...;
  justify-content: flex-start | flex-end | center | space-between | space-around;
}
```

`justify-content` 属性有5个值

* `flex-start`（默认）：与主轴的**起点**对齐。
* `flex-end`：与主轴的**终点**对齐。
* `center`：与主轴的**中点**对齐。
* `space-between`：**两端对齐主轴的起点与终点**，项目之间的间隔都**相等**。
* `space-around`：**每个项目两侧的间隔相等**。所以，项目之间的间隔比项目与边框的间隔大一倍。

效果如下图所示：

![在这里插入图片描述](https://img-blog.csdnimg.cn/7fef1d5dfc034e28bc2161d7b7b4df81.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/9a309d28651e4fa88df7573ae50c5b82.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/bf64ca5f2e9f43efb720e1b342f6dea7.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/d164a049327148f7af12c264f27dd389.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/543f4aedcfb4446c8bfdbc7917ade4ad.png#pic_center)

### 5. `align-items` 属性

`align-items` 属性用于定义项目在**交叉轴**上如何对齐。**纵向交叉轴始终自上而下，横向交叉轴始终自左而右。**

```css
.box {
  ...;
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```

`align-items` 属性有5个值

* `flex-start`：交叉轴的**起点**对齐。
* `flex-end`：交叉轴的**终点**对齐。
* `center`：交叉轴的**中点**对齐。
* `baseline`: **项目的第一行文字的基线**对齐。
* `stretch`（默认值）：如果**项目未设置高度**或**设为auto**，项目将占满整个容器的高度。

![在这里插入图片描述](https://img-blog.csdnimg.cn/47ab20e352354e329a2a42fbd6927002.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/e6a332c0b77a4afb918ee945ad984344.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/780c77ac8f0846cd80789c07af844bc0.png#pic_center)

设置为 `baseline` 时，向各项目的第一行文字的基线对齐

![在这里插入图片描述](https://img-blog.csdnimg.cn/442d9e6fb2eb41ad9acba364c5444547.png#pic_center)

设置为 `stretch` 时

![在这里插入图片描述](https://img-blog.csdnimg.cn/bc22f5deb5334bbd8b77bb04d97b922d.png#pic_center)

而此时还可能会出现项目换行的情况，如下：

两条主轴上的项目纵向铺满交叉轴！

![在这里插入图片描述](https://img-blog.csdnimg.cn/2596f979e154432fac316bb848d7add3.png#pic_center)

如果交叉轴是横向，那么不给项目设置宽，则项目会横向铺满。如下图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/9103fb95da284e389a7d4b49cbe57607.png#pic_center)

如果容器的宽高都设置，但不设置 `align-items` 属性，那么默认值为 `flex-start`，与交叉轴起点对齐。

### 6. `align-content` 属性

`align-content` 属性用于定义**多根轴线(多根轴线，即有多行或多列项目)**的对齐方式。**如果项目只有一根轴线，该属性不起作用。**

```css
.box {
  ...;
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```

`align-content` 属性有6个值

* `flex-start`：与交叉轴的**起点**对齐。
* `flex-end`：与交叉轴的**终点**对齐。
* `center`：与交叉轴的**中点**对齐。
* `space-between`：与交叉轴**两端**对齐，**轴线之间的间隔平均分布**。
* `space-around`：**每根轴线两侧的间隔都相等**。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
* `stretch`（默认值）：**主轴线占满整个交叉轴**。

![在这里插入图片描述](https://img-blog.csdnimg.cn/38d160cde5d745b7af5cedc8d678ccfb.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/6edae577f11147699b5861fc4d1055c5.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/108c0dfa0e3a4ac893f778501df7a23c.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/ce5440dff1124552af343fcd96a0c779.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/f038f367d5d84cae809dea1d32d46a1e.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/819c66617f264d7c847909f4b3d1b9aa.png#pic_center)

## 项目 (Flex item) 的属性

设置在 Flex item 上的6个属性。

* `order`
* `flex-grow`
* `flex-shrink`
* `flex-basis`
* `flex`
* `align-self`

### 1. `order` 属性

`order` 属性用于定义容器中项目的排列顺序。**数值越小，排列越靠前**，默认为 0。

```css
.item {
  order: <integer>;
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/cc7688c5a8ab4d10b99a1234e2bf9b35.png#pic_center)

如果不给项目设置 `order` 值，默认值为0，那么项目的顺序按照**结构顺序**排列。

### 2. `flex-grow` 属性

`flex-grow` 属性用于定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。

```css
.item {
  flex-grow: <number>; /* default 0 */
}
```

效果如下：

不放大

![在这里插入图片描述](https://img-blog.csdnimg.cn/52c4d1088c95405dac1dcedfcd80e8e6.png#pic_center)

将剩余空间分为4份，3份给黄色，1份给紫色

![在这里插入图片描述](https://img-blog.csdnimg.cn/5718749008f14af3ad5a296863f00c02.png#pic_center)

注意这里的分配空间的计算方式：

div1 — 不放大

div2 — 占据 3 / (3 + 1) = 3 /4 的剩余空间

div3 — 占据 1 / (3 + 1) = 1 /4 的剩余空间

### 3. `flex-shrink` 属性

…

### 4. `flex-basis` 属性

`flex-basis` 属性定义了在分配多余空间之前，项目占据的**主轴空间**（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为 `auto`，即项目的本来大小。

```css
.item {
  flex-basis: <length> | auto; /* default auto */
}
```

它可以设为跟 `width`或 `height` 属性一样的值（比如350px），此时项目将占据固定空间。

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/6b144609718e4f149a8a108ef0104233.png#pic_center)

可以看到，对于项目1，无论是把 `width` 放在 `flex-basis` 上方还是下方都不起作用了，**只要设置了 `flex-basis` 项目就占据主轴固定空间，`width` 就不起作用。**

### 5. `flex` 属性

`flex` 属性是 `flex-grow`, `flex-shrink` 和 `flex-basis`的简写，默认值为 `0 1 auto`。后两个属性可选。

```css
.item {
  flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
}
```

该属性有两个快捷值：`auto` (1 1 auto) 和 `none` (0 0 auto)。

建议**优先使用这个属性**，而不是单独写三个分离的属性，因为浏览器会推算相关值。

### 6. `align-self` 属性

`align-self` 属性**允许单个项目有与其他项目不一样的对齐方式**，**可覆盖 `align-items` 属性**。

默认值为 `auto`，表示继承父元素的 `align-items` 属性，如果没有父元素，则等同于 `stretch`。

```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

`align-self` 属性有6个值，除了 `auto`，其他都与 `align-items` 属性完全一致。

![在这里插入图片描述](https://img-blog.csdnimg.cn/daf91eaee21d4b76a4c433c8957910c4.png#pic_center)
