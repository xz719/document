
# JS 遍历数组或对象的方法

## 1. 遍历数组

### 1.1 最传统的 `for` 循环

![在这里插入图片描述](https://img-blog.csdnimg.cn/01e6cb665aad4cee82aa299234311797.png#pic_center)

### 1.2 ES5 新增的 `for in` 方法

![在这里插入图片描述](https://img-blog.csdnimg.cn/5a93d8a298a8498fabf5e18b9bb03963.png#pic_center)

注意，这里的 `i` 是数组元素的索引。

### 1.3 ES6 新增的 `for of` 方法

![在这里插入图片描述](https://img-blog.csdnimg.cn/0e3a58aefd0f4789b2c50d6ecc59208e.png#pic_center)

注意，这里的 `i` 是数组元素的值。

### 1.4 `forEach()` 方法

![在这里插入图片描述](https://img-blog.csdnimg.cn/39a5c6ef7d5945d8920d4e4a6d4e62d2.png#pic_center)

`forEach` 方法接收一个**回调函数**作为参数，其会对数组中的每一个元素执行该函数。

该回调函数有两个可选参数：

* `item` — 遍历到的当前元素
* `index` — 当前元素的索引

但注意，`forEach` 方法中间不能退出循环，且对于空数组不会执行回调函数！

实际上，除了 `forEach`，还可以用很多**数组方法**来遍历数组，例如：`filter`、`map`、`reduce`、`every`、`some`等。

## 2. 遍历对象

### 2.1 `for in` 循环

`for in` 专门用于遍历对象的**可枚举属性**，包括 prototype 原型链上的属性，因此**性能会比较差**。

至于可枚举属性，可以通俗理解为会出现在对象的迭代(例如：`for in` 循环等)中的属性。

具体来说，是在用 `defineProperty()` 方法为对象添加属性时， `enumerable` 参数配置 `true`的属性。

例如：

```js
var obj = { a: 2, b: 4, c: 6 };
for (let key in obj) {
  console.log(key);
}
// a b c
// 所以，遍历过程中拿到的是对象的属性名，即 key

// for in 会将对象原型链上的属性也遍历到
let obj1 = { a: 2, b: 4, c: 6 };
obj1.__proto__.my = 7
for (let key in obj1) {
  console.log(key);
}
// a b c my

// 此外，for in 不能遍历到对象的不可枚举属性
let obj2 = { a: 2, b: 4, c: 6 };
Object.defineProperty(obj2, 'u', {
  enumerable: false,
  value: 10,
})
for (let key in obj2) {
  console.log(key);
}
```

### 2.2 `Object.keys()` 和 `Object.values()`

`Object.keys()` 会返回一个新数组，包含对象的所有可枚举属性；

`Object.values()` 会返回一个新数组，包含对象的所有属性值；

```js
var obj = { a: 2, b: 4, c: 6 };
// Object.keys()
Object.keys(obj).forEach(key => {
  console.log(key);
})
// a b c
```

但注意，`Object.keys()` 方法只查找对象的**自定义属性**！

### 2.3 `Object.getOwnPropertyNames()`

使用 `Object.getOwnPropertyNames(obj)` 返回一个数组，包含对象自身的**所有属性**（包括不可枚举属性）

```js
var person = {name: 'xiaoming', sex: '男'}
Object.defineProperty(person, 'id', {
  enumerable: false,
  value: 3123123,
})
console.log(Object.getOwnPropertyNames(person))
// name sex id
```

[![pFYZi7D.png](https://s11.ax1x.com/2024/02/19/pFYZi7D.png)](https://imgse.com/i/pFYZi7D)

此时，就可以通过遍历数组的方法，拿到 `key` 和 `value`，进而进行操作。

### 2.4 遍历对象方法的区别

[![pFYZAtH.png](https://s11.ax1x.com/2024/02/19/pFYZAtH.png)](https://imgse.com/i/pFYZAtH)
