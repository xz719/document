# JS valueOf 和 toString

## `valueOf()`

`valueOf()` 方法返回指定对象的**原始值**。

JavaScript 调用 `valueOf` 方法将对象转换为原始值。你很少需要自己调用 `valueOf` 方法；当遇到要获取原始值的对象时，JavaScript 会自动调用它。

## `toString()`

`toString()` 方法返回一个表示该对象的字符串。

每个对象都有一个 `toString()` 方法，当该对象被表示为一个文本值时，或者一个对象以预期的字符串方式引用时自动调用。默认情况下，`toString()` 方法被每个 `Object` 对象继承。

需要注意的是，`Date` 类型的原型上重写了 `toString()` 方法，其会返回一个**美式英语日期格式**的字符串。

## `{}` 和 `[]` 的 `valueOf()` 和 `toString()` 的结果是什么？

```js
([]).valueOf()      // []
([]).toString()     // ''
({}).valueOf()      // {}
({}).toString()     // '[object Object]'
```
