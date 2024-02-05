// 一个简单的缓存实现
const memorize = (fn) => {
    const cache = {}

    return (...args) => {
        const argStr = JSON.stringify(args)
        if (cache[argStr] === undefined) {
            console.log(`calculate input ${args}`)
            cache[argStr] = fn(...args)
        } else {
            console.log(`returns cache for input ${args}`)
        }
        return cache[argStr]
    }
}

const squareNumber = memorize((x) => x * x);

console.log(squareNumber(4));

console.log(squareNumber(4));

console.log(squareNumber(5));

console.log(squareNumber(5));

// http请求，纯函数, 延迟执行
const pureHttpCall = memorize((url, params) => () => $.getJSON(url, params));

// 这里为什么说 pureHttpCall 函数是一个纯函数？

/* 
 * 因为，我们这里执行 memorize((url, params) => () => $.getJSON(url, params)) 后
 * 
 * 返回一个发送http请求的函数，但并没有真正发送请求；此外，这个函数只要指定了url以及params，就会返回同一个发送http请求的函数，即，对于相同的输入，会有相同的输出
 * 
 * 即，此时memorize中缓存的并不是发送请求所返回的结果，而是生成的发送请求的函数！
 * 
 * 现在来看，这种方式的意义并不大，但是通过后续的学习，我们会发现这种方式的作用。
 * 
 * 重点在于，我们可以缓存任意一个函数，不论这个函数多么具有破坏性
 */