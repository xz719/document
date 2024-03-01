// demo.js
import { arrayPrototype, proxyPrototype } from "./public";
// observer 方法
function observer(value) {
  if (!isObject(value)) {
    return;
  }
  var ob;
  if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else {
    ob = new Observer(value);
  }
  return ob;
}

// Observer 类
export class Observer {
  constructor(value) {
    this.value = value;
    // 声明该数据对应的 dep 实例
    this.dep = new Dep();
    def(value, "__ob__", this);
    if (Array.isArray(value)) {
      // 如果是数组类型数据的话就特殊处理
      // 代理原型
      Object.setPrototypeOf(value, proxyPrototype);
      // 监听数组内容
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }
  // 遍历下一层属性，执行defineReactive
  walk(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i]);
    }
  }
  observeArray(arr) {
    // 对数组内部的对象类型数据进行监听
    arr.forEach((i) => observe(i));
  }
}

// def 方法，用于为当前正在拦截的数据添加 __ob__ 属性
function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  });
}

// 数据劫持
function defineReactive(data, key, value = data[key]) {
  const dep = new Dep();
  // 对当前属性的下一层属性进行劫持，并拿到当前数据对应的Observer实例
  let childOb = observe(value);
  // 对当前属性进行拦截
  Object.defineProperty(data, key, {
    get: function reactiveGetter() {
      // 收集依赖
      dep.depend();
      if (childOb) {
        childOb.dep.depend();
        // 新增
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value;
    },
    set: function reactiveSetter(newValue) {
      if (newValue === value) return;
      value = newValue;
      // 触发依赖，并更新Observer实例
      childOb = observe(newValue);
      dep.notify();
    },
  });
}

function dependArray(array) {
  for (let e of array) {
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

// 准备一个全局变量用于为dep实例添加id
let uuid = 0;

// Dep 类
class Dep {
  constructor() {
    this.subs = [];
    this.id = uuid++; // 为每一dep实例加上唯一标识id
  }
  // 依赖收集
  depend() {
    if (Dep.target) {
      // 调用Dep.target指向的watcher实例身上的方法，让watcher实例自己决定是否订阅该dep实例
      Dep.target.addDep(this);
    }
  }
  // 通知更新
  notify() {
    const subs = [...this.subs];
    subs.forEach((s) => s.update());
  }
  // 添加订阅
  addSub(sub) {
    this.subs.push(sub);
  }
  // 清除无用订阅
  removeSub(sub) {
    remove(this.subs, sub)
  }
}

// 全局变量 Dep.target
Dep.target = null;

// 用于暂存 Dep.target 指向的栈
const targetStack = [];

// 入栈
function pushTarget(_target) {
  targetStack.push(Dep.target); // 保存当前 Dep.target
  Dep.target = _target;
}

// 出栈
function popTarget() {
  Dep.target = targetStack.pop();
}

// Watcher 类
class Watcher {
  // 此时第二个参数可能为依赖属性的路径字符串，也可能为一个渲染函数
  constructor(data, expOrFn, cb) {

    this.deps = []; // 上次取值时，已经收集过该watcher的dep实例
    this.depIds = new Set(); // 上次取值时，已经收集过该watcher的dep实例的id集合
    this.newDeps = []; // 本次取值时，需要收集该watcher的dep实例
    this.newDepIds = new Set(); // 本次取值时，需要收集该watcher的dep实例的id集合

    this.data = data; // 要实现响应式的对象
    if (typeof expOrFn === "function") {
      // 传入的是一个渲染函数
      this.getter = expOrFn;
    } else {
      // 传入的是依赖属性的访问路径，通过工具函数处理，得到一个取值函数
      this.getter = parsePath(expOrFn);
    }
    this.cb = cb; // 依赖的回调
    this.value = this.get(); // 访问目标属性以触发getter从而发起依赖收集流程
  }

  // 访问当前实例依赖的属性，并将自身加入响应式对象的依赖中
  get() {
    pushTarget(this);
    // 注意，当 getter 为渲染函数时，是没有返回值的，即 value 为 undefined
    const value = this.getter.call(this.data, this.data);
    popTarget();
    this.clearUpDeps()
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

// 工具函数，返回一个用于根据指定访问路径，取出某一对象下的指定属性的函数
function parsePath(expression) {
  const segments = expression.split(".");
  return function (obj) {
    for (let key of segments) {
      if (!obj) return;
      obj = obj[key];
    }
    return obj;
  };
}

// 工具函数，判断一个值是否是对象
function isObject(target) {
  return typeof target === "object" && target !== null;
}

// 工具函数，用于删除数组中的指定元素
function remove(arr, item) {
  if (!arr.length) return
  const index = arr.indexOf(item)
  if (index > -1) {
    return arr.splice(index, 1)
  }
}
