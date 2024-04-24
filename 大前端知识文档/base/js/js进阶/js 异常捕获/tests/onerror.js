/*
    下面是处理函数能够接收到的几个参数：

        message：错误信息（字符串）。
        source：发生错误的脚本URL（字符串）
        lineno：发生错误的行号（数字）
        colno：发生错误的列号（数字）
        error：Error对象（对象）
    
    实际上，我们可以通过 ...args 的形式获取这些参数，不必挨个接收

    另外，若该函数返回true，则阻止执行默认事件处理函数。
*/
window.onerror = function (...args) {
  // onerror_statements
  console.log("onerror", args);
  return true;
};

/*
    ErrorEvent 类型的 event 包含有关事件和错误的所有信息。
*/
// window.addEventListener("error", function (event) {
//   // onerror_statements
// });

function fn() {
  console.log("fn->s");
  error;
  console.log("fn->e");
}

fn();
