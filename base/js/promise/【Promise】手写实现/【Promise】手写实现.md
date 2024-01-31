# Promise 手写实现

JavaScript 中的 Promise 诞生于 ES2015（ES6），是当下前端开发中特别流行的一种异步操作解决方案，也几乎是前端面试过程中的必考题。如果能够熟练运用 Promise，并深入理解 Promise 的运行原理，想必不论是在实际开发中还是在面试过程中，都能如鱼得水。

本文会尝试实现一个 Promise，并在这个过程中，对Promise的特征以及用法进行进一步的分析。

根据实际开发中对 Promise 的使用，我们要实现的有以下内容：

* Promise 基本结构
* `Promise.prototype.then()`

_Tip：代码中标明✨的地方就是更新的地方_

## 1. 开始

首先我们可以回顾一下 Promise 的基本使用方法：

* 创建一个 Promise

  ```js
  let asyncOperation = new Promise((resolve, reject) => {
    Math.random() > 0.5 ? resolve('fulfilled') : reject('rejected')
  })
  ```

* 异步操作完成后的处理

  ```js
  asyncOperation.then(
    res => {
        console.log(res)
    },
    err => {
        console.log(err)
    }
  )
  ```

其中就可以看到，Promise 最为显著的特征 --- 三个状态。

具体来说，Promise 有三种状态，它们不受外界影响，而且状态的改变是不可逆的。准备对应枚举如下：

* pending --- 待定。初始状态，既没有被兑现，也没有被拒绝

  ```js
  const PENDING = 'pending'
  ```

* fulfilled --- 已兑现。表示操作已完成

  ```js
  const FULFILLED = 'fulfilled'
  ```

* rejected --- 已拒绝。表示操作失败

  ```js
  const REJECTED = 'rejected'
  ```

## 2. 实现基本结构

根据官方文档，Promise 是一个构造函数，用于生成 Promise 实例，其接受一个函数作为其参数。该函数同样可以接收两个参数：resolve 和 reject 。它们也都是函数。

由此以及前面的回顾，我们可以总结出 Promise 的四个特征，也是我们实现时需要关注的地方：

* `new Promise` 时， 需要传递一个 `executor` 执行器，执行器**立即执行**
* executor 接受两个参数，分别是 resolve 和 reject
* Promise 的默认状态是 `pending`
* Promise 必须有一个 `then` 方法，then 接收两个参数，分别是 Promise 成功的回调 `onFulfilled`, 和失败的回调 `onRejected`

这样我们可以将 Promise 的基本结构实现如下：

```js
// 可以利用 class 语法糖实现
class _Promise {
    // 构造函数
    constructor(executor) {
        // ...
    }

    // Promise 的状态
    status = PENDING    // 初始状态为pending
    // 保存成功的值
    value = undefined
    // 保存失败的值
    reason = undefined

    // resolve方法
    resolve = (value) => {
        // ...
    }

    // reject方法
    reject = (reason) => {
        // ...
    }

    // 暂时不管then方法
    
}
```

## 3. 实现 `resolve` 和 `reject` 方法

实现 resolve 和 reject 方法时，我们需要关注的是：

> Promise 只能从`pending`到`rejected`, 或者从`pending`到`fulfilled`，状态一旦确认，就不会再改变

具体实现如下：

```js
// resolve方法
resolve = (value) => {
    // 一旦状态改变，就不能再变。这里使用 === 保证状态改变不可逆
    if (this.status !== PENDING) return
    // 更新Promise状态
    this.status = FULFILLED
    // 保存数据
    this.value = value
}

// reject方法
reject = (reason) => {
    // 同上
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
}
```

## 4. 实现构造函数

Promise 的构造函数中需要传入一个 executor 执行器，其是主要业务流程进行的地方。

具体实现如下：

```js
// 构造函数
constructor(executor) {
    // 在executor的执行过程中，可能会出现错误，所以我们需要用try/catch包裹一下
    try {
        executor(this.resolve, this.reject)
    } catch (error) {
        this.reject(error)
    }
}
```

