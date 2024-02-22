/**
 * 利用 JSON parse stringify 实现深拷贝
 */

// 1. 数组的深拷贝
const testArr = [1, 2, [3, 4, 5, { a: 1 }], { b: 2, c: 3, d: [6, 7, 8] }]; // 多层数组
const cloneArr = JSON.parse(JSON.stringify(testArr)); // 利用 JSON parse stringify 拷贝原数组

// 新旧数组的引用地址不同
console.log(testArr === cloneArr);

// 仅修改首层的数据，新数组不受影响
testArr[0] = 3;
console.log(cloneArr);

// 修改更深层的数据时，新数组同样不会被影响！
testArr[2][2] = 9;
testArr[2][3].a = 3;
testArr[3].c = 10;
console.log(cloneArr);

// 2. 对象的深拷贝
let srcObj = {
  name: "aaa",
  grade: { chi: 80, eng: 100 },
  prizes: ["11", "22", "33"],
}; // 多层复合对象
let cloneObj = JSON.parse(JSON.stringify(srcObj)); // 利用 Object.assign 拷贝原对象

// 新旧对象的引用地址不同
console.log(srcObj === cloneObj);

// 仅修改首层的数据，新对象不受影响
srcObj.name = "abc";
console.log(cloneObj);

// 修改更深层的数据时，新对象同样不会被影响！
srcObj.grade.chi = 60;
console.log(cloneObj);
