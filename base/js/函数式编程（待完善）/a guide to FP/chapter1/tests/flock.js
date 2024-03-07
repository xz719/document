// 例1：鸟群

// 传统写法

class Flock {
    constructor(n) {
        this.seagulls = n
    }
    // 合并
    conjoin(other) {
        this.seagulls += other.seagulls
        return this
    }
    // 繁殖
    breed(other) {
        this.seagulls = this.seagulls * other.seagulls
        return this
    }
}

/* 
 * test------  
 */

const flockA = new Flock(4);
const flockB = new Flock(2);
const flockC = new Flock(0);

const result = flockA
  .conjoin(flockC)
  .breed(flockB)
  .conjoin(flockA.breed(flockB)).seagulls;

console.log(result);

/* 
 * 最终输出为 32，显然是一个错误的答案，正确答案是16，因为在计算过程中 flockA.seagulls 被永久地改变了
 * 
 * 但需要注意的是，本例并不是一个典型的面向对象式编程的例子。
 * 
 * 而是旨在说明，在传统的对象赋值程序中，状态和可变值的变化非常难以追踪，以至于在这么小的一个程序中也不例外。
 */