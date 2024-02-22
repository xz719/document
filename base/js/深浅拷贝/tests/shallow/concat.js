/**
 * 利用数组的 concat 方法实现首层浅拷贝
 */
const testArr = [1, 2, [3, 4, 5, {a: 1}], {b: 2, c: 3, d: [6, 7, 8]}]  // 多层数组
const cloneTest = testArr.concat()    // 利用 concat 拷贝原数组

console.log(testArr === cloneTest)    // 引用地址不同，说明拷贝了首层

// 仅修改首层的数据，新数组不受影响
testArr[0] = 3
console.log(cloneTest)

// 修改更深层的数据时，新数组会被影响！
testArr[2][2] = 9
testArr[2][3].a = 3
testArr[3].c = 10
console.log(cloneTest)

// 以上的测试充分说明了，concat 方法只能实现数组首层的浅拷贝