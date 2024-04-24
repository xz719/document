# CSS 文本溢出处理

日常开发中，时不时会遇到需要展示的文本过长的情况，这种情况下，为了提高用户的使用体验，最为常见的处理方式就是把溢出的文本显示成省略号。

处理文本的溢出方式有如下四种：

1. 单行文本溢出
2. 多行文本溢出
3. 超出容器高度缩略展示
4. 缩略后加展开收起按钮，可点击操作

## 1. 单行文本溢出

### 1.1 实现方式

要处理单行文本的溢出，需要用到以下几个 CSS 属性：

1. `overflow` --- 容器内容溢出时的展示方式
2. `text-overflow` --- 文本溢出时的展示方式
3. `white-space` --- 控制空白字符的显示，同时可以控制文本是否自动换行
4. `word-break` --- 当值设置为 `break-all` 时，可以使一个单词在换行时进行拆分

当我们处理单行文本时，需要设置 `overflow: hidden` 和 `text-overflow: ellipsis`，目的是为了让文本的溢出展示为省略号 `...`，但是，在此之前，我们需要确保文字在一行，所以我们需要设置 `white-space: nowrap`，不然 `text-overflow: ellipsis` 会失效。

### 1.2 具体实现实例

```html
<div class="wrap">
    <p>单行文本溢出缩略显示</p>
    <div class="one-line">
        日常开发中，时不时会遇到需要展示的文本过长的情况，这种情况下，为了提高用户的使用体验，最为常见的处理方式就是把溢出的文本显示成省略号。
    </div>
</div>

<style>
.wrap {
  width: 350px;
  margin: 0 auto;
  text-align: left;
}
p {
  color: red;
}
.one-line {
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  white-space: nowrap;
  border: 2px solid #3d3d3f;
}
</style>
```

效果如下：

[![pFdjouD.png](https://s11.ax1x.com/2024/02/28/pFdjouD.png)](https://imgse.com/i/pFdjouD)

## 2. 多行文本溢出省略

### 2.1 实现方式

相比于单行文本溢出，在处理多行文本溢出时，我们还需要确定其最大行数，从而基于行数截断文本，所以，我们需要额外使用以下的 CSS 属性：

1. `display: -webkit-box` --- 设定容器以弹性伸缩盒子模型显示
2. `-webkit-line-clamp` --- 用于设定多行文本的最大行数
3. `-webkit-box-orient` --- 设置或检索伸缩盒对象的子元素的排列方式

### 2.2 具体实现实例

```html
<div class="wrap">
    <p>多行文本溢出缩略显示</p>
    <div class="multiple-line">
        总的来说,display属性是CSS中一个非常重要的样式属性,它在网页设计中扮演着多种角色,包括布局控制、隐藏显示、盒模型调整和响应式布局。了解并灵活运用display属性,可以帮助我们更好地掌控网页的显示方式
    </div>
    <div class="multiple-line">
        这里只有一行，不会溢出。
    </div>
</div>

<style>
.wrap {
  width: 400px;
  margin: 0 auto;
  text-align: left;
}
p {
  color: red;
}
.multiple-line {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
  border: 2px solid #3d3d3f;
}
</style>
```

效果如下：

[![pFdvMVJ.png](https://s11.ax1x.com/2024/02/28/pFdvMVJ.png)](https://imgse.com/i/pFdvMVJ)

## 3. 多行文本超出容器宽高省略显示

处理多行文本溢出时，还可能会有一种情况，即要求在超过容器的宽高后，缩略展示。在这种情况下，关键在于设置容器的宽高后，需要根据文字的 `line-height` 属性，计算出容器高度最多能够容纳几行文本，然后再设置 `-webkit-line-clamp` 即可。

实例如下：

```html
<div class="wrap">
    <p>超过元素宽高省略显示</p>
    <div class="multiple-line">
        总的来说,display属性是CSS中一个非常重要的样式属性,它在网页设计中扮演着多种角色,包括布局控制、隐藏显示、盒模型调整和响应式布局。了解并灵活运用display属性,可以帮助我们更好地掌控网页的显示方式
    </div>
    <div class="multiple-line">
        这里只有一行，不会溢出。
    </div>
</div>

<style>
.wrap {
  width: 400px;
  margin: 0 auto;
  text-align: left;
}
p {
  color: red;
}
.multiple-line {
  width: 400px;
  height: 65px;
  overflow: hidden;
  display: -webkit-box;
  line-height: 20px;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: break-all;
  border: 2px solid #3d3d3f;
  margin-top: 10px;
}
</style>
```

效果如下：

[![pFwpZFJ.png](https://s11.ax1x.com/2024/02/28/pFwpZFJ.png)](https://imgse.com/i/pFwpZFJ)

## 4. 纯 CSS 多行文本展开收起

见：[纯 CSS 实现多行文本展开收起](./tests/pureCssMultipleLine.html)
