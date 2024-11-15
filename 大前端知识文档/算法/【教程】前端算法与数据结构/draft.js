/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
const balanceBST = function (root) {
  // 1. 求二叉搜索树的中序序列
  let mid = [];
  inorder(root);

  // 2. 由有序序列得到平衡二叉树
  return buildAVL(0, mid.length - 1);

  // 工具函数1：二叉树的中序遍历序列
  function inorder(root) {
    if (!root) {
      return;
    }
    inorder(root.left);
    mid.push(root.val);
    inorder(root.right);
  }

  // 工具函数2：将有序序列转化为平衡二叉树
  function buildAVL(low, high) {
    // 如果 low > high，则说明当前序列已经处理完毕
    if (low > high) {
      return null;
    }

    // 否则，通过 low 和 high 找到序列的中间元素，将其作为根节点
    let mid = Math.floor(low + (high - low) / 2);
    let root = new TreeNode(mid[mid]);
    // 根据左右序列继续构造左右子树
    root.left = buildAVL(low, mid - 1);
    root.right = buildAVL(mid + 1, high);

    return root;
  }
};
