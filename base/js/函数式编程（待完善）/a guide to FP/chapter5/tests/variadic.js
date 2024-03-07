import { compose, reduce } from "../../support";

// 这是我们前面使用的第一个例子
const toUpperCase = (x) => x.toUpperCase()
const exclaim = (x) => `${x}!`

const shout = compose(exclaim, toUpperCase)

// 这是第二个例子
const head = (x) => x[0]
const reverse = reduce((acc, x) => [x, ...acc], [])
const last = compose(head, reverse)

/**
 * 在前面的例子中，我们必须写两个组合，但既然组合符合结合律，那么我们就可以只写一个组合，并向其中传入任意个函数，然后让它自己决定如何分组
 */

const test = ['first', 'second', 'third', 'last']

// 拿到最后一个字符串的大写
const lastUpper = compose(toUpperCase, head, reverse)   
// 基于结合律，这样写实际上与 const lastUpper = compose(toUpperCase, compose(head, reverse)) 没有区别！

console.log(lastUpper(test))

// 如果我们要得到最后一个字符的大写，并为其加上感叹号
const loudLastUpper = compose(exclaim, toUpperCase, head, reverse)

console.log(loudLastUpper(test))

// 但这仅仅是写法之一，由于符合结合律，我们的写法可以有非常多，但这些写法都不会影响最终的运行结果！
const loudLastUpper1 = compose(exclaim, toUpperCase, compose(head, reverse))

const loudLastUpper2 = compose(compose(exclaim, toUpperCase), head, reverse)

// ...

/**
 * 所以，结合律带给我们的是极其强大的灵活性，但其并不会影响最终的结果
 */