function query(selector) {
  return Array.from(document.querySelectorAll(selector));
}

let flag = 0

var observer = new IntersectionObserver((entries) => {
  // 由于回调函数会在调用 observe 方法时就执行一次，而为了实现懒加载，调用 observe 时显然是不能将template中的img插入真实 DOM 中的，所以这里用一个flag来标识一下
  if (!flag) {
    flag = 1
    return
  }
  entries.forEach(entry => {
    var container = entry.target;
    var content = container.querySelector("template").content;
    // 将模板内的img插入真实DOM中，此时才会请求静态资源！
    container.appendChild(content);
    observer.unobserve(container);
  });
});

query(".lazy_load").forEach(item => {
  observer.observe(item);
});
