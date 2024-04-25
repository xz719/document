# JS 合并对象

## 1. `Object.assign` 方法

```js
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
 
const mergedObj = Object.assign({}, obj1, obj2);
// mergedObj的结果为 { a: 1, b: 2, c: 3, d: 4 }
```

## 2. 展开运算符 `...`

```js
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
 
const mergedObj = { ...obj1, ...obj2 };
// mergedObj的结果为 { a: 1, b: 2, c: 3, d: 4 }
```

## 3. 使用 lodash 库的 `merge()` 方法

```js
const _ = require('lodash');
 
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
 
const mergedObj = _.merge({}, obj1, obj2);
// mergedObj的结果为 { a: 1, b: 2, c: 3, d: 4 }
```

## 4. 循环遍历

。。。不推荐使用
