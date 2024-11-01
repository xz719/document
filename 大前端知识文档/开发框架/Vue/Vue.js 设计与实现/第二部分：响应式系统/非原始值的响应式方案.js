// 全局变量 activeEffect 用于存放当前通过 effect 注册的副作用函数
let activeEffect;

// 副作用函数栈
const effectStack = [];
// register effect 注册副作用函数方法
function effect(fn, options) {
  const effectFn = () => {
    // 调用 cleanup 清理相关联依赖集合中的副作用函数
    cleanup(effectFn);
    // 存放当前注册的副作用函数，并在执行前将其压入栈中，此时 activeEffect 指向栈顶
    activeEffect = effectFn;
    effectStack.push(effectFn);
    // 执行副作用函数，并存储其返回值
    const res = fn();
    // 执行完毕后，将副作用函数弹出，将 activeEffect 重新指向栈顶
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    // 将副作用函数的返回值传出去
    return res;
  };
  // 将 options 挂载到 effectFn 身上便于后续使用
  effectFn.options = options;
  // effectFn.deps 用于存放相关联的依赖集合，它是一个数组，每一项都是一个依赖集合 Set
  effectFn.deps = [];
  if (!options.lazy) {
    // 未开启懒执行，立即执行 effectFn
    effectFn();
  }
  // 否则将包装后的副作用函数 effectFn 返回
  return effectFn;
}
// cleanup
function cleanup(effectFn) {
  // 遍历 effectFn.deps 清除所有 effectFn
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }
  // 重置 effectFn.deps 数组
  effectFn.deps.length = 0;
}

// 桶
const bucket = new WeakMap();

// trace 方法，追踪变化
function trace(target, key) {
  // 如果没有 activeEffect 直接返回值
  if (!activeEffect) return target[key];
  // 否则，根据 target 从 bucket 中取出 depsMap，它是一个 map 结构
  let depsMap = bucket.get(target);
  // 如果不存在，则新建一个
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  // 根据 key 从 depsMap 中取出 deps，它是一个 Set 结构
  let deps = depsMap.get(key);
  // 如果没有，则新建一个
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  // 将副作用函数添加到 deps 中
  deps.add(activeEffect);

  // 添加副作用函数时，将依赖集合 deps 添加到 activeEffect.deps 中
  activeEffect.deps.push(deps);
}
// trigger 方法，触发响应
function trigger(target, key, type) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  // 取得与 key 相关联的副作用函数
  const effects = depsMap.get(key);

  // 将要执行的副作用函数加入到 effectsToRun 中，而不是直接操作 effects，避免无限循环
  const effectsToRun = new Set();

  // 将与 key 相关联的副作用函数加入
  effects &&
    effects.forEach((effectFn) => {
      // 如果 trigger 当前触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发执行
      if (effectFn != activeEffect) {
        effectsToRun.add(effectFn);
      }
    });

  // 当操作类型为 ADD 或 DELETE 时，才触发与 ITERATE_KEY 相关联的副作用函数
  if (type === "ADD" || type === "DELETE") {
    // 取得与 ITERATE_KEY 相关联的副作用函数
    const iterateEffects = depsMap.get(ITERATE_KEY);
    // 将与 ITERATE_KEY 相关联的副作用函数加入
    iterateEffects &&
      iterateEffects.forEach((effectFn) => {
        // 如果 trigger 当前触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发执行
        if (effectFn != activeEffect) {
          effectsToRun.add(effectFn);
        }
      });
  }

  effectsToRun.forEach((effectFn) => {
    // 如果副作用函数存在调度器函数，则调用该调度器并将副作用函数传递，否则直接执行副作用函数
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn);
    } else {
      effectFn();
    }
  });
}

/**
 * 创建响应式数据
 */
const ITERATE_KEY = Symbol();
/**
 * 用于创建响应式数据的方法
 * @param {*} obj 原始数据
 * @param {*} isShallow 是否浅响应，默认为 false
 * @param {*} isReadonly 是否只读，默认为 false
 * @returns
 */
