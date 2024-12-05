# HTML meta

`<meta>` 是 HTML 语言头部（header）的一个**辅助性标签**，常用于定义页面的说明、关键字、最后修改日期、页面编码语言、搜索引擎优化、自动刷新并指向新的页面、控制页面缓冲、响应式视窗等以及其它的**元数据**。

从使用上讲，`meta` 标签由 `name` 和 `content` 属性定义，⽤来描述⽹⻚⽂档的属性，⽐如⽹⻚的作者，⽹⻚描述，关键词等，除了 HTTP 标准固定了⼀些 `name`作为⼤家使⽤的共识，开发者还可以⾃定义 `name` 属性。

## 💡常见的 `meta` 标签

1. `charset` --- 用于描述 HTML 文档的编码类型，例：`<meta charset="utf-8">`
2. `keywords` --- 用于定义页面关键字，例：`<meta name="keywords" content="k1 k2 k3">`
3. `description` --- 页面描述，例：`<meta name="description" content="⻚⾯描述内容" />`
4. `refresh` --- 页面的重定向和刷新，例：`<meta http-equiv="Refresh" content="5;url=../index.htm" />`
5. `viewport` --- 视口的大小以及比例，例：

   ```html
    <meta
        name="viewport"
        content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
    />
   ```

   viewport 详解见 [meta viewport](./meta%20viewport.md)