## 5. 实现基本的`then`方法

接下来就是 Promise 的核心部分：`then` 方法。

`.then()` 方法是 Promise 的核心之一，异步操作的成功或失败，都可以通过 `.then()` 添加的回调函数进行处理。并且它将继续返回一个 Promise 对象，这样可以通过多次调用 `.then()` 添加多个回调函数，它们会按照插入的顺序执行，形成**链式调用（chaining）**。

实现 then 方法时，需要关注以下几点：

* then 接收两个参数，分别是 Promise 成功的回调 `onFulfilled`, 和失败的回调 `onRejected`
* 如果调用 then 时，Promise 已经成功，则执行 `onFulfilled`，参数是 Promise 的 `value`
* 如果调用 then 时，Promise 已经失败，那么执行 `onRejected`, 参数是 Promise 的 `reason`
* 如果 then 中抛出了异常，那么就会把这个异常作为参数，传递给下一个 then 的失败的回调`onRejected`

在此基础上，我们可以写出一个简单的then方法：

```js
then(onFulfilled, onRejected){
    if(this.status === _Promise.FULFILLED){
        onFulfilled(this.value)
    }
    if(this.status === _Promise.REJECTED){
        onRejected(this.reason)
    }
}
```

测试一下：

```js
let _promise = new _Promise((resolve, reject) => {
    setTimeout(()=>{
        resolve('ok')
    }, 2000)
})

_promise.then((value) => {
    console.log("promise success:", value);
}, (reason) => {
    console.log("promise fail:", reason)
})
```

对于原生的 Promise，其肯定会在2秒后打印 success：ok

但对于我们实现的 _Promise，它是没有任何输出的！为什么？因为 setTimeout 是一个异步任务，当执行到这里时，发现其是异步任务，就会将其放入微任务队列中，暂时不做处理。

然后，在执行 then 方法时，promise 实例的状态实际上还是 pending（因为此时 setTimeout 中的 resolve 方法还未执行），所以不会有任何操作。但在两秒后，promise 实例的状态就会变为 fulfilled，测试一下：

```js
setTimeout(()=>{
    console.log(_promise);
}, 2000)
```

这一次，两秒后会输出 `Promise { status: 'fulfilled', value: 'ok', reason: undefined }`

但我们总不能每次使用的时候都要等待一段时间吧，那就失去了实现 Promise 的意义了，如何解决呢？

我们能不能把成功和失败的回调先存储起来，当 executor 中的异步任务被执行，触发了 resolve 或 reject 方法时，再依次调用这些回调呢？

要实现这样的效果，我们就需要准备两个数组，用于存放成功和失败的回调：

```js
// 存储成功的回调
onFulfilledCallbacks = [];
// 存储失败的回调
onRejectedCallbacks = [];
```

接下来，在 then 方法中，当 Promise 的状态为 pending 时，我们就可以先把成功和失败的回调存起来：

```js
// then方法
then = (onResolved = (value) => value, onRejected) => {
    if (this.status === _Promise.PENDING) {
        // 状态为pending时，将回调存放起来
        this.onFulfilledCallbacks.push(() => {
            // 传递操作成功时的结果
            onResolved(this.value)
        })
        this.onRejectedCallbacks.push(() => {
            // 传递操作失败时的原有
            onRejected(this.reason)
        })
    }
    // ...
};
```

而在 Promise 的状态为 fulfilled 或 rejected 时，我们直接执行这些回调即可，所以，目前完整的 then 方法如下：

```js
// then方法
then = (onResolved = (value) => value, onRejected) => {
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
    // ✨状态为fulfilled或rejected时，直接执行回调
    if (this.status === _Promise.FULFILLED) {
        onResolved(this.value);
    }
    if (this.status === _Promise.REJECTED) {
        onRejected(this.reason);
    }
};
```

