console.log("script start");

// Promise1
Promise.resolve().then(() => {
  console.log("Promise1");

  // setTimeout1
  setTimeout(() => {
    console.log("setTimeout2");
  }, 0);
});

// Promise2
Promise.resolve().then(() => {
  console.log("Promise2");
});

// setTimeout2
setTimeout(() => {
  console.log("setTimeout1");

  // Promise3
  Promise.resolve().then(() => {
    console.log("Promise3");
  });
}, 0);

console.log("script end");


/**
 * 最终输出结果如下：
 * 
 *      script start => script end => Promise1 => Promise2 => setTimeout1 => Promise3 => setTimeout2
 */

/**
 * 下面来分析一下执行流程：
 * 
 *      首先主线程执行，解析 script 整体代码，即，开始执行 script 宏任务。
 * 
 *      执行期间，遇到 console.log("script start") 属于同步任务，执行输出【script start】
 * 
 *      继续执行，遇到 Promise1，then 方法属于微任务，放入微任务队列中。现在微任务队列中的内容为：[Promise1 then]
 * 
 *      继续执行，遇到 Promise2，同样，then 方法属于微任务，放入微任务队列中。现在微任务队列中的内容为：[Promise1 then, Promise2 then]
 * 
 *      继续执行，遇到 setTimeout2，属于宏任务，将其放入对应类型的任务队列中，现在对应类型的任务队列中内容为：[setTimeout2 回调函数]
 * 
 *      继续执行，遇到 console.log("script end") 属于同步任务，执行输出【script end】
 * 
 *      script 宏任务执行完毕，接下来，检查微任务队列，有可执行的微任务回调，将这些微任务回调放入主线程执行：
 *
 *          首先执行 Promise1 then，遇到 console.log("Promise1") 属于同步任务，执行输出【Promise1】。继续执行，遇到 setTimeout1，属于宏任务，将其放入对应类型的任务队列中，执行完毕。现在对应类型的任务队列中内容为：[setTimeout2 回调函数, setTimeout1 回调函数]
 *          
 *          接下来执行 Promise2 then，遇到 console.log("Promise2") 属于同步任务，执行输出【Promise2】，执行完毕。
 * 
 *          此时，微任务队列为空，说明微任务全部执行完毕。
 * 
 *      接下来，再次检查任务队列，有可执行的宏任务回调，拿出第一个回调放入主线程中执行：
 * 
 *          执行 setTimeout2 回调，遇到 console.log("setTimeout1") 属于同步任务，执行输出【setTimeout1】。继续执行，遇到 Promise3，then 属于微任务，放入微任务队列中，执行完毕。现在微任务队列中的内容为：[Promise3 then]。
 * 
 *      宏任务执行完毕，再次检查微任务队列，发现有可执行的微任务回调，拿出放入主线程中执行：
 * 
 *          执行 Promise3 then，遇到 console.log("Promise3") 属于同步任务，执行输出【Promise3】，执行完毕
 * 
 *          此时，微任务队列已清空。
 * 
 *      再次检查任务队列，发现还有可执行的宏任务回调，于是拿出放入主线程中执行：
 * 
 *          执行 setTimeout1 回调，遇到 console.log("setTimeout2") 属于同步任务，执行输出【setTimeout2】，执行完毕。
 * 
 *      此时，检查微任务队列，没有可执行的微任务，再检查任务队列，也没有可执行的宏任务，事件循环结束。
 * 
 * 由此，我们可以得到输出为：
 * 
 *      script start => script end => Promise1 => Promise2 => setTimeout1 => Promise3 => setTimeout2
 */