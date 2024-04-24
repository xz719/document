/*
 * 命令模式还可以用于实现一些简单的宏命令(即一组命令的集合)
 */
var closeDoorCommand = {
  execute: function () {
    console.log("关门");
  },
};

var openPcCommand = {
  execute: function () {
    console.log("开电脑");
  },
};

var openQQCommand = {
  execute: function () {
    console.log("登录QQ");
  },
};

var MacroCommand = function () {
  return {
    // 命令列表
    commandsList: [],
    // 添加命令
    add: function (command) {
      this.commandsList.push(command);
    },
    // 执行宏命令
    execute: function () {
      for (var i = 0, command; (command = this.commandsList[i++]); ) {
        command.execute();
      }
    },
  };
};

var macroCommand = MacroCommand();
macroCommand.add(closeDoorCommand);
macroCommand.add(openPcCommand);
macroCommand.add(openQQCommand);

macroCommand.execute();