但是还存在一点问题，当 Promise 状态为 pending 时，我们仅仅存储了回调，但在 Promise 状态发生改变时，我们并没有执行这些回调，而我们在哪里改变 Promise 的状态呢？自然是 resolve 和 reject 方法中：

```js
// resolve方法
resolve = (value) => {
    // 一旦状态改变，就不能再变。这里使用 === 保证状态改变不可逆
    if (this.status !== _Promise.PENDING) return;
    // 更新Promise状态
    this.status = _Promise.FULFILLED;
    // 保存数据
    this.value = value;
    // ✨依次执行成功的回调
    this.onFulfilledCallbacks.forEach(cb => cb())
};

// reject方法
reject = (reason) => {
    // 同上
    if (this.status !== _Promise.PENDING) return;
    this.status = _Promise.REJECTED;
    this.reason = reason;
    // ✨依次执行失败的回调
    this.onRejectedCallbacks.forEach(cb => cb())
};
```

测试一下，看看能不能达到预期效果：

```js
// 还是用之前的例子
const promise = new _Promise((resolve, reject) => {
    setTimeout(()=>{
        resolve('ok')
    },2000)
});
promise.then((value) => {
    console.log("promise success:", value);
}, (reason) => {
    console.log("promise fail:", reason);
})
```

这次，两秒之后就会输出 `promise success: ok`

## 6. 实现可链式调用的`then`方法

前面提到过，Promise 的最大特性之一就是其可以链式调用，但目前我们实现的 then 方法是不支持链式调用的。

### 6.1 实现链式调用

要实现形如 `Promise.then(...).then(...)` 的链式调用，首先要求，`Promise.then(...)` 必须是一个 Promise 对象！也就是说 then 方法中必须返回一个 Promise 对象！

所以，我们需要在 then 方法中返回一个新的 _Promise 对象：

```js
// then方法
then = (onResolved = (value) => value, onRejected) => {
    // ✨返回一个新的 Promise 对象
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
            onResolved(this.value);
        }
        if (this.status === _Promise.REJECTED) {
            onRejected(this.reason);
        }
    });
};
```

但是这样就完成了吗？

来看看原生的 Promise：

```js
const p1 = new Promise((resolve, reject) => {
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
```

显而易见，输出结果为
`
p1 success: ok
p2 success: 123
`

但注意，在 p2 的 then 方法中，我们是可以拿到 p1 的 onResolved 回调中返回的值 123 的！而我们的 then 方法中，是没有任何返回的，所以我们需要补全这部分功能：

```js
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
            // ✨直接执行回调时，需要将回调的返回值resolve出去，供后续链式调用时获取
            const res = onResolved(this.value);
            resolve(res)
        }
        if (this.status === _Promise.REJECTED) {
            onRejected(this.reason);
        }
    });
};
```

测试一下，输出结果为：`p1 success: ok p2 success: 123`

到这里，我们就能够构建一个简单的链式调用了。

### 6.2 对特殊返回值的处理

但这里，返回的数据可能会有以下几种情况：

* 返回普通值
* 回调失败
* 返回一个新的 Promise

#### 6.2.1 回调失败的处理

我们上面仅仅考虑了返回普通值的处理，现在我们来考虑失败的情况。还是上面的例子：

```js
const p1 = new Promise((resolve, reject) => {
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
```

考虑这个问题：p2 在什么时候需要执行失败的回调呢？

根据我们前面的实现，我们首先知道，p2 是我们在执行 p1 的 then 方法时，返回的一个新 Promise 对象。

那么，这个 Promise 对象，在哪些情况下会需要执行失败回调呢（即调用 reject 方法）？

还是先看原生的 Promise：

```js
const p1 = new Promise((resolve, reject) => {
    setTimeout(()=>{
        reject('ok')
    },2000)
});
const p2 = p1.then((value) => {
    console.log("p1 success:", value);
}, (reason) => {
    console.log("p1 fail:", reason);
})
 
p2.then((value)=>{
    console.log("p2 success:", value);
},(reason)=>{
    console.log("p2 fail:", reason);
})

// 输出为 
// p1 fail: ok
// p2 success: undefined 
```

