// 引入将普通函数柯里化的方法 curry
import { curry } from '../../support';

const match = curry((what, s) => s.match(what));
const replace = curry((what, replacement, s) => s.replace(what, replacement));
const filter = curry((f, xs) => xs.filter(f));
const map = curry((f, xs) => xs.map(f));

console.log(match(/r/g, 'hello world'));

const hasLetterR = match(/r/g);
console.log(hasLetterR('hello world'));
console.log(hasLetterR('just j and s and t etc'));

console.log(filter(hasLetterR, ['rock and roll', 'smooth jazz']));

const removeStringsWithoutRs = filter(hasLetterR);
console.log(removeStringsWithoutRs(['rock and roll', 'smooth jazz', 'drum circle']));

// 替换目标中的所有元音字母
const noVowels = replace(/[aeiou]/gi);
const censored = noVowels('*');
console.log(censored('Chocolate Rain'));

/* 
 * 本例的重点在于：函数柯里化之后所体现出来的一种“预加载”函数的能力。
 * 
 * 具体来说，柯里化后的函数可以通过仅传递部分参数调用函数，然后得到一个记住了这些参数的新函数，使得我们不必每次调用函数都传入这些参数
 */
