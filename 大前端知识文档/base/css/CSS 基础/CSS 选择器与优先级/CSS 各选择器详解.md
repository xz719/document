# CSS 选择器

CSS 选择器分为 6 大类：

* 基础选择器
* 群组选择器
* 关系选择器
* 属性选择器
* 伪类选择器
* 伪元素选择器

## 1. 基础选择器

### 1.1 元素选择器

语法：`标签名{...}`

元素选择器会选中对应标签名的HTML元素，例如：`p{...}`，`div{...}`，`span{...}`等

### 1.2 类选择器

语法：`.类名{...}`

类选择器会选中 `class` 属性为指定类名的 HTML 元素，例如：

```html
<div class="div1">test</div>

.div1 {
 ...;
}
```

需要注意的是，HTML 元素的 `class` 属性值不能以数字开头，如果要以符号开头，只能为 `_` 或 `-`。同时，一个元素的 `class` 属性中可以有多个属性值，意味着其可以被多个类选择器选中！

### 1.3 id选择器

语法：`#id属性值{...}`

id选择器会选中id属性为指定值的 HTML 元素，例如：

```html
<div id="div1">test</div>

#div1 {
 ...;
}
```

与类不同，HTML 元素的 `id` 属性只能有一个！

#### 1.4 通配符选择器

语法：`*{...}`

通配符选择器会选中页面中的所有 HTML 元素，并对所有元素都执行其中的样式，一般可以用来**清除间距**。

## 2. 群组选择器

语法：

```css
选择器1,选择器2,选择器3,...{
 ...;
}
```

群组选择器会同时选中**多个选择器对应的元素**！例如：

```html
<div>盒子1</div>
<p>段落1</p>
<p>段落2</p>
<h3>文本标题3</h3>
<h3 class="text3">文本标题3</h3>
<ol>
    <li>有序列表</li>
    <li class="li2">有序列表</li>
    <li>有序列表</li>
</ol>

<style>
    div,p,h3,.li2{
        font-size: 30px;
    }
    div,.li2,.text3{
        color: red;
    }
    p{
        color: blue;
    }
    h3{
        color: pink;
    }
</style>
```

最终的效果为：

