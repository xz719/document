# HTML meta 标签中的 viewport

## viewport 中各属性及其作用

`viewport` 属性用于调整视口的大小以及比例，一般用于适配移动端

```html
<meta
  name="viewport"
  content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
/>

<!-- 
    viewport 各属性：

       1. width --- 设置 viewport 宽度，为一个正整数，或字符串 device-width，即设备宽度
       2. height --- 设置 viewport 高度，一般设置了宽度，会自动解析出高度，可以不用设置
       3. initial-scale --- 默认缩放比例（初始缩放比例），为一个数字，可以带小数
       4. minimum-scale --- 允许用户最小缩放比例，为一个数字，可以带小数
       5. maximum-scale --- 允许用户最大缩放比例，为一个数字，可以带小数
       6. user-scalable --- 是否允许手动缩放
 -->
```

## 延伸提问

❓怎样处理移动端 1px 被渲染成 2px 的问题？

1. 局部处理

   设置 meta 标签中的 viewport 属性 ，`initial-scale` 设置为 1，rem 按照设计稿标准走，外加利用 `transform` 的 `scale(0.5)` 缩小一倍即可；

2. 全局处理

   设置 mate 标签中的 viewport 属性 ，`initial-scale` 设置为 0.5，rem 按照设计稿标准走即可

❓如何强制手机浏览器采用**真实可视窗口宽度**来加载网页 ？

设置 meta viewport 中的 `width` 属性为 `device-width` 即可！