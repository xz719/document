# `block`、`inline` 和 `inline-block` 的区别

## 设置为 `block` 时
  
元素会**独占一行**，可以设置元素的 width、height、margin 和 padding 属性。

## 设置为 `inline` 时

元素不会独占一行，此时设置 width、height 无效。但可以**设置水平方向的 margin、padding 属性**，不能设置垂直方向的 padding 和 margin。

## 设置为 `inline-block` 时

将元素设置为 inline 元素，但元素的内容作为 block 元素呈现，**后续的内联元素会被排列在同一行内**。此时**可以设置元素的 width、height 以及垂直方向、水平方向上的 padding 和 margin**。