![群组选择器](https://img-blog.csdnimg.cn/1e7aa4c8bca24b4cb657f4ba3b39498e.png#pic_center)

群组选择器一般用于**简化代码**，可以将对多个元素的统一操作放在一个群组选择器中，

## 3. 关系选择器

### 3.1 后代选择器

后代选择器也叫**包含选择器**，即祖先元素直接或间接地包含后代元素。

语法：

```css
选择器1 选择器2 选择器3 ...{
 ...;
}
```

下面看两个例子：

```html
<div class="box">
    <p>0000</p>
    <div>
        <p>11111</p>
        <p>22222</p>
    </div>
    <div class="box2">
        <p>333</p>
    </div>
    <p>444</p>
</div>

<style>
    .box p{
        width: 200px;
        height: 200px;
        background-color: yellow;
    } 
</style>
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/0dec9974991743be9b6dd04a61020b99.png#pic_center)

可以看到，此时选中的是 box 类下的所有 p 元素！即使是 box 类的子类 box1 中的 p 元素也被选中了。

再来看第二个例子：

```html
<div class="box">
    <p>0000</p>
    <div>
        <p>11111</p>
        <p>22222</p>
    </div>
    <div class="box2">
        <p>333</p>
    </div>
    <p>444</p>
</div>

<style>
    .box div p {
        width: 200px;
        height: 200px;
        background-color: yellow;
    }
</style>
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/24292649a82f41228bba79365dac8f98.png#pic_center)

可以看到，此时选中的是 box 类下的所有 div 元素中的 所有 p 元素！

### 3.2 子代选择器

语法：

```css
选择器1>选择器2{
    ...;
}
```

子代选择器与后代选择器的区别在于：子代选择器要求父元素**直接而非间接地**包含子元素！

看下面这个例子：

```html
<div class="box">
    <p>0000</p>
    <div>
        <p>11111</p>
        <p>22222</p>
    </div>
    <div class="box2">
        <p>333</p>
    </div>
    <p>444</p>
</div>

<style>
    .box>p{
        width: 200px;
        height: 200px;
        background-color: yellow;
    } 
</style>
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/db5755132bd94af78ed5139f95d82557.png#pic_center)

可以看到，此时只选中了 box 类下**直接包含**的所有 p 元素，而对于间接包含的，例如：box 类下的 div 中包含的所有 p 元素；box 类下的 box2 类中包含的所有 p 元素，则均未选中！

再来看下面这个例子：

```html
<div class="box">
    <p>0000</p>
    <div>
        <p>11111</p>
        <p>22222</p>
    </div>
    <div class="box2">
        <p>333</p>
    </div>
    <p>444</p>
</div>

<style>
    .box>div>p{
        width: 200px;
        height: 200px;
        background-color: yellow;
    }
</style>
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/d6bd53eee3c8432faf6c82ddac127072.png#pic_center)

可以看到此时选中的是 box 类下的所有 div 元素中包含的所有 p 元素。

### 3.3 相邻兄弟选择器

语法：

```css
选择器1+选择器2{
    ...;
}
```

其效果不方便用文字描述，看下面这个例子：

```html
<p>000</p>
<div class="box">盒子1</div>
<p>111</p>
<p>222</p>
<p>333</p>
<div>
    <p>44444</p>
</div>
<p>5555</p>
```

在以上的HTML代码中，除了内容为 "4444" 的 p 标签，其他所有元素均为兄弟元素。那么什么叫做相邻兄弟元素呢？实际上就是**两个紧挨着的兄弟元素**！

下面给以上HTML代码添加样式：

```html
<style>
    .box+p{
        width: 200px;
        height: 200px;
        background-color: yellow;
    }
</style>
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/9a807451c89b4bef9c29f8d5893e5412.png#pic_center)

可以看到，此时选中的是 box 类的相邻兄弟元素，即内容为 "111" 的 p 元素。

那么如果我们再加上一个`+`呢？

```html
<style>
    .box+p+p{
        width: 200px;
        height: 200px;
        background-color: yellow;
    }
</style>
```

会变成下面的样子：

![在这里插入图片描述](https://img-blog.csdnimg.cn/468b41f6cdaf4a978212c1163c2b7c6c.png#pic_center)

即选中了 box 类的相邻兄弟元素的相邻兄弟元素，也就是内容为 "222" 的 p 元素！

如果进一步嵌套，则会继续向后选中。

实际上，此时的 CSS 选择器可以理解为：`(.box+p)+p`，即其实际上仍是两个选择器，只不过第一个选择器是一个**嵌套**罢了。这样的嵌套在实际使用中是十分常见的。

### 3.4 通用兄弟选择器

语法：

```css
选择器1~选择器2{
 ...;
}
```

同样是上面那个例子：

```html
<p>000</p>
<div class="box">盒子1</div>
<p>111</p>
<p>222</p>
<p>333</p>
<div>
    <p>44444</p>
</div>
<p>5555</p>
```

为其添加以下样式：

```html
<style>
    .box~p{
        width: 200px;
        height: 200px;
        background-color: yellow;
    }
</style>
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/b1bd80d7177a47ba977db121344300c3.png#pic_center)

可以看到，此时选中的是所有 box 类**后面**所有的兄弟 p 元素！所以，通用兄弟选择器的效果是：**选中选择器1对应元素后面的所有对应选择器2的兄弟元素**。

另外，需要注意的是，相邻兄弟选择器和通用兄弟选择器是可以结合在一起使用的！比如对于上面的例子，我们想要单独修改内容为 "5555" 的 p 元素的样式，那么我们可以使用下面的 CSS 代码实现：

```html
<style>
    .box~div+p{
        width: 200px;
        height: 200px;
        background-color: yellow;
    }
</style>
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/37734e9b6b2e46d5bb6cee9171dc4be2.png#pic_center)

## 4. 属性选择器

属性选择器一共有以下7种写法：

1. `选择器[属性名]`
2. `选择器[属性名 = 属性值]`
3. `选择器[属性名 ^= 属性值]`
4. `选择器[属性名 $= 属性值]`
5. `选择器[属性名 *= 属性值]`
6. `选择器[属性名 ~= 属性值]`
7. `选择器[属性名 |= 属性值]`

下面用一个例子，来说明这7种写法各自的效果：

```html
<div class="demo">
    <a href="http://www.baidu.com" target="_blank" class="li nks item first" id="first" title="link">1</a>
    <a href="" class="links active item" title="test website" target="_blank" lang="zh">2</a>
    <a href="sites/file/test.html" class="links item" title="link-1 aa" lang="zh-cn">3</a>
    <a href="sites/file/test.png" class="links item" target="_balnk" lang="zh-tw">4</a>
    <a href="sites/file/image.jpg" class="links item" title="link-23 aa">5</a>
    <a href="mailto:baidu@hotmail" class="links item" title="website link" lang="zh">6</a>
    <a href="/a.pdf" class="links item" title="open the website" lang="cn">7</a>
    <a href="/abc.pdf" class="linksitem" title="close the website" lang="en-zh">8</a>
    <a href="abcdef.doc" class="links item" title="http://www.sina.com">9</a>
    <a href="abd.doc" class="linksitem last" id="last">10</a>
</div>

<style>
    .demo {
        width: 300px;
        border: 1px solid #ccc;
        padding: 10px;
        overflow: hidden;
        margin: 20px auto;
    }

    .demo a {
        float: left;
        display: block;
        height: 50px;
        width: 50px;
        border-radius: 10px;
        text-align: center;
        background: #aac;
        color: blue;
        font: bold 20px/50px Arial;
        margin-right: 5px;
        text-decoration: none;
        margin: 5px;
    }
</style>
```

以上是基本样式，效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/11411846fca747e39d9c9268339ebefa.png#pic_center)

下面按照每一种写法，向其中添加样式。

### 4.1 写法1：`选择器[属性名]`

添加如下样式：

```css
a[title]{
 background: yellow;
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/a02c8b12c14e4affbd6a6af3bc8d49a6.png#pic_center)

即此时选中的是所有身上有 `title` 属性的 a 标签！

如果添加以下样式：

```css
a[lang][target]{
 background: yellow;
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/76ee63e176494607bfda5eca23beadb5.png#pic_center)

此时选中的是所有身上同时拥有 `lang` 属性和 `target` 属性的 a 标签！

### 4.2 写法2：`选择器[属性名 = 属性值]` --- 重点

向其中添加以下样式：

```css
a[lang="zh"]{
    background: yellow;
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/89bb90089dd74e478951c06a6471112e.png#pic_center)

此时选中的是身上 `lang` 属性值为 "zh" 的所有 a 标签！注意这里属性值必须为一模一样，多一个字符、一个空格都不会被选中。

当然，**前面的选择器也不是只能指定标签，同样也可以指定类、id，甚至可以使用上面的群组选择器、关系选择器等**。

例如向其中添加以下样式：

```css
/* 选中类为item，身上的lang属性值为 "zh-cn" 的元素 */
.item[lang="zh-cn"]{
    background: yellow;
}
/* 选中id为last，身上配置了title属性，且身上的class属性值为 "links" 的元素 */
#last[title][class="links"]{
    background: yellow;
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/9f48327b62f148eba039a7d866467f0a.png#pic_center)

此时，选择器 `.item[lang="zh-cn"]` 选中了3，而选择器 `#last[title][class="links"]` 未能选中，因为此时不存在 `class` 属性**仅为** "links" 的元素！

### 4.3 写法3：`选择器[属性名 ^= 属性值]`

添加以下样式：

```css
a[class^="li "]{ /* 注意这里有一个空格！ */
    background-color: yellow;
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/66252e30d30d49e4a9fb0a033bb8e1a9.png#pic_center)

此时选中的是身上 `class` 属性的值以 "li " 开头的所有 a 标签，而其他 `class` 属性以 "li" 开头的 a 标签则未被选中，即这里 `^=` 运算符匹配时也会匹配空格！

但需要注意的是，在实际开发中，**若元素的 `class` 属性值前面有空格，此时这个空格是可能会被自动去掉**的！所以**使用 `^=` 运算符匹配时尽量不要去匹配前面带空格的值**，可能会导致无法选中。

例如：

```html
<a class=" links item first">1</a>

<style>
    a[class^=" li"]{
        background-color: yellow;
    }
</style>
```

此时是无法选中 a 标签的！

### 4.4 写法4：`选择器[属性名 $= 属性值]`

添加以下样式：

```css
a[href$=".pdf"]{
    background-color: yellow;
}
a[href$=".doc"]{
    background-color: red;
}
a[href$=".png"]{
    background-color: green;
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/d50f2d2e543049e6898e2be27b6e3738.png#pic_center)

此时首先选中了身上 `href` 属性以 ".pdf" 结尾的 a 标签，即7、8，将其背景色置为黄色；然后选中了身上 `href` 属性以 ".doc" 结尾的 a 标签，即9、10，将其背景色置为红色；最后选中了身上 `href` 属性以 ".png" 结尾的 a 标签，即4，将其背景色置为绿色。

即 `$=` 运算符的作用是**匹配结尾的字符**。

### 4.5 写法5：`选择器[属性名 *= 属性值]`

添加以下样式：

```css
a[href*="b"]{
    background-color: green;
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/7dc964b748ce4ab1aee5bac09f875b84.png#pic_center)

此时选中的是身上 `href` 属性值中包含 "b" 的 a 标签！即，`*=` 运算符的作用是**与整个字符串进行匹配，只要包含目标字符，则为 `true`**。

### 4.6 写法6：`选择器[属性名 ~= 属性值]`

添加以下样式：

```css
a[class~="item"]{
    background-color: green;
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/2627a76a10794d39b1e0c06455377e00.png#pic_center)

此时选中的是身上 `class` 属性值中包含**单独且完整**的 "item" 的所有 a 标签。

什么叫**单独且完整**？当一个元素属于多个类时，其身上的`class`属性是这样的：

```html
<a class="class1 class2 class3">2</a>
```

此时其身上单独且完整的类就有 `class1`、`class2`、`class3`。此时 CSS 选择器 `a[class~="class1"]` 就可以选中该元素，而当一个元素身上的 `class` 属性为下面这样时：

```html
<a class="clas s1class2 class3">2</a>
```

此时其身上单独且完整的类为 `clas`、`s1class2`、`class3`。此时 CSS 选择器`a[class~="class1"]`就无法选中该元素！

对应上面的例子，元素8、10身上的 `class` 属性值均为 "linksitem"，这是一个单独的类，所以无法选中这两个元素。

真正来说，出现这种情况是因为，此时的 `~=` 运算符不再是像前面几种写法中的运算符一样是**字符串匹配**了，而是与元素身上的**某个属性的多个值进行匹配**！

### 4.7 写法7：`选择器[属性名 |= 属性值]`

添加以下样式：

```css
a[title|="link"]{
    background-color: green;
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/a753b7cc1e0b4dbcbdce3b357663b33f.png#pic_center)

此时选中的是身上 `title` 属性值中只有1个是 "link" 的或者属性值有多个但是得是 "link-" 开头的所有 a 标签。

具体来说 `|=` 运算符的匹配：

* 当元素该属性值只有一个时，其值必须是指定的值
* 当元素该属性的值有多个时，该属性值开头必须为 "指定值-" 的形式。(注意此时为字符串匹配！)

## 5. 伪类选择器

### 5.1 常用的伪类选择器1

1. `:first-child` 第一个子元素
2. `:last-child` 最后一个子元素
3. `:nth-child()` 选中括号中指定的元素，这里的括号内可以填入以下内容
   * `n` --- 第n个元素，n的范围是从0到正无穷，正无穷代表全选。
   * `even` 或 `2n` --- 选中偶数位的元素
   * `odd` 或 `2n+1` --- 选中奇数位的元素

注意：**以 `child` 结尾的是在所有元素中选择！**

用一个例子来理解：

```html
<ul class="box">
    <p>1111</p>
    <p>222</p>
    <li>无序列表的li1</li>
    <p>33333</p>
    <li>无序列表的li2</li>
    <li>无序列表的li3</li>
    <p>44444</p>
    <li>无序列表的li4</li>
    <p>555</p>
    <li>无序列表的li5</li>
    <p>666</p>
</ul>
```

先来试试`:first-child`，下面为其添加样式：

```css
.box   :first-child{
    border: 2px solid blue;
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/f96f7b4ba2a649059bcf37f90242f126.png#pic_center)

此时选中的为 box 类下的第一个子元素，即内容为 "1111" 的 p 元素。

如果添加下面的样式：

```css
.box   li:first-child{
    border: 2px solid blue;
}
```

此时不会选中任何元素，因为此时效果是 box 类下的**第一个子元素为 li 标签**时，其中的样式才会生效。

如果将 li 换成 p：

```css
.box   p:first-child{
    border: 2px solid blue;
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/e6804c0d2ac441cbb44c7d4a914f0f52.png#pic_center)

此时则可以选中元素。

接下来是 `:last-child`，其使用方法与 `:first-child` 是完全相同的，只不过其判断的是最后一个子元素。

```css
/* 根据上面的结果，可以知道，此时的效果是当最后一个子元素为p元素时，将样式作用到其身上 */
.box   p:last-child{
    border: 2px solid blue;
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/c7da5c5d1fc14ce48cb4dcac498102de.png#pic_center)

然后是`:nth-child()`。其同样有和上面一样的使用方法：

```css
/* 选中box类下的第三个子元素 */
.box  :nth-child(3){
    border: 2px solid blue;
}

/* 当box类下的第七个子元素为p元素时，将样式应用到其身上 */
.box  p:nth-child(7){
    border: 2px solid red;
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/a0bbfb2edbe5448f83060beebb9128ab.png#pic_center)

但 `:nth-child()` 的括号中不仅仅能填入数字，还有一些特殊用法，在使用之前，首先要知道，下面的所有 n 指代的是**一个从0开始的数列**！

```css
/*
 n 为从0开始的数列，所以 n+3 指代的是第3、4、5、6、7...个子元素
*/
.box  :nth-child(n+3){
    border: 2px solid blue;
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/13bcb6e755d044409bbaafa940ef1cf2.png#pic_center)

可以看到从第三个子元素开始往后的所有元素均被选中！

同样其也可以**判断元素的标签类型**：

```css
/* 即box下的第3、4、5、6...个子元素为li时，将样式应用到它们身上 */
.box  li:nth-child(n+3){
    border: 2px solid blue;
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/771a64832c3c4de2b869bcbdb9eac34f.png#pic_center)

甚至，n 的前面还可以加上负号：

```css
/* 
 n=0 -n=0 -n+3=3
 n=1 -n=-1 -n+3=2
 n=2 -n=-2 -n+3=1
 n=3 -n=-3 -n+3=0
 ...
 所以此时选中的是box下的第3、2、1个子元素
*/
.box  :nth-child(-n+3){
    border: 2px solid blue;
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/dfb502c9ec134d36870e24928000243a.png#pic_center)

还可以指定偶数和奇数：

```css
/* 此时选中的是box里面的第2,4,6,8,10,12....个为li标签的元素，将样式应用到它们身上 */
.box li:nth-child(2n){
    border: 2px solid blue;
}

/* 当然选中第偶数个元素也可以直接用 even，其和2n是一样的 */
.box li:nth-child(even){
    border: 2px solid blue;
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/d9fb2e0a1c1e40c6bbe346733a0294fe.png#pic_center)

指定奇数：

```css
/* 此时选中的是box下的所有奇数子元素 */
.box :nth-child(2n+1){
      border: 2px solid blue;
}
/* 奇数也可以用 odd 来指定 */
.box :nth-child(odd){
    border: 2px solid blue;
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/c1c352706bcf4ca783f76b28361e8165.png#pic_center)

当然，并不是只能按上述几种固定的方式使用，我们可以自己定义，同时还可以搭配前面的 `:first-child`、`:last-child` 一起使用！

```css
/* 此时选中的是第5、7、9...个子元素 */
.box :nth-child(2n+5){
    border: 2px solid blue;
}
/* 此时选中的是从后数，第2、4、6、8...个子元素 */
.box :nth-last-child(2n){
    border: 2px solid blue;
}
```

### 5.2 常用的伪类选择器2

1. `:first-of-type` 第一个子元素
2. `:last-of-type` 最后一个子元素
3. `:nth-of-type()` 选中括号中指定的元素，这里的括号内可以填入以下内容
   * `n` --- 第n个元素，n的范围是从0到正无穷，正无穷代表全选。
   * `even` 或 `2n` --- 选中偶数位的元素
   * `odd` 或 `2n+1` --- 选中奇数位的元素

注意：**以 type 结尾的是在相同元素中选择！**

其具体的使用与前一节中一样，这里仅给出几个例子，用于理解其与 **`-child` 结尾的伪类选择器**的区别。

```css
.box  :first-of-type{
    border: 2px solid blue;
}
```

效果如下：
![在这里插入图片描述](https://img-blog.csdnimg.cn/8566086480484a71a57b1de82c776d23.png#pic_center)

可以看到，box 类下的第一个 p 元素和第一个 li 元素均被选中！

为什么？从结构上看，box 类的下面有两个类型：p 标签和 ul 标签，所以是选中这两类中的第一个元素。

这里就体现了与 `-child` 的选择器的区别：**`-child` 选择器是看父元素下的所有子元素，而 `-type` 选择器则是看父元素下的同类型的子元素**。打个比方，`-child` 选择器是从一个班级内的所有学生中进行筛选，而 `-type` 选择器则是从班级内的所有女生、所有男生中进行筛选。

那么既然是同类型，自然能够指定类型：

```css
/* box下的所有p元素中的最后一个 */
.box  p:last-of-type{
    border: 2px solid blue;
}
/* box下的所有li元素中的第偶数个 */
.box li:nth-of-type(2n){
    border: 2px solid red;
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/469693b475f74011a41da8aa5884c16a.png#pic_center)

### 5.3 否定伪类

`:not()` --- 将符合条件的元素排除

例：

```html
<div class="test">
    <p>1111</p>
    <p>2222</p>
    <p>3333</p>
    <p>4444</p>
</div>
```

添加如下样式：

```css
.test {
    margin: 10px 10px 10px 10px;

    :not(:first-of-type):not(:last-child){
        color: red;
    }
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/03b7ad6f00a348eaae6a182c03628f30.png#pic_center)

所以，这个选择器的效果就是，排除相同类型中的第一个，然后再排除 test 下的最后一个子元素！

### 5.4 元素的伪类

* `:link` --- 表示**未访问过**的a标签
* `:visited` --- 表示**访问过**的a标签

以上两个伪类是**超链接**所独有的！另外，由于隐私的问题，所以 `:visited` 这个伪类只能修改链接的颜色。

以下两个伪类是所有标签都可以使用：

* `:hover` --- 鼠标移入后，元素的状态
* `:active` --- 鼠标点击后，元素的状态

## 6. 伪元素选择器

与伪类一样，伪元素也是不存在的元素，其代表了元素的特殊状态。

常见的几个伪元素：

* `::first-letter` --- 表示第一个字母
* `::first-line` --- 表示第一行
* `::selection` --- 表示选中的元素
* `::before` --- 元素开始的位置前
* `::after` --- 元素结束的位置后

**`before` 和 `after` 必须配合 `content` 一起使用(`before`, `after` 所写的内容无法选中且永远在最前和最后)**。

下面给出几个例子帮助理解。

对于下面的HTML结构：

```html
<div class="test">
    <p>hello hello hello hello</p>
    <p>world，我们要相信明天会更好。</p>
</div>
```

添加如下样式：

```css
/* 让文字的首字母一直为字体为24px */
p::first-letter {
    font-size: 24px;
}
/* 让文字的第一行添加背景色灰色 */
p::first-line {
    background-color: #ccc;
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/a2e01d6927a0436e8c5530c1e743e593.png#pic_center)

添加如下样式：

```css
 /* 让选中的内容，字体为绿色(此时鼠标选中 "我们")*/
::selection{
    color: red;
}
/* 在元素开始的位置前+'你好' */
p::before{
    content: '你好';
    color:red
}
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/1fe94c4b413e45a3aab3aabad747d0bd.png#pic_center)
