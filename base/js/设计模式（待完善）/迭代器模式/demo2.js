// ================= 2. 外部迭代器
// 外部迭代器必须【显式地】请求迭代下一个元素

// 外部迭代器增加了一些调用的复杂度，但相对的也增强了迭代器的灵活性，我们可以手动控制迭代的过程或者顺序。这里仍然以一个对象迭代器为例

/* 
    外部迭代器，可以看到，外部迭代器显式地向外部暴露了：

        * 判断迭代是否已完成的方法
        * 进行下一轮迭代的方法
        * 获取当前迭代数据的方法
*/
let Iterator = function (obj) {
  // 当前key的索引
  let cur = 0;
  // 对象key集合
  let keys = Object.keys(obj);

  // 迭代是否已完成
  let isDone = function () {
    return cur >= keys.length;
  };

  // 进行下一轮迭代
  let next = function () {
    cur += 1;
  };

  // 获取当前迭代的key
  let getCurKey = function () {
    return keys[cur];
  };

  // 获取当前迭代的属性值
  let getCurAttr = function () {
    return obj[keys[cur]];
  };

  return {
    next,
    isDone,
    getCurKey,
    getCurAttr,
  };
};

// 下面就可以编写业务逻辑了，仍然以比较两个对象是否相同为例
let compareObj = function (obj1, obj2) {
  try {
    // 首先比较对象的key数量
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      throw new Error("obj1与obj2不相等！对象key数量不同");
    }

    let iterator1 = Iterator(obj1);

    // 用while循环来进行迭代
    while (!iterator1.isDone()) {
      // 同样首先比较key
      if (!(iterator1.getCurKey() in obj2)) {
        throw new Error("obj1与obj2不相等！对象key名称不同");
      }

      // 接下来比较相同key的属性值是否相同
      if (iterator1.getCurAttr() !== obj2[iterator1.getCurKey()]) {
        throw new Error("obj1与obj2不相等！对象相同key的值不同")
      }

      // 【显式地请求迭代下一个元素】---------------------------- 外部迭代器的特征
      iterator1.next()
    }

    console.log("obj1与obj2相等！")
  } catch (error) {
    console.log(error.message);
  }
};

/* 
  测试-------------------
*/
compareObj({a: 1, b: 2, c:3}, {a: 1, c: 3})           // obj1与obj2不相等！对象key数量不同
compareObj({a: 1, b: 2, c:3}, {a: 1, b: 2, c: 4})     // obj1与obj2不相等！对象相同key的值不同
compareObj({a: 1, b: 2, c:3}, {a: 1, b: 2, d: 3})     // obj1与obj2不相等！对象key名称不同
compareObj({a: 1, y: 2, c:3}, {a: 1, b: 2, c: 3})     // obj1与obj2不相等！对象key名称不同
compareObj({a: 1, b: 2, c:3}, {a: 1, b: 2, c: 3})     // obj1与obj2不相等！
