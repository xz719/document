// import btnClickEvent from './test'

let count = 0

let btn = document.querySelector("#count")

btn.onclick = function () {
    btnClickEvent.publish(btnClickEvent.MSG_ENUM.CLICK_EVENT, count++)
}