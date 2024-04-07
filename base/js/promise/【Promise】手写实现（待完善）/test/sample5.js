// 例5：对返回嵌套Promise的处理

// 先看原生Promise
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("ok");
  }, 2000);
});

const p2 = p1.then(
  (value) => {
    console.log("p1 success:", value);
    return new Promise((resolve, reject) => {
      reject(
      // resolve(
        new Promise((resolve, reject) => {
          resolve("ok2");
        })
      );
    });
  },
  (reason) => {
    console.log("p1 fail:", reason);
  }
);

p2.then(
  (value) => {
    console.log("p2 success:", value);
  },
  (reason) => {
    console.log("p2 fail:", reason);
  }
);
