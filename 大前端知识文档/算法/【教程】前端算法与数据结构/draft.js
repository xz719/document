/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
const maxSlidingWindow = function (nums, k) {
  // 缓存数组长度 + 初始化结果数组
  const len = nums.length;
  let res = [];

  // 初始化双端队列
  const deque = [];

  // 遍历数组
  for (let i = 0; i < len; i++) {
    // 将当前元素与队尾元素比较，保证双端队列的递减性
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop();
    }
    // 将元素索引入队
    deque.push(i);
    // 检查队头元素是否已经在滑动窗口之外
    while (deque.length && deque[0] < i - k + 1) {
      // 在窗口之外的元素要被去除
      deque.shift();
    }
    // 检查滑动窗口状态，是否已经遍历了 k 个元素，如果是，则开始填入结果
    if (i >= k - 1) {
      res.push(nums[deque[0]])
    }
  }

  // 返回结果数组
  return res;
};
