# 用 link 和 `@import` 引入 CSS 的区别

两者都是引入 CSS 的方法，区别如下：

1. link 是 XHTML 标签，除了加载 CSS 外，还可以定义 RSS 等其他事务； `@import` 属于 CSS 范畴，只能加载 CSS；

2. link 引⽤ CSS 时，会在⻚⾯载⼊时同时加载；而 `@import` 需要⻚⾯⽹⻚完全载⼊以后才加载；

3. link是XHTML标签，⽆兼容问题；`@import` 是在 CSS2.1 提出的，低版本的浏览器不⽀持；

4. link ⽀持使⽤ Javascript 控制 DOM 去改变样式；⽽ @import 不⽀持。
