/*
 * 什么是【命令模式】？
 *
 * 命令模式是将一个请求封装成一个对象，从而使您可以用不同的请求对客户进行参数化。
 * 请求以【命令】的形式包裹在对象中，并传给调用对象。调用对象寻找可以处理该命令的合适的对象，并把该命令传给相应的对象，该对象执行命令。
 *
 * 命令模式要解决的问题是：在软件系统中，行为请求者与行为实现者通常是一种【紧耦合】的关系，但某些场合，比如需要对行为进行记录、撤销或重做、事务等处理时，这种无法抵御变化的紧耦合的设计就不太合适。
 */

/*
 * 如何理解命令模式？
 *
 * 以喝水为例，某个人喝水时执行的指令就是：倒水 - 端起杯子 - 送入口中，这就是一条命令。无论喝水的是谁、谁让这个人喝水，都不会影响这个步骤
 *
 * 即，一条命令，并不关注其调用者、执行者，而是只关心执行某些特定事情的过程。
 */

/*
 * 一个完整的命令模式中，往往包含以下5个角色：
 *
 *      1. 客户(client)：发出一个具体的命令并指定其接收者，需要注意的是，其不是我们常规意义上的客户，而是在组装命令对象和接收者，或许，把这个client称为装配者会更好理解，因为真正的客户是从Invoker来触发命令的
 *      2. 命令(command)：声明了一个给所有具体命令类实现的抽象接口
 *      3. 具体命令(concreteCommand)：通过命令提供的接口实现的具体命令对象，其定义了一个接受者和行为的弱耦合，负责调用接受者的相应方法来完成命令要执行的操作
 *      4. 请求者(Invoker)：调用命令对象执行请求，通常会持有一个或多个命令对象。这个是客户真正触发命令并要求命令执行相应操作的地方，也就是说相当于使用命令对象的【入口】。
 *      5. 接收者(Receiver)：真正完成命令相应操作的对象。【任何类都可能成为一个接收者】，只要它能够实现命令要求实现的相应功能。
 *
 * 当然，命令模式不一定具备上面的所有结构，简单的命令模式可以只有命令的发布者(即client)和命令的接收者。
 */

/*
 * 下面以一个自增的例子来进行说明
 */
// 首先是commend对象
function Command(receiver) {
  // 命令栈
  this.commandStack = [];
  // 栈指针位置
  this.stackPos = -1;
  // 命令接收者
  this.receiver = receiver;
}

Command.prototype = {
  constructor: Command,

  // 在执行时，已经撤销的部分不能再重做
  _clearRedo: function () {
    this.commandStack = this.commandStack.slice(0, this.stackPos + 1);
  },

  // 执行命令
  execute: function () {
    this._clearRedo();

    // 执行接收者的某一方法，并将其存入栈中
    const action = this.receiver.action;
    action();
    this.commandStack.push(action);
    this.stackPos++;
  },

  // 检查是否能够撤销命令
  canUndo: function () {
    return this.stackPos >= 0;
  },

  // 撤销
  undo: function () {
    // 不能撤销，则直接返回
    if (!this.undo()) {
      console.log("没有可撤销的操作");
      return;
    }

    // 撤销命令
    this.stackPos--;
    const revoke = this.receiver.revoke;
    revoke();
    // 此时不再需要存入栈中
  },

  // 检查是否能够重做
  canRedo: function () {
    return this.stackPos < this.commandStack.length - 1;
  },

  redo: function () {
    if (!this.canRedo()) {
      console.log("没有可重做的命令");
      return;
    }

    // 执行栈顶的命令
    this.commandStack[++this.stackPos]();
  },
};

// 接收者，实现功能的地方
const incrementReceiver = {
  val: 0,
  action: function () {
    this.val += 2;
    this.getVal()
  },
  revoke: function () {
    this.val -= 2;
    this.getVal()
  },
  getVal: function () {
    console.log(this.val)
  }
};

// 具体命令，即创建的一个命令对象，此时传入某一个receiver，从而建立了一个发送者与接收者之间的松耦合关系, 这一步往往由client完成
const incrementCommand = new Command(incrementReceiver);

// 请求者
const invoker = {
  incrementTrigger: {
    command: incrementCommand,

    increment: function () {
      this.command.execute();
    },

    "undo increment": function () {
      this.command.undo();
    },

    "redo increment": function () {
      this.command.redo();
    },
  },
};

// 下面模拟一下
invoker.incrementTrigger['increment']();    // 2
invoker.incrementTrigger['increment']();    // 4

invoker.incrementTrigger['undo increment']();   // 2

invoker.incrementTrigger['increment']();    // 4

invoker.incrementTrigger['undo increment']()    // 2
invoker.incrementTrigger['undo increment']()    // 0
invoker.incrementTrigger['undo increment']()    // 没有可撤销的命令

invoker.incrementTrigger['redo increment']()    // 2
invoker.incrementTrigger['redo increment']()    // 4
invoker.incrementTrigger['redo increment']()    // 没有可重做的命令

invoker.incrementTrigger['increment']();    // 6


/* 
 *  什么时候使用命令模式？
 * 
 *      1. 系统需要支持命令的撤销（undo）。命令对象可以把状态存储起来，等到客户端需要撤销命令所产生的效果时，可以调用undo方法把命令所产生的效果撤销掉。命令对象还可以提供redo方法，以供客户端在需要时，重新实现命令效果。
 *      
 *      2. 系统需要在不同的时间指定请求、将请求排队。一个命令对象和原先的请求发出者可以有不同的生命周期。
 *         意思为：原来请求的发出者可能已经不存在了，而命令对象本身可能仍是活动的。这时命令的接受者可以在本地，也可以在网络的另一个地址。命令对象可以串行地传送到接受者上去。
 *      
 *      3. 如果一个系统要将系统中所有的数据消息更新到日志里，以便在系统崩溃时，可以根据日志里读回所有数据的更新命令，重新调用方法来一条一条地执行这些命令，从而恢复系统在崩溃前所做的数据更新。
 *      
 *      4. 系统需要使用命令模式作为【CallBack(回调)】在面向对象系统中的替代。Callback即是先将一个方法注册上，然后再以后调用该方法。
 */