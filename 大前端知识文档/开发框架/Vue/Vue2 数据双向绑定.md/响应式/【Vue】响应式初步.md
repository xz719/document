## Vue 响应式初步

在上一节 [Vue 数据劫持]()中，介绍了 Vue 响应式的实现基础 --- 数据劫持，在那篇文章的最后，我们说到，要实现响应式，仅仅实现对数据的劫持还不够，还需要能够对数据的读写做出相应的处理，具体来说，就是在 getter 和 setter 中，**收集依赖**和**触发依赖**，下面我们通过一个简单的 demo 来对这两个步骤进行学习。

### 0. 准备 --- Dep 和 Watcher

在介绍具体实现之前，首先要了解两个 Vue 中的重要类：`Dep` 和 `Watcher`

但是这里我们暂时不去深入学习这两个类，而是简单介绍，有一个基本的理解即可。

#### 0.1 Dep 类

Dep 类对于整个响应式功能模块是非常重要的，它与**要实现响应式功能的数据对象和对象属性**关联，它只在 Observer 类构造函数和 defineReactive 函数中实例化，并在 setter\getter 方法中的特定场景下完成**依赖收集**和**派发更新通知**的工作。

#### 0.2 Watcher 类

Watcher 类，可以理解为 Vue 中的观察者。其一般用在渲染函数、计算属性以及侦听属性中，其一般用于在数据发生变化时接收通知，并给出相应的行为。

#### 0.3 Dep 和 Watcher --- 发布订阅模式

根据上面的简单介绍，再结合收集依赖和触发依赖，可以发现，这里实际上是一个很典型的发布订阅模式的应用场景，其中 Dep 是发布者，而 Watcher 显然是订阅者。

Vue 中也正是这样做的，Dep 类中有两个方法：`addSub` 和 `notify`

addSub 方法用于添加依赖该变量的 Watcher 实例，将这些 Watcher 实例存入当前 Dep 实例身上的数组变量 subs 中，即发布订阅模式中的**订阅**操作。

notify 方法则用来通知订阅了该 Dep 实例的所有 Watcher 对象(实际上就是 subs 数组中的所有 Watcher 实例)，即发布订阅模式中的**通知**操作。

至于订阅者 Watcher，我们可以预想到，其中至少需要保存以下内容：

* **要实现响应式的对象**。比如组件中的data对象(当然由于Vue中做了数据代理，所以可以用组件实例vm来指代data)。
* **Watcher 依赖的对象属性的访问路径**。比如，当前 Watcher 实例依赖的是 data 的 data.demo.test 属性，那么访问路径就是 'demo.test '。
* **依赖的回调函数**。在 Watcher 收到更新的通知时，执行该回调。

另外，还准备了一个 `update` 方法，用于在接收到通知时，调用回调函数。

对 Dep 和 Watcher 类有了一个简单的理解之后，我们就可以进入下一部分，依赖收集的实现。



### 1. 依赖收集

需要注意的是，在收集依赖的过程中，针对 Object 和 Array，Vue 中有不同的实现。

前面我们说到过，Dep 类中有 addSub 方法，用于向 Dep 实例对象身上的 subs 数组中添加 Watcher 实例，但在 Vue 中，依赖收集并不是简单地调用 addSub 方法实现的。

在 Dep 类中，还有一个 `depend` 方法用于进行依赖的收集：

```js
class Dep {
  constructor() {
    ...
    this.subs = []
    ...
  }
  // 依赖收集
  depend () {
      if (Dep.target) {
          Dep.target.addDep(this)
      }
  }
  // 订阅
  addSub(sub) {
    this.subs.push(sub)
  }
  // 发出更新通知
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
  ...
}
```

问题在于，在哪里调用这个方法呢？

根据响应式的具体表现，当我们更改某一个数据时，使用该数据的地方都需要进行更新，即，引用了该数据的地方，都依赖于该数据。又，由于我们对数据进行了劫持，只要引用该数据，就会触发我们准备好的 getter，所以，我们只需要在 getter 方法中调用该方法即可：

