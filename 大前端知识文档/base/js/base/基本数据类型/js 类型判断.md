# JS 类型判断

## 1. `typeof`

`typeof` 操作符可以用于区分【基本类型】、【函数】和【对象】。

其返回结果只可能是以下几种：'string'、'number'、'boolean'、'undefined'、'function' 、'symbol'、'bigInt'、'object'

示例：

```js
console.log(typeof null) // object
console.log(typeof undefined) // undefined
console.log(typeof 1) // number
console.log(typeof 1.2) // number
console.log(typeof "hello") // string
console.log(typeof true) // boolean
console.log(typeof Symbol()) // symbol
console.log(typeof (() => {})) // function
console.log(typeof {}) // object
console.log(typeof []) // object
console.log(typeof /abc/) // object
console.log(typeof new Date()) // object
```

`typeof` 的缺点在于：

1. `typeof` 最为明显的问题就是 **`typeof null` 为 object**。
2. **`typeof` 无法区分各种内置的对象**，如 `Array`, `Date` 等。

### 1.1 `typeof` 原理

那么 `typeof` 是如何区分各种类型的变量的呢？

由于 JS 是动态类型的，所有每个变量在存储时除了需要存储变量的值，还需要存储变量的类型。JS 里使用 32 位存储变量信息，其中，低位的 1~3 个 bit 存储变量的类型信息，叫做【类型标签（type tag）】，就像下面这样：

```cmd
.... XXXX X000 // object
.... XXXX XXX1 // int
.... XXXX X010 // double
.... XXXX X100 // string
.... XXXX X110 // boolean
```

我们可以看到，只有 `int` 类型的 type tag 只使用了 1 位 bit，并且其取值为 1，其它类型都使用了 3 位 bit，并且最低位都是 0。这样，`typeof` 就可以通过低位取值来判断一个变量是否为 int 类型的数据。

前面为了区分 `int` 类型，已经用掉了最低位，那么就只能用剩下的两位来区分 `object`、`double`、`string` 以及 `boolean`，这当然没有什么问题。

但是，对于 `null`、`undefined` 和 `Function` 并没有分配 type tag，那么 `typeof` 要如何区分它们呢？

### 1.2 `typeof` 如何识别 `Function`？

`Function` 并没有单独的 type tag，因为其本身也是对象。但 `typeof` 内部会通过判断一个对象是否实现了 `[[call]]` 内部方法来判断其是否是 `Function` 类型。

### 1.3 `typeof` 如何识别 `undefined`?

JS 中，`undefined` 变量存储的是一个特殊值 `JSVAL_VOID`

```cmd
#define JSVAL_VOID              INT_TO_JSVAL(0 - JSVAL_INT_POW2(30))
```

`typeof` 内部判断如果一个变量存储的是这个特殊值，则认为其是 `undefined`。

### 1.4 `typeof` 如何识别 `null`?

JS 中，`null` 变量存储的也是一个特殊值 `JSVAL_NULL`，且其取值恰好是空指针机器码 0，正好与 `object` 类型的 type tag 值是一样的，这也就导致了著名的 bug：

```js
typeof null     // object
```

但实际上我们有很多方法可以用于判断一个变量是一个非 null 的对象，例如使用 Object 函数的装箱功能：

```js
function isObject (target) {
    return Object(target) === target;
}

isObject({})    // true
isObject(null)  // false
```

## 2. `instanceof`

`instanceof` 一般用于判断某一变量是否为某一类型的实例，也可以理解为检查该类型的 prototype 是否在该变量的原型链上，示例：

```js
Object.create({}) instanceof Object     // true
Object.create(null) instanceof Object   // false

Function instanceof Object      // true
Function instanceof Function    // true
Object instanceof Object        // true

[] instanceof Array             // true
{ a: 1 } instanceof Object      // true
new Date() instanceof Date      // true

// 对于基本类型，使用【字面量声明】的方式无法正确判断类型
new String('123') instanceof String // true
'123' instanceof String             // false, 原型链不存在
new Number(12) instanceof Number    // true
12 instanceof Number                // false
new Boolean(false) instanceof Boolean   // true
true instanceof Boolean             // false
```

可以看到，`instanceof` 能够**正确地判断对象的类型，但是其无法正确判断基础类型的数据**。

对于没有原型的对象或者基本类型，则直接返回 `false`：

```js
1 instanceof Object     // false
Object.create(null) instanceof Object   // false
```

为什么？因为字面量是不存在原型链的，而通过 `new` 创建的基本类型，其身上是有原型链的！

需要注意的是，在使用 `A instanceof B` 时，要求 B 必须是一个对象，并且大部分情况下都要求是一个**构造函数**，即要求具有 `prototype` 属性。

