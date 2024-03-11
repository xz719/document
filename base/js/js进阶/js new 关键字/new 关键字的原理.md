# JS `new` 原理

## 1. `new` 关键字

众所周知，在 JS 中，`new` 的作用是通过提供的构造函数来创建一个实例对象。

例如：

```js
// 构造函数一般首字母大写，用于和普通函数区分开来
function Foo (name) {
    this.name = name
}
console.log('new Foo 的类型：', typeof new Foo('test'))     // object
console.log('Foo 的类型：', typeof Foo)     // function
```

## 2. 调用 `new` 后做了哪些事情？

`Foo` 只是一个函数，为什么执行 `new Foo()` 后会得到一个对象呢？

首先我们要了解使用 `new` 关键字后做了哪些事情：

1. 【生成新对象】：创建一个空对象，我们叫它 obj
2. 【链接原型】：将 obj 的原型的内存地址，也就是 `__proto__` 指向构造函数的原型对象，也就是构造函数的 `prototype`。
3. 【绑定this】：利用构造函数的 `call` 方法，将原本指向 `window` 的 `this` 指向了 obj。这样，当我们向构造函数中传递实参时，实参就会被挂载到 obj 上。
4. 【返回新对象】：如果构造函数返回了一个对象，就将该对象返回，如果返回值不是对象，就将第一步中创建的对象返回

## 3. 分析 `new` 的处理过程

实际上，我们可以将上面所说的调用 `new` 关键字后做的事情，改写为如下的代码：

```js
// 首先准备好构造函数
function Foo (name) {
    this.name = name
    return this
}

// 1. 构造一个空对象
let obj = {}

// 2. 链接原型
obj.__proto__ = Foo.prototype

// 3. 绑定this指向并返回新对象
let foo = Foo.call(obj, 'new foo')

console.log(foo)
```

让我们分析一下为什么要做这几件事：

首先是第一步，生成新对象，这一步没有什么可说的，因为我们调取 `new` 的目的就是得到一个类的实例，也就是一个对象。

接下来是第二步，链接原型，由于 js 中没有继承的概念，所以，需要通过链接原型来继承父类的方法。

然后是第三步，绑定 `this`，在默认情况下，`this` 是指向 `window` 的，但当我们使用 `new` 期望获取一个类实例时，我们希望其身上也包含该类的私有属性，此时，如果构造函数中的 `this` 没有指向我们在第一步中创建的新对象，就无法实现私有属性的继承了！

至于最后一步，返回新对象，听起来很简单，但实际上这里面是有一个地方需要注意的：

> 如果构造函数返回了一个对象，就将该对象返回，如果返回值不是对象，就将第一步中创建的对象返回

下面我们来试试这里提到的，构造函数中返回一个对象的情况：

```js
function Person (name) {
    this.name = name
    return {
        age: 18
    }
}

let person1 = new Person('aaa')
let person2 = new Person('bbb')

console.log(person1)     // { age: 18 }
console.log(person2)     // { age: 18 }
```

可以看到，这里 `new` 之后返回的并不是 `new` 中新创建的对象，而是在构造函数中 return 出来的一个对象！

而当我们的构造函数返回的不是一个对象时：

```js
function Person (name) {
    this.name = name
    return 'tom'
}

let person1 = new Person('aaa')
let person2 = new Person('bbb')

console.log(person1)     // { name: 'aaa' }
console.log(person2)     // { name: 'bbb' }
```

可以看到，又会返回 `new` 中新创建的对象！

所以， `new` 关键字执行后，总是会返回一个对象，要么是一个新创建的实例对象，要么是一个构造函数中 return 时指定的对象！

## 总结

现在，我们了解了 `new` 关键字的执行原理，后续，我们就可以自己手写一个 `new` 关键字了！

详见 [new 关键字手写实现](./new%20关键字手写实现.md)