function createReactive(obj, isShallow = false, isReadonly = false) {
  return new Proxy(obj, {
    /**
     * 拦截对属性的读取
     * @param {*} target 拦截目标
     * @param {*} key 拦截属性名
     * @param {*} receiver Reflect 中的 receiver 参数，用于处理访问器属性的特殊情况
     * @returns
     */
    get(target, key, receiver) {
      // 代理对象可以通过 raw 属性访问原始数据
      if (key === "raw") {
        return target;
      }

      // 对于非只读数据，调用 trace 函数建立响应式联系
      if (!isReadonly) {
        trace(target, key);
      }

      // 得到原始值结果
      const res = Reflect.get(target, key, receiver);

      // 如果是浅响应，则直接返回结果
      if (isShallow) {
        return res;
      }
      // 对于对象类型的结果，需要将其进行包装
      if (typeof res === "object" && res !== null) {
        // 如果数据的只读的，则需要将原始值结果进行只读包装，否则将其包装为深响应数据
        return isReadonly ? readonly(res) : reactive(res);
      }
    },
    /**
     * 拦截 in 操作符
     * @param {*} target 拦截目标
     * @param {*} key 拦截属性名
     * @returns
     */
    has(target, key) {
      // 调用 trace 函数建立响应式联系
      trace(target, key);
      // 返回操作结果
      return Reflect.has(target, key);
    },
    /**
     * 拦截 ownKeys 操作，间接拦截 for...in 循环
     * @param {*} target 拦截目标
     * @returns
     */
    ownKeys(target) {
      // 将副作用函数与 ITERATE_KEY 关联
      trace(target, ITERATE_KEY);
      // 返回操作结果
      return Reflect.ownKeys(target);
    },
    /**
     * 拦截设置、添加新属性操作
     * @param {*} target 拦截目标
     * @param {*} key 拦截属性
     * @param {*} newVal 新值
     * @param {*} receiver Reflect 中的 receiver 参数
     * @returns
     */
    set(target, key, newVal, receiver) {
      // 如果是只读数据，则发出警告并返回
      if (isReadonly) {
        console.log(`属性${key}是只读的`);
        return true;
      }

      // 获取旧值
      const oldValue = target[key];

      // 如果属性不存在，说明是在添加属性，否则是设置已有属性
      const type = Object.prototype.hasOwnProperty.call(target, key)
        ? "SET"
        : "ADD";

      // 设置属性值
      const res = Reflect.set(target, key, newVal, receiver);

      if (target === receiver.raw) {
        // 当 receiver 是 target 的代理对象时，说明触发响应的是对象本身属性而不是从原型继承而来的属性
        if (
          newVal !== oldValue &&
          (newVal === newVal || oldValue === oldValue)
        ) {
          // 当值发生变化且变化前后均不为 NaN 时，触发依赖集合，传递操作类型
          trigger(target, key, type);
        }
      }

      return res;
    },
    /**
     * 拦截属性删除操作
     * @param {*} target 拦截目标
     * @param {*} key 拦截属性
     * @returns
     */
    deleteProperty(target, key) {
      // 如果是只读数据，则发出警告并返回
      if (isReadonly) {
        console.log(`属性${key}是只读的`);
        return true;
      }

      // 检查被操作属性是否是对象自己的属性
      const hadKey = Object.prototype.hasOwnProperty(target, key);

      // 删除属性
      const res = Reflect.deleteProperty(target, key);

      // 只有当被删除的属性是自己的属性且删除成功时，触发依赖集合，并传递操作类型为 DELETE
      if (hadKey && res) {
        trigger(target, key, "DELETE");
      }

      return res;
    },
  });
}

// reactive 方法，用于创建深响应数据
function reactive(obj) {
  return createReactive(obj);
}

// shallowReactive 方法，用于创建浅响应数据
function shallowReactive(obj) {
  return createReactive(obj, true);
}

// readonly 方法，用于创建只读数据
function readonly(obj) {
  return createReactive(obj, false, true);
}

// shallowReadonly 方法，用于创建浅只读数据
function shallowReadonly(obj) {
  return createReactive(obj, true /* shallow */, true);
}
