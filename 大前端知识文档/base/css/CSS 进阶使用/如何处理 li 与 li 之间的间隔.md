# li 与 li 之间有看不⻅的空⽩间隔是什么原因引起的？

## 产生原因

浏览器会把inline内联元素间的空⽩字符（空格、换⾏、Tab等）渲染成⼀个空格。为了美观，通常是⼀个 `<li>` 放在⼀⾏，这导致 `<li>` 换⾏后产⽣换⾏字符，它变成⼀个空格，占⽤了⼀个字符的宽度。

## 解决方法

1. 为 `<li>` 设置 `float:left` --- 不⾜：有些容器是不能设置浮动，如左右切换的焦点图等。

2. 将所有 `<li>` 写在同⼀⾏ --- 不⾜：代码不美观。

3. 将 `<ul>` 内的字符尺⼨直接设为 0，即 `font-size:0` --- 不⾜：`<ul>` 中的其他字符尺⼨也被设为 0，需要额外重新设定其他字符尺⼨，且在 Safari 浏览器依然会出现空⽩间隔。

4. 消除 `<ul>` 的字符间隔 `letter-spacing:-8px` --- 不⾜：这也设置了 `<li>` 内的字符间隔，因此需要将 `<li>` 内的字符间隔设为默认 `letter-spacing:normal`。
