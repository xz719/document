# HTML ​`​<iframe>​`

`iframe`（inline frame）是一种在 HTML 页面中嵌入另一个 HTML 页面的方法。通过 `iframe`，你可以在当前网页中显示另一个完全独立的网页，它们是彼此分离的。换句话说，`iframe` 允许你在当前页面中创建一个子窗口，而该窗口可以加载另一个网站或内容。

现代网页开发中，​`​<iframe>​`​ 标签是一个非常重要的工具。允许我们在一个网页中嵌入另一个网页，对于展示外部内容、应用嵌套或实现复杂的布局设计都非常有用。

## 1. ​`​<iframe>​` 的基本使用

### 1.1 ​`​<iframe>​` 基本语法

```html
<iframe src="URL" width="宽度" height="高度" frameborder="边框"></iframe>
```

例如：

```html
<iframe src="https://www.abc.com"></iframe>
```

在这个例子中，通过 `iframe` 在页面中嵌入并显示 <https://www.abc.com> 这个网页。

### 1.2 ​`​<iframe>​` 标签常用属性

`iframe` 有很多常见属性，可以控制其行为、外观和与父页面的交互。

* `src` --- 嵌入页面的 URL 地址。
* `width` 和 `height` --- 设置 `iframe` 的宽度和高度，可以是像素值或者百分比。
  
  例如：

  ```html
  <iframe src="https://www.abc.com" width="600" height="400"></iframe>
  ```

* `frameborder` --- 控制 `iframe` 边框的显示。0 表示无边框，1 表示有边框（已废弃，建议使用 CSS 控制）。
* `scrolling` --- 控制 `iframe` 内是否显示滚动条。yes 表示允许，no 表示不允许，auto 根据内容自动判断。
  
  例如：

  ```html
  <iframe src="https://www.abc.com" scrolling="no"></iframe>
  ```

* `sandbox` --- 限制 `iframe` 内内容的权限，比如禁止脚本执行、表单提交等。常见值包括：
  * `allow-scripts`：允许脚本运行；
  * `allow-forms`：允许表单提交；
  * `allow-same-origin`：允许 `iframe` 内的内容被认为与父页面同源（❗这非常危险，需谨慎使用）。
  
  例如：

  ```html
  <iframe src="https://www.abc.com" sandbox="allow-scripts"></iframe>
  ```

* `allowfullscreen` --- 允许 `iframe` 内容进入全屏模式（比如视频），这是一个布尔属性，示例：
  
  ```html
  <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>
  ```

## 2. `iframe` 的常见用途

`iframe` 的常见用途包括：

* 嵌入视频：如 YouTube、Vimeo 等视频平台提供的嵌入代码；
* 加载广告：广告常常通过 iframe 嵌入，以确保广告内容与主页面隔离；
* 嵌入外部内容：将一个完全独立的页面嵌入到当前页面中，比如加载第三方应用、表单等；
* 内嵌文档：将 PDF、HTML、网站等文件展示在网页中；
* 跨域内容嵌入：通过 iframe 可以显示来自不同域名的内容，但需要考虑一些安全限制。

## 3. `iframe` 的安全问题

`iframe` 虽然很方便，但也存在一些安全风险，尤其是涉及跨域内容时，以下是一些常见的安全问题：

* **点击劫持（Click hijacking）**：攻击者可以利用 `iframe` 将一个网页嵌入到透明的 `iframe` 中，诱导用户点击，从而劫持用户操作。这种情况下，用户以为在操作当前页面，实际上在点击 `iframe` 内的内容。
  
  解决方法：

  在被嵌入的页面中设置 X-Frame-Options 响应头，阻止页面被嵌入：
  
  ```html
  X-Frame-Options: DENY
  ```

  或者允许特定来源的嵌入：

  ```html
  X-Frame-Options: SAMEORIGIN
  ```

* **跨域通信问题**：不同域名下的页面不能直接通过 JavaScript 进行交互。这是为了防止跨站脚本攻击（XSS）。不过可以通过 postMessage 实现安全的跨域通信。

## 4. 一些示例

### 4.1 使用 `iframe` 嵌入 YouTube 视频

嵌入视频是 `iframe` 的常见用途之一。例如，你可以通过 `iframe` 在网页中嵌入一个 YouTube 视频：

```html
<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
```

在这个例子中，`iframe` 会显示一个宽为 560 像素，高为 315 像素的 YouTube 视频播放器。

### 4.2 加载另一个 HTML 文件

假设你有两个 HTML 文件，一个是主页面 index.html，另一个是被嵌入的页面 about.html，你可以通过 `iframe` 将 about.html 嵌入到 index.html 中。

见 [例4.2](./示例/index.html)

### 4.3 嵌入高德地图

见 [例4.3](./示例/gaode.html)

## 5. `iframe` 的优点和缺点

🎉优点：

* ⽤来加载速度较慢的内容（如⼴告）
* 可以使脚本可以并⾏下载
* 可以实现跨⼦域通信

⚠️缺点：

* `iframe` 会阻塞主⻚⾯的 onload 事件
* ⽆法被⼀些搜索引擎索识别
* 会产⽣很多⻚⾯，不容易管理
