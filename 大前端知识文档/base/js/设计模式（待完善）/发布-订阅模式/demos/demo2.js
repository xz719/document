/* 
    demo1中，我们实现了一个简单的发布-订阅模式，但其中显然存在着一些问题：
    
        对于每个订阅者，都会收到发布者发布的所有消息，这显然是不够合理的，订阅者应当能够选择【仅订阅自己感兴趣的消息】

    为了实现这一点，我们可以对发布者进行修改，增加一个key，使得订阅者可以只订阅增加感兴趣的消息。
*/

// 1. 指定发布者
let observer = {}

// 2. 这里缓存列表不再使用数组，而是以key-value形式存储
observer.clientList = new Map()

// 3. 准备一个订阅该发布者的方法
observer.subscribe = function (key, cb) {
    // 检查这一类消息是否被人关注过，若未被人订阅过，则此次订阅时为其创建订阅列表
    if (!(this.clientList.has(key))) {
        this.clientList.set(key, [])
    }
    // 向指定消息的订阅列表中填充回调
    this.clientList.get(key).push(cb)
}

// 4. 当发布者发布消息时，遍历关注列表，依次触发回调函数。
observer.publish = function () {
    // 首先需要获取发布消息的类型，即传入参数的首位
    let key = arguments[0]

    // 获取该类消息的订阅列表
    let subs = this.clientList.get(key)

    // 但是，可能存在没有人订阅这类消息的情况，此时就不必通知订阅者了
    if (!subs || subs.length === 0) {
        return
    }

    for (let i = 0, callback; callback = subs[i++];) {
        callback.apply(this, arguments)
    }
}

// 实际上，对于消息的类型，我们可以准备一个枚举提供给订阅者使用
const MSG_ENUM = {
    MSG_1: '三室一厅',
    MSG_2: '一室一厅'
}

// 测试一下
// 客户1订阅类型为"三室一厅"的消息
observer.subscribe(MSG_ENUM.MSG_1, function getNote (type, source, price) {
    console.log(`客户1收到消息：【户型：${type}-房源：${source}-价格：${price}】`)
})

// 客户2订阅类型为"一室一厅"的消息
observer.subscribe(MSG_ENUM.MSG_2, function getNote (type, source, price) {
    console.log(`客户2收到消息：【户型：${type}-房源：${source}-价格：${price}】`)
})

// 发布消息
observer.publish('三室一厅', '房源1', '200000')
observer.publish('一室一厅', '房源2', '10000')

/* 
    客户1收到消息：【户型：三室一厅-房源：房源1-价格：200000】
    客户2收到消息：【户型：一室一厅-房源：房源2-价格：10000】

    即，订阅者只会收到其感兴趣的（即订阅过的）类型的消息
*/