# Web API 简介

## 1.什么是 API ？

**应用程序接口**（**API**，Application Programming Interface）是基于编程语言构建的结构，使开发人员更容易地创建复杂的功能。它们抽象了复杂的代码，并提供一些简单的接口规则直接使用。

## 2.客户端 JS 中的 API

客户端 JavaScript 中有很多可用的 API — 他们本身并不是 JavaScript 语言的一部分，却建立在 JavaScript 语言核心的顶部，为使用 JavaScript 代码提供额外的超强能力。他们通常分为两类：

* **浏览器 API** 内置于 **Web 浏览器**中，能从浏览器和电脑周边环境中提取数据，并用来做有用的复杂的事情。例如 [Geolocation API](https://developer.mozilla.org/zh-CN/docs/Web/API/Geolocation_API) 提供了一些简单的 JavaScript 结构以获得位置数据，因此使用者可以在 Google 地图上标示您的位置。在后台，浏览器确实使用一些复杂的低级代码（例如 C++）与设备的 GPS 硬件（或可以决定位置数据的任何设施）通信来获取位置数据并把这些数据返回给使用者的代码中使用浏览器环境；但是，这种复杂性通过 API 抽象出来，因而与使用者无关。
* **第三方 API** 缺省情况下不会内置于浏览器中，通常必须在 Web 中的某个地方获取代码和信息。例如[Twitter API](https://dev.twitter.com/overview/documentation) 使使用者能做一些显示最新推文这样的事情，它提供一系列特殊的结构，可以用来请求 Twitter 服务并返回特殊的信息。

![在这里插入图片描述](https://img-blog.csdnimg.cn/4a0b3d6a5be64f388b871da092fb9dd0.png#pic_center)

## 3. API 可以做什么？

在主流浏览器中有大量的可用 API，使用者可以利用这些 API 在代码中做许多的事情，对此可以查看 [MDN API index page](https://developer.mozilla.org/zh-CN/docs/Web/API)。

### 3.1 常见浏览器 API

最常见的浏览器 API 类别是：

* 【操作文档的 API】--- 内置于浏览器中。最明显的例子是[DOM（文档对象模型）](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model)API，它**允许您操作 HTML 和 CSS** — 创建、移除以及修改 HTML，动态地将新样式应用到您的页面，等等。每当您看到一个弹出窗口出现在一个页面上，或者显示一些新的内容时，这都是 DOM 的行为。您可以在在[Manipulating documents](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents)中找到关于这些类型的 API 的更多信息。
* 【从服务器获取数据的 API】--- 用于更新网页的一小部分是相当好用的。这个看似很小的细节能对网站的性能和行为产生巨大的影响 — 如果您只是更新一个股票列表或者一些可用的新故事而不需要从服务器重新加载整个页面将使网站或应用程序感觉更加敏感和“活泼”。使这成为可能的 API 包括[`XMLHttpRequest`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)和 [Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)。您也可能会遇到描述这种技术的术语**Ajax**。您可以在[Fetching data from the server](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Client-side_web_APIs/Fetching_data)找到关于类似的 API 的更多信息。
* 【用于绘制和操作图形的 API】--- 目前已被浏览器广泛支持 — 最流行的是允许您以编程方式更新包含在 HTML [`canvas`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas) 元素中的像素数据以创建 2D 和 3D 场景的 [Canvas](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API) 和 [WebGL](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API)。例如，您可以绘制矩形或圆形等形状，将图像导入到画布上，然后使用 Canvas API 对其应用滤镜（如棕褐色滤镜或灰度滤镜），或使用 WebGL 创建具有光照和纹理的复杂 3D 场景。这些 API 经常与用于创建动画循环的 API（例如[`window.requestAnimationFrame()`](https://developer.mozilla.org/zh-CN/docs/Web/API/window/requestAnimationFrame)）和其他 API 一起不断更新诸如动画和游戏之类的场景。
* 【音频和视频 API】--- 诸如 [`HTMLMediaElement`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement)、[Web Audio API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API) 和 [WebRTC](https://developer.mozilla.org/zh-CN/docs/Web/API/WebRTC_API) 允许你使用多媒体来做一些非常有趣的事情，比如创建用于播放音频和视频的自定义 UI 控件，显示字幕字幕和你的视频，从网络摄像机抓取视频，通过画布操纵（见上），或在网络会议中显示在别人的电脑上，或者添加效果到音轨（如增益、失真、平移等） 。
* 【设备 API】--- 基本上是以对网络应用程序有用的方式操作和检索现代设备硬件中的数据的 API。我们已经讨论过访问设备位置数据的地理定位 API，因此您可以在地图上标注您的位置。其他示例还包括通过系统通知（参见[Notifications API](https://developer.mozilla.org/zh-CN/docs/Web/API/Notifications_API)）或振动硬件（参见[Vibration API](https://developer.mozilla.org/zh-CN/docs/Web/API/Vibration_API)）告诉用户 Web 应用程序有用的更新可用。
* 【客户端存储 API】--- 在 Web 浏览器中的使用变得越来越普遍 - 如果您想创建一个应用程序来保存页面加载之间的状态，甚至让设备在处于脱机状态时可用，那么在客户端存储数据将会是非常有用的。例如使用 [Web Storage API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Storage_API) 的简单的键值对存储以及使用 [IndexedDB API](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API) 的更复杂的表格数据存储。

### 3.2 常见的第三方API

第三方 API 种类繁多，下列是一些比较流行的你可能迟早会用到的第三方 API:

* The [Twitter API](https://dev.twitter.com/overview/documentation), 允许您在您的网站上展示您最近的推文等。
* The [Google Maps API](https://developers.google.com/maps/) 允许你在网页上对地图进行很多操作（这很有趣，它也是 Google 地图的驱动器）。现在它是一整套完整的，能够胜任广泛任务的 API。其能力已经被[Google Maps API Picker](https://developers.google.com/maps/documentation/api-picker)见证。
* The [Facebook suite of API](https://developers.facebook.com/docs/) 允许你将很多 Facebook 生态系统中的功能应用到你的 app，使之受益，比如说它提供了通过 Facebook 账户登录、接受应用内支付、推送有针对性的广告活动等功能。
* The [YouTube API](https://developers.google.com/youtube/), 允许你将 Youtube 上的视频嵌入到网站中去，同时提供搜索 Youtube，创建播放列表等众多功能。
* The [Twilio API](https://www.twilio.com/), 其为您的 app 提供了针对语音通话和视频聊天的框架，以及从您的 app 发送短信息或多媒体信息等诸多功能。

## 4. API是如何工作的？

不同的 JavaScript API 以稍微不同的方式工作，但通常它们具有共同的特征和相似的主题。

### 4.1 它们是基于【对象】的

API 使用一个或多个`JavaScript objects` 在您的代码中进行交互，这些对象用作 API 使用的数据（包含在对象属性中）的容器以及 API 提供的功能（包含在对象方法中）。

首先，API 对象通常包含**构造函数**，可以调用这些构造函数来创建用于编写程序的对象的**实例**。其次，API 对象通常有几个可用的 **options**，可以调整以获得您的程序所需的确切环境 (根据不同的环境，编写不同的`Options`对象)。

而 API 构造函数通常接受 options 对象作为参数。

### 4.2 它们有可识别的入口点

使用 API 时，应确保知道 API 入口点的位置。

文档对象模型 (DOM) API 有一个更简单的入口点 —它的功能往往被发现挂在 [`Document`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document) 对象上，或任何你想影响的 HTML 元素的实例，例如：

```js
var em = document.createElement('em'); // 创建一个em元素
var para = document.querySelector('p'); // 引用一个已存在的p元素
em.textContent = 'Hello there!'; // 给em元素一个文本
para.appendChild(em); // 将em嵌入p元素
```

其他 API 具有稍微复杂的入口点，通常涉及为要编写的 API 代码创建特定的上下文。例如，Canvas API 的上下文对象是通过获取要绘制的 [`canvas`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas) 元素的引用来创建的，然后调用它的 [`HTMLCanvasElement.getContext()`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/getContext) 方法：

```js
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
```

然后，我们想通过调用内容对象 (它是 [`CanvasRenderingContext2D`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D) 的一个实例) 的属性和方法来实现我们想要对画布进行的任何操作，例如：

```js
Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};
```

### 4.3 它们使用事件来处理状态的变化

一些 Web API 不包含事件，但有些包含一些事件。当事件触发时，允许我们运行函数的处理程序属性通常在单独的“Event handlers”(事件处理程序) 部分的参考资料中列出。

作为一个简单的例子，[`XMLHttpRequest`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest) 对象的实例（每一个实例都代表一个到服务器的 HTTP 请求，来取得某种新的资源）都有很多事件可用，例如 `onload` 事件在成功返回时就触发包含请求的资源，并且现在就可用。

下面的代码提供了一个简单的例子来说明如何使用它：

```js
var requestURL = 'https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json';
var request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

request.onload = function() {
  var superHeroes = request.response;
  populateHeader(superHeroes);
  showHeroes(superHeroes);
}
```

 `onload` 处理函数指定我们如何处理响应。我们知道请求会成功返回，并在需要加载事件（如`onload` 事件）之后可用（除非发生错误），所以我们将包含返回的 JSON 的响应保存在`superHeroes`变量中，然后将其传递给两个不同的函数以供进一步处理。

### 4.4 它们在适当的地方有额外的安全机制

WebAPI 功能受到与 JavaScript 和其他 Web 技术（例如[同源政策](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)）相同的安全考虑 但是他们有时会有额外的安全机制。例如，一些更现代的 WebAPI 将只能在通过 HTTPS 提供的页面上工作，因为它们正在传输潜在的敏感数据（例如 [服务工作者](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API) 和 [推送](https://developer.mozilla.org/zh-CN/docs/Web/API/Push_API)）。

另外，一旦调用 WebAPI 请求，用户就可以在您的代码中启用一些 WebAPI 请求权限。例如，[通知 API](https://developer.mozilla.org/zh-CN/docs/Web/API/Notifications_API) 使用弹出对话框请求权限：

![在这里插入图片描述](https://img-blog.csdnimg.cn/2add18d163a84f47ad25916d806589b7.png#pic_center)

这些许可提示会被提供给用户以确保安全 - 如果这些提示不在适当位置，那么网站可能会在您不知情的情况下开始秘密跟踪您的位置，或者通过大量恼人的通知向您发送垃圾邮件。

---

在后面的文章中，将对于几种客户端 API 以及第三方 API 进行简要的介绍。