```js
function defineReactive(data, key, val = data[key]) {
  const dep = new Dep()
  let childOb = observe(val)
  Object.defineProperty(data, key, {
    // getter
    get() {
      // 收集依赖
      if (Dep.target) {
        dep.depend()
      }
      return val
    },
    // setter
    set(newVal) {
      val = newVal;
      ... // 触发依赖
    },
  });
}
```

这里可以看到，对于响应式对象的每一属性，都会为其创建一个 Dep 实例。

同时，这里和上面的 depend 方法中，都使用到了 `Dep.target` 这一变量。Dep.target 是一个**全局唯一的变量**，事实上，**它就是一个全局的指向某一 Watcher 实例的变量**。在创建一个 Watcher 实例时，会调用成员方法 `get`，而在 get 方法中，就会将这个全局变量指向当前 Watcher 实例：

```js
// Watcher类的简单实现
class Watcher{ 
    constructor (vm, expr, cb){
        this.vm = vm;	    // 要实现响应式的对象
        this.expr = expr;	// 依赖属性的访问路径
        this.cb = cb;	    // 依赖的回调
        this.value = this.get() // 访问目标属性以触发getter从而发起依赖收集流程
    }
    update () {
      // 调用依赖回调cb
      ...
    }
    get () {
      Dep.target = this
      const value = parsePath(this.vm, this.expr) // 读取依赖的属性，触发对应属性的getter
      Dep.target = null // 依赖收集完毕后，需要将全局变量 Dep.target 置为空
      return value
    }
}

// 根据指定路径读取对象属性
function parsePath(obj, expression) {
  const segments = expression.split('.')
  for (let key of segments) {
    if (!obj) return
    obj = obj[key]
  }
  return obj
}
```

可以看到，在 new Watcher() 后，调用 get 函数，访问依赖的属性，触发我们在 defineReactive 方法中，为该属性准备好的 getter，然后，由于此时全局变量 Dep.target 指向了我们刚刚创建的 Watcher 实例，说明此时需要进行依赖的收集，调用该属性的 dep 实例身上的 depend 方法，接下来顺着 Dep.target 找到我们刚刚创建的 Watcher 实例，调用该实例身上的 addDep 方法：

```js
addDep (dep) {
     // 此处还会有对重复依赖的过滤，但与现在所讲的内容无关，将其忽略
     this.deps.push(dep)  // 由于一个Watcher实例可能依赖了多个变量，所以可能会对应多个Dep实例，所以也需要一个deps数组来保存其所依赖的Dep实例。
     dep.addSub(this)  // 将当前Watcher实例加入该Dep实例的订阅队列中
}
```

这样，就完成了依赖的收集。

但还存在一个问题：**何时创建 Watcher 实例？**

在上述流程中，我们并没有提高在哪里创建的 Watcher 对象，如果不知道该对象在哪里创建，那么这整个流程就根本无从开始，后续也没有意义了。那么，搞清楚在何处、何时创建 Watcher 对象就十分重要。

在前面的介绍中，我们说过，Watcher 类会在三个地方使用：**渲染函数**、**计算属性**以及**侦听属性**，而这些地方都是监听变量更新，做出相应处理。以页面渲染时来说，渲染页面时碰到**插值表达式，`v-bind`等需要数据等地方**，就会实例化一个`watcher`。

> 这种方法，每遇到一个插值表达式就会新建一个`watcher`，这样每个节点就会对应一个`watcher`。实际上这是`vue1.x`的做法，以节点为单位进行更新，粒度较细。而`vue2.x`的做法是每个组件对应一个`watcher`，实例化`watcher`时传入的也不再是一个`expression`，而是渲染函数，渲染函数由组件的模板转化而来，这样一个组件的`watcher`就能收集到自己的所有依赖，以组件为单位进行更新，是一种中等粒度的方式。要实现`vue2.x`的响应式系统涉及到很多其他的东西，比如组件化，虚拟`DOM`等，而这个系列文章只专注于数据响应式的原理，因此不能实现`vue2.x`，但是两者关于响应式的方面，原理相同。

