## Vue 响应式中对数组的处理

前两节的内容：

[Vue 数据劫持](https://blog.csdn.net/cannotbecounted/article/details/134953155)

[Vue 响应式初步](https://blog.csdn.net/cannotbecounted/article/details/134953314)

### 0. 为什么需要对数组特殊处理？

在响应式初步那一篇文章的最后，我们提到过，需要对数组进行特殊的处理，为什么？

如果仍然用我们之前写的 demo 来简单模拟响应式的话，那么对于一个数组 arr，当我们访问这个数组时，同样会触发它身上的 getter 和 setter，但需要注意的是，我们在使用数组时，并不是仅仅有一般的读写操作，更多时候，我们会**通过一些常用的数组方法去操作数组**，例如：

```js
arr.push(...)
arr.unshift(...)
arr.splice(...)
...
```

此时我们应该如何做到响应式呢？

Vue 中给出的方法是：对 js 中7个会改变数组的方法进行重写。这七个方法分别是：`push, pop, unshift, shift, splice, reverse, sort`。

接下来，在我们的 demo 中简单地实现一下。

首先，需要对之前的 Observer 类进行一些修改，加入对数组类型的处理：

```js
class Observer {
  constructor(value) {
    this.value = value
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      // 如果是数组类型数据的话就特殊处理
      // 代理原型
      ...
      // 监听数组内容
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  
  observeArray(arr) {
    // 对数组内部的对象类型数据进行监听
    arr.forEach((i) => observe(i))
  }
  ...
}
```

接下来，就是对数组方法进行监听。



### 1. 代理原型

基于对原型链的理解，我们知道，当调用 arr 身上的某一方法如 `push` 时，实际上是顺着原型链找到了 `Array.prototype` 然后调用了它身上的 `push` 方法。

那么，如果我们想要在调用 push 时，对其进行拦截，让其执行我们自己定义的方法，一般我们想到的都是重写该方法，但实际上还有另一种方法 --- 代理原型。

所谓代理原型，实际上就是在数组对象和其原型 `Array.prototype` 之间做一层代理，当通过数组对象调用某些特定的方法时，就会触发我们的代理，在不影响原方法执行的情况下，实现响应式。

如下图：

![2](C:\Users\pc\Desktop\Vue 数据双向绑定\响应式\2.png)

接下来就是实现了：

首先是 Observer 类中

```js
// 定义两个全局变量
const arrayPrototype = Array.prototype	// 保存数组的原型
// 增加代理原型 proxyPrototype 且 proxyPrototype.__proto__ === arrayProrotype
const proxyPrototype = Object.create(arrayPrototype)

// Observer 类
class Observer {
  constructor(value) {
    this.value = value
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      // 如果是数组类型数据的话就特殊处理
      // 代理原型
      Object.setPrototypeOf(value, proxyPrototype)
      // 监听数组内容
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  
  observeArray(arr) {
    // 对数组内部的对象类型数据进行监听
    arr.forEach((i) => observe(i))
  }
  ...
}
```

接下来对上面的7个方法进行代理：

```js
// 在 array.js 中编写
const reactiveMethods = [
    'push',
    'pop',
    'unshift',
    'shift',
    'splice',
    'reverse',
    'sort',
]

reactiveMethods.forEach((method) => {
    // 取出原方法
    const originalMethod = arrayPrototype[method]
    // 在我们的代理原型上定义该方法的响应式版本
    Object.defineProperty(proxyPrototype, method, {
        value: function reactiveMethod(...args) {
            // 首先确保调用不受影响
            const result = originalMethod.apply(this, args)
            // 派发更新
            ...
            return result
        },
        enumerable: false,
    	writable: true,
    	configurable: true
    })
})
```

现在遇到了一个问题：**如何派发更新？**

### 2. 派发更新的实现

在对象类型数据的处理中，我们是首先在 `defineReactive` 方法中形成一个 dep 实例的闭包，然后在 setter 中通过 `dep.notify()` 依次通知相关的 watcher 实例来实现派发更新。这样保证了**每一个响应式数据都有其自己的 dep 实例。**

而这里，数组中的各项数据的确是拥有其自己的 dep 实例的，但是我们想要的是为数组对象本身准备一个 dep 实例，那么我们应该在哪里定义这一 dep 实例呢？

在前面数据劫持的学习实现中，**为了防止对某一数据进行重复劫持**，我们在每一个被劫持过的数据身上，都添加了一个属性 `__ob__` ，并将**该数据对应的 Observer 类实例**存入了该属性中。

那么，同理，数组对象身上应该也存在这一属性：

![3](C:\Users\pc\Desktop\Vue 数据双向绑定\响应式\3.png)

由于该属性指向当前数据对应的 Observer 类实例，且两者是一一对应的，所以，此时我们只需要在 Observer 实例身上定义一个 dep 实例，就能够维持我们之前的特性：**每一个响应式数据都有其自己的 dep 实例**。

那么就需要对 Observer 类进行一些修改：

```js
// Observer 类
class Observer {
  constructor(value) {
    this.value = value
    // 声明该数据对应的 dep 实例
    this.dep = new Dep()
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      // 如果是数组类型数据的话就特殊处理
      // 代理原型
      Object.setPrototypeOf(value, proxyPrototype)
      // 监听数组内容
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  
  observeArray(arr) {
    // 对数组内部的对象类型数据进行监听
    arr.forEach((i) => observe(i))
  }
  ...
}
```

接下来，就可以对我们前面的代码进行补全。同时还有一个小细节需要注意：当使用 push、unshift、splice 这三个方法操作数组时，可能会向数组中增加元素，那么这些增加的元素也需要被劫持一下。

```js
// 在 array.js 中编写
const reactiveMethods = [
    'push',
    'pop',
    'unshift',
    'shift',
    'splice',
    'reverse',
    'sort',
]

reactiveMethods.forEach((method) => {
    // 取出原方法
    const originalMethod = arrayPrototype[method]
    // 在我们的代理原型上定义该方法的响应式版本
    Object.defineProperty(proxyPrototype, method, {
        value: function reactiveMethod(...args) {
            // 首先确保调用不受影响
            const result = originalMethod.apply(this, args)
            // 获取数组对象的 Observer 类实例
            const ob = this.__ob__
            // 对三种方法特殊处理
            let appended = null
            switch (method) {
                case 'push':
                case 'unshift':
                    appended = args
                    break;
                case 'splice':
                    // splice 方法中，第三个以及以后的参数是新增的数据
                    appended = args.slice(2)
            }
            // 如果有新增的数据，则对这些新增的数据进行劫持
            if (appended) ob.observerArray(appended)
            // 通过dep实例派发更新
            ob.dep.notify()
            return result
        },
        enumerable: false,
    	writable: true,
    	configurable: true
    })
})
```

完成了派发更新的逻辑，接下来还需要解决依赖收集的问题。

### 3. 依赖收集的实现

对于下面的数据：

```js
const obj = {
	a: 1,
	arr: [
        {
            b: 2,
            c: 3,
        },
        {
            d: 4
        }
    ]
}
```

由于我们前面为被劫持的数据都添加了 `__ob__` 属性，所以，被劫持后的数据实际上会变成下面这种形式：

```js
const obj = {
	a: 1,
	arr: [
        {
            b: 2,
            c: 3,
            __ob__: {...}	// 数组中对象数据的Observer实例
        },
        {
            d: 4,
            __ob__: {...}	// 数组中对象数据的Observer实例
        },
        __ob__: {...}	// 数组对象arr的Observer实例(实际上的数组对象结构并不是这样的，这里只是简化的写法)
    ],
    __ob__: {...}	// obj对象的Observer实例
}
```

在前面的数据劫持时，我们在 `observer` 方法的最后，将新创建或已有的 Observer 类实例返回了出来，并在 `defineReactive` 方法中，用变量 `childOb` 接收到了该实例：

```js
// 数据劫持
function defineReactive(data, key, value = data[key]) {
  const dep = new Dep()
  // 对当前属性的下一层属性进行劫持，并拿到当前数据对应的Observer实例
  let childOb = observe(val)
  // 对当前属性进行拦截
  Object.defineProperty(data, key, {
    get: function reactiveGetter() {
      // 收集依赖
      dep.depend()
      return value
    },
    set: function reactiveSetter(newValue) {
      if (newValue === value) return
      value = newValue
      // 触发依赖，并更新Observer实例
      childOb = observe(newValue)
      dep.notify()
    }
  })
}
```

即，当前的闭包中，我们不仅可以通过变量 `dep` 拿到该数据对应的 dep 实例，还可以通过 `childOb.dep` 拿到 dep 实例。

在针对**对象类型**数据的处理中，我们是通过变量 `dep` 指向的 dep 实例来进行依赖收集以及派发更新，但是这里对于**数组类型**的数据，我们是通过 `__ob__.dep` 或者说 `childOb.dep` 来进行派发更新。即**对于对象类型和数组类型的数据，其会存在两个 dep 实例**，一个是在 defineReactive 方法的闭包中，一个则在其对应的 Observer 实例对象身上！

因此，只要能够**保证 `__ob__.dep` 与当前闭包中的变量 `dep` 这两个 dep 实例中保存的 watcher 相同**，就能保证依赖收集以及派发更新不会出现问题。

所以，我们需要对原本的 getter 进行修改：

```js
get: function reactiveGetter() {
    // 同时向两个dep实例中收集依赖
    // 由于此时的 Dep.target 变量指向某一watcher，所以只需要每次收集依赖时，都同时向两个dep实例中收集依赖，就能保证两个dep实例中保存的watcher相同
    dep.depend()
    childOb.dep.depend()
    return value
},
```

但是，我们还需要考虑一种特殊情况：在 `observer` 方法中，对于普通类型的数据，我们不会进行处理，即，普通类型的数据身上并不会有 `__ob__` 属性！也就是说，普通类型数据的 `childOb` 可能为空，但是，在 `defineReactive` 方法的闭包中，变量 `dep` 仍然存在，且能够收集到该数据的依赖，所以此时我们仅需要向变量 `dep` 指向的 dep 实例中收集依赖就行了:

```js
get: function reactiveGetter() {
    // 收集依赖
    dep.depend()
    if (childOb) {
      childOb.dep.depend() 
    }
    return value
},
```

这样就完成了依赖的收集。

### 4. 注意

考虑下面的情况：

当我们仅仅改变**数组中一个对象的某一属性的值**时，是否会触发更新？

```js
const arr = [
    {
        a: 1
    }
]
// 劫持该数据
observer(arr)
// 劫持后的数据变为如下形式
const arr = [
    {
        a: 1,
        __ob__: {...}
    },
    __ob__: {...}
]
```

当某一watcher依赖于该数组时，会执行以下流程：

在 watcher 的构造函数中，会访问该数组，触发其 getter，然后在 getter 中触发依赖收集，从而使得 watcher 被收集到数组 `arr` 的 `__ob__.dep` 的依赖数组中，但此时需要注意，`arr[0]` 这一数据的 `__ob__.dep` 中并没有收集到这个 watcher。显然，我们的实现对于这种情况是不会触发派发更新的。

但是，在 Vue 的源码中认为，**只要依赖了该数组，就等价于依赖了数组中的所有元素**，即只要数组中的任意元素更新了，依赖该数组的地方也需要更新，这实际上是合理的。

所以，我们需要在收集依赖时做出一些修改：

```js
function defineReactive(data, key, value = data[key]) {
  const dep = new Dep()
  // 对当前属性的下一层属性进行劫持，并拿到当前数据对应的Observer实例
  let childOb = observe(val)
  // 对当前属性进行拦截
  Object.defineProperty(data, key, {
    get: function reactiveGetter() {
        // 收集依赖
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          // 新增
          if (Array.isArray(val)) {
              dependArray(val)
          }
        }
        return value
    },
    set: function reactiveSetter(newValue) {
      if (newValue === value) return
      value = newValue
      // 触发依赖，并更新Observer实例
      childOb = observe(newValue)
      dep.notify()
    }
  })
}

function dependArray(array) {
  for (let e of array) {
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}
```



### 5. 完整demo

这已经是第三版的demo了：

首先是两个全局变量

```js
// public.js
// 定义两个全局变量
const arrayPrototype = Array.prototype	// 保存数组的原型
// 增加代理原型 proxyPrototype 且 proxyPrototype.__proto__ === arrayProrotype
const proxyPrototype = Object.create(arrayPrototype)
```

```js
// demo.js
// observer 方法
function observer (value) {
    if (!isObject(value)) {
        return
    }
    var ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
    } else {
        ob = new Observer(value);
    }
    return ob
}

// Observer 类
export class Observer {
  constructor(value) {
    this.value = value
    // 声明该数据对应的 dep 实例
    this.dep = new Dep()
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      // 如果是数组类型数据的话就特殊处理
      // 代理原型
      Object.setPrototypeOf(value, proxyPrototype)
      // 监听数组内容
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  // 遍历下一层属性，执行defineReactive
  walk (obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
  observeArray(arr) {
    // 对数组内部的对象类型数据进行监听
    arr.forEach((i) => observe(i))
  }
}

// def 方法，用于为当前正在拦截的数据添加 __ob__ 属性
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

// 数据劫持
function defineReactive(data, key, value = data[key]) {
  const dep = new Dep()
  // 对当前属性的下一层属性进行劫持，并拿到当前数据对应的Observer实例
  let childOb = observe(value)
  // 对当前属性进行拦截
  Object.defineProperty(data, key, {
    get: function reactiveGetter() {
        // 收集依赖
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          // 新增
          if (Array.isArray(value)) {
              dependArray(value)
          }
        }
        return value
    },
    set: function reactiveSetter(newValue) {
      if (newValue === value) return
      value = newValue
      // 触发依赖，并更新Observer实例
      childOb = observe(newValue)
      dep.notify()
    }
  })
}

function dependArray(array) {
  for (let e of array) {
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}

// Dep 类
class Dep {
  constructor() {
    this.subs = []
  }
  // 依赖收集
  depend() {
    if (Dep.target) {
      this.addSub(Dep.target)
    }
  }
  // 通知更新
  notify() {
    const subs = [...this.subs]
    subs.forEach((s) => s.update())
  }
  // 添加订阅
  addSub(sub) {
    this.subs.push(sub)
  }
}

// 全局变量 Dep.target
Dep.target = null

// 用于暂存 Dep.target 指向的栈
const targetStack = []

// 入栈
function pushTarget (_target) {
    targetStack.push(Dep.target)	// 保存当前 Dep.target
    Dep.target = _target
}
        
// 出栈
function popTarget () {
    Dep.target = targetStack.pop()
}

// Watcher 类
class Watcher {
  constructor(data, expression, cb) {
      this.data = data;	    // 要实现响应式的对象
      this.expression = expression;	// 依赖属性的访问路径
      this.cb = cb;	    // 依赖的回调
      this.value = this.get() // 访问目标属性以触发getter从而发起依赖收集流程
  }
  // 访问当前实例依赖的属性，并将全局变量指向自身
  get() {
    pushTarget(this)
    const value = parsePath(this.data, this.expression)
    popTarget()
    return value
  }
  // 收到更新通知后，进行更新，并触发依赖回调
  update() {
    const oldValue = this.value
    this.value = parsePath(this.data, this.expression)
    this.cb.call(this.data, this.value, oldValue)
  }
}

// 工具函数，用于根据指定访问路径，取出某一对象下的指定属性
function parsePath(obj, expression) {
  const segments = expression.split('.')
  for (let key of segments) {
    if (!obj) return
    obj = obj[key]
  }
  return obj
}
```

```js
// array.js
const reactiveMethods = [
    'push',
    'pop',
    'unshift',
    'shift',
    'splice',
    'reverse',
    'sort',
]

// 代理原型
reactiveMethods.forEach((method) => {
    // 取出原方法
    const originalMethod = arrayPrototype[method]
    // 在我们的代理原型上定义该方法的响应式版本
    Object.defineProperty(proxyPrototype, method, {
        value: function reactiveMethod(...args) {
            // 首先确保调用不受影响
            const result = originalMethod.apply(this, args)
            // 获取数组对象的 Observer 类实例
            const ob = this.__ob__
            // 对三种方法特殊处理
            let appended = null
            switch (method) {
                case 'push':
                case 'unshift':
                    appended = args
                    break;
                case 'splice':
                    // splice 方法中，第三个以及以后的参数是新增的数据
                    appended = args.slice(2)
            }
            // 如果有新增的数据，则对这些新增的数据进行劫持
            if (appended) ob.observerArray(appended)
            // 通过dep实例派发更新
            ob.dep.notify()
            return result
        },
        enumerable: false,
    	writable: true,
    	configurable: true
    })
})
```

github 仓库地址：[Vue 响应式原理demo](https://github.com/xz719/vue-reactive)