```js
// TypeError: Right-hand side of 'instanceof' is not an object
1 instanceof 1

// TypeError: Right-hand side of 'instanceof' is not callable
1 instanceof ({})

// TypeError: Function has non-object prototype 'undefined' in instanceof check
({}) instanceof (() => {})
```

如果想要了解 `instanceof` 的原理，可以移步 [js instanceof](../../js进阶/js%20instanceof.md)

## 3. `Object.prototype.toString`

调用 `Object.prototype.toString` 方法，会返回一个形如 "[object XXX]" 的字符串，示例：

```js
Object.prototype.toString.call(null)   //"[object Null]"
Object.prototype.toString.call(undefined) //"[object Undefined]"
Object.prototype.toString.call(1)    // "[object Number]"
Object.prototype.toString.call('123')  // “[object String]"
Object.prototype.toString.call(true)  // "[object Boolean]"
Object.prototype.toString({})       // "[object Object]"
Object.prototype.toString.call({})  // "[object Object]"
Object.prototype.toString.call(function(){})  // ”[object Function]"
Object.prototype.toString.call([])       //"[object Array]"
Object.prototype.toString.call(/123/g)    //"[object RegExp]"
Object.prototype.toString.call(new Date()) //"[object Date]"
Object.prototype.toString.call(document)  //[object HTMLDocument]"
Object.prototype.toString.call(window)   //"[object Window]"
```

需要注意的是：

* 如果实参是个基本类型，会自动转成对应的引用类型;
* `Object.prototype.toString` 不能区分基本类型的，只是**用于区分各种对象**；
* `null` 和 `undefined` 不存在对应的引用类型，内部特殊处理了;

那么，`Object.prototype.toString` 是如何区分各类对象的呢？

首先我们要知道，每个对象都有个内部属性 `[[Class]]`，且内置对象的 `[[Class]]` 的值都是不同的，有如下几种值："Arguments", "Array", "Boolean", "Date", "Error", "Function", "JSON", "Math", "Number", "Object", "RegExp", "String"。

但是，目前 `[[Class]]` 属性值只能通过 `Object.prototype.toString` 访问。

接下来我们来看看 `Object.prototype.toString` 的内部处理逻辑：

1. 如果实参是 undefined，则返回 "[object Undefined]"，否则，执行2
2. 如果实参是 null，则返回 "[object Null]"，否则，执行3
3. 将实参转成对象
4. 获取对象的 `Symbol.toStringTag` 属性值作为 subType：

   如果 subType 是一个字符串，则直接返回 "[object subType]"；若不是，则获取对象的 `[[Class]]` 属性值 type，并返回 "[object type]"

例如：我们手动修改某一对象的 `Symbol.toStringTag` 属性

```js
let obj = { [Symbol.toStringTag]: 'MyObject' }


console.log(Object.prototype.toString(obj))    // [object Object]
console.log(Object.prototype.toString.call(obj))    // [object MyObject]
```

但是对于**自定义的类**而言，就没有这么友好了，都是返回 "[object, Object]"

```js
class Foo {}
console.log(Object.prototype.toString.call(new Foo()));     // [object Object]
```

这个时候我们可以自定义获取 `Symbol.toStringTag` 属性的方法 `get[Symbol.toStringTag]()`，来给我们的对象上【标签】，简单操作如下:

```js
// 自定义类
class Foo {
  get[Symbol.toStringTag]() {
    return 'Foo'
  }
}
console.log(Object.prototype.toString.call(new Foo()));     // [object Foo]
```

## 4. 封装一个通用的类型检测方法

前面说到过，`typeof` 无法区分各种内置的对象，但是可以准确判断各种基础类型，而 `Object.prototype.toString` 无法判断基础类型，但是可以准确判断各种对象，所以，我们可以结合这两个方法，封装一个自己的类型检测方法：

```js
function getPrototype(obj){
  let type  = typeof obj;
  if (type !== "object") {    // 先进行typeof判断，如果是基础数据类型，直接返回
    console.log(obj, ':', res)
    return type;
  }
  // 对于typeof返回结果是object的，再进行如下的判断，正则返回结果
  const res = Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1')
  console.log(obj, '=', res);
  return res;
}

// 测试一下
getPrototype([])            // "Array"     typeof [] 是 object，因此 toString 返回
getPrototype('abc')         // "string"    typeof 直接返回
getPrototype(window)        // "Window"    toString 返回
getPrototype(null)          // "Null"      typeof null是object，需 toString 来判断，因此首字母大写
getPrototype(undefined)     // "undefined" typeof 直接返回
getPrototype()              // "undefined" typeof 直接返回
getPrototype(function(){})  // "function"  typeof 能判断，因此首字母小写
getPrototype(/123/g)        // "RegExp"    toString 返回
```
