# 如何修改 `iframe` 外观？

## 1. 设置 `iframe` 的宽高

使用 `​​<iframe>​`​ 标签时，可以通过 `​​width`​​ 和 `​​height`​​ 属性来控制其显示的尺寸。设置这两个属性的值通常有两种方式：像素值（例如 ​`​600px​`​）和百分比值（例如 ​`​100%`​​）。

### 1.1 固定宽高的 `iframe`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fixed Size iFrame</title>
</head>
<body>
    <iframe src="https://www.bilibili.com" width="800" height="600" style="border: none;"></iframe>
</body>
</html>
```

[![pAbVXXd.png](https://s21.ax1x.com/2024/12/12/pAbVXXd.png)](https://imgse.com/i/pAbVXXd)

在这个示例中，创建了一个宽 800 像素、高 600 像素的 ​​iframe​​，并通过在 ​`​style`​​ 属性中设置 `​​border: none;`​​，去除了边框的显示。

### 1.2 响应式 `​​iframe​`

为了使 ​`​iframe`​​ 自适应容器的宽度，我们可以使用百分比值。下面的示例展示了如何创建一个宽度为页面宽度的 100% 的 `​​iframe`​​​，高度为容器宽度的 50%。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive iFrame</title>
    <style>
        .iframe-container {
            position: relative;
            width: 100%;
            padding-top: 50%; /* 16:9 aspect ratio */
        }
        .iframe-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>
</head>
<body>
    <div class="iframe-container">
        <iframe src="https://www.bilibili.com"></iframe>
    </div>
</body>
</html>
```

[![pAbZw9O.png](https://s21.ax1x.com/2024/12/12/pAbZw9O.png)](https://imgse.com/i/pAbZw9O)

这个示例中，使用了一个包含 `​​iframe​`​ 的容器 `div`。通过设置容器的 ​`​padding-top​`​，能够保持 ​`​iframe​​`​ 的纵横比为 16:9，并且使其自适应页面宽度。

## 2. 移除 ​`​iframe`​​ 的边框

以前我们会通过 `<iframe>` 标签的 `frameborder` 属性值来控制 `iframe` 的边框显示，但现在已经废弃了，更建议使用 CSS 来实现：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>iFrame without Border</title>
    <style>
        iframe {
            border: none;
        }
    </style>
</head>
<body>
    <iframe src="https://www.baidu.com" width="600" height="400"></iframe>
</body>
</html>
```

这个示例中，通过 CSS 中的 ​`​border: none;​`​ 去除了 `​​iframe​`​ 的边框。这是移除边框的推荐方法，符合现代浏览器的标准。
