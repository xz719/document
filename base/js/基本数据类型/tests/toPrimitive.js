/**
 * 在 Javascript 中，通过使用 Symbol.toPrimitive 属性(用作函数值)，可以将一个对象转换为其对应的原始值。
 * 要调用该函数，需要传递一个名为hint 的字符串参数。提示参数指定结果原始值的首选返回类型。提示参数可以采用 “number”、“string” 和 “default” 作为它的值。
 */

function myFunction() {
  // Creation of an object with the
  // Symbol.toPrimitive property
  const obj2 = {
    [Symbol.toPrimitive](hint) {
      // If hint is number
      if (hint === "number") {
        return 0;
      }

      // If the hint is string
      if (hint == "string") {
        return "String";
      }

      // If hint is default
      if (hint == "default") {
        return "Default";
      }
    },
    id: 1,
  };

  // Hint passed is integer
  console.log(+obj2);

  // Hint passed is string
  console.log(`${obj2}`);

  // Hint passed is default
  console.log(obj2 + "");

  console.log(Boolean(''))

}
myFunction();
