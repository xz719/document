# JS 异常捕获

## 1. 异常捕获的几种方法

JS 中的异常一般通过 `try-catch-finally` 语句以及 `window.onerror` 来进行捕获。

### 1.1 `try-catch-finally`

`try-catch-finally` 语句是处理异常的强大工具。其中，try 语法块包含可能抛出异常的代码，catch 语法块包含处理异常的代码。finally 语法块始终执行，无论是否抛出异常。

```js
try {
    // ...这里是可能出现异常的代码块
} catch (error) {
    // ...这里是处理异常的地方
} finally {
    // ...这里的代码无论如何都会执行
}
```

需要注意的是，`try-catch-finally` 语句只能捕获运行时的错误，无法捕获语法错误，在 catch 的 `error` 中我们可用拿到出错的信息、堆栈，出错的文件、行号、列号等。

下面是一个 `error` 的一个实例：

```js
[
  'catch', ReferenceError {
    stack: 'ReferenceError: error is not defined\n' +
      '    at fn (E:\xxx\doc\base\js\js进阶\js 异常捕获\tests\trycatch.js:5:57)\n' +
      '    at Timeout._onTimeout (E:\xxx\doc\base\js\js进阶\js 异常捕获\tests\trycatch.js:11:27)\n' +
      '    at listOnTimeout (node:internal/timers:569:17)\n' +
      '    at process.processTimers (node:internal/timers:512:7)',
    message: 'error is not defined'
  }
]
```

可以看到，我们能够获取到报错信息、错误的类型，对于调用函数报错，我们还能拿到函数调用的堆栈信息，从而找到具体错误的位置。

当然，`try-catch-finally` 语句也存在一些问题，这个我们后面再说。

### 1.2 `window.onerror`

`window.onerror` 可以捕捉语法错误，也可以捕捉运行时错误，可以拿到出错的信息，堆栈，出错的文件、行号、列号，只要在**当前 `window` 执行的 JS 脚本**出错都会捕捉到，通过 `window.onerror` 可以实现前端的错误监控。

另外，出于安全方面的考虑，当**加载自不同域的脚本**中发生语法错误时，语法错误的细节将不会报告。

```js
/*
    下面是处理函数能够接收到的几个参数：

        message：错误信息（字符串）。
        source：发生错误的脚本URL（字符串）
        lineno：发生错误的行号（数字）
        colno：发生错误的列号（数字）
        error：Error对象（对象）
    
    实际上，我们可以通过 ...args 的形式获取这些参数，不必挨个接收

    另外，若该函数返回true，则阻止执行默认事件处理函数。
*/
window.onerror = function(message, source, lineno, colno, error) { 
    // onerror_statements
}

/*
    ErrorEvent 类型的 event 包含有关事件和错误的所有信息。
*/
window.addEventListener('error', function(event) { 
    // onerror_statements
})
```

下面是一个实例：

```js
window.onerror = function (...args) {
  console.log("onerror", args);
  return true;
};

function fn() {
  console.log("fn->s");
  error;
  console.log("fn->e");
}

fn();
```

控制台输出如下：

