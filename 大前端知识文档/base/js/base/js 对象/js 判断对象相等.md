# JS 判断对象相等

在 JavaScript 中，判断两个对象是否相等有多种方法，取决于你对 相等 的定义以及对象属性的类型。以下是几种常见的方法：

## 1. 严格相等运算符 (===)

使用 === 运算符可以比较两个对象是否**引用同一个对象**。如果两个变量引用了同一个对象，则它们是相等的，否则它们是不相等的。例如：

```js
const obj1 = { a: 1 };
const obj2 = { a: 1 };
const obj3 = obj1;

console.log(obj1 === obj2); // false
console.log(obj1 === obj3); // true
```

在上面的例子中， obj1 和 obj2 的属性值相同，但它们是不同的对象（即它们的引用地址不同），因此它们的 === 比较返回 false 。而 obj1 和 obj3 引用了同一个对象，它们是相等的，因此 `obj1 === obj3` 返回 true 。

这里就是严格比较，引用地址和属性名属性值都要一一对应。

## 2. 对象属性的比较

如果你只是需要比较两个对象的**属性是否相等**（不比较引用地址），你可以使用循环或 `Object.keys()` 方法来获取对象属性的列表，并比较它们的值。例如：

```js
function isObjectEqual(obj1, obj2) {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  // 首先判断对象的属性数量是否一致
  if (obj1Keys.length !== obj2Keys.length) {
    return false;
  }
  // 其次判断各属性值是否相等
  for (let key of obj1Keys) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

const obj1 = { a: 1, b: "hello" };
const obj2 = { a: 1, b: "world" };
const obj3 = { a: 1, b: "hello" };

console.log(isObjectEqual(obj1, obj2)); // false
console.log(isObjectEqual(obj1, obj3)); // true
```

在上面的例子中， `isObjectEqual` 函数比较了 obj1 和 obj2 的属性值并返回 false ，因为它们的 b 属性的值不相等。而 `isObjectEqual(obj1, obj3)` 返回 true ，因为它们的所有属性值都相等。

## 3. 使用 Lodash 等工具库判断两个对象是否相等

可以使用 Lodash 的 `isEqual` 方法（依然**不比较引用地址**）。`isEqual` 方法会递归比较两个对象的属性值是否相等，包括**嵌套对象**和**数组**。

```js
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };
const obj3 = { a: 1, b: { c: 3 } };

console.log(_.isEqual(obj1, obj2)); // true
console.log(_.isEqual(obj1, obj3)); // false
```

在上面的例子中， `_.isEqual(obj1, obj2)` 返回 true ，因为它们的所有属性值都相等，包括嵌套的对象。而 `_.isEqual(obj1, obj3)` 返回 false ，因为它们的 b.c 属性的值不相等。

## 4. `JSON.stringify` 方法

如果你的对象中只包含**简单类型**（如数字、字符串、布尔值和 null）以及其他**对象或数组**，则可以使用 JSON.stringify 方法将对象转换为字符串，然后比较这些字符串（还是**不比较引用地址**）。例如：

```js
const obj1 = { a: 1, b: "hello", c: true };
const obj2 = { a: 1, b: "hello", c: true };
const obj3 = { a: 1, b: "world", c: true };

console.log(JSON.stringify(obj1) === JSON.stringify(obj2)); // true
console.log(JSON.stringify(obj1) === JSON.stringify(obj3)); // false
```

在上面的例子中， `JSON.stringify(obj1)` 和 `JSON.stringify(obj2)` 都返回相同的字符串，因此它们的比较返回 true 。而 `JSON.stringify(obj1)` 和 `JSON.stringify(obj3)` 返回不同的字符串，因此比较返回 false 。

需要注意的是，这种方法**只适用于简单类型和嵌套对象或数组，因为它无法处理对象中包含函数、正则表达式和 Date 等类型的情况**。

## 5. 使用 `Object.is()` 方法

它与 `===` 运算符类似，但是有一些特殊情况，例如 `Object.is(+0, -0)` 返回 false ，而 `===` 运算符返回 true 。

```js
const obj1 = { a: 1 };
const obj2 = { a: 1 };
const obj3 = obj1;

console.log(Object.is(obj1, obj2)); // false
console.log(Object.is(obj1, obj3)); // true
```

在上面的例子中， `Object.is(obj1, obj2)` 返回 false ，因为 obj1 和 obj2 是两个不同的对象（引用地址不同），而 `Object.is(obj1, obj3)` 返回 true ，因为 obj1 和 obj3 引用了同一个对象，即，`Object.is()` 方法会比较对象的引用地址！
