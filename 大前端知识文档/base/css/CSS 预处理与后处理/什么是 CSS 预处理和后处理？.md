# CSS 预处理器/后处理器是什么？为什么要使⽤它们？

## 1. 预处理器

预处理器支持我们写一种类似 CSS 但实际并不是 CSS 的语言，然后预处理器会帮我们把它编译成 CSS 代码。

为什么需要预处理器？

1. 宏观设计上：我们希望能优化 CSS ⽂件的⽬录结构，对现有的 CSS ⽂件实现复⽤
2. 编码优化上：我们希望能写出结构清晰、简明易懂的 CSS，需要它又一幕了然的嵌套层级关系，而不是一铺到底。同时希望它具有变量特征、计算能力、循环能力等等更强的可编程性。
3. 可维护性上：更强的可编程性意味着更优质的代码结构，实现复用意味着更简单的目录结构和更强的拓展能力。

传统 CSS 无法做到这三点，所以需要预处理器。

## 2. 后处理器

后处理器，如：postCss，通常是在完成的样式表（style sheet）中根据 CSS 规范处理 CSS，让其更加有效。⽬前最常做的是给 CSS 属性添加浏览器私有前缀，实现跨浏览器兼容性的问题。

## 为什么要使用预处理器与后处理器？

* 结构清晰， 便于扩展
* 可以很⽅便的屏蔽浏览器私有语法的差异
* 可以轻松实现多重继承
* 完美的兼容了CSS代码，可以应⽤到⽼项⽬中
