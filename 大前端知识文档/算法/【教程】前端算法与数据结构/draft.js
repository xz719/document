/**
 * @param {ListNode} head
 * @return {ListNode}
 */
const deleteDuplicates = function (head) {
  // 优先判断：0个或1个结点，直接返回，不可能存在重复
  if (!head || !head.next) {
    return head;
  }
  // 1. 设置 dummy 结点，dummy 是头结点的前驱
  let dummy = new ListNode();
  dummy.next = head;

  // 2. 从 dummy 开始遍历链表，检查后续的两个结点
  let cur = dummy;
  // 检查后续两个结点是否存在重复，直到后续不存在两个结点
  while (cur.next && cur.next.next) {
    // 是否存在重复
    if (cur.next.val === cur.next.next.val) {
        // 若存在重复，则从第一个后继开始，一边删除重复结点一边继续判断
        let val = cur.next.val;
        while(cur.next && cur.next.val === val) {
            cur.next = cur.next.next;
        }
    } else {
        // 否则，cur 向后移动
        cur = cur.next;
    }
  }

  return dummy.next;
};
