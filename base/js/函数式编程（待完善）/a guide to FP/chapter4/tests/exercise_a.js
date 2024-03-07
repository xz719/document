import { split } from "../../support";

/**
 * 练习 A：尝试将下面的调用过程改为局部调用的形式，移除所有参数，使得两个assert方法均不报错
 */

// words方法，将字符串根据空格拆分
// const words = (str) => split(' ', str)

// 改造，将其柯里化，首先部分调用 split 方法，获取一个将字符串按照空格拆分的函数，然后将其赋给words方法
const words = split(' ')

// ------------------------------------
// tests
// ------------------------------------

assert.arrayEqual(
  words('Jingle bells Batman smells'),
  ['Jingle', 'bells', 'Batman', 'smells'],
  'The function gives incorrect results.'
);

assert(split.partially, 'The answer is incorrect; hint: split is currified!');