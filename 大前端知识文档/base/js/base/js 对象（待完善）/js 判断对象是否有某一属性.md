# 判断对象是否有某一属性

有如下几种方法：

1. `in` 操作符
2. 使用内置对象 `Reflect` 的 `has` 方法
3. `obj.hasOwnProperty(...)`
4. `Object.hasOwn(obj, property)`
5. `Object.prototype.hasOwnProperty.call(obj,property)`

## 1. `in` 操作符

`in` 操作符用于检查对象是否包含某一属性，如果该属性存在于**对象自身或其原型链上**，则返回 true，否则返回 false。

```js
const test = {
    a: 'ttt',
    b: 123,
}

console.log('a' in test)    // true
console.log('b' in test)    // true
console.log('c' in test)    // false
console.log('toString' in test)     // true (toString 是 test 的原型 Object 身上的一个属性)
```

即，`in` 操作符能够判断一个属性是否存在于对象自身或其原型链上，但其无法区分某一属性到底是挂载在对象自身还是其原型链上！

## 2. 内置对象 `Reflect` 的 `has` 方法

[Reflect.has](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/has) 是 ES6 中引入的新方法，用于检测一个对象是否包含某个属性，与 `in` 操作符类似，可以同时**判断一个属性是否存在于对象自身或原型链上**。

```js
const test = {
    a: 'ttt',
    b: 123,
}

console.log(Reflect.has(test, 'a')); // true
console.log(Reflect.has(test, 'b')); // true
console.log(Reflect.has(test, 'c')); // false
console.log(Reflect.has(test, 'toString')); // true
```

但，同样地，`Reflect.has` 能够判断一个属性是否存在于对象自身或其原型链上，但其无法区分某一属性到底是挂载在对象自身还是其原型链上！

## 3. `obj.hasOwnProperty(...)`

前面说到的两种方法，它们对来自对象原型链上的属性同样返回 true，针对这种问题，我们可以使用对象的 `hasOwnProperty()` 方法来判断：

```js
const test = {
    a: 'ttt',
    b: 123,
}

console.log(test.hasOwnProperty('a')); // true
console.log(test.hasOwnProperty('b')); // true
console.log(test.hasOwnProperty('c')); // false
console.log(test.hasOwnProperty('toString')); // false
```

可以看到，`hasOwnProperty()` 方法能够正确区分对象本身的属性和其原型链上的属性。

但是 `hasOwnProperty()` 方法同样存在问题，即，如果对象是使用 `Object.create(null)` 方式创建的，那么就不能使用 `hasOwnProperty()` 方法进行判断了:

```js
let obj = Object.create(null)
obj.p = 1
obj.hasOwnProperty('p')     // 报错
```

另外，如果对象身上有一个名为 hasOwnProperty 的方法，那么由于属性遮蔽的原因，我们也无法再使用原先的 hasOwnProperty 方法了：

```js
var obj = {
    p: 1,
    // 覆盖原先的 hasOwnProperty 方法
    hasOwnProperty: function () {
        return false;
    }
}
obj.hasOwnProperty('p'); // 始终返回false，因为此时调用的是我们自己定义的方法
```

造成这种问题的原因是 javascript 没有将 hasOwnProperty 作为一个敏感词，所以我们是可以覆盖它的！那么如何解决这个问题呢？继续往下看⬇

## 4. `Object.prototype.hasOwnProperty.call(obj,property)`

要解决上面的问题，需要使用对象原型链上真正的 `hasOwnProperty()` 方法！

但这个方法并没有给我们传入目标对象的空间，所以，我们需要用 `call` 来将这个方法中的 `this` 与我们的目标对象进行[显示的绑定](../../进阶/call、apply以及bind/js%20显式绑定与硬绑定.md)：

```js
const test = {
    a: 'ttt',
    b: 123,
}

console.log(Object.prototype.hasOwnProperty.call(test, 'a')); // true
console.log(Object.prototype.hasOwnProperty.call(test, 'b')); // true
console.log(Object.prototype.hasOwnProperty.call(test, 'c')); // false
console.log(Object.prototype.hasOwnProperty.call(test, 'toString')); // false
```

同样地，这种方法也可以区分对象自身的属性和其原型链上的属性。

## 5. `Object.hasOwn(obj, property)`

`Object.hasOwn()` 方法是 ES2022 新提出的，用于替代 `Object.prototype.hasOwnProperty()` 的方法。根据 MDN 文档中的介绍：

> 如果指定的对象具有作为**其自身属性**的指定属性，则 `hasOwn()` 方法返回 true；如果该属性是**继承的或不存在**，则该方法返回 false。

如下：

```js
const test = {
    a: 'ttt',
    b: 123,
}

console.log(Object.hasOwn(test, 'a')); // true
console.log(Object.hasOwn(test, 'b')); // true
console.log(Object.hasOwn(test, 'c')); // false
console.log(Object.hasOwn(test, 'toString')); // false
```

```js
const obj1 = Object.create(null);
obj1.name = '111';
console.log(obj1.hasOwnProperty('name')); // 报错

const obj2 = Object.create(null);
obj2.name = '222';
console.log(Object.hasOwn(obj2, 'name')); // true

const obj3 = {
    p: 1,
    hasOwnProperty: function () {
        return false
    }
}
console.log(Object.hasOwn(obj3, 'p')); // true
```

从上面的代码结果可以看到，Object.hasOwn()方法是可以解决上面所有出现的问题的。但是它是ES2022提出的，所以还得看看它的兼容性，如下：

![Object.hasOwn 兼容性](https://img.jbzj.com/file_images/article/202208/2022819105606707.png)

## PS：如何区分一个属性是在对象本身还是在其原型链上？

```js
const test = {
    a: 'ttt',
    b: 123,
}

console.log(Object.getPrototypeOf(test).hasOwnProperty('a')); // false，说明不是其原型链上的属性
console.log(Object.getPrototypeOf(test).hasOwnProperty('toString')); // true
```
