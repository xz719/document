import { compose, reduce } from "../../support";

// 函数组合

const toUpperCase = (x) => x.toUpperCase()
const exclaim = (x) => `${x}!`

const shout = compose(exclaim, toUpperCase)

console.log(shout('send in the clowns'))
// shout函数组合了toUpperCase和exclaim两个函数，执行顺序为按照 compose 时的传入顺序从右向左执行，即：toUpperCase -> exclaim

// 那么如果我们不使用函数组合，shout函数将会是下面这个样子
/* 
 * const shout = (x) => exclaim(toUpperCase(x))
 * 
 * 从可读性的角度来说，显然是不如函数组合的，因为函数组合中，我们传入函数的顺序反过来即是执行的顺序！
 */

// 下面给出一个执行顺序更加明显的例子，用于取出数组的最后一项

const head = (x) => x[0]
const reverse = reduce((acc, x) => [x, ...acc], [])
const last = compose(head, reverse)

console.log(last(['first', 'second', 'third', 'last']))

// 从这个例子中，可以直观地看到，函数组合的执行顺序的从右到左