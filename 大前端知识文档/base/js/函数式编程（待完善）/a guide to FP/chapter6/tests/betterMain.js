const CDN = (s) => `https://cdnjs.cloudflare.com/ajax/libs/${s}`;
const ramda = CDN("ramda/0.21.0/ramda.min");
const jquery = CDN("jquery/3.0.0-rc1/jquery.min");

requirejs.config({ paths: { ramda, jquery } });
require(["jquery", "ramda"], ($, { compose, curry, map, prop }) => {
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
  };

  const host = "api.flickr.com";
  const path = "/services/feeds/photos_public.gne";
  const query = (t) => `?tags=${t}&format=json&jsoncallback=?`;
  const url = (t) => `https://${host}${path}${query(t)}`;

  const mediaUrl = compose(prop("m"), prop("media"));
  const getImg = (src) => $("<img />", { src });

  /**
   * 可以看到，在下面的代码中，map 使用了两次，那么说明是可以使用 map 的组合定律的：
   *
   *    compose(map(f), map(g)) === map(compose(f, g))
   *
   * 但问题在于，这里的两个 map 并没有出现在同一个表达式中，所以，我们首先需要让这两个 map 出现在同一行中
   *
   * 可以利用组合的结合律以及第二章中我们学到的等式推导：
   *
   *    compose(f, compose(g, h)) === compose(f, g, h)
   */
  // const mediaUrls = compose(map(mediaUrl), prop("items"));
  // const getImages = compose(map(getImg), mediaUrls);

  // 进行等式替换后，map 出现在同一行中，可以应用组合律了
  // const getImages = compose(map(getImg), map(mediaUrl), prop("items"))

  // 应用组合律后
  const mediaToImg = compose(getImg, mediaUrl)
  const getImages = compose(map(mediaToImg), prop("items"))

  const render = compose(Impure.setHTML("#js-main"), getImages);

  const app = compose(Impure.getJSON(render), url);
  // 示例
  app("cats");
});
