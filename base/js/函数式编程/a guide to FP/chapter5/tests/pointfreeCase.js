import { compose, replace, toLowerCase, head, intercalate, map, split, toUpperCase } from "../../support";

// 非 Pointfree 模式，因为函数中提及了要操作的数据 word
// const shakeCase = (word) => word.toLowerCase().replace(/\s+/ig, '_')

// Pointfree 模式
const shakeCase = compose(replace(/\s+/ig, '_'), toLowerCase)

console.log(shakeCase('Hello World'))

// 这里，我们局部调用了replace方法，并通过管道将数据在接收单个参数的函数之间传递，利用柯里化，我们能够让每一个函数都先接收数据，再操作数据，然后再把数据传递到下一个函数中去

/**
 * 我们可以发现，在 Pointfree 版本中，我们并不需要数据来构造函数，而在非 Pointfree 版本中，必须要有 word 才能进行一切操作！
 */

// 第二个例子：获得名字的首字母缩写

// 非 Pointfree 模式，提及到了数据 name
// const initials = (name) => name.split(' ').map(compose(toUpperCase, head)).join('. ');

// Pointfree 模式，我们可以在完全不知道即将操作的数据的情况下构建函数
const initials = compose(
    intercalate('. '),
    map(compose(toUpperCase, head)),
    split(' '),
)

console.log(initials('hunter stockton thompson'))