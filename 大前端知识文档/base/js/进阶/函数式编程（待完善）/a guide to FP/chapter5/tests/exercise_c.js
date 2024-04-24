/*
  练习 C
  重构 `fastestCar` 使之成为 pointfree 风格，使用 `compose()` 和其他函数。
 */
import {
  curry,
  concat,
  append,
  compose,
  last,
  sortBy,
  prop
} from "../../support";

// fastestCar :: [Car] -> String，其用于找出最快的车型
// const fastestCar = (cars) => {
//   const sorted = sortBy((car) => car.horsepower, cars);
//   const fastest = last(sorted);
//   return concat(fastest.name, " is the fastest");
// };

const trace = curry((tag, x) => {
  console.log(tag, x)
  return x
})

// 将其重写为 Pointfree 模式
const fastestCar = compose(
  append(" is the fastest"),  // 使用 concat 方法，无法固定第一个参数，所以使用 append 方法代替！
  prop('name'),
  last,
  sortBy(prop('horsepower'))
)

// ------------------------------------
// tests
// ------------------------------------

import { cars } from "../../support";

try {
  assert(
    fastestCar(cars) === "Aston Martin One-77 is the fastest",
    "The function gives incorrect results."
  );
} catch (err) {
  const callees = fastestCar.callees || [];

  if (callees.length > 0 && callees[0] !== "sortBy") {
    throw new Error(
      "The answer is incorrect; hint: functions are composed from right to left!"
    );
  }

  throw err;
}

const callees = fastestCar.callees || [];

assert.arrayEqual(
  callees.slice(0, 3),
  ["sortBy", "last", "prop"],
  "The answer is incorrect; hint: Hindley-Milner signatures help a lot to reason about composition!"
);
