# CSS 常见面试题：水平垂直居中

给出元素布局如下，要求实现子元素在父元素中水平垂直居中

```html
<div class="parent">
    <div class="son"></div>
</div>
```

## 方法 1：绝对定位 + `transform`

为子元素添加如下样式：

```css
.center1 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)
}
```

并为父元素添加：`position: relative;`

这种方式比较常见，其**在父子元素宽高都不确定的情况下也适用**。当子元素宽高确定时，可以将 `translate` 中的值设置为子元素宽高的一半，如：子元素宽高为 200px 180px，此时就可以使用 `translate(-100px, -90px)`

## 方法 2：绝对定位 + `margin`

为子元素添加如下样式：

```css
.center2 {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -90px;
    margin-left: -100px;
}
```

并为父元素添加：`position: relative;`

实际上由代码就能看出来，这种方式**只适用于子元素的宽高能够确定的情况**，当子元素宽高无法确定时，`margin-top` 是找不到合适的值的！（其不能为百分比）

## 方法 3：绝对定位 + `margin: auto`

为子元素添加如下样式：

```css
.center3 {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
}
```

并为父元素添加：`position: relative;`

这种方式也是**适用于父子元素宽高不确定的情况**的。注意这里的 `top`、`bottom`、`right`、`left` 四个属性一个都不能少。

## 方法 4：父元素 flex 布局

为父元素添加如下样式：

```css
.parent_center1 {
    height: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
```

这种方式要求父元素的**高度**的确定的！百分比形式的高度将无法生效，此时父元素将会塌陷至刚好容纳子元素。

## 方法 5：利用 `table-cell` 实现

为父子元素添加样式如下：

```css
.parent_center2 {
  height: 500px;
  width: 500px;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
.son_inline {
  display: inline-block;
}
```

毫无疑问，这种方式要求父元素的宽高都是确定的。
