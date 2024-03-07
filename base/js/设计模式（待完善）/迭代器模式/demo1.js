// 迭代器模式是指提供一种方法用于顺序访问一个聚合对象中的各个元素，而又不必暴露该对象的内部表示

/*
    在大部分浏览器中，针对JS的数组、map以及对象类型的数据，都有可用的迭代方法，那么我们为什么还需要使用迭代器模式呢？

    因为迭代器模式的核心在于：
    
        迭代器模式可以将【迭代的过程】从【业务逻辑】中分离出来，在使用迭代器模式之后，即使不关心对象的内部构造，也可以按顺序访问其中的每个元素

    迭代器可以分为两类：

        1. 内部迭代器
        2. 外部迭代器
*/

// ================= 1. 内部迭代器
// 内部迭代器内部已经定义好了迭代原则，它完全接手整个迭代过程，外部只需要一次初始调用。这里以迭代对象和数组为例

// 迭代器函数
function each(target, callback) {
  let value;

  // 对于不同类型的数据，采用不同的迭代方式
  if (Array.isArray(target)) {
    for (let index = 0; index < target.length; index++) {
      value = callback.apply(target[index], [index, target[index]]);
      // 当回调函数返回false时，停止迭代
      if (value === false) {
        break;
      }
    }
  } else {
    for (const key in target) {
      value = callback.apply(target[key], [key, target[key]]);
      // 当回调函数返回false时，停止迭代
      if (value === false) {
        break;
      }
    }
  }
}

// 可以看到，内部迭代器的实现中，与业务逻辑没有任何关系，仅仅是进行纯粹的迭代

// 接下来，我们就可以实现业务逻辑，比如如下场景：比较两个对象是否完全相等
let compareObj = function(obj1, obj2) {
  try {
    // 首先比较对象的key数量
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      throw new Error("obj1与obj2不相等！对象key数量不同")
    }
    // 然后检查各key是否相同
    each(obj1, function(key, item) {
      // 首先检查key名称
      if (!(key in obj2)) {
        throw new Error("obj1与obj2不相等！对象key名称不同")
      }
      // 接下来检查某一key的值
      if (item !== obj2[key]) {
        throw new Error("obj1与obj2不相等！对象相同key的值不同")
      }
    })
    console.log("obj1与obj2相等！")
  } catch (error) {
    console.log(error.message)
  }
}

/* 
  测试-------------------
*/
compareObj({a: 1, b: 2, c:3}, {a: 1, c: 3})           // obj1与obj2不相等！对象key数量不同
compareObj({a: 1, b: 2, c:3}, {a: 1, b: 2, c: 4})     // obj1与obj2不相等！对象相同key的值不同
compareObj({a: 1, b: 2, c:3}, {a: 1, b: 2, d: 3})     // obj1与obj2不相等！对象key名称不同
compareObj({a: 1, y: 2, c:3}, {a: 1, b: 2, c: 3})     // obj1与obj2不相等！对象key名称不同
compareObj({a: 1, b: 2, c:3}, {a: 1, b: 2, c: 3})     // obj1与obj2不相等！