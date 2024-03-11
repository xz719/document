# JS `new` 关键字手写实现

在 [前一篇文章](./new%20关键字的原理.md) 中，我们了解了 `new` 关键字的原理，知道在其执行过程中会做四件事：

1. 【生成新对象】：创建一个空对象，我们叫它 obj
2. 【链接原型】：将 obj 的原型的内存地址，也就是 `__proto__` 指向构造函数的原型对象，也就是构造函数的 `prototype`。
3. 【绑定this】：利用构造函数的 `call` 方法，将原本指向 `window` 的 `this` 指向了 obj。这样，当我们向构造函数中传递实参时，实参就会被挂载到 obj 上。
4. 【返回新对象】：如果构造函数返回了一个对象，就将该对象返回，如果返回值不是对象，就将第一步中创建的对象返回

接下来，我们可以自己实现一个 `new` 方法：

```js
// 这里我们无法定义关键字，所以用函数的形式
function _new () {
    /**
     * 同时，我们约定，_new 方法的第一个参数是构造函数
     * 
     * 我们可以通过 arguments 获取一个方法的实参列表，接下来让我们开始吧
     */

    // 1. 创建空对象
    let obj = {}

    // 从参数列表中获取构造函数，arguments 是类数组对象，虽然有 length 属性，但是没有 shift 方法，故通过 call 方法改变执行上下文调用 shift 方法
    const constructor = [].shift.call(arguments)

    // 2. 链接原型
    obj.prototype = constructor.__proto__

    // 3. 绑定this并执行构造函数，还需要将构造函数的返回值接收一下
    const res = constructor.call(obj, arguments)

    // 4. 返回新对象，注意这里要检查一下构造函数的返回值是不是对象，如果是，则返回构造函数得到的对象
    return res instanceof Object ? res : obj
}
```

试试我们自己手写的 `_new` 方法：

```js
//构造函数
function Person(name, sex) {
    this.name = name;
    this.sex = sex
}

// 在原型身上添加一个公共方法
Person.prototype.getName = function() {
    return this.name
}

const person1 = new Person('person1', '男');
const person2 = _new(Person, 'person2', '男');
console.log(person1)    // Person {name: 'hugh', sex: '男'}
console.log(person2)    // Person {name: 'hugh', sex: '男'}

// 共享原型上的方法，说明我们的 _new 方法没有问题！
console.log(person1.getName === person2.getName); // true
```
