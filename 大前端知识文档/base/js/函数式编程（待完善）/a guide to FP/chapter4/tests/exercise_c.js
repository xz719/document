/**
 * 练习 C
 * 给定以下函数，其用于找出两个数之间的较大者
 *
 *   const keepHighest = (x, y) => (x >= y ? x : y);
 *
 * 使用帮助函数 `keepHighest` 重构 `max`， 重构后的`max`不再引用任何参数。
 */
import { keepHighest, reduce } from "../../support";

// max :: [Number] -> Number
// const max = (xs) => reduce((acc, x) => (x >= acc ? x : acc), -Infinity, xs);

// 有了前面两道练习题的基础，我们知道，局部调用实际上就是将参数分步固定的过程，这里我们的最后一个参数 xs，即目标数组是不固定的，但前面的所有参数都是固定的，那么，我们需要一步步地固定这些参数即可
// 1. 通过局部调用固定对每一元素执行的方法
const reduceHighest = reduce(keepHighest)

// 2. 固定reduce的第二个参数，即初始值
const max = reduceHighest(-Infinity)

// ------------------------------------
// tests
// ------------------------------------

assert(
  max([323, 523, 554, 123, 5234]) === 5234,
  'The function gives incorrect results.'
);

assert(
  reduce.partially,
  'The answer is incorrect; hint: look at the arguments for `reduce`!'
);

assert(
  keepHighest.calledBy && keepHighest.calledBy.name === '$reduceIterator',
  "The answer is incorrect; hint: look closely to `reduce's` iterator and `keepHighest`!"
);
