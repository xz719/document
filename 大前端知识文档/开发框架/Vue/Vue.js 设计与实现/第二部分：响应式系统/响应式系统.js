
/**
 * 响应式系统
 */
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

// 原始数据
const data = { text: "hello" };
// 对原始数据的代理
const obj = new Proxy(data, {
  get(target, key) {
    // 调用 trace 函数
    trace(target, key);
    return target[key];
  },
  set(target, key, newVal) {
    // 设置属性值
    target[key] = newVal;
    trigger(target, key);
  },
});
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
function trigger(target, key) {
  // 取出当前字段对应副作用函数并执行
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);

  const effectsToRun = new Set();
  effects &&
    effects.forEach((effectFn) => {
      // 如果 trigger 当前触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发执行
      if (effectFn != activeEffect) {
        effectsToRun.add(effectFn);
      }
    });
  effectsToRun.forEach((effectFn) => {
    // 如果副作用函数存在调度器函数，则调用该调度器并将副作用函数传递，否则直接执行副作用函数
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn);
    } else {
      effectFn();
    }
  });
}


// --------------------------------------------------

/**
 * 计算属性 computed
 */
function computed(getter) {
  // 缓存上次计算结果
  let value;
  // 标识，是否需要重新计算
  let dirty = true;

  // 将 getter 作为副作用函数，创建一个懒执行的 effect
  const effectFn = effect(getter, {
    lazy: true,
    // 调度器，当依赖的值变化时将 dirty 置为 true
    scheduler() {
      dirty = true;
      // 依赖的值发生变化，意味着计算属性也会变化，触发依赖重新执行
      trigger(obj, "value");
    },
  });

  const obj = {
    // 访问器属性 value
    get value() {
      if (dirty) {
        // 重新计算并将标识重置
        value = effectFn();
        dirty = false;
      }
      // 读取计算属性时，收集依赖
      trace(obj, "value");
      return value;
    },
  };

  return obj;
}


/**
 * watch 实现
 */
function watch(source, cb, options) {
  // 定义 getter
  let getter;

  if (typeof source === "function") {
    // 如果第一个参数是函数，则将其直接赋值给 getter
    getter = source;
  } else {
    // 否则，仍然递归读取目标
    getter = () => traverse(source);
  }
  // 定义新值与旧值
  let oldValue, newValue;

  // 将执行回调的逻辑封装为一个单独的 job 函数
  const job = () => {
    // 数据变化时，重新执行副作用函数，得到的是新值
    newValue = effectFn();
    // 数据变化时，执行回调函数，传递新值旧值
    cb(newValue, oldValue);
    // 传递完成后，这一次的新值就成了下一次的旧值
    oldValue = newValue;
  };

  const effectFn = effect(
    // 执行 getter
    () => getter(),
    {
      lazy: true,
      scheduler: job,
    }
  );

  if (options.immediate) {
    // 当开启 immediate 选项，立即执行 job，执行回调函数
    job();
  } else {
    // 手动执行，第一次读取，获取到的是旧值
    oldValue = effectFn();
  }
}
function traverse(value, seen = new Set()) {
  // 如果目标是原始值，或者已经读取过了，则什么都不做
  if (typeof value !== "object" || value === null || seen.has(value)) return;
  // 将读取过的数据加入到 seen 集合中
  seen.add(value);
  // 暂时不考虑数组等其他数据结构
  // 当 value 是一个对象时，用 for in 遍历其所有属性，递归地调用 traverse 进行处理
  for (const key in value) {
    if (Object.hasOwnProperty.call(value, key)) {
      traverse(value[key], seen);
    }
  }

  return value;
}