可以看到，即使 p1 状态转为 rejected，p2 仍然执行的是成功回调

而当 p1 的回调中抛出错误时：

```js
const p1 = new Promise((resolve, reject) => {
    setTimeout(()=>{
        reject('ok')
    },2000)
});
const p2 = p1.then((value) => {
    console.log("p1 success:", value);
}, (reason) => {
    console.log("p1 fail:", reason);
    throw new Error('error')
})
 
p2.then((value)=>{
    console.log("p2 success:", value);
},(reason)=>{
    console.log("p2 fail:", reason);
})

// 输出为 
// p1 fail: ok
// p2 fail: Error: error
```

可以看到，p2 执行了失败回调，即，某一 Promise 的回调执行失败，会导致调用链上的下一个 Promise 状态转为 rejected。仔细想也是合理的，我们可以这样理解，回调执行失败，说明该 Promise 的执行流程没有完成，而我们在此基础上调用 then 方法，相当于**将这个 Promise 的执行流程视为了一个新的 Promise**，既然执行流程未完成，也就意味着这个新的 Promise 并未兑现，也就是 rejected！

接下来就是实现了，首先我们不考虑其它情况，在前面的例子中我们可以看到，无论调用链上的前一个 Promise 是 fulfilled 还是 rejected，其下一个 Promise 都只会执行成功的回调，那么我们的实现如下：

```js
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
            resolve(res)
        }
        if (this.status === _Promise.REJECTED) {
            // ✨不考虑其它情况时，就和fulfilled一样，直接resolve即可
            const res = onRejected(this.reason);
            resolve(res)
        }
    });
};
```

进一步地，我们需要考虑回调抛错的情况，抛错如何处理？当然是用 try/catch 捕获，然后，在 catch 中，调用 reject 方法，这样就能够正确地执行错误回调了：

```js
then = (onResolved = (value) => value, onRejected) => {
    return new _Promise((resolve, reject) => {
        // 状态为pending时，将回调存放起来
        if (this.status === _Promise.PENDING) {
            this.onFulfilledCallbacks.push(() => {
                // 传递操作成功时的结果
                try {
                    const res = onResolved(this.value);
                    resolve(res);
                } catch (error) {
                    reject(error);
                }
            });
            this.onRejectedCallbacks.push(() => {
                // 传递操作失败时的原有
                try {
                    const res = onRejected(this.reason);
                    resolve(res);
                } catch (error) {
                    reject(error);
                }
            });
        }
        // 状态为fulfilled或rejected时，直接执行回调
        if (this.status === _Promise.FULFILLED) {
        // 直接执行回调时，需要将回调的返回值resolve出去，供后续链式调用时获取
            try {
                const res = onResolved(this.value);
                resolve(res);
            } catch (error) {
                reject(error);
            }
        }
        if (this.status === _Promise.REJECTED) {
            try {
                const res = onRejected(this.reason);
                resolve(res);
            } catch (error) {
                reject(error);
            }
        }
    });
};
```

这样，我们对于返回普通值和回调报错的处理都有了，剩下的就是处理返回值为 Promise 对象的情况了

#### 6.2.2 回调返回 Promise 的处理

仍然是先看原生 Promise 的处理：

```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("ok");
  }, 2000);
});

const p2 = p1.then(
  (value) => {
    console.log("p1 success:", value);
    return new Promise((resolve, reject) => {
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

// 输出
// p1 success: ok
// p2 fail: ok2
```

当我们返回一个状态为 fulfilled 的 Promise 对象时，p2 会执行成功的回调；当我们返回一个状态为 rejected 的 Promise 对象时，p2 会执行失败的回调。

但我们先不考虑具体怎么实现，这里由于逻辑比较复杂，且 then 方法中会多次用到这个逻辑处理，所以我们先为这部分单独准备一个处理函数：

```js
// 判断回调的返回类型并做相应处理
const resolvePromise = (promise, res, resolve, reject) => {
  // ...
}
```

