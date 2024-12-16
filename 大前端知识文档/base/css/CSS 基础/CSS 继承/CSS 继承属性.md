# CSS 继承属性与非继承属性

## 1. 继承属性

继承属性，即可以从父类继承的属性，其默认值为父元素该属性的计算值。

💡常见的继承属性有：

1. 字体系列属性 --- 即 font 系列属性，如：font-size、font-weight、font-family 等。
2. 文本系列属性：
   * text-indent：文本缩进
   * text-align：文本对齐
   * line-height：行高
   * word-spacing：单词之间距离
   * letter-spacing：中文或者字母之间的间距
   * color：文本颜色
   * ...
3. 元素可见性 --- visibility
4. 列表布局属性 --- list-style
5. 光标属性 --- cursor

## 2. 非继承属性

非继承属性，即不可以从父类继承的属性，其默认值为初始值。但需要注意的是，对于非继承属性，可以显式声明其属性值为 `inherit`，从而继承父元素的属性值！

💡常见的非继承属性有：

1. display 属性
2. 部分文本属性：
   * vertical-align：垂直文本对齐；
   * text-decoration：文本装饰，如下划线等；
   * text-shadow：文本阴影；
   * white-space：空白符的处理；
   * ...
3. 盒模型的相关属性 --- width、height、margin、padding、border
4. 背景相关属性 --- 即 background 系列属性
5. 定位属性
6. ...
