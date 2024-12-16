# CSS `Transform` 详解

`transform` 是 CSS3 中具有颠覆性的特征之一，可以实现元素的位移、旋转、倾斜、缩放，甚至支持矩阵方式，配合**过渡**和**动画**，可以取代大量之前只能靠 Flash 才可以实现的效果。

## 1. CSS `Transform` 2D 变换

### 1.1 移动 --- `translate`

`translate` 属性值用于定义二维平移。

例如：`translate(50px, 50px)` 效果如下

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/3f2cfdb161a9323011eeabfe9b5f61c1.png#pic_center)

可以看到，`translate` 的效果就是将元素在水平和垂直方向上分别移动一定的距离

当然我们也可以单独指定某一方向上的偏移，`translate` 的相关语法如下：

```css
translate(x,y) --- X轴和Y轴同时移动
translateX(x) --- 仅X轴移动
translateY(Y) --- 仅Y轴移动
```

### 1.2 缩放 --- `scale`

`scale` 属性值对元素进行二维缩放。

例如：`transform:scale(0.5,1);` 效果如下

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/5cbd84bea30603519e24b4cf86fa5680.png#pic_center)

可以看到，在x轴方向上，元素被缩放为原来的 0.5 倍，即`scale`属性值可以对元素进行水平和垂直方向的缩放。

`scale`属性值的相关语法如下：

```css
scale(X,Y) --- X轴和Y轴同时缩放
scaleX(x) --- X轴缩放
scaleY(y) --- Y轴缩放
```

`scale()` 的取值默认的值为 1，当值设置为 0.01 到 0.99之间的任何值，作用使一个元素缩小；而任何大于或等于 1.01 的值，作用是让元素放大。

### 1.3 旋转 --- `rotate`

`rotate` 属性用于对元素进行旋转，正值表示顺时针旋转，负值表示逆时针旋转。

例如：`transform:rotate(45deg);` 效果如下

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e7eb202ae1023b10014f44473bda22b8.png#pic_center)

`deg` 表示 degree，即旋转的度数。

另外，我们可以使用 `transform-origin` 属性调整元素转换的基点。

```css
div{
    transform-origin: left top;
    transform: rotate(45deg); 
} 
```

效果如下，改变元素原点到左上角，然后进行顺时旋转 45 度

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/6231d1dc929f12d888e5391c7aa2e9b7.png#pic_center)

如果要粗略的通过元素的 4 个边角作为基点，可以使用上面的方式，但如果想要精确地确定基点的位置，可以用 px 指定其精确位置：

```css
div{
    transform-origin: 50px 100px;
    transform: rotate(45deg); 
} 
```

效果如下：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/46b9bec2df875f8539dbd6a5afc6b0e2.png#pic_center)

即将 x 轴上 50px、y 轴上 100px 处作为旋转的基点。

至于坐标系可以看下面这张图：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/da4eeee5847ad3d682147fbeee6ce9dd.png#pic_center)

### 1.4 倾斜 --- `skew`

`skew` 属性值用于将元素沿 x 轴、y 轴倾斜。

例如：

```css
div{
    transform: skew(20deg, 10deg);
} 
```

效果如下：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/ba2b7faf1e27141ae9f7ac95e0b40fd5.png#pic_center)

未指定第二个参数时，默认为 0。另外，这两个参数值可以为**负值**！

### 1.5 matrix

...

## 2. CSS `Transform` 3D 变换

CSS `Transform` 还支持 3D 转换。要实现 3D 转换，首先需要了解 CSS 中的三维坐标系。

CSS 中的三维坐标系与左手 3D 坐标系有一定区别，CSS 中的三维坐标系相当于**将左手3D坐标系绕其 x 轴旋转 180 度**：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/6c61950ac5efab08bcf2b45835b0d410.png#pic_center)

可以看到，坐标轴 y 轴负方向在上方，z 轴的负方向在后方，所以可以这样记：

* x 轴向左为负值，向右为正值
* y 轴向上为负值，向下为正值
* z 轴向内为负值，向外是正值

以 `rotateX` 为例：

```css
.div1 {
    width: 100px;
    height: 100px;
    /* border: 3px solid black; */
    background-color: yellow;
    color: red;
    margin: 10px 0px 0px 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transition: all 0.5s ease 0s;
}
.div1:hover {
    transform: rotateX(180deg);
}
```

即绕坐标系的 X 轴旋转

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/36232782e0e1714206fe4e7387d70b50.gif#pic_center)

其他属性可参考：

[CSS 3D](https://www.w3school.com.cn/css/css3_3dtransforms.asp)