该函数接收以下4个参数：

* promise --- 我们在 then 方法中创建的 Promise 对象
* res --- 回调返回的数据
* resolve 和 reject --- Promise 的 executor 接收的 resolve 和 reject 方法

接下来，我们就可以修改 then 方法：

```js
then(onFulfilled,onRejected){
    return new _Promise((resolve, reject)=>{
        if(this.status === _Promise.FULFILLED){
            try {
                const res = onFulfilled(this.value)
                // ✨调用处理函数
                resolvePromise(newPromise, res, resolve, reject);
            } catch (error) {
                reject(error)
            }
        }
        // ... 其它的几个if中也是相同的修改
    })
}
```

但这里面存在一个问题，newPromise 从哪里来的？其实际上就是我们要返回的这个新 Promise 对象，所以我们需要声明接收一下，最后再返回：

```js
then(onFulfilled,onRejected){
    // ✨先声明接收一下，最后再返回
    const newPromise =  new _Promise((resolve, reject)=>{
        if(this.status === _Promise.FULFILLED){
            try {
                const res = onFulfilled(this.value)
                // 调用处理函数
                resolvePromise(newPromise, res, resolve, reject);
            } catch (error) {
                reject(error)
            }
        }
        // ... 其它的几个if中也是相同的修改
    })
    return newPromise
}
```

但实际上还是有问题，我们是要**在 newPromise 的 executor 中使用它自身**，而 executor 实际上是**同步的**，这一点在同步代码中是无法实现的！因此，需要将这段代码修改为**异步**，这样就可以获取到 newPromise 了：

```js
then(onFulfilled,onRejected){
    // 先声明接收一下，最后再返回
    const newPromise =  new _Promise((resolve, reject)=>{
        if(this.status === _Promise.FULFILLED){
            // ✨将同步代码修改为异步执行，使得能够获取到 newPromise
            setTimeout(() => {
                try {
                    const res = onFulfilled(this.value)
                    // 调用处理函数
                    resolvePromise(newPromise, res, resolve, reject);
                } catch (error) {
                    reject(error)
                }
            }, 0)
        }
        // ... 其它的几个if中也是相同的修改
    })
    return newPromise
}
```

最终，我们的 then 方法如下：

```js
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
    return promise
};
```

接下来，就是处理函数 resolvePromise 了。

```js
// 判断Promise的返回值类型
const resolvePromise = (promise, value, resolve, reject) => {
  // 回调返回自身，属于自己等待自己完成，会导致无限循环，直接抛错！
  if (promise === value) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // 判断返回值的类型，这里要进行严格的类型判断，保证代码能和别的库一起使用
  if ((typeof value === 'object' && value !== null) || typeof value === 'function') {
    // 这里用 try/catch 包裹，防止下面调用then方法时出错，如果出错，直接reject触发失败回调
    try {
      // 检查返回值的then属性
      const then = value.then
      if (typeof then === 'function') {   // 若返回值的then属性为函数，说明其为Promise对象！
        // 如果是Promise对象，调用其then方法，当其状态变化时，执行resolve或reject方法，更新新Promise对象的状态，并将结果传递出去
        then.call(value, (v) => {
          resolve(v)
        }, (e) => {
          reject(e)
        })
      } else {  // 只是身上有then属性的普通对象，直接resolve即可
        resolve(value)
      }
    } catch (error) {
      reject(error)
    }
  } else {
    // 既不是对象也不是函数类型，说明是普通值，直接resolve出去即可
    resolve(x)
  }
};
```

这样就能正常处理返回 Promise 对象的情况了，还是用上面的例子测试

```js
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
```

当返回一个 fulfilled 状态的 Promise 对象时，p2 会执行成功回调；当返回一个 rejected 状态的 Promise 对象时，p2 则会执行失败回调。

那假如我们在上面的例子中，在 resolve 或者 reject 中继续 new Promise 呢？例如：

