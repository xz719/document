/**
 * @param {ListNode} head
 * @return {boolean}
 */
// 入参是头结点 
const hasCycle = function(head) {
  // 设置遍历指针
  let cur = head;
  // 遍历
  while(cur) {
    if (!cur.once) {
      // 没走过
      cur.once = true;
      cur = cur.next;
    } else {
      // 走过，说明成环
      return true;
    }
  }

  // 遍历完都没遇到走过的结点，说明不成环
  return false;
}