所以，我们可以将依赖收集的过程总结如下：

![5](C:\Users\pc\Desktop\Vue 数据双向绑定\数据劫持\5.png)



### 2. 触发依赖

在前面依赖收集部分，我们提到过，需要获取某一数据，或者说需要触发某一数据的 getter，说明此时的 Watcher 就依赖于该数据，所以，进一步地，当该数据变化时，我们需要通知 Watcher 进行更新。

至于在何处通知 Watcher，实际上我们在数据劫持部分中，就知道了在 setter 中触发依赖：

```js

function defineReactive(obj, key, value) {
  ...
  const dep = new Dep();
  ...
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    ...,
    // setter
    set() {
      if (newValue === value) return
      value = newValue
      observe(newValue)	// 对新的值也需要进行一次劫持
      dep.notify();	// 通知 dep 相关的所有 Watcher 实例
    },
  });
}
```

而在 Dep 实例的 notify 方法中，只需要依次触发 subs 数组中的所有 Watcher 实例身上的 update 方法即可，也就是发布订阅模式中的派发更新操作：

```js
class Dep {
  constructor() {
    ...
    this.subs = []
    ...
  }
  ...
  // 发出更新通知
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
  ...
}
```

在各个 Watcher 的 update 方法中，则需要更新内部保存的信息，并触发依赖的回调：

```js
class Watcher{ 
    constructor (vm, expr, cb){
        this.vm = vm;	    // 要实现响应式的对象
        this.expr = expr;	// 依赖属性的访问路径
        this.cb = cb;	    // 依赖的回调
        this.value = this.get() // 访问目标属性以触发getter从而发起依赖收集流程
    }
    update () {
      const oldValue = this.value
      this.value = parsePath(this.vm, this.expr)
      // 调用依赖回调cb，这里借助call方法，将新值和旧值都传过去
      this.cb.call(this.vm, this.value, oldValue)
    }
    ...
}

// 根据指定路径读取对象属性
function parsePath(obj, expression) {
  const segments = expression.split('.')
  for (let key of segments) {
    if (!obj) return
    obj = obj[key]
  }
  return obj
}
```

### 3. 存在的问题以及解决

考虑下面的场景：

如果按照 Vue 2.x 中的处理方法，对于两个嵌套的父子组件，首先渲染父组件时，会创建一个父组件的 Watcher 实例，渲染到子组件时，会再创建一个子组件的 Watcher 实例，当创建父组件的 Watcher 实例时，会将全局变量 Dep.target 指向当前 Watcher 实例，但在接下来创建子组件 Watcher 实例时，会将 Dep.target 指向子组件的 Watcher 实例，然后进行子组件的依赖收集，收集完成后会将 Dep.target 置为空，待完成子组件的渲染后，回到父组件中，继续父组件的依赖收集时，会发现 Dep.target 为空了，也就无法再走下去了。

为了解决这一问题，Vue 中采用的方案是：用一个**栈结构**来保存 Watcher 实例 --- `targetStack`。

所以我们需要在 Watcher 类中进行一些修改：

```js
class Watcher{ 
    constructor (vm, expr, cb){
        this.vm = vm;	    // 要实现响应式的对象
        this.expr = expr;	// 依赖属性的访问路径
        this.cb = cb;	    // 依赖的回调
        this.value = this.get() // 访问目标属性以触发getter从而发起依赖收集流程
    }
    
    update () {
      ...
    }
    get () {
      pushTarget(this)	// 将 Dep.target 指向当前实例
      const value = parsePath(this.vm, this.expr) // 读取依赖的属性，触发对应属性的getter
      popTarget() // 依赖收集完毕后，需要将全局变量 Dep.target 重置
      return value
    }
    addDep () {
        ...
    }
}

// 根据指定路径读取对象属性
function parsePath(obj, expression) {
  const segments = expression.split('.')
  for (let key of segments) {
    if (!obj) return
    obj = obj[key]
  }
  return obj
}
        
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
```