```js
const p2 = p1.then(
  (value) => {
    console.log("p1 success:", value);
    return new _Promise((resolve, reject) => {
      resolve(new Promise((resolve, reject) => {
        resolve('ok2')
      }));
    });
  },
  (reason) => {
    console.log("p1 fail:", reason);
  }
);
```

所以，我们还需要递归解析！只需要在调用返回 Promise 对象的 then 方法时，在成功回调中递归调用本方法即可：

```js
// 判断Promise的返回值类型
const resolvePromise = (promise, value, resolve, reject) => {
    ...
    const then = value.then;
    if (typeof then === "function") {
    // 若返回值的then属性为函数，说明其为Promise对象！
    // 如果是Promise对象，调用其then方法，当其状态变化时，执行resolve或reject方法，更新新Promise对象的状态，并将结果传递出去
    then.call(
        value,
        (v) => {
            // ✨递归解析的过程（因为可能 promise 中还有 promise）
            resolvePromise(promise, v, resolve, reject);
        },
        (e) => {
            reject(e);
        }
    );
    } else {
    // 只是身上有then属性的普通对象，直接resolve即可
        resolve(value);
    }
    ...
};
```

但是，为什么在错误回调中不需要递归调用？因为，对于上面的多层嵌套情况，一旦最上层的 Promise 对象状态为 rejected，就意味着**这个异步流程已经失败了**，也就可以决定最终我们需要将新的 Promise 更新为 reject 状态，而不必关心嵌套中的下层 Promise

这样，我们就可以处理嵌套的 new Promise 情况了。

但是，还是上面的例子，如果在 p1 的 then 方法中，连续触发回调，会出现错误，如下：

```js
const promise = new _Promise((resolve, reject) => {
    setTimeout(()=>{
        resolve('ok')
    },2000)
});
const promise2 = promise.then((value) => {
    console.log("promise1 success:", value);
    return {
        // 这里返回一个then属性为函数的对象，仅仅是为了测试，绝大部分场景下不会出现这种情况
        then(onFulfilled,onRejected){
            // 首先调用成功回调，然后再抛错，触发我们 resolvePromise 中的 try/catch
            throw new Error(onFulfilled('ok'))
        }
    }
}, (reason) => {
    console.log("promise1 fail:", reason);
})
 
promise2.then((value)=>{
    console.log("promise2 success:", value);
},(reason)=>{
    console.log("promise2 fail:", reason);
})
```

在 resolvePromise 方法中添加两处输出：

[![pFMn6B9.png](https://s11.ax1x.com/2024/01/31/pFMn6B9.png)](https://imgse.com/i/pFMn6B9)

最终输出结果为：

```cmd
promise1 success: ok
第一次调用
第二次调用
promise2 success: ok    // 这里之所以仍然是成功回调，是因为 Promise 的特性 --- 状态一旦被修改就无法再变化
```

显然是不对的，虽然结果是对的，但实际上不应该允许同时执行 resolve 和 reject，我们需要保证只能有一个被执行，且仅执行一次！

我们可以设置一个标识 called，然后在成功和失败的执行过程中进行控制：

```js
// 判断Promise的返回值类型
const resolvePromise = (promise, value, resolve, reject) => {
    ...
    let called = false; // ✨标识，用于控制仅执行一次
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
            // ✨控制仅执行一次
            if (called) return;
            called = true;
            // 递归解析的过程（因为可能 promise 中还有 promise）
            resolvePromise(promise, v, resolve, reject);
          },
          (e) => {
            reject(e);
          }
        );
      } else {
        // 只是身上有then属性的普通对象，直接resolve即可
        // ✨控制仅执行一次
        if (called) return;
        called = true;
        resolve(value);
      }
    } catch (error) {
      reject(error);
    }
    ...
};
```

这样，就完成了 Promise 的基本实现。完整代码可以参考[Promise手写实现](./Promise.js)

还剩下 `catch` 和 `finally` 以及一些 Promise 的公共方法：

* `Promise.all()`
* `Promise.resolve()`
* `Promise.reject()`
