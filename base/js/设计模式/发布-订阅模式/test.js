// 用一个按钮点击的实例来测试一下我们封装好的发布-订阅模块
// import { installPubsub } from "./pubsubPlugin";

let btnClickEvent = {}

const BTN_EVENT_ENUM = {
  ALL_EVENT: "ALL",
  CLICK_EVENT: "CLICK",
}

// 安装发布-订阅模块
installPubsub(btnClickEvent, BTN_EVENT_ENUM)

// export default btnClickEvent

