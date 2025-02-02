# HTML DOCTYPE

`DOCTYPE` 是 HTML5 中⼀种标准通⽤标记语⾔的⽂档类型声明，它的⽬的是**告诉浏览器（解析器）应该以什么样（html 或 xhtml）的⽂档类型定义来解析⽂档**，不同的渲染模式会影响浏览器对 CSS 代码甚⾄ JavaScript 脚本的解析。它必须声明在 HTML ⽂档的第⼀⾏。

✨浏览器渲染页面的两种方式：

* CSS1Compat --- 标准模式（Strick mode）：默认模式，浏览器使⽤ W3C 的标准解析渲染⻚⾯。在标准模式中，浏览器以其⽀持的最⾼标准呈现⻚⾯；
* BackCompat --- 怪异模式（Quick mode）：浏览器使⽤⾃⼰的怪异模式解析渲染⻚⾯。在怪异模式中，⻚⾯以⼀种⽐较宽松的向后兼容的⽅式显示。

## `<!DOCTYPE html>` 的作用？

让浏览器进⼊标准模式，使⽤最新的 HTML5 标准来解析渲染⻚⾯；如果不写，浏览器就会进⼊混杂模式，我们需要避免此类情况发⽣。

## 标准模式与混杂模式（怪异模式）的区分

HTML5 没有 DTD ，因此也就**没有严格模式与混杂模式的区分**，HTML5 有相对宽松的写法，实现时，已经尽可能⼤的实现了向后兼容。

即❗HTML5 没有标准模式和怪异模式之分！
