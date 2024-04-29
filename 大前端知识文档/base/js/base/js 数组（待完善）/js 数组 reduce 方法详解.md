# JS 数组 reduce 方法

对于 `reduce` 方法，MDN 中是这样说的：

> reduce() 方法对数组中的每个元素按序执行一个提供的 reducer 函数，每一次运行 reducer 会将先前元素的计算结果作为参数传入，最后将其结果汇总为单个返回值。

## 1. `reduce` 语法

`reduce` 方法的使用方法如下：

```js
arr.reduce(callbackFn, [initialValue])
```

可以看到，`reduce` 方法可以接收两个参数：

* `callbackFn` --- 为数组中每个元素执行的函数。其接收以下参数：
  
  * `accumulator` --- 上一次调用 `callbackFn` 的结果。在第一次调用时，如果指定了 `initialValue` 则为指定的指，否则为 `arr[0]`。
  * `currentValue` --- 当前元素的值。在第一次调用时，如果指定了 `initialValue`，则为 `arr[0]`，否则，为 `arr[1]`。
  * `currentIndex` --- `currentValue` 在数组中的索引。在第一次调用时，如果指定了 `initialValue`，则为 0，否则，为 1。
  * `array` --- 调用 `reduce` 方法的数组本身
  
* `initialValue` --- 可选参数。第一次调用回调时初始化 `accumulator` 的值。如果指定了 `initialValue`，则 `callbackFn` 从数组中的第一个值作为 `currentValue` 开始执行。如果没有指定 `initialValue`，则 `accumulator` 初始化为数组中的第一个值，并且 `callbackFn` 从数组中的第二个值作为 `currentValue` 开始执行。在这种情况下，如果数组为空（没有第一个值可以作为 `accumulator` 返回），则会抛出错误。

`reduce` 方法的返回值为使用回调函数遍历整个数组后的结果。

## 2. 理解 `reduce` 方法

下面给出两个示例来帮助理解 `reduce` 方法的执行流程。

### 示例一：不设置初始值 `initialValue`

```js
let arr = [1, 2, 3, 4, 5, 6]
let sum = arr.reduce((prev, cur, index, arr) => {
    console.log(prev, cur, index);
    return prev + cur;
});

console.log('arr:', arr, 'sum', sum);
```

运行结果如下：

[![pkFKHLd.png](https://s21.ax1x.com/2024/04/29/pkFKHLd.png)](https://imgse.com/i/pkFKHLd)

可以看到，当不设置初始值，第一次调用时的 `prev` 值为 1，`cur` 值为 2，即数组的第一项和第二项！同时，数组长度为 6，但 `reduce` 方法只循环调用了 5 次。

### 示例二：设置初始值 `initialValue`

```js
let arr = [1, 2, 3, 4, 5, 6]
let sum = arr.reduce((prev, cur, index, arr) => {
    console.log(prev, cur, index);
    return prev + cur;
}, 4);  // 设置了初始值

console.log('arr:', arr, 'sum', sum);
```

运行结果如下：

[![pkFMJfK.png](https://s21.ax1x.com/2024/04/29/pkFMJfK.png)](https://imgse.com/i/pkFMJfK)
