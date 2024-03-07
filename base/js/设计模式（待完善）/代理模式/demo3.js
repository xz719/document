// =================== 3. 缓存代理
// 缓存代理可以为一些开销大的运算结果提供暂时的缓存(即缓存上一次相同运算的结果)，提升效率。

// 首先定义主体
function getTotal () {
    // 将参数转为数组
    const args = [].slice.apply(arguments)

    // 通过reduce方法处理
    return args.reduce((pre, now) => {
        return pre + now
    })
}

// 定义代理，准备一个缓存对象，记录上一次相同运算的结果
let proxyGetTotal = (function () {
    let cache = new Map()

    return function () {
        let symbol = [].slice.apply(arguments).join(',')

        // 首先从缓存中找
        if (cache.get(symbol)) return cache.get(symbol)

        // 否则访问主体进行运算
        let res = getTotal.apply(this, arguments)
        cache.set(symbol, res)     // 缓存本次计算结果
        return res
    }
})()

/* 
    测试数据 ----------------
*/

const params1 = [1, 4, 6, 11, 46, 99, 53, 12, 784, 22, 364, 77, 25, 153, 653, 5, 123, 7, 15]
const params2 = [1, 23, 6, 11, 46, 231, 544, 1, 314, 26, 424, 751, 2, 321, 54, 66, 178, 12, 65, 9, 33]

// 直接访问主体时，每次运算都需要重新计算
console.log(getTotal(...params1))
console.log(getTotal(...params2))
console.log(getTotal(...params1))

// 通过代理访问时，相同的运算，再次计算时，会直接从缓存中取
console.log(proxyGetTotal(...params1))
console.log(proxyGetTotal(...params2))
console.log(proxyGetTotal(...params1))

/* 
    在代理模式的三种子模式中，最为常用的就是虚拟代理，其中比较典型的使用场景就是【Vue3的响应式设计】
*/