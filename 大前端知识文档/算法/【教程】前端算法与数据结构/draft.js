/**
 * @param {number} n
 * @param {number} k
 * @return {number[][]}
 */
const combine = function(n, k) {
  // 结果数组
  const res = [];

  // 当前组合
  const subset = []

  // dfs
  dfs(1);

  // dfs 方法
  function dfs (index) {
    // 边界：当且仅当组合内数字个数为 k 个时，才会对组合结果数组进行更新，且不再继续递归
    if (subset.length === k) {
      res.push(subset.slice())
      return
    }

    // 递归式
    // 1. 取所有剩余数字
    for (let i = index; i <= n; i++) {
      // 2. 对其中一个剩余数字进行二叉
      // 取该数字填入，根据填入后的结果，继续处理（右子树）
      subset.push(i);
      dfs(i + 1);
      // 不取该数字填入（左子树）
      subset.pop();
    }
  }

  return res;
}