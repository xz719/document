// 前面我们尝试实现了一个发布-订阅模式，但如果我们有另一个或多个场景需要实现发布-订阅功能，该如何实现呢？每次都重写一套发布-订阅的逻辑吗？

/* 
    实际上，我们可以实现一个通用的发布-订阅功能，其可以像插件一样，安装到任何一个对象上
*/

let pubsubPlugin = {
  subMap: new Map(), // 各类消息的订阅列表

  MSG_ENUM: {}, // 消息枚举

  // 初始化方法
  initMap: function () {
    for (const key in this.MSG_ENUM) {
      this.subMap.set(this.MSG_ENUM[key], []);
    }
  },

  // 订阅事件
  subscribe: function (MSG_TYPE, callback) {
    // 当订阅消息类型为所有时，需将回调加入所有的订阅列表中
    if (MSG_TYPE == "ALL") {
      this.subMap.forEach((subs) => {
        subs.push(callback);
      });
    } else {
      this.subMap.get(MSG_TYPE).push(callback);
    }
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
      cb.apply(this, arguments);
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

// 测试一下，假设某一微信公众号对象需要实现发布-订阅功能 -------------------------
// 目标对象以及消息枚举
let wxPublicAccountXXX = {};

const XXX_MSG_ENUM = {
  ALL_MSG: "ALL",
  DAILY_MSG: "DAILY",
  DISCOUNT_MSG: "DISCOUNT",
};

// 安装功能
installPubsub(wxPublicAccountXXX, XXX_MSG_ENUM);

// 用户A默认订阅所有消息
// wxPublicAccountXXX.subscribe(function (MSG_TYPE, content) {
//     console.log(`用户A接收到消息：【类型：${MSG_TYPE}-消息内容：${content}】`)
// })

// 用户B显式订阅所有消息
wxPublicAccountXXX.subscribe(
  wxPublicAccountXXX.MSG_ENUM.ALL_MSG,
  function (MSG_TYPE, content) {
    console.log(`用户B接收到消息：【类型：${MSG_TYPE}-消息内容：${content}】`);
  }
);

// 用户C订阅日常消息
wxPublicAccountXXX.subscribe(
  wxPublicAccountXXX.MSG_ENUM.DAILY_MSG,
  function (MSG_TYPE, content) {
    console.log(`用户C接收到消息：【类型：${MSG_TYPE}-消息内容：${content}】`);
  }
);

// 用户D订阅折扣消息
wxPublicAccountXXX.subscribe(
  wxPublicAccountXXX.MSG_ENUM.DISCOUNT_MSG,
  function (MSG_TYPE, content) {
    console.log(`用户D接收到消息：【类型：${MSG_TYPE}-消息内容：${content}】`);
  }
);

// 发布消息
wxPublicAccountXXX.publish(
  wxPublicAccountXXX.MSG_ENUM.DAILY_MSG,
  "每日消息，xxxxxxxxxxxx"
);
wxPublicAccountXXX.publish(
  wxPublicAccountXXX.MSG_ENUM.DAILY_MSG,
  "每日消息，xxxxxxxxxxxxxxxx，yyyyyyyyy"
);
wxPublicAccountXXX.publish(
  wxPublicAccountXXX.MSG_ENUM.DISCOUNT_MSG,
  "折扣：xxx 10% discount，yyy 5% discount"
);

/* 
    用户B接收到消息：【类型：DAILY-消息内容：每日消息，xxxxxxxxxxxx】
    用户C接收到消息：【类型：DAILY-消息内容：每日消息，xxxxxxxxxxxx】
    用户B接收到消息：【类型：DAILY-消息内容：每日消息，xxxxxxxxxxxxxxxx，yyyyyyyyy】
    用户C接收到消息：【类型：DAILY-消息内容：每日消息，xxxxxxxxxxxxxxxx，yyyyyyyyy】
    用户B接收到消息：【类型：DISCOUNT-消息内容：折扣：xxx 10% discount，yyy 5% discount】
    用户D接收到消息：【类型：DISCOUNT-消息内容：折扣：xxx 10% discount，yyy 5% discount】

    可以看到，用户B由于订阅了所有消息，每次发布消息时，都会收到通知，而用户C、D则只会收到自己感兴趣的消息
*/

// 结合实际生活，我们在订阅了某些信息后，当我们不再想接收某些信息时，可以选择取消订阅，所以我们需要为上面的插件添加一个取消订阅功能

/* 
    为什么这里要传入callback，因为在我们的实现中，每一订阅者都是由其传入的回调来唯一标识的，要找到某个特定的订阅者，只能通过回调来匹配
*/
pubsubPlugin.remove = function (MSG_TYPE, callback) {
  // 查找这一类消息的订阅列表
  let subs = this.subMap.get(MSG_TYPE);

  // 如果此类消息没有人订阅，则直接返回
  if (!subs.length) {
    return;
  }

  // 当没有传入callback时，即没有指定是哪一订阅者要取消订阅，此时将取消此类消息的所有订阅
  if (!callback) {
    subs && (subs.length = 0);
  } else {
    // 反向遍历订阅列表
    for (let i = subs.length - 1; i > 0; i--) {
      // 找到相同回调，则删除
      if (subs[i] === callback) {
        subs.splice(i, 1);
      }
    }
  }
};

/* 
    实际上，这里的实现还不够完善，每次取消订阅时，还需要传入对应的回调函数，但这个回调函数实际上是完全不会被调用的。
    所以，我们可以在订阅时，不仅仅存入回调函数，还顺带存入一个唯一标识id，并在完成订阅后返回给订阅者，当需要取消订阅时，只用传入这个id即可。
*/
