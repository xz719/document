// import btnClickEvent from "./test";

let div = document.querySelector("#show");

btnClickEvent.subscribe(
  btnClickEvent.MSG_ENUM.CLICK_EVENT,
  function (MSG_TYPE, content) {
    div.innerHTML = content;
  }
);
