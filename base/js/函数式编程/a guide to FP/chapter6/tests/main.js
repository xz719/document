const CDN = (s) => `https://cdnjs.cloudflare.com/ajax/libs/${s}`;
const ramda = CDN("ramda/0.21.0/ramda.min");
const jquery = CDN("jquery/3.0.0-rc1/jquery.min");

// 先引入两个库 ramda 和 jquery，ramda 中提供了 compose、curry 等许多工具函数

// 模块加载我们选择使用 require js，虽然有点大材小用，但是为了保持一致性，本教程中将一直使用它
requirejs.config({ paths: { ramda, jquery } });
require(["jquery", "ramda"], ($, { compose, curry, map, prop }) => {
  /**
   * 下面是我们要做的事：
   *
   *      1. 根据特定搜索关键字构造 url
   *      2. 向 flickr 发送 api 请求
   *      3. 将请求返回的 json 转为 html 图片
   *      4. 把图片放到网页上
   *
   * 注意到，上面提到了两个不纯的动作，即第二步中向 flickr 发送请求，以及第四步中将图片放到网页上这两个动作
   *
   * 我们首先来定义这些不纯的动作，以便在后续的实现中对其进行隔离。我们将不纯的函数都放在 Impure 命令空间下
   */

  const Impure = {
    // debug 时使用的 trace 函数
    trace: curry((tag, x) => {
      console.log(tag, x);
      return x;
    }),

    // 将 jquery 的 getJSON 方法柯里化，同时这里把参数的位置也调换了下
    getJSON: curry((cb, url) => $.getJSON(url, cb)),

    // setHTML，用于后续将图片放到标签中
    setHTML: curry((sel, html) => $(sel).html(html)),

    // 在后面的章节中，我们会学习如何将这两个方法变为纯函数
  };

  // 接下来，完成上面的4个步骤

  // 1. 根据特定搜索关键字构造 url
  const host = "api.flickr.com";
  const path = "/services/feeds/photos_public.gne";
  const query = (t) => `?tags=${t}&format=json&jsoncallback=?`;
  const url = (t) => `https://${host}${path}${query(t)}`; // 这里也可以选择使用 pointfree 模式编写 url 方法，但是为了可读性，这里仍然选择使用基本模式

  // 2. 向拼接好的 url 发送请求
  /**
   * 这里使用了声明式的方式来构造发送请求的方法，其指明了发送请求的行为是由:
   *
   *    1. 获取 url
   *    2. 向 url 发送请求，执行回调
   *
   * 这两步组合而成
   */
  //   const app = compose(Impure.getJSON(render), url)

  // 3. 将返回的json转为图片地址，这里我们可以使用 ramda 库中的 prop 方法来获取图片对象数组中的某一嵌套属性
  const mediaUrl = compose(prop("m"), prop("media"));
  const mediaUrls = compose(map(mediaUrl), prop("items"));
  /**
   * 可以看到，这里也是采用了声明式的写法
   *
   * mediaUrl，用于从某一图片对象中获取图片地址属性，其实际上就是两个行为的组合：
   *
   *    1. 获取对象的 media 属性
   *    2. 获取 media 属性的 m 属性
   *
   * mediaUrls，用于获取请求返回的一组图片对象的所有地址，其实际上也是两个行为的组合：
   *
   *    1. 获取响应中的 items 属性，即包含所有图片对象的数组
   *    2. 遍历数组，用 mediaUrl 方法获取其中各图片对象的地址属性
   */

  // 4. 将图片插入到 img 标签并放到页面中
  // 对于大型应用，一般会使用 HandleBars 或者 React 这样的 template/dom 库来做这件事的，但是我们仅仅是一个小型应用，所以使用 jquery 就行了

  // 准备一个根据图片地址获取 img 标签的方法
  const getImg = (src) => $("<img />", { src });

  /**
   * 采用声明式写法，获取一个包含所有 img 标签的数组，其也是两个行为的组合：
   *
   *    1. 获取响应中的所有图片地址
   *    2. 对每一个图片地址生成一个 img 标签
   */
  const getImages = compose(map(getImg), mediaUrls);

  /**
   * 接下来，将 img 标签渲染在页面特定元素中
   */
  const render = compose(Impure.setHTML("#js-main"), getImages);

  const app = compose(Impure.getJSON(render), url);
  // 示例
  app("cats");
});
