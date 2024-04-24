# JS对象原型

原型是 JS 中对象相互继承特性的机制，这里将解释什么是原型，以及原型链的工作原理、如何为一个对象设置原型，最后，会分析基于原型的继承机制。

## 1. 原型与原型链

这里创建一个对象：

```js
const myObject = {
  city: "bj",
  greet() {
    console.log(`来自 ${this.city} 的问候`);
  },
};
myObject.greet(); // 来自 bj 的问候
```

它具有数据属性 `city` 和方法 `greet()`。

当在控制台中输入 `myObject.` 时，可以看到该对象下可用的一系列属性：
![在这里插入图片描述](https://img-blog.csdnimg.cn/ffc02133d53749c49a2dc32dbcd3033a.png#pic_center)
但这些方法中，很多都不是我们定义的，现在尝试访问其中一个：

```js
myObject.toString(); // "输出[object Object]"
```

发现其可以成功调用，那么这些额外的属性，是从哪里来的？

在 JS 中，所有对象均有一个内置属性，其被称为它的 `prototype` (原型)。它本身是一个对象，因此，原型对象也会有其自己的原型。

每当定义一个对象（函数也是对象）时，就会生成一个 `__proto__` 属性，被称为**隐式原型**；这个 `__proto__` 属性指向的是这个对象的**构造函数的 prototype属性**，其被称为**显式原型**。

当访问一个对象的属性或方法时，首先对象会从自身去找，如果找不到，就会往原型中去找，即 `__proto__`，也就是**它构造函数的 prototype 中**。如果原型中找不到(即构造函数中也没有该属性)，因为构造函数也是对象，也有 `__proto__`，就会往**原型的原型**上去找…这样就形成了链式的结构，称为**原型链**，本质描述的是**对象的一种继承关系**！

因此在上面的代码中，浏览器做了以下工作：

* 在 `myObject` 中寻找 `toString` 属性
* `myObject` 中找不到 `toString` 属性，故在 `myObject` 的原型对象中寻找 `toString`
* 其原型对象拥有这个属性，然后调用它。

那么 `myObject` 的原型是什么？可以使用 `Object.getPrototypeOf()` 函数来查询：

![在这里插入图片描述](https://img-blog.csdnimg.cn/78112a8ad37c4c4192fc731cbfc1a320.png#pic_center)

可以看到是一个对象，实际上，这个对象叫 **`Object.prototype`**，它是**最基础的原型**，**所有对象默认都拥有它**。`Object.prototype` 的 `__proto__` 性是 `null`，即，它位于原型链的**终点**：

![在这里插入图片描述](https://img-blog.csdnimg.cn/2b10388087f042439dcb1f4418ebd0e1.png#pic_center)
但需要注意的是，一个对象的原型并不总是 `Object.prototype`，比如：

```js
const myDate = new Date();
let object = myDate;

do {
  object = Object.getPrototypeOf(object);
  console.log(object);
} while (object);

// 输出为：
// Date.prototype
// Object { }
// null
```

在这个例子中，创建了一个 `Date` 对象，然后遍历了它的原型链并输出了原型链上的原型。其原型链如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/261afb5dd2f54dd3bc96ae776b7c951e.png#pic_center)

可以看到，如果调用 Date 类型常用的方法，如：`myDate.getMonth()`。实际上调用的是 `Date.prototype` 上的方法。

实际上，如果我们顺着上面 `myObject` 的例子继续看下去，我们会看到更有意思的情况：

首先我们明确一点，`__proto__` 属性为空的原型就是 `Object.prototype`，即最基础的原型。

当我们定义一个函数时，可以看到这个函数的原型：

![!\[在这里插入图片描述\](https://img-blog.csdnimg.cn/direct/a6cca540f41842c499a6fe63bbeb24f3.png](https://img-blog.csdnimg.cn/direct/90c714a3efaa41ad9f5a095fc1ae67a3.png)

即 `f ()`

而看下面这张图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/f7c4f67ba9884b54ad0bfbda8ac176c0.png#pic_center)

由前面的内容，我们知道，`myObject` 的 原型就是 `Object.prototype` ，而如果我们继续看下去，`Object.prototype` 同样有构造函数，而且这个构造函数是函数类型，进一步地，这个构造函数也有原型，其原型就是函数原型，而函数原型作为一个对象，其同样拥有 `__proto__` 属性，且它的 `__proto__` 属性指向的是 `Object.prototype`！

也就是下面这张图：

![在这里插入图片描述](<https://img-blog.csdnimg.cn/direct/e94a2d4fca45468db67410c11092009a.png#pic_center>)

由此，还存在下面这几个比较有意思的等式：

```javascript
Function.__proto__.__proto__ === Object.prototype
Function.__proto__ === Function.prototype
Object.__proto__.__proto__ === Object.prototype
Object.__proto__ === Function.prototype
```

## 2. 属性遮蔽

当我们在对象中定义了一个属性，而在该对象的原型中也存在一个同名的属性，会发生什么呢？

```js
const myDate = new Date(1995, 11, 17);

console.log(myDate.getYear()); // 95

myDate.getYear = function () {
  console.log("别的东西！");
};

myDate.getYear(); // '别的东西！'
```

基于上面对原型链的描述，这应该是可以预测的。当我们调用 `getYear()` 时，浏览器首先在 `myDate` 中寻找具有该名称的属性，如果 `myDate` 没有定义该属性，才检查原型。因此，当我们给 `myDate` 添加 `getYear()` 后，就会调用 `myDate` 中的版本。

这就叫做**属性的遮蔽**。

## 3. 如何设置原型

在 JS 中，有多种设置对象原型的方法，这里主要介绍两种：

1. `Object.create()`
2. 构造函数

### 3.1 使用Object.create

例：

```js
const personPrototype = {
  greet() {
    console.log("hello!");
  },
};

const carl = Object.create(personPrototype);
carl.greet(); // hello!
```

在这个例子中，创建了一个 `personPrototype` 对象，它有一个 `greet()` 方法。然后我们使用 `Object.create()` 来创建一个**以 `personPrototype` 为原型的新对象**。

现在我们可以在新对象上调用 `greet()`，而**原型提供了这个方法的实现**。(继承机制的体现！)

### 3.2 使用构造函数

在 JavaScript 中，所有的函数都有一个名为 `prototype` 的属性。**当你调用一个函数作为构造函数时，这个属性被设置为新构造对象的原型**，即该对象的**显式原型**。（按照惯例，该对象的 `__proto__` 的属性会指向这个属性！）。

因此，如果我们设置了一个构造函数的 `prototype`，我们可以确保所有用该构造函数创建的对象都被赋予该原型：

```js
const personPrototype = {
  greet() {
    console.log(`你好，我的名字是 ${this.name}！`);
  },
};

function Person(name) {
  this.name = name;
}

Object.assign(Person.prototype, personPrototype);
// 将Person函数的prototype属性赋为我们创建的对象或
// Person.prototype.greet = personPrototype.greet;
```

可以看到这里：

* 创建了一个 `personPrototype` 对象，其中实现了输出名字的 `greet()` 方法
* 创建了一个 `Person()` 构造函数，其中初始化了要创建人物对象的名字

在这段代码之后，使用 `Person()` 创建的对象将获得 `personPrototype` 作为其原型，其中自动包含 `greet` 方法。如下：

```js
const reuben = new Person("Reuben");
reuben.greet(); // 你好，我的名字是 Reuben！即调用了其构造函数原型上的方法！
```

这也解释了为什么我们之前说 `myDate` 的原型被称为 `Date.prototype`，因为它是 `Date` 构造函数的 `prototype` 属性。

## 4. 自有属性

在上面的例子中，使用 `Person` 构造函数创建的对象有两个属性：

* `name` 属性，在构造函数中设置，在 `Person` 对象中可以直接看到
* `greet()` 方法，在原型即 `Person.prototype` 中实现

这是一种非常常见的模式，即：**方法是在原型上定义的，但数据属性是在构造函数中定义的。**

这是因为方法通常对我们创建的每个对象都是一样的，而我们通常希望每个对象的数据属性都有自己的值（就像这里每个人都有不同的名字）。

而这些这就在对象中定义的属性，例如这里的 `name`，被称为**自有属性**，在 JS 中，我们可以用静态方法 `Object.hasOwn()` 来检查某一个属性是否是自有属性。

```js
const irma = new Person("Irma");

console.log(Object.hasOwn(irma, "name")); // true
console.log(Object.hasOwn(irma, "greet")); // false
```

实际上，非静态方法 `Object.hasOwnProperty()` 也可以判断。但还是推荐使用静态方法 `Object.hasOwn()`。

## 5. 原型与继承

原型是 JavaScript 的一个强大且非常灵活的功能，使得**重用代码**和**组合对象**成为可能。

特别是它们支持某种意义的**继承**。继承是面向对象的编程语言的一个特点，它让程序员表达这样的想法：系统中的一些对象是其他对象的更专门的版本。

例如，如果我们正在为一所学校建模，我们可能有*教授* 和*学生* ：他们都是*人*，所以有一些共同的特征（例如，他们都有名字），但每个人都可能增加额外的特征（例如，教授有一个他们所教的科目），或者可能以不同的方式实现同一个特征。在一个 OOP 系统中，我们可以说教授和学生都**继承自**人。

你可以看到在 JavaScript 中，如果 `Professor` 和 `Student` 对象具有原型 `Person`，那么他们可以继承共同的属性，同时增加和重新定义那些需要不同的属性。

首先整理一下相关概念：

* **构造函数**：在 JavaScript 中，**构造函数可以实现类的定义**，帮助我们在一个地方描述类的“形状”，包括定义类的方法。不过，原型也可以用于实现类的定义。例如，如果一个方法定义于构造函数的 `prototype` 属性中，那么所有由该构造函数创造出来的对象都可以通过原型使用该方法，而我们也不再需要将它定义在构造函数中。
* **原型链**：原型链很自然地实现了继承特性。例如，如果我们由 `Person` 原型构造了一个 `Student` 类，那么我们可以继承 `Person` 类的 `name` 属性，重写 `introduceSelf()` 方法。

而实际上，JS 中的继承特性与基于类的面向对象编程之间有所不同，下面就来探讨一下二者的区别。

首先，**在基于类的面向对象编程中，类与对象是两个不同的概念**，对象通常是由类创造出来的实例。由此，定义类的方式（定义类的语法）和实例化对象的方式（构造函数）也是不同的。而在 JavaScript 中，我们经常会使用函数或对象字面量创建对象，也就是说，**JavaScript 可以在没有特定的类定义的情况下创建对象**。相对于基于类的面向对象编程来说，这种方式更为**轻量**，帮助我们更为方便地使用对象。

其次，尽管原型链看起来很像是继承的层级结构，并且在某些方面，原型链的行为与继承的行为也很类似，但是在其他方面，二者之间仍然存在区别。在继承方式下，当一个子类完成继承时，由该子类所创建的对象既具有其子类中单独定义的属性，又具有其父类中定义的属性（以及父类的父类，依此类推）。而**在原型链中，每一个层级都代表了一个不同的对象**，不同的对象之间通过 `__proto__` 属性链接起来。原型链的行为并不太像是继承，而更像是**委派**（delegation）。委派同样是对象中的一种编程模式。当我们要求对象执行某项任务时，在委派模式下，对象可以自己执行该项任务，或者要求另一个对象（委派的对象）以其自己的方式执行这项任务。在许多方面，相对于继承来说，委派可以更为灵活地在许多对象之间建立联系（例如，委派模式可以在程序运行时改变、甚至完全替换委派对象）。

尽管如此，构造函数和原型仍然可以在 JavaScript 中实现基于类的面向对象编程特性。但是直接使用构造函数和原型去实现这些特性（例如继承）仍是棘手的，因此，JavaScript 提供了一些额外的特性，这些特性在原型这一模型之上又抽象出一层模型，将基于类的面向对象编程中的概念映射到原型中，从而能够更为直接地在 JavaScript 中使用基于类的面向对象编程中的概念。实际上，就是 **ES6 中新增的 class 语法糖**！

那么，JS 中有哪些实现继承的方法呢？

## 6. JS中实现继承的方法

1. **构造函数继承**：在⼦对象的构造函数中，通过 `call` 或者 `apply` 调⽤**⽗对象的构造函数**来继承⽗对象的属性
2. **原型继承**：即把⼦对象的**原型 `prototype`** 设置为⽗对象的一个实例
3. **组合继承**：组合继承实际上是上面两种方法的结合，⼀般我们会**通过构造函数来继承属性**，**通过原型来继承⽅法**。
4. 最后就是**ES6新增了class，可以通过extends来实现继承**，但本质上仍然是构造函数和原型的继承。

## 7. 实例

…
