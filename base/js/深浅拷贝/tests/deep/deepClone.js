// 深拷贝函数
function deepClone(src) {
  // 1. 首先判断要进行拷贝的是数组还是对象，从而确定目标变量类型
  const target = src.constructor === Array ? [] : {};
  // 2. 遍历 src
  for (let key in src) {
    // 如果当前值是对象或数组，就递归一下
    if (
      src[key] &&
      (typeof src[key] === "object" || src[key].constructor === Array)
    ) {
      target[key] = deepClone(src[key]);
    } else {
      // 否则，对于非引用类型，直接赋值
      target[key] = src[key];
    }
  }

  return target;
}

// 测试一下
const srcObj = { a: "a", b: "b", c: [1, 2, 3], d: { dd: "dd" } };
const cloneObj = deepClone(srcObj);

console.log(srcObj === cloneObj);

// 仅修改首层的数据，新对象不受影响
srcObj.a = "abc";
console.log(cloneObj);

// 修改更深层的数据时，新对象同样不会被影响！
srcObj.c[2] = 60;
console.log(cloneObj);

// 再试试带有函数的复合对象
const srcObj1 = {
  name: "with func",
  sayHello: function () {
    console.log("Hello World");
  },
};
const cloneObj1 = deepClone(srcObj1);
console.log(cloneObj1)

// 尝试修改，新对象不受影响！
srcObj1.sayHello = 5
console.log(srcObj1)
console.log(cloneObj1)
