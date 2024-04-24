// 前面说到过，策略模式不仅仅可以用于整合各类算法，还可以用于组合业务规则，其中最为经典的场景就是表单校验。

/* 
    在表单校验的场景中，我们往往会存在多个输入框，而针对不同的输入框，可能会存在不同的校验要求，包括但不限于：

        1. 内容不为空
        2. 限制输入长度
        3. 限制输入数据类型
        ...

    有时，甚至需要使用客户自定义的校验策略。

    同时，客户会指定好每一输入框所需要使用的校验策略，也就是整个表单的校验规则。
*/

// 首先我们需要准备好各校验策略的错误提示，这里只列出部分
let errorMap = {
  default: "输入数据格式不正确",
  minLength: "输入数据长度不足",
  isNumber: "请输入数字",
  required: "内容不能为空",
};

// 下面是针对各校验要求的组策略
let strategies = {
  // 限制最小输入长度的策略
  minLength: function (value, length, customErrorMsg) {
    if (value.length < length) {
      return customErrorMsg || errorMap["minLength"];
    }
  },
  // 限制数据格式为数字的策略
  isNumber: function (value, customErrorMsg) {
    if (!/\d+/.test(value)) {
      return customErrorMsg || errorMap["isNumber"];
    }
  },
  // 限制内容不能为空的策略
  required: function (value, customErrorMsg) {
    if (value === null || value === undefined) {
      return customErrorMsg || errorMap["required"];
    }
  },
};

// 定义一个校验类，其会将各表单项的不同校验要求委托给对应的策略
function Validator(rules) {
  this.validateItems = rules;
  this.validateResult = {};
  for (let key in this.validateItems) {
    Object.defineProperty(this.validateResult, key, {
        value: {},
        writable: true
    })
  }
}

Validator.prototype = {
  constructor: Validator,

  // 校验
  validate: function (data) {
    for (const key in this.validateResult) {
        this.validateResult[key] = {}
    }
    for (let key in this.validateItems) {
      let value = data[key];
      let itemRules = this.validateItems[key];
      let itemResult = {
        res: false,
        msg: "",
      };
      for (let rule of itemRules) {
        let type = rule.type;
        let params = [value, rule.msg];
        if (rule.length) {
          params.splice(1, 0, rule.length);
        }
        let tempRes = strategies[type](...params);
        if (tempRes) {
          itemResult.res = false;
          itemResult.msg = tempRes;
          if (type === "required") {
            break
          }
        } else {
          itemResult.res = true;
          itemResult.msg = "";
        }
      }
      this.validateResult[key] = itemResult
    }
    return this.validateResult;
  },
};

/* 
    测试数据 ------------------------------------
*/

// 客户指定的表单校验规则(当然这里是简化过的，实际上在比较完善的表单校验库中，还可以指定更加复杂的规则)
let customRules = {
  name: [
    { type: "required", msg: "姓名不能为空" },
    { type: "minLength", length: 5 },
  ],
  password: [
    { type: "required", msg: "密码不能为空" },
    { type: "minLength", length: 8, msg: "密码长度最少为8位" },
    { type: "isNumber" },
  ],
};

// 创建一个校验类实例
let loginFormValidator = new Validator(customRules);

let data1 = {
  name: "aaaa",
  password: null,
};
let data2 = {
  name: "123456",
  password: "dwadadwadwadaw",
};
let data3 = {
  name: "test-demo",
  password: 123456789,
};

// console.log(loginFormValidator.validate(data1));
// console.log(loginFormValidator.validate(data2));
console.log(loginFormValidator.validate(data3));


/* 
    在真实的表单校验库中，实际上会提供非常多的可选要求，例如：

        * 必填
        * 长度校验
        * 类型校验
        * ...

    同时，还可以自定义错误提示、自定义校验的触发时机等
*/

/* 
    实际上，在上面的表单校验场景中，就可以体现出策略模式的优缺点。

    其优点在于：能够避免在代码中出现大段的多重条件语句，明显提高了代码的可读性；通过将一系列策略封装起来的方式，更加直观，维护起来也更加方便

    但其也存在一个缺点，我们需要在定义组策略前，就要能够预测到所有的情况，往往策略集会比较庞大，这也是为什么一般组件库中的表单校验功能会使用第三方库来实现。
*/