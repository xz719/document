// 合并
const add = (x, y) => x + y
// 繁殖
const multiply = (x, y) => x * y

/* 
 * test ---------
 */

const flockA = 4;
const flockB = 2;
const flockC = 0;

const result = add(
    multiply(flockB, add(flockA, flockC)),
    multiply(flockA, flockB)
);

console.log(result)

// 这次得到了正确的结果 16

// 如果我们将鸟群的合并和繁殖抽象出来，会发现其实际上就是数学中的加法和乘法运算，而对于加法和乘法，自然有以下运算规律：

const x = 1, y = 2, z = 3;
// 结合律（associative）  x + (y + z) == (x + y) + z
add(add(x, y), z) === add(x, add(y, z));

// 交换律（commutative）  x + y == y + x
add(x, y) === add(y, x);

// 同一律（identity）  x + 0 == x
add(x, 0) === x;

// 分配律（distributive）  x * (y + z) == x * y + x * z
multiply(x, add(y, z)) === add(multiply(x, y), multiply(x, z));

/* 
 * 那么，我们能否尝试用这些数学规律来简化上面的运算过程呢？
 */

// 应用同一律，去掉多余的加法操作 add(flockA, flockC) == flockA
add(multiply(flockB, add(flockA, flockC)), multiply(flockA, flockB)) === add(multiply(flockB, flockA), multiply(flockA, flockB));

// 再应用分配律
add(multiply(flockB, flockA), multiply(flockA, flockB)) === multiply(flockB, add(flockA, flockA));

console.log(result);
console.log(multiply(flockB, add(flockA, flockA)));

/* 
 * 你可能会说，仅仅用一个如此数学的例子来进行推理，是不合理的，真实世界中的程序要比这个例子复杂的多等等
 * 
 * 但前面也说过，这并不是一个严肃的例子，其目的仅在于让我们感受到，在函数式编程环境中，对于函数的调用过程，可以通过数学方法进行简化，进而提高我们程序的简洁性和准确性
 */