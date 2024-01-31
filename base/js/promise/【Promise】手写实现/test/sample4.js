// 例：对回调返回 Promise 的处理
// const p1 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("ok");
//   }, 2000);
// });

// const p2 = p1.then(
//   (value) => {
//     console.log("p1 success:", value);
//     return new Promise((resolve, reject) => {
//       // resolve("ok2");
//       reject("ok2");
//     });
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
    // 先声明接收一下，最后再返回
    const promise = new _Promise((resolve, reject) => {
      // 状态为pending时，将回调存放起来
      if (this.status === _Promise.PENDING) {
        this.onFulfilledCallbacks.push(() => {
          // 将同步代码修改为异步执行，使得能够获取到新创建的promise
          setTimeout(() => {
            // 传递操作成功时的结果
            try {
              const res = onResolved(this.value);
              // 调用处理函数
              resolvePromise(promise, res, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          // 将同步代码修改为异步执行，使得能够获取到新创建的promise
          setTimeout(() => {
            // 传递操作失败时的原因
            try {
              const res = onRejected(this.reason);
              // 调用处理函数
              resolvePromise(promise, res, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
      // 状态为fulfilled或rejected时，直接执行回调
      if (this.status === _Promise.FULFILLED) {
        // 将同步代码修改为异步执行，使得能够获取到新创建的promise
        setTimeout(() => {
          try {
            const res = onFulfilled(this.value);
            // 调用处理函数
            resolvePromise(promise, res, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      if (this.status === _Promise.REJECTED) {
        // 将同步代码修改为异步执行，使得能够获取到新创建的promise
        setTimeout(() => {
          try {
            const res = onRejected(this.reason);
            // 调用处理函数
            resolvePromise(promise, res, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
    });
    return promise;
  };
}

// 判断Promise的返回值类型
const resolvePromise = (promise, value, resolve, reject) => {
  // 回调返回自身，属于自己等待自己完成，会导致无限循环，直接抛错！
  if (promise === value) {
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    );
  }
  // 判断返回值的类型，这里要进行严格的类型判断，保证代码能和别的库一起使用
  if (
    (typeof value === "object" && value !== null) ||
    typeof value === "function"
  ) {
    // 这里用 try/catch 包裹，防止下面调用then方法时出错，如果出错，直接reject触发失败回调
    try {
      // 检查返回值的then属性
      const then = value.then;
      if (typeof then === "function") {
        // 若返回值的then属性为函数，说明其为Promise对象！
        // 如果是Promise对象，调用其then方法，当其状态变化时，执行resolve或reject方法，更新新Promise对象的状态，并将结果传递出去
        then.call(
          value,
          (v) => {
            resolve(v);
          },
          (e) => {
            reject(e);
          }
        );
      } else {
        // 只是身上有then属性的普通对象，直接resolve即可
        resolve(value);
      }
    } catch (error) {
      reject(error);
    }
  } else {
    // 既不是对象也不是函数类型，说明是普通值，直接resolve出去即可
    resolve(x);
  }
};

const p1 = new _Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("ok");
  }, 2000);
});

const p2 = p1.then(
  (value) => {
    console.log("p1 success:", value);
    return new _Promise((resolve, reject) => {
      // resolve("ok2");
      reject("ok2");
    });
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