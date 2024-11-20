// 入参是物品的个数和背包的容量上限，以及物品的重量和价值数组
function knapsack(n, c, w, value) {
  // 保存计算结果的数组，这里数组长度为 c + 1 因为要考虑背包容量为0的情况
  const dp = new Array(c + 1).fill(0);

  let res = -Infinity; // 结果

  for (let i = 0; i < n; i++) {
    for (let v = c; v >= w[i]; v--) {
      dp[v] = Math.max(dp[v], dp[v - w[i]] + value[i]);

      // 更新
      if (res < dp[v]) {
        res = dp[v];
      }
    }
  }

  return res;
}
