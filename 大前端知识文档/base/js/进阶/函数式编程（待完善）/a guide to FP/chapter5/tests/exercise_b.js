/*
  练习 B
  给定下面的函数：

    const average = xs => reduce(add, 0, xs) / xs.length;

  使用帮助函数 `average` 重构 `averageDollarValue` 使之成为一个组合
 */
import {
  average,
  compose,
  map,
  prop,
} from "../../support";

// averageDollarValue :: [Car] -> Int，其用于返回所有车型的平均价格
// const averageDollarValue = (cars) => {
//   const dollarValues = map((c) => c.dollar_value, cars);
//   return average(dollarValues);
// };

// 重写如下
const averageDollarValue = compose(average, map(prop('dollar_value')))

// ------------------------------------
// tests
// ------------------------------------

import { cars } from "../../support";

try {
  assert(
    averageDollarValue(cars) === 790700,
    "The function gives incorrect results."
  );
} catch (err) {
  const callees = averageDollarValue.callees || [];

  if (callees[0] === "average" && callees[1] === "map") {
    throw new Error(
      "The answer is incorrect; hint: functions are composed from right to left!"
    );
  }

  throw err;
}

assert.arrayEqual(
  averageDollarValue.callees || [],
  ["map", "average"],
  "The answer is incorrect; hint: map is currified!"
);

assert(
  prop.partially,
  "The answer is almost correct; hint: you can use prop to access objects' properties!"
);
