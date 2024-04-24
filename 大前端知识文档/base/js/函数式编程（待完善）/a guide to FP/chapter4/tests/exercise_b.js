/**
 * 练习 B
 * 通过局部调用（partial apply）移除所有参数
 */
import { filter, match } from "../../support";

// filterQs方法，过滤字符串中的部分字符
// const filterQs = (xs) => filter((x) => x.match(/q/i), xs);

// 修改如下
// 首先通过局部调用match获得针对字符q的新函数
const matchQs = match(/q/i)

// 接下来需要局部调用filter获取处理字符q的新函数filterQs
const filterQs = filter(matchQs)

// 实际上，这就是一个将多个参数分步固定的过程！

// ------------------------------------
// tests
// ------------------------------------

assert.arrayEqual(
  filterQs(['quick', 'camels', 'quarry', 'over', 'quails']),
  ['quick', 'quarry', 'quails'],
  'The function gives incorrect results.'
);

assert(
  filter.partially,
  'The answer is incorrect; hint: look at the arguments for `filter`.'
);

assert(
  match.partially,
  'The answer is incorrect; hint: look at the arguments for `match`.'
);