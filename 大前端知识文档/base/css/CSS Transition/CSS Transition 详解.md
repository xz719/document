# CSS `Transition` 详解

通常当 CSS 的属性值更改后，浏览器会**立即更新**相应的样式。

在 CSS3 中加入了一项过渡功能，通过该功能，我们可以将元素从一种样式在指定时间内平滑的过渡到另一种样式，类似于简单的动画，但无需借助 flash 或 JavaScript。

CSS3 中，提供了 4 个相关属性来实现过渡效果：

1. `transition-property` --- 用于指定应用 transition 效果的 CSS 属性名
2. `transition-duration` --- 指定 transition 效果需要多久完成
3. `transition-timing-function` --- 指定 transition 效果的动画曲线
4. `transition-delay` --- 指定设置过渡效果延迟的时间

当然这些属性可以通过 `transition` 属性统一设置：

```css
.transition {
    transition: property duration timing-function delay;
}
```

其中，要成功实现过渡效果，必须定义 `transition-property`、`transition-duration` 属性。

下面对四个属性进行详细说明.

## 1. `transition-property`

`transition-property` 属性用来设置元素中参与过渡的**属性名称**，语法格式如下：

```css
transition-property: none | all | property;
```

各参数如下：

* `none` --- 没有属性参与过渡效果
* `all` --- 表示该元素上的所有属性都参与过渡效果
* `property` --- CSS 属性名称列表，多个属性名称之间使用逗号进行分隔。

## 2. `transition-duration`

`transition-duration` 属性用来设置过渡**需要花费的时间**（单位为秒或者毫秒），语法格式如下：

```css
transition-duration: time;
```

❗如果有**多个**参与过渡的属性，也可以依次按照 `transition-property` 中声明的顺序，为这些属性设置过渡需要的时间，多个属性之间使用逗号进行分隔，例如`transition-duration: 1s, 2s, 3s;`。

当然，也可以使用一个时间来为所有参与过渡的属性设置过渡所需的时间。

现在，我们了解了成功实现过渡效果的两个必要属性，下面可以尝试实现一个过渡效果：

在业务场景中，`transition` 往往会与 `:hover` 一同使用。

如下

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        div {
            width: 100px;
            height: 100px;
            border: 3px solid black;
            margin: 10px 0px 0px 10px;
            transition-property: width, background;
            transition-duration: .25s, 1s;
        }
        div:hover {
            width: 200px;
            background-color: blue;
        }
    </style>
</head>
<body>
    <div></div>
</body>
</html>
```

效果如下：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/18119fc7f3637d5f41d612756e270757.gif#pic_center)

## 3. `transition-timing-function`

`transition-timing-function` 属性用来设置**过渡动画的类型**，属性的可选值如下：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/988ec7c5e4c4c872845b1373dbd2542e.png#pic_center)

默认值为 `linear`。

示例如下：

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        div {
            width: 100px;
            height: 100px;
            border: 3px solid black;
            margin: 10px 0px 0px 10px;
            transition-property: width, background;
            transition-duration: 5s, 1s;
        }
        div:hover {
            width: 1500px;
            background-color: blue;
        }
    </style>
</head>
<body>
    <div></div>
</body>
</html>
```

现在为其加上 `transition-timing-function` 属性：

```css
div {
    width: 100px;
    height: 100px;
    border: 3px solid black;
    margin: 10px 0px 0px 10px;
    transition-property: width, background;
    transition-duration: 5s, 1s;
    transition-timing-function: linear;
}
```

效果如下：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/48ac48caf5a98ae469873a98b8665a5a.gif#pic_center)

下面是各属性值的动画运动曲线：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/b194e1c0e7ffc92ce482d065693f387d.png#pic_center)

## 4. `transition-delay`

`transition-delay` 属性用来设置**过渡效果何时开始**，属性的语法格式如下：

```css
transition-delay: time;
```

## 5.用 `transition` 属性同时设置过渡、设置多组属性的过渡

`transition` 属性是上面四个属性的简写形式，通过该属性可以同时设置上面的四个属性。

另外，通过 `transition` 属性也可以设置多组过渡效果，每组之间使用逗号进行分隔，示例代码如下：

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        div {
            width: 100px;
            height: 100px;
            border: 3px solid black;
            margin: 10px 0px 0px 10px;
            transition: width .25s linear 1.9s, background 1s 2s, transform 2s;
        }
        div:hover {
            width: 200px;
            background-color: blue;
            transform: rotate(180deg);
        }
    </style>
</head>
<body>
    <div></div>
</body>
</html>
```

其中设置了三组 transition 效果，各组之间通过逗号分隔：

* `width .25s linear 1.9s`
* `background 1s 2s`
* `transform 2s`

效果如下：

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/23ef65dcf0c41546ab3ec086ed845a22.gif#pic_center)
