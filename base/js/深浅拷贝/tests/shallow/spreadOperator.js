/**
 * 利用扩展运算符 ... 实现首层浅拷贝
 */
let srcObj = {
  name: "aaa",
  grade: { chi: 80, eng: 100 },
  prizes: ["11", "22", "33"],
}; // 多层复合对象
let cloneObj = {...srcObj}; // 利用 Object.assign 拷贝原对象

console.log(srcObj === cloneObj);

// 仅修改首层的数据，新对象不受影响
srcObj.name = "abc";
console.log(cloneObj);

// 修改更深层的数据时，新对象会被影响！
srcObj.grade.chi = 60;
console.log(cloneObj);

// 以上的测试充分说明了，扩展运算符只能实现复合对象首层的浅拷贝