这样就解决了这个问题，然后下面把代码合并一下，方便阅读。

### 4. 最终demo

这里的数据拦截相关的代码在上一节中有详细的介绍 --- [Vue 数据拦截]()

```js
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
  constructor (value) {
      ...
      def(value, '__ob__', this)
      this.walk(value)
  }
  // 遍历下一层属性，执行defineReactive
  walk (obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
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
  // 对当前属性的下一层属性进行劫持
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
      // 触发依赖
      observe(newValue)
      dep.notify()
    }
  })
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

有一点需要注意 --- **依赖属性的嵌套**

假设现在有一个地方使用到了一个对象 obj 的一个属性 obj.a.b.c，那么根据我们上面的分析，此时会为其新建一个 Watcher 实例：

```js
let test = {
    a: {
        b: {
            c: 111
        }
    }
}

observer(test)

const watcher = new Watcher(test, 'a.b.c', (newVal, oldVal) => {
    console.log(`obj发生了变化！newVal: ${newVal}---oldVal: ${oldVal}`)
})
```

那么有一个问题，我们知道此时 watcher 依赖的是 `test.a.b.c`，但此时 watcher 是否也同时依赖了 test 中的 `test.a.b`、`test.a` 这两个属性？或者说，`test.a.b`、`test.a` 这两个属性的 dep 身上的 subs 数组中是否有 watcher？

单纯考虑这种情况的话，如果我们此时改变了 `test.a.b` 的值，那么我们传入的回调函数理应触发，问题就在于，如何触发？为什么会触发？

从实现的角度分析，在创建 Watcher 实例时，会调用 get 方法，然后根据访问路径去找依赖的属性：

```js
function parsePath(obj, expression) {
  const segments = expression.split('.')
  for (let key of segments) {
    if (!obj) return
    obj = obj[key]	// 关键就在这里！
  }
  return obj
}
```

在上面的例子中，这里的执行流程如下：

1. 函数局部变量 obj 初始时指向 test，segments 中的内容为 `['a', 'b', 'c']`，另外，此时的 Dep.target 始终指向 watcher！
2. 第一次循环，执行至 `obj = obj[key]` 时，**读取 `obj.a` 的值**，触发其的 getter，调用 a 属性的 dep 的 depend 方法，收集依赖，将 Dep.target 也就是 watcher 添加到 a 属性的 dep 的 subs 数组中。
3. 第二次循环，执行至 `obj = obj[key]` 时，**读取 `obj.a.b` 的值**，触发其的 getter，调用 b 属性的 dep 的 depend 方法，收集依赖，将 Dep.target 也就是 watcher 添加到 b 属性的 dep 的 subs 数组中。
4. 第三次循环，执行至 `obj = obj[key]` 时，**读取 `obj.a.b.c` 的值**，触发其的 getter，调用 c 属性的 dep 的 depend 方法，收集依赖，将 Dep.target 也就是 watcher 添加到 c 属性的 dep 的 subs 数组中。

这样，无论我们修改 a 属性还是 b 属性，抑或是 test 本身的值，都会触发更新，进而去通知 watcher 指向回调！

所以，当**依赖某一嵌套属性时，也会依赖与该属性相关的每一项属性**！



### 5. 遗留的问题

1. **数组的处理** --- Vue 针对 Object 类型和 Array 类型有不同的实现，目前我们还没涉及到数组的处理
2. 目前的 demo 仅仅做到了数据劫持、依赖收集以及依赖触发，但触发依赖后**页面的重新渲染**是做不到的。