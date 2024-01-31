// const p1 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("ok");
//   }, 2000);
// });

// const p2 = p1.then(
//   (value) => {
//     console.log("p1 success:", value);
//     return 123;
//   },
//   (reason) => {
//     console.log("p1 fail:", reason);
//   }
// );

// p2.then(
//   (value) => {
//     console.log("p2 success:", value);
//   },
//   (reason) => {
//     console.log("p2 fail:", reason);
//   }
// );

// 例：返回普通值的处理

class _Promise {
  // Promise状态枚举
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  // 构造函数
  constructor(executor) {
    // 在executor的执行过程中，可能会出现错误，所以我们需要用try/catch包裹一下
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  // Promise 的状态
  status = _Promise.PENDING; // 初始状态为pending
  // 保存成功的值
  value = undefined;
  // 保存失败的值
  reason = undefined;

  // 存储成功的回调
  onFulfilledCallbacks = [];
  // 存储失败的回调
  onRejectedCallbacks = [];

  // resolve方法
  resolve = (value) => {
    // 一旦状态改变，就不能再变。这里使用 === 保证状态改变不可逆
    if (this.status !== _Promise.PENDING) return;
    // 更新Promise状态
    this.status = _Promise.FULFILLED;
    // 保存数据
    this.value = value;
    // 依次执行成功的回调
    this.onFulfilledCallbacks.forEach((cb) => cb());
  };

  // reject方法
  reject = (reason) => {
    // 同上
    if (this.status !== _Promise.PENDING) return;
    this.status = _Promise.REJECTED;
    this.reason = reason;
    // 依次执行失败的回调
    this.onRejectedCallbacks.forEach((cb) => cb());
  };

  // then方法
  then = (onResolved = (value) => value, onRejected) => {
    return new _Promise((resolve, reject) => {
      // 状态为pending时，将回调存放起来
      if (this.status === _Promise.PENDING) {
        this.onFulfilledCallbacks.push(() => {
          // 传递操作成功时的结果
          onResolved(this.value);
        });
        this.onRejectedCallbacks.push(() => {
          // 传递操作失败时的原有
          onRejected(this.reason);
        });
      }
      // 状态为fulfilled或rejected时，直接执行回调
      if (this.status === _Promise.FULFILLED) {
        // 直接执行回调时，需要将回调的返回值resolve出去，供后续链式调用时获取
        const res = onResolved(this.value);
        resolve(res);
      }
      if (this.status === _Promise.REJECTED) {
        onRejected(this.reason);
      }
    });
  };
}

const p1 = new _Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("ok");
  }, 2000);
});

const p2 = p1.then(
  (value) => {
    console.log("p1 success:", value);
    return 123;
  },
  (reason) => {
    console.log("p1 fail:", reason);
  }
);

p2.then(
  (value) => {
    console.log("p2 success:", value);
  },
  (reason) => {
    console.log("p2 fail:", reason);
  }
);