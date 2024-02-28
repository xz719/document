# DOM 和 BOM 详解

## 1. 什么是 DOM ？

**DOM**（Document Object Model，**文档对象模型**），是 W3C 组织推荐的处理可扩展标记语言（HTML或XML）的标准编程接口(API)。它的作用是通过这些 DOM 接口可以改变网页的内容、结构和样式。

在 DOM 模型中，HTML 文档的层次结构被抽象为一个 DOM 树，这个树结构的每一个子节点表示 HTML 文档中的不同内容。

* 【文档】：**一个页面就是一个文档**。在 DOM 中使用 **document** 表示。
* 【节点】：位于文档中的**每个对象**都是某种类型的节点。在一个 HTML 文档中，一个对象可以是一个元素节点，也可以是一个文本节点或属性节点，DOM 中使用 **node** 表示。
* 【元素】：页面中的所有**标签**都是元素，`element` 类型是基于 `node` 的。它指的是一个元素或一个由 DOM API 的成员返回的 `element` 类型的节点。，DOM 中使用 **element** 表示。

例如：

![在这里插入图片描述](https://img-blog.csdnimg.cn/11de0c02e1214413ab88e335cd7058aa.png#pic_center)

DOM 的方法 (methods) 让你可以用特定方式操作这个树，用这些方法你可以改变文档的结构、样式或者内容。同时，元素可以关联上事件处理器，一旦某一事件被触发了，那些事件处理器就会被执行。

## 2. DOM 树节点操作

[文档对象模型 (DOM) - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model#dom_接口)

## 3. DOM 事件

DOM 事件模型包括：

* 标准事件模型
* IE 事件模型

但 IE 事件模型很少用了，所以这里不再进行叙述。

**标准事件模型**包括三个阶段：

### 3.1 事件捕获阶段

事件**从 `document` ⼀直向下传播到⽬标元素**, 在这个过程中检查经过的节点是否绑定了该类事件的**事件监听函数**，如果有就执⾏。

### 3.2 事件处理阶段

事件到达⽬标元素, 触发⽬标元素的**监听函数**。

### 3.3 事件冒泡阶段

事件**从⽬标元素冒泡到 `document`** , 也是检查经过的节点是否绑定了该类事件的**事件监听函数**，如果有则执⾏。

### 3.4 事件处理的时机

事件监听(处理)函数一般有两种写法：

* 在 js 中向元素的属性添加，例如：`div.onclick = …`
* 在 html 中直接向元素上添加，例如：`<div onclick = “…">`

或者，使用 `addEventListener` 和 `removeEventListener` 来添加或移除事件监听函数。

而实际上，事件处理函数并不是一定在**事件处理阶段**被调用，也可以设定在其它阶段！

事件绑定监听函数的方法如下：

```js
addEventListener(eventType, handler, userCapture)
```

事件移除监听函数的方式如下：

```js
removeEventListener(eventType, handler, useCapture)
```

可以看到，有三个参数：

* 【eventType】 — 事件类型
* 【handler】 — 事件处理函数
* 【useCapture】 — `boolean` 类型，用于指定是否在**捕获阶段**进行处理，一般设置为 `false` 与 IE 浏览器保持一致，即只在**事件冒泡阶段**才执行事件处理函数！设置为 `true` 就在**捕获过程**中执行。

### 3.5 事件对象

在触发 DOM 上的事件时都会产生一个对象。

DOM中的事件对象为 `event`，其拥有以下属性：

* `type`：获取事件类型（click）
* `target`：获取事件目标（object）
* `stopPropagation()`方法：阻止事件冒泡
* `preventDefault()`方法：阻止事件的默认行为

## 4. 什么是 BOM ？

BOM的**核心**是 `window` 对象，而 `window` 对象又具有**双重角色**，它既是通过 js 访问浏览器窗口的一个**接口**，又是一个 **`Global`（全局）对象**。

这意味着**在网页中定义的任何对象、变量和函数，都以 `window` 作为其 `global` 对象**。

下面是一些常用的 `window` 对象身上的方法：

```js
window.close();  //关闭窗口  

window.alert("message");  
//弹出一个具有OK按钮的系统消息框，显示指定的文本 

window.confirm("Are you sure?");  
//弹出一个具有OK和Cancel按钮的询问对话框，返回一个布尔值  

window.prompt("What's your name?", "Default");  
//提示用户输入信息，接受两个参数，即要显示给用户的文本和文本框中的默认值，
//将文本框中的值作为函数值返回  

window.status  //可以使状态栏的文本暂时改变  

window.defaultStatus  
//默认的状态栏信息，可在用户离开当前页面前一直改变文本  

window.setTimeout("alert('xxx')", 1000);  
//设置在指定的毫秒数后执行指定的代码，接受2个参数，要执行的代码和等待的毫秒数  

window.clearTimeout("ID");  //取消还未执行的暂停，将暂停ID传递给它  

window.setInterval(function, 1000);  
//无限次地每隔指定的时间段重复一次指定的代码，参数同setTimeout()一样  

window.clearInterval("ID");  //取消时间间隔，将间隔ID传递给它  

window.history.go(-1);  
//访问浏览器窗口的历史，负数为后退，正数为前进 

window.history.back();  //同上  

window.history.forward();  //同上  

window.history.length  //可以查看历史中的页面数 
```

BOM 中的其它对象为：

* location
* navigator
* screen
* history
* frames

这些对象称为 `window` 的子对象，是以**属性**的方式添加到 window 对象身上的。

### 4.1 `document` 对象

实际上就是 DOM 中的 document 对象，即 `document == window.document` 的结果为 `true`。它是唯一一个**既属于 BOM 又属于 DOM 的对象**。

### 4.2 `location` 对象

location 对象，表示载入窗口的**URL**，可用 `window.location` 直接引用它。

其身上常用的属性和方法如下：

```js
location.href  //当前载入页面的完整URL，如http://www.somewhere.com/pictures/index.htm  

location.portocol  //URL中使用的协议，即双斜杠之前的部分，如http 

location.host  //服务器的名字，如www.wrox.com  

location.hostname  //通常等于host，有时会省略前面的www  

location.port  
//URL声明的请求的端口，默认情况下，大多数URL没有端口信息，如8080 

location.pathname  
//URL中主机名后的部分，如/pictures/index.htm  

location.search  
//执行GET请求的URL中的问号后的部分，又称查询字符串，如?param=xxxx  

location.hash  
//如果URL包含#，返回该符号之后的内容，如#anchor1  

location.assign("http:www.baidu.com");  
//同location.href，新地址都会被加到浏览器的历史栈中  

location.replace("http:www.baidu.com");  
//同assign()，但新地址不会被加到浏览器的历史栈中，不能通过back和forward访问  

location.reload(true | false);  
//重新载入当前页面，为false时从浏览器缓存中重载，为true时从服务器端重载，默认为false  
```

### 4.3 `navigator` 对象

`navigator` 对象中包含大量有关 Web 浏览器的信息，在**检测浏览器及操作系统**上非常有用，也可用 `window.navigator` 直接引用它。

其身上常用的属性和方法如下：

```js
navigator.appCodeName  //浏览器代码名的字符串表示  

navigator.appName  //官方浏览器名的字符串表示  

navigator.appVersion  //浏览器版本信息的字符串表示  

navigator.cookieEnabled  //如果启用cookie返回true，否则返回false  

navigator.javaEnabled  //如果启用java返回true，否则返回false  

navigator.platform  //浏览器所在计算机平台的字符串表示  

navigator.plugins  //安装在浏览器中的插件数组  

navigator.taintEnabled  //如果启用了数据污点返回true，否则返回false  

navigator.userAgent  //用户代理头的字符串表示   
```

### 4.4 `screen` 对象

`screen` 对象，其用于获取某些关于用户屏幕的信息，同样也可用 `window.screen` 引用它。

其身上常用的属性和方法如下：

```js
screen.width/height  //屏幕的宽度与高度，以像素计  

screen.availWidth/availHeight  //窗口可以使用的屏幕的宽度和高度，以像素计 

screen.colorDepth  //用户表示颜色的位数，大多数系统采用32位  

window.moveTo(0, 0);  

window.resizeTo(screen.availWidth, screen.availHeight);  //填充用户的屏幕   
```

## 5. DOM 和 BOM 区别

那么最后，DOM 和 BOM 的区别在哪呢？它们两者之间有什么联系？

首先来看下面这张图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/5d16fbb09c664fa4859167306f920a2e.png#pic_center)

可以看到，在层次结构中，DOM 最根本的元素 `document` 是 BOM 的核心对象 `window` 的一个子对象。所以，**DOM 实际上可以看作 BOM 的一个部分**。即上面所说的，`document == window.document` 的结果为 `true`。

而浏览器提供出来给予访问的是 BOM 对象，从 BOM 对象再访问到 DOM 对象，从而在 js 中可以操作浏览器以及浏览器读取到的文档。

只不过，两者的区别在于：

DOM 描述了处理**网页内容**的方法和接口，BOM 描述了与**浏览器**进行交互的方法和接口。

### 总结

最后来总结一下：

1. DOM 是【文档对象模型】，BOM是【浏览器对象模型】。

2. DOM 就是把**文档**当做一个对象来看待，BOM 是把**浏览器**当做一个对象来看待

3. DOM 的顶级对象是 `document`（实际上是window.document），BOM 的顶级对象是 `window`

4. DOM 主要规定的是操作**页面元素**，BOM 规定的是**浏览器窗口**交互的一些对象

5. DOM 是 W3C 标准规范，BOM 是浏览器厂商在各自浏览器上定义的，**兼容性较差**。
