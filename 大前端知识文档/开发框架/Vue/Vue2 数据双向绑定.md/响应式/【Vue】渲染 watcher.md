## Vue 响应式 --- 渲染 watcher

前三节内容：

[Vue 数据劫持](https://blog.csdn.net/cannotbecounted/article/details/134953155)

[Vue 响应式初步](https://blog.csdn.net/cannotbecounted/article/details/134953314)

[Vue 响应式中数组的特殊处理](https://blog.csdn.net/cannotbecounted/article/details/135246339)

在第二节中，我们简单了解了 watcher 类，当时我们说到，其一般用在**渲染函数、计算属性以及侦听属性**中，其一般用于在数据发生变化时接收通知，并给出相应的行为。

在前面的 demo 中，我们也实现了一个简单的 watcher 类，这个类更类似于 Vue 1.x 版本中 `$watch` ，它们都是需要传入要监听的属性、回调函数...等等，然后在依赖发生变化时，执行回调函数。

而在这一节，我们要学习的是**渲染 watcher**，其不需要传入监听的属性，而是接收一个**渲染函数**，当依赖发生变化时，执行渲染函数。

### 1. 修改 watcher 类

由于渲染 watcher 中，接收的是需要实现响应式的对象以及一个渲染函数，所以，我们需要对 watcher 类的构造函数进行修改：

```js
// watcher 类
class Watcher {
    // 此时第二个参数可能为依赖属性的路径字符串，也可能为一个渲染函数
    constructor(data, expOrFn, cb) {
        this.data = data;	    // 要实现响应式的对象
        if (typeof expOrFn === 'function') {
            // 传入的是一个渲染函数
            this.getter = expOrFn
        } else {
            // 传入的是依赖属性的访问路径，通过工具函数处理，得到一个取值函数
            this.getter = parsePath(expOrFn)
        }
        this.cb = cb;	    // 依赖的回调
        this.value = this.get() // 访问目标属性以触发getter从而发起依赖收集流程
    }
    ...
}
```

同时对工具函数 parsePath 进行修改，保证 `this.getter` 是一个函数：

```js
// 工具函数，返回一个用于根据指定访问路径，取出某一对象下的指定属性的函数
function parsePath(expression) {
  const segments = expression.split('.')
  return function (obj) {
    for (let key of segments) {
      if (!obj) return
      obj = obj[key]
    }
    return obj
  }
}
```

由于工具函数修改了，需要对原来的 `get` 方法和 `update` 方法进行修改：

```js
// Watcher 类
class Watcher {
    ...
  // 访问当前实例依赖的属性，并将自身加入响应式对象的依赖中
  get() {
    pushTarget(this);
    // 注意，当 getter 为渲染函数时，是没有返回值的，即 value 为 undefined
    const value = this.getter.call(this.data, this.data);
    popTarget();
    return value;
  }

  // 收到更新通知后，进行更新，并触发依赖回调
  update() {
    // 原本的逻辑是，先将旧值存下来，然后通过工具函数去取新值，然后再触发回调函数。
    // const oldValue = this.value;
    // this.value = parsePath(this.data, this.expression);
    // this.cb.call(this.data, this.value, oldValue);

    // 现在需要先通过 get 方法获取新值，且这个值可能是 undefined
    const newValue = this.get();
    /* 
        只有当:
          1. 新值与当前 watcher 实例中存放的旧值 this.value 不等时
          2. 该值为对象类型时
        才触发回调函数。

        当传入的是一个渲染函数时，newValue 是 undefined，this.value 也是 undefined，自然不会进入下面的逻辑

        那么对于渲染 watcher，在哪里触发更新呢？

        实际上，在前面重新执行 get 方法的时候，就会通过 this.getter.call 完成渲染函数的调用！
    */
    if (newValue !== this.value || isObject(newValue)) {
      const oldValue = this.value;
      this.value = newValue;
      this.cb.call(this.data, this.value, oldValue);
    }
  }
}

// 工具函数，判断一个值是否是对象
function isObject(target) {
  return typeof target === "object" && target !== null;
}
```

这里有一个问题：为什么在 `update` 方法中，不直接使用 `this.getter.call(this.data, this.data)` 来**访问依赖属性获取新值**或者**重新调用渲染函数**呢？

看起来，使用 `this.getter.call(this.data, this.data)` 和重新执行 `get` 方法的区别并不大，但实际上涉及到了**依赖的重新收集**。

但我们先把这个问题放到一边，先来考虑另一个问题：**依赖的重复收集**



### 2. 解决依赖重复收集的问题

考虑下面的场景：

```vue
<template>
	<div>
        第一次依赖数据: {{ target }}
        第二次依赖数据：{{ target }}
    </div>
</template>

<script>
	export default {
        name: 'xxx',
        data() {
            return {
                target: 'xxxxxxx'
            }
        }
    }
</script>

```

在渲染模板时，由于我们在模板中使用了两次 `target` ，那么在解析模板时，会读取两次 `target` 的值，即触发两次我们为其定义的 getter ，进而触发依赖收集即 `dep.depend()` 

```js
// 依赖收集
depend() {
    if (Dep.target) {
        this.addSub(Dep.target);
    }
}
```

而此时的 `Dep.target` 始终为我们的渲染 watcher，

所以渲染 watcher 会被收集两次！这样，在 `target` 发生更新时，就会调用两次渲染 watcher 中的渲染函数，即重新渲染两次，这样显然是不对的。

为了解决这一问题，Vue 中采用了下面的方式来避免重复收集依赖：

1. 首先为每一个 dep 实例添加一个`id`

   ```js
   // 准备一个全局变量用于为dep实例添加id
   let uuid = 0
   
   // Dep 类
   class Dep {
     constructor() {
       this.subs = [];
       this.id = uuid++    // 为每一dep实例加上唯一标识id
     }
     ...
   }
   ```

2. 接下来修改 watcher，先准备4个属性：

   * `deps` --- 上次取值时，已经收集过该 watcher 的 dep 实例
   * `depIds` --- 上次取值时，已经收集过该 watcher 的 dep 实例的 id 集合
   * `newDeps` --- 本次取值时，需要收集该 watcher 的 dep 实例
   * `newDepIds` --- 本次取值时，需要收集该 watcher 的 dep 实例的 id 集合

   ```js
   // Watcher 类
   class Watcher {
     // 此时第二个参数可能为依赖属性的路径字符串，也可能为一个渲染函数
     constructor(data, expOrFn, cb) {
   
       this.deps = []; // 上次取值时，已经收集过该watcher的dep实例
       this.depIds = new Set(); // 上次取值时，已经收集过该watcher的dep实例的id集合
       this.newDeps = []; // 本次取值时，需要收集该watcher的dep实例
       this.newDepIds = new Set(); // 本次取值时，需要收集该watcher的dep实例的id集合
   
       ...
     }
     ...
   }
   ```

   整体的思路是：**触发依赖收集后，在 watcher 中判断自身是否已经被该数据的 dep 实例收集过，如果已经被收集过，则不再重复收集**。

   首先需要修改 Dep 类的 `depend` 方法，因为此时是否收集依赖已经不再由 dep 实例决定，而是**由当前 `Dep.target` 指向的 watcher 实例自身来决定**：

   ```js
   // Dep 类
   class Dep {
     ...
     // 依赖收集
     depend() {
       if (Dep.target) {
         // 调用Dep.target指向的watcher实例身上的方法，让watcher实例自己决定是否订阅该dep实例
         Dep.target.addDep(this)
       }
     }
     ...
   }
   ```

   然后需要在 Watcher 类中添加一个方法：

   ```js
   // Watcher 类
   class Watcher {
       ...
       // 决定是否订阅某一dep实例
       addDep(dep) {
           const id = dep.id
           // 本次取值过程中，处理过当前dep实例，则进入
           if (!this.newDepIds.has(id)) {
               this.newDeps.push(dep)
               this.newDepIds.add(id)
               // 若上次取值时，没有订阅过该dep实例，则订阅该dep实例
               if (!this.depIds.has(id)) {
                   dep.addSub(this)
               }
           }
       }
   }
   ```

3. 最后，需要在完成取值后，交换 `deps、depIds` 与 `newDeps、newDepIds` 的内容，并清空 `newDeps、newDepIds`：

   ```js
   // Watcher 类
   class Watcher {
     ...
   
     // 访问当前实例依赖的属性，并将自身加入响应式对象的依赖中
     get() {
       pushTarget(this);
       // 注意，当 getter 为渲染函数时，是没有返回值的，即 value 为 undefined
       const value = this.getter.call(this.data, this.data);
       popTarget();
       // 完成取值后，更新内容
       this.clearUpDeps()
       return value;
     }
   
     ...
   
     // 交换deps、depIds与newDeps、newDepIds的内容，并清空newDeps、newDepIds
     cleanUpDeps() {
       // 交换depIds和newDepIds
       let tmp = this.depIds
       this.depIds = this.newDepIds
       this.newDepIds = tmp
       // 清空newDepIds
       this.newDepIds.clear()
       // 交换deps和newDeps
       tmp = this.deps
       this.deps = this.newDeps
       this.newDeps = tmp
       // 清空newDeps
       this.newDeps.length = 0
     }
   }
   ```



为什么这样做能够防止依赖的重复收集？

> 1. `newDeps`和`newDepIds`用来在一次解析模板过程中避免重复依赖，比如：`{{ name }} -- {{ name }}`
> 2. `deps`和`depIds`用来再重新渲染的取值过程中避免重复依赖

先来看第一点，首先数据 `name` 对应一个 dep 实例，接下来在解析模板时，会创建一个渲染 watcher 实例，执行一次 get() 方法，然后渲染函数内部读取两次 `name` 的值：

第一次时，取值，触发 getter ，进而触发依赖收集 `dep.depend()` ，此时的 `Dep.target` 指向渲染 watcher，执行 watcher 实例身上的方法 `addDep()`，此时，watcher 身上的 `newDepIds` 是空的，所以会处理该 dep 实例，将其加入 `newDeps`，并将其`id`加入 `newDepIds` 中，且此时 `depIds` 必然为空，所以会订阅该 dep 实例(执行 `dep.addSub()`)。

到第二次取值时，由于仍然为 `name` ，其对应的 dep 实例并没有变化，重复上述流程直到执行渲染 watcher 身上的 `addDep()` 方法时，此时，watcher 身上的 `newDepIds` 中已经收集到了这个 Dep 实例的 `id`，所以不会再进行处理！

这就是所谓**在一次解析模板的过程中，避免重复依赖**。

再来看第二点，当 name 发生变化时，此时，前面的依赖收集已经完成，即 watcher 中已经执行完一次 `get()` 方法，也执行了一次 `cleanUpDeps()` ，所以，此时的 `deps` 和 `depIds` 中，并不是空的，而是存放有上一次解析模板取值时收集过渲染 watcher 的 dep 实例，所以，在本次重新取值时，name 对应的 dep 实例不变，即不会进入最后一个 if 判断中，也就不会重复订阅(执行 `dep.addSub()`)

也就是**在重新渲染时，避免重复依赖**。

重复依赖的问题解决了，但不要忘记，我们还有一个遗留的的问题没有解决。



### 3. 依赖的重新收集

前面在修改 Watcher 类时，我们提到过，为什么在 `update` 方法中，不直接使用 `this.getter.call(this.data, this.data)` 来**访问依赖属性获取新值**或者**重新调用渲染函数**呢？

前面也说过，这里实际上涉及到了依赖的重新收集，依赖的重新收集是必要的，如果我们在模板中使用了  `v-if` 等指令，那么可能在重新渲染时，模板中依赖的数据也会发生变化，此时就需要重新收集依赖了。

重新收集依赖实际上包括了两个方面：

1. 收集新的依赖
2. 删除无效的依赖

关于第一方面，首先我们进行依赖收集的前提条件就是 `Dep.target` 的指向不为空，当 `Dep.target` 指向为空时，是不会执行 `dep.depend()` 方法的。而纵观整个demo，只有在 watcher 的 `get()` 方法中，我们会调用 `pushTarget()` 方法，将 `Dep.target` 指向自身，并在完成取值后，将 `Dep.target` 指向复原。而在仅考虑渲染 watcher 的情况下，这实际上就意味着只有在 `get()` 方法执行期间，`Dep.target` 的指向才不为空！

所以，这就是为什么我们在 `update` 方法中，需要调用 `get()` 方法，其目的就在于使得依赖的重新收集得以进行。

至于第二方面，我们可以在 Dep 类身上添加一个方法：

```js
// Dep 类
class Dep {
  ...
  // 清除无用订阅
  removeSub(sub) {
    remove(this.subs, sub)
  }
}

...

// 工具函数，用于删除数组中的指定元素
function remove(arr, item) {
  if (!arr.length) return
  const index = arr.indexOf(item)
  if (index > -1) {
    return arr.splice(index, 1)
  }
}
```

然后，在取值完毕后，更新 `deps、depIds、newDeps以及newDepIds` 时，将无用的依赖删除。

```js
// Watcher 类
class Watcher {
  ...

  // 交换deps、depIds与newDeps、newDepIds的内容，并清空newDeps、newDepIds
  cleanUpDeps() {
    // 删除无用的依赖
    let i = this.deps.length
    while (i--) {
        const dep = this.deps[i]
        if (!this.newDepIds.has(dep.id)) {
            dep.removeSub(this)
        }
    }
    // 交换depIds和newDepIds
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    // 清空newDepIds
    this.newDepIds.clear()
    // 交换deps和newDeps
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    // 清空newDeps
    this.newDeps.length = 0
  }
}
```



仓库地址：[github](https://github.com/xz719/vue-reactive/tree/master)

这一版中做了比较大的改动。

下一节中，我们会尝试实现一个能够看到实际效果的响应式系统。

