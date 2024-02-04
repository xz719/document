// 例1：未实现状态改变时执行回调的例子

class _Promise {
  // Promise 等待态（初始状态）
  static PENDING = "pending";
  // Promise 失败态
  static REJECTED = "rejected";
  // Promise 成功态
  static FULFILLED = "fulfilled";

  constructor(executor) {
    // 初始化 Promise 初始状态
    this.status = _Promise.PENDING;
    // 定义 Promise 成功的值
    this.value = undefined;
    // 定义 Promise 失败的原因
    this.reason = undefined;
    // 定义 resolve 函数
    const resolve = (value) => {
      if (this.status === _Promise.PENDING) {
        this.status = _Promise.FULFILLED;
        this.value = value;
      }
    };
    // 定义 reject 函数
    const reject = (reason) => {
      if (this.status === _Promise.PENDING) {
        this.status = _Promise.REJECTED;
        this.reason = reason;
      }
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  // 实现一个简单的then方法
  then(onFulfilled, onRejected) {
    if (this.status === _Promise.FULFILLED) {
      onFulfilled(this.value);
    }
    if (this.status === _Promise.REJECTED) {
      onRejected(this.reason);
    }
  }
}

// 先看原生Promise
// const p = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("ok");
//   }, 2000);
// });
// p.then(
//   (value) => {
//     console.log("promise success:", value);
//   },
//   (reason) => {
//     console.log("promise fail:", reason);
//   }
// );

// 再看我们实现的_Promise

const promise = new _Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("ok");
  }, 2000);
});
promise.then(
  (value) => {
    console.log("promise success:", value);
  },
  (reason) => {
    console.log("promise fail:", reason);
  }
);

setTimeout(() => {
  console.log(promise);
}, 2400);
