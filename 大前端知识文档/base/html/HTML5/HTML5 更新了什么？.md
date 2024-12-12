# HTML5 更新了什么？

HTML5 是一个新版本的 HTML 语言，有新的元素、属性和行为。

## 1. 语义化标签

* `header`：定义⽂档的⻚眉（头部）；
* `nav`：定义导航链接的部分；
* `footer`：定义⽂档或节的⻚脚（底部）；
* `article`：定义⽂章内容；
* `section`：定义⽂档中的节（section、区段；
* `aside`：定义其所处内容之外的内容（侧边）；

## 2. 媒体标签

`<audio>` `<video>` `<source>`

## 3. 表单更新

### 3.1 新的表单控件

* `email` ：能够验证当前输⼊的邮箱地址是否合法
* `url` ： 验证URL
* `number` ： 只能输⼊数字，其他输⼊不了，⽽且⾃带上下增⼤减⼩箭头，max属性可以设置为最⼤值，min可以设置为最⼩值，value为默认值。
* `search` ： 输⼊框后⾯会给提供⼀个⼩叉，可以删除输⼊的内容，更加⼈性化。
* `range` ： 可以提供给⼀个范围，其中可以设置max和min以及value，其中value属性可以设置为默认值
* `color` ： 提供了⼀个颜⾊拾取器
* `time` ： 时分秒
* `data` ： ⽇期选择年⽉⽇
* `datatime` ： 时间和⽇期（⽬前只有 Safari ⽀持）
* `datatime-local` ：⽇期时间控件
* `week` ：周控件
* `month` ：⽉控件

### 3.2 新的表单属性

* `placeholder` --- 提示信息；
* `autofocus` --- ⾃动获取焦点；
* `autocomplete="on/off"` --- 使⽤这个属性需要有两个前提：
  * 表单必须提交过；
  * 必须有 `name` 属性。
* required --- 要求输⼊框不能为空，必须有值才能够提交；
* `pattern=" "` --- ⾥⾯写⼊想要的正则模式；
* multiple --- 可以选择多个⽂件或者多个邮箱；
* form --- form 表单的 ID。

### 3.3 新的表单事件

* `oninput` 每当 input ⾥的输⼊框内容发⽣变化都会触发此事件。
* `oninvalid` 当验证不通过时触发此事件。

## 4. 进度条、度量器标签

* `<progress>` 标签：⽤来表示任务的进度（IE、Safari不⽀持），`max` ⽤来表示任务的进度，`value` 表示已完成多少；
* `<meter>` 标签：⽤来显示剩余容量或剩余库存（IE、Safari不⽀持）
  * `high/low`：规定被视作⾼/低的范围
  * `max/min`：规定最⼤/⼩值
  * `value`：规定当前度量值

## 5. 新的 DOM 查询操作

* document.querySelector()
* document.querySelectorAll()

它们选择的对象可以是标签，可以是类（需要加 .），可以是 ID（需要加 #）

## 6. Web 存储

HTML5 提供了两种在客户端存储数据的新⽅法：

* `localStorage` - 没有时间限制的数据存储；
* `sessionStorage` - 针对⼀个 `session` 的数据存储。

## 7. 其他

* 拖放 draggable
* 画布 Canvas
* 矢量图 SVG
* ...
