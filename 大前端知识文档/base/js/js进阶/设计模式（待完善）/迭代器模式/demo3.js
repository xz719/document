// 当然，迭代器并不是只能用于迭代某些聚合对象，其实际上也可以用于替换频繁的条件语句。来看下面这个例子

// 首先是不使用迭代器
function getCentury () {
    let year = new Date().getFullYear()

    if (year <= 2000) {
        console.log('20世纪')
    } else if (year > 2100) {
        console.log('22世纪')
    } else {
        console.log('21世纪')
    }
}

getCentury()    // 21世纪

// 现在将每一个条件语句拆分为一个逻辑函数
function century20 () {
    let year = new Date().getFullYear()

    if (year <= 2000) {
        console.log('20世纪')
    }

    return false
}

function century22 () {
    let year = new Date().getFullYear()

    if (year > 2100) {
        console.log('22世纪')
    }

    return false
}

function century21 () {
    let year = new Date().getFullYear()

    if (year > 2000 && year <= 2100) {
        console.log('21世纪')
    }

    return false
}

// 准备好迭代器
function iterator () {
    for (let i = 0; i < arguments.length; ++i ) {
        let res = arguments[i]()

        if (res !== false) {
            return res
        }
    }
}

// 将各逻辑函数放入迭代器中进行迭代
iterator(century20, century22, century21);   // 21世纪

/* 
    虽然这个例子不是很好，看起来好像反而增加了代码量，但其目的仅仅是演示一种使用迭代器的方式。
    
    当条件语句的【分支判断条件】、各分支的【内部处理逻辑】十分复杂时，这种使用方式也是值得考虑的！
*/

// 下面给出一个实际开发中的例子：根据不同的浏览器获取相应的上传组件对象

// 将不同的上传对象封装到各自的函数里; 如果函数可用，则返回该对象，否则返回false，提示迭代器继续
let getActiveUploadObj = function () {
    try {
        return new ActiveXObject("TXFTNActiveX.FTNUpload")      // 尝试创建IE上传控件
    } catch (error) {
        return false
    }
}

let getFlashUploadObj = function () {
    // 是否支持flash
    if (supportFlash()) {
        let obj = document.createElement('object')
        obj.setAttribute('type', 'application/x-shockwave-flash')
        document.querySelector("body").appendChild(obj);
        return obj
    }
    return false
}

let getFormUploadObj = function () {
    // 获取表单上传组件
    let obj = document.createElement('input')
    obj.setAttribute('type', 'file')
    document.querySelector("body").appendChild(obj);
    return obj
}

// 迭代器代码实际上可以直接使用上面定义的方法
let uploadObj = iterator(getActiveUploadObj, getFlashUploadObj, getFormUploadObj)

// 这种方式在实际开发中的浏览器兼容场景中会经常遇见！