[![pFo86WF.png](https://s21.ax1x.com/2024/03/28/pFo86WF.png)](https://imgse.com/i/pFo86WF)

这里由于我们是在 html 中引入的外部 js 文件，所以这里并不会给出具体错误行数，当我们将代码写入 html 文件中时， 输出如下：

[![pFo8oFK.png](https://s21.ax1x.com/2024/03/28/pFo8oFK.png)](https://imgse.com/i/pFo8oFK)

可以看到，我们能够拿到具体的报错文件，以及具体的出错行数、列数。

## 2. 各种方法的优缺点分析

首先来试试 `try-catch-finally` 语句存在的问题，看下面这个例子：

```js
// 尝试在异步方法中使用
function fn () {
    console.log("fn->start")
    error
    console.log("fn->end")
}

setTimeout(() => {
    try {
        fn()
    } catch (error) {
        console.log("catch", error)
    }
})
```

控制台输出如下：

[![pFoGy7t.png](https://s21.ax1x.com/2024/03/28/pFoGy7t.png)](https://imgse.com/i/pFoGy7t)

没问题能够正确捕获到异常，但如果我们在 `try-catch-finally` 语句中调用异步函数呢？

```js
// 在 try-catch-finally 中调用异步方法
function fn () {
    console.log("fn->start")
    error
    console.log("fn->end")
}

try {
    setTimeout(() => {
        fn()
    })
} catch (error) {
    console.log("catch", error)
}
```

控制台输出如下：

[![pFoGqhT.png](https://s21.ax1x.com/2024/03/28/pFoGqhT.png)](https://imgse.com/i/pFoGqhT)

可以看到，并没有捕获到异常(红色的是浏览器自己报的)。

这是因为，`try-catch-finally` 语句的捕获能力实际上并不是很强，对于其内部的异步函数调用，它是无法捕获到函数内的异常的！

比如这里我们也可以试一下 `async/await` 定义的异步函数：

```js
async function asyncFn() {
    await fn();
}

try {
    asyncFn()
} catch (error) {
    console.log("catch", error);
}
```

同样：

[![pFoGqhT.png](https://s21.ax1x.com/2024/03/28/pFoGqhT.png)](https://imgse.com/i/pFoGqhT)

那么，对于这种情况，我们要怎么捕获异常呢？

前面我们说过，捕获异常一般就上面的两种方法，既然用 `try-catch-finally` 语句不行，那就用 `window.onerror` 试试吧：

```js
// 用 window.onerror 捕获错误，fn 仍使用上面定义的
window.onerror = (...args) => {
    console.log("onerror", args);
};

setTimeout(() => {
    fn()
})
```

控制台输出如下：

[![pFoJOat.png](https://s21.ax1x.com/2024/03/28/pFoJOat.png)](https://imgse.com/i/pFoJOat)

下面红色的警告不用管，是浏览器自己抛出的错误提示。可以看到，能够正确地捕获到异步函数中的异常！这也是 `window.onerror` 相对于 `try-catch-finally` 语句的最大优势。

但是，`window.onerror` 同样存在问题：它无法捕获类似于 js 文件加载出错、图片加载出错这样的网络请求错误。

例如：

```html
<img src="./xxxxxx.jpg" />

<script>
    window.onerror = (...args) => {
        console.log("onerror", args);
    };
</script>
```

此时控制台不会有输出，只会有浏览器自己的报错：index.html:9 GET xxxx net::ERR_FILE_NOT_FOUND

那么我们如何捕获这种错误呢？

可以使用下面这种方法：

```js
// 捕获网络请求错误
window.addEventListener(
    "error",
    (args) => {
        console.log("error event", args);
        return true; // 返回 true 是为了阻止默认执行默认事件处理函数
    },
    true,   // 这里设置为 true，是为了在事件的捕获阶段进行处理，而不是在事件冒泡阶段处理！
);
```

注意， 一定不要忘记加最后的配置，即在事件捕获阶段进行处理！

控制台输出如下：

[![pFoYJJK.md.png](https://s21.ax1x.com/2024/03/28/pFoYJJK.md.png)](https://imgse.com/i/pFoYJJK)

在红框中，我们还可以拿到报错的路径等等。

除了上面的问题，还存在一个情况：在实际开发中，我们经常会用到 Promise，如果我们要捕获 Promise 中的错误，要怎么做呢？

我们可以用 Promise 自带的 `.catch`：

```js
new Promise((resolve, reject) => {
    error
}).catch(err) => {
    console.log("promise catch", err)
}
```

对于 `async/await` ，我们可以使用 `try-catch-finally` 语句：

```js
const asyncFunc = () =>
    new Promise((resolve) => {
        error;
    });
setTimeout(async () => {
    try {
        await asyncFunc();
    } catch (error) {
        console.log("catch", error);
    }
});
```

这两种方式都是可以捕获到的。但是，如果真的在实际开发中使用，可能意味着我们需要修改大量的代码，因为有些地方的原有代码可能并没有考虑错误捕获。

为了避免这种大量的代码修改，我们可以用通过监听 `window` 的 `unhandledrejection` 事件来捕获 Promise 中的异常：

```js
new Promise((resolve, reject) => {
    error;
});

window.addEventListener("unhandledrejection", e => {
    console.log("unhandledrejection", e)
})
```

控制台输出如下：

[![pFotJ7n.md.png](https://s21.ax1x.com/2024/03/28/pFotJ7n.md.png)](https://imgse.com/i/pFotJ7n)

## 3. 最佳实践

总结一下上面的分析，`try-catch-finally` 语句能够针对一般的错误进行捕获，但是其无法捕获其内部的异步函数调用中的错误，且其往往伴随着大量代码的改动，在没有提前考虑异常捕获的场景下不太方便。

`window.onerror` 比 `try-catch-finally` 语句更加强大，其能够捕获到异步函数调用中的错误，但其无法捕获到类似于 js 文件请求出错、img 图片加载出错这样的网络请求错误。

而 `window.addEventListener("error", args => {...}, true)` 则更进一步，不仅能捕获到一般的错误以及异步函数调用中的错误，还能捕获到网络请求错误，但其仍然存在缺陷，无法捕获 Promise 和 `async/await` 语法糖内部的错误，因此，往往我们会使用 `window.addEventListener("unhandledrejection", err => {...})` 来辅助捕获 Promise 和 `async/await` 语法糖中的错误。

当然，如果是单个的 Promise 和 `async/await` 语法糖，还是建议通过 `.catch` 或 `try-catch-finally` 语句来处理。

最后，给出异常捕获的最佳实践：

1. 通过 `window.addEventListener("error", args => {...}, true)` 监听当前 `window` 下的异常
2. 通过 `window.addEventListener("unhandledrejection", err => {...})` 来辅助捕获 Promise 中的错误，并将错误通过 `throw` 抛出，交由第一步中准备好的 error 事件处理函数进行异常处理

如下：

```js
window.addEventListener(
    "error",
    (args) => {
        console.log("error event", args);
        // 在这里进行你自己的错误处理！
        // ...
        return true; // 返回 true 是为了阻止默认执行默认事件处理函数
    },
    true // 这里设置为 true，是为了在事件的捕获阶段进行处理，而不是在事件冒泡阶段处理！
);

// 捕获 Promise 异常
window.addEventListener("unhandledrejection", (err) => {
    // 将错误原因抛出，交由上面进行处理
    throw err.reason;
});
```
