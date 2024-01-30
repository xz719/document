// 除了在demo3中提到的问题，先前的发布-订阅模块还存在一个小问题：后订阅的订阅者无法收到订阅前发布的消息

// 这里，我们将这两个问题一并解决，并向外暴露一个安装模块的方法

let subId = 0;

const pubsubPlugin = {
  subMap: new Map(), // 各类消息的订阅列表

  MSG_ENUM: {}, // 消息枚举

  cache: new Map(), // 消息缓存

  // 初始化方法
  initMap: function () {
    for (const key in this.MSG_ENUM) {
      this.subMap.set(this.MSG_ENUM[key], []);
    }
    for (const key in this.MSG_ENUM) {
      this.cache.set(this.MSG_ENUM[key], []);
    }
  },

  // 订阅事件
  subscribe: function (MSG_TYPE, callback) {
    // 当订阅消息类型为所有时，需将回调加入所有的订阅列表中
    if (MSG_TYPE == "ALL") {
      this.subMap.forEach((subs) => {
        subs.push({
          callback,
          id: subId,
        });
      });
    } else {
      this.subMap.get(MSG_TYPE).push({
        callback,
        id: subId,
      });
    }

    // 用户订阅时，如果此类消息有缓存，则将缓存中的消息发送给订阅者
    let cacheMsgs = this.cache.get(MSG_TYPE)
    if (!cacheMsgs.length) {
        for (let i = 0; i < cacheMsgs.length; i++) {
            callback.apply(this, cacheMsgs[i].arguments)
        }
    }

    let nowSubId = subId;
    subId += 1;
    // 返回订阅者id
    return nowSubId;
  },

  // 发布事件
  publish: function () {
    // 获取发布的消息类型
    const MSG_TYPE = arguments[0];

    // 获取该类型消息的订阅列表
    let subs = this.subMap.get(MSG_TYPE);

    // 当没有人订阅此类消息时，不必发送通知
    if (!subs || subs.length === 0) {
      return;
    }

    // 通知所有订阅了此类消息的订阅者
    for (let i = 0, cb; (cb = subs[i++]); ) {
      cb.callback.apply(this, arguments);
    }

    // 将该消息存入缓存
    this.cache.get(MSG_TYPE).push({
        date: Date.now(),
        arguments,
    })
  },

  // 取消订阅
  remove: function (MSG_TYPE, id) {
    // 查找这一类消息的订阅列表
    let subs = this.subMap.get(MSG_TYPE);

    // 如果此类消息没有人订阅，则直接返回
    if (!subs.length) {
      return;
    }

    // 当没有传入id时，即没有指定是哪一订阅者要取消订阅，此时将取消此类消息的所有订阅
    if (!id) {
      subs && (subs.length = 0);
    } else {
      // 反向遍历订阅列表
      for (let i = subs.length - 1; i > 0; i--) {
        // 找到相同回调，则删除
        if (subs[i].id === id) {
          subs.splice(i, 1);
        }
      }
    }
  },
};

// 安装发布-订阅功能的方法
const installPubsub = function (obj, msgEnum) {
  for (const key in pubsubPlugin) {
    obj[key] = pubsubPlugin[key];
  }
  obj.MSG_ENUM = msgEnum;
  obj.initMap();
};

// export { installPubsub }

/* 
    在程序中，发布—订阅模式可以用一个全局的Event对象来实现，订阅者不需要了解消息来自哪个发布者，发布者也不知道消息会推送给哪些订阅者
    Event则扮演一个类似【中介者】的角色，把订阅者和发布者联系起来

    全局的发布—订阅模式，可以在两个封装良好的模块中进行通信，这两个模块可以完全不知道对方的存在。
*/
