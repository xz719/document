// 代理模式，是指为一个对象提高一个代用品或占位符，以便【控制对其的访问】

/* 
    代理模式的主要目的在于：

        当客户不方便直接访问一个对象，或者该对象的访问接口不满足客户需求时，提供一个代理对象来代理对于该对象的访问，当客户访问该对象时，实际上是访问的代理对象。

        而代理对象则会在对客户访问对象的请求做出一些处理后，在将请求转交给本体对象。

        需要注意的是，代理和本体的接口具有一致性，本体定义了关键功能，而代理则提供或拒绝对其的访问，亦或是在访问本体之前做一些额外的事情。

    
    代理模式主要有三种：

        1. 保护代理
        2. 虚拟代理
        3. 缓存代理

*/

// =================== 1. 保护代理
// 保护代理主要是实现对访问主体行为的限制。看下面这样一个场景: 我们需要向外部发送一条消息

// 主体, 实现关键功能, 即向外部发送消息
function sendMsg(msg) {
  console.log(msg);
}

// 客户要求: 当传入的消息为空时, 不发送消息

// 代理, 对访问主体的行为进行限制, 具体到这里, 就是对传入的消息进行过滤
function proxySendMsg1(msg) {
  // 无消息时, 直接返回
  if (typeof msg === "undefined") {
    console.log("denied!");
    return;
  }

  sendMsg(msg);
}

// 直接访问主体时, 显然不能满足客户的要求
sendMsg(); // undefined
// 通过代理访问
proxySendMsg1(); // denied!

// 如果此时客户又有新的需求, 当用户传入了某些敏感消息时, 对其进行过滤, 那么我们可以修改代理如下
function proxySendMsg2(msg) {
  // 无消息时, 直接返回
  if (typeof msg === "undefined") {
    console.log("denied!");
    return;
  }

  // 对某些敏感消息进行过滤
  msg = ('' + msg).replace(/(fuck|dick|penis|nigger|gay|pussy|nmsl|cnm|草\s*尼\s*马)/g, '*')

  sendMsg(msg);
}

// 直接访问主体, 不能拦截敏感词汇
sendMsg('fuck')                                     // fuck
// 通过代理访问
proxySendMsg2('fuck you')                           // * you
proxySendMsg2('ur a pussy')                         // ur a *
proxySendMsg2('nmsl')                               // *
proxySendMsg2('我草       尼            马')        //  我 *
proxySendMsg2('ur a nigger, your mom is a pussy, nmsl, 我草尼马')   // ur a *, your mom is a *, *, 我*


// 但实际上, 这类操作并不属于保护代理, 因为这里实际上并不是对访问行为进行了限制, 无论如何最终客户都可以访问到主体, 这里只是在客户访问主体时, 进行了一些额外的操作
// 这实际上属于第二类代理模式: 虚拟代理
