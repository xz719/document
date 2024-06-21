# JS 判断空对象

## 方法1：`for...in`

示例代码：

```js
function judgeObj (obj) {
    for (let key in obj) {
        console.log('非空！')
        return false
    }
    console.log('空对象！')
    return true
}
```

## 方法2：`JSON.stringify`

示例代码：

```js
function judgeObj (obj) {
    if (JSON.stringify(obj) == '{}') {
        console.log('空对象！')
        return true
    } else {
        console.log('非空！')
        return false
    }
}
```

## 方法3：`Object.keys()` + `Object.getOwnPropertyNames()`

示例代码：

```js
function judgeObj (obj) {
    if (!Object.keys(obj).length) {
        console.log('空对象！')
        return true
    } else {
        console.log('非空！')
        return false
    }
}
```

但仅仅使用 Object.keys() 无法判断对象是否有不可枚举的属性，因此需要结合 Object.getOwnPropertyNames()

```js
function checkNullObj(obj) {
  return (
    Object.keys(obj).length === 0 &&
    Object.getOwnPropertySymbols(obj).length === 0
  );
}
```
