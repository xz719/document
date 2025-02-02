let arr = [1, 2, [3, 4], { n: 1 }]; // 多层级数组，其内部还包裹了对象

let obj = { a: 1, b: 2, c: { d: 3, e: [1, 2] } };   // 多层级对象，对象内部包裹数组或对象

/**
 * 理解浅拷贝
 */
let arr1 = [...arr]     // 运用扩展运算符拷贝数组

console.log(arr === arr1)   // 输出为 false，说明它们的引用地址不同

// 改动原数组，新数组不被影响
arr[0] = 0
console.log(arr1)

// 但是，数组内部包裹的数组、对象仍然都使用的是同一个引用，说明仍然为浅拷贝！
console.log(arr[2] === arr1[2])
console.log(arr[3] === arr1[3])

// 修改原数组中对象的某一属性，新数组也受到了影响！
arr[3].n = 3
console.log(arr1)

/**
 * 所以，浅拷贝虽然复制出了一个新的数组，但是其实际上只拷贝了一层，即，当数组的元素为引用数据类型时，浅拷贝只拷贝了地址，通过原数组改动这个地址指向的数组，新数组同样也会发生变化。
 * 
 * 另外，单纯的赋值操作不属于深浅拷贝讨论范围内，其仅仅是传递引用地址而已！
 */

// -----------------------------------------------------------

/**
 * 理解深拷贝
 */
let arr1Deep = JSON.parse(JSON.stringify(arr))  // 通过数组转字符串再转数组的方式进行了深拷贝

console.log(arr === arr1Deep)
console.log(arr[2] === arr1Deep[2])

// 可以看到，深拷贝中，不仅最外层的引用地址不同，其内部的数组的引用地址也不同！

// 修改原数组中对象的某一属性，新数组不受影响！
arr[3].n = 5
console.log(arr1Deep)

/**
 * 所以，深拷贝是每一个层级都在堆内存中开辟了新的空间，是拷贝了一个全新的数组或对象，不会受原数组或原对象的影响。
 */