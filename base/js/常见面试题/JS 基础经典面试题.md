# JS 基础经典面试题

题目如下：

下列代码的执行结果是什么？

```js
// a
function Foo() {
  getName = function () {
    console.log(1);
  };
  return this;
}
// b
Foo.getName = function () {
  console.log(2);
};
// c
Foo.prototype.getName = function () {
  console.log(3);
};
// d
let getName = function () {
  console.log(4);
};
// e
function getName() {
  console.log(5);
}

Foo.getName();
getName();
Foo().getName();
getName();
new Foo.getName();
new Foo().getName();
new new Foo().getName();
```

这是一道非常经典的面试题，涵盖了从函数的基本概念、运算符优先级，到作用域链、原型链、this 关键字、new 关键字等基础知识点考察，可以说能完整答对 JS 基础才算过了关，本文就带一起回顾这道面试题，彻底搞懂它。
