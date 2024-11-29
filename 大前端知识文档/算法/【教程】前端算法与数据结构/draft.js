/**
 * 二叉树结点的结构定义如下
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
const lowestCommonAncestor = function (root, p, q) {
  // 获取 p 的路径
  const pathForP = getPath(root, p);
  // 获取 q 的路径
  const pathForQ = getPath(root, q);
  // 找到两条路径中最后一个相同的元素
  let i = 0;
  while (i < Math.min(pathForP.length, pathForQ.length)) {
    if (pathForP[i] === pathForQ[i]) {
      i++;
    } else {
      break;
    }
  }
  return pathForP[i - 1];
};

// 工具函数，找到二叉树中的某一结点并输出路径
function getPath(root, target) {
  let res = [];

  // dfs 逻辑
  function dfs(root) {
    // root 为空，则说明当前子树上不存在
    if (!root) {
      return false;
    }

    // 将路径入栈
    res.push(root.val);

    if (root.val === target) {
      // 找到目标，停止dfs
      return true;
    } else if (!dfs(root.left) && !dfs(root.right)) {
      res.pop();
      return false;
    } else {
      return true;
    }
  }

  dfs(root);

  return res;
}

function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}

const test3 = new TreeNode(3);
const test5 = new TreeNode(5);
const test1 = new TreeNode(1);
test3.left = test5;
test3.right = test1;

const test6 = new TreeNode(6);
const test2 = new TreeNode(2);
const test0 = new TreeNode(0);
const test8 = new TreeNode(8);
test5.left = test6;
test5.right = test2;
test1.left = test0;
test1.right = test8;

const test4 = new TreeNode(4);
const test7 = new TreeNode(7);
test2.left = test4;
test2.right = test7;

const res = lowestCommonAncestor(test3, 7, 1);
console.log(res);
