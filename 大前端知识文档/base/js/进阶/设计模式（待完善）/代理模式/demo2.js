// =================== 2. 虚拟代理
// 虚拟代理在控制对主体的访问时，加入了一些额外的操作。

// 前端开发中应用虚拟代理模式的场景很多，其中比较典型的就是【防抖节流】

// 防抖函数
function debounce (fn, delay) {
    delay = delay || 200

    let timer = null

    return function() {
        const args = arguments

        // 清除已有定时器
        clearTimeout(timer)
        timer = null

        // 重新创建一个定时器
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

// 定义主体
let count = 0

function scrollHandler (e) {
    console.log(e.type, ++count)
}

// 代理，用防抖函数对主体方法进行处理
let proxyScrollHandler = (function() {
    return debounce(scrollHandler, 500)
})()

// 直接访问主体
// window.onscroll = scrollHandler      // 一旦页面滚动，就输出信息
// 通过代理访问
window.onscroll = proxyScrollHandler    // 当页面停止滚动后，才能输出信息