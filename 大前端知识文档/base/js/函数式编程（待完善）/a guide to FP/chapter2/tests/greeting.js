// 打招呼
const hi = (name) => `Hi ${name}`

const greeting = (name) => hi(name)

console.log(hi)
console.log(hi('jonas'))

console.log(greeting)
console.log(greeting('times'))

/* 
 * 这里的 greeting 方法，仅仅是在 hi 方法的外部又嵌套了一层，然后接收相同的参数并调用 hi 方法
 * 
 * 这种操作的意义在哪呢？仅仅是为了延迟执行吗？
 * 
 * 这种糟糕的编程习惯会严重影响程序的可维护性，实际上，我们可以做下面的修改
 */

const greeting1 = hi

console.log(greeting1)
console.log(greeting1('times'))

