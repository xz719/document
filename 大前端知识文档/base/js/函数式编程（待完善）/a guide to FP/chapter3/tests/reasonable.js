// 变量名对应关系: p = player 玩家, a = attacker 攻击者, t = target 被攻击者
// 定义两名玩家
const joe = new Map([
  ["name", "Joe"],
  ["hp", 20],
  ["team", "red"],
]);
const michael = new Map([
  ["name", "Michael"],
  ["hp", 20],
  ["team", "green"],
]);

const decrementHP = (p) => p.set("hp", p.get("hp") - 1);
const isSameTeam = (p1, p2) => p1.get("team") === p2.get("team");

const punch = (a, t) => (isSameTeam(a, t) ? t : decrementHP(t));

console.log(punch(joe, michael));

// 在上面的例子中，decrementHP、isSameTeam以及 punch 三者均是纯函数，即它们是引用透明的

/* 
 * 对于这种引用透明的函数，我们可以采用【等式推导】的方式，来对代码进行分析 
 * 
 * 首先我们知道，引用透明就是指一个函数的调用，可以用其执行结果进行替代
 * 
 * 所以，我们知道如下的等价关系：
 * 
 *      isSameTeam(a, t) === (a.get('team') === t.get('team'))
 * 
 * 即 const punch = (a, t) => (isSameTeam(a, t) ? t : decrementHP(t)); 就可以被替换为 const punch = (a, t) => (a.get('team') === t.get('team') ? t : decrementHP(t));
 * 
 * 而由于此时a和t都是固定值，所以，我们实际上可以直接写成：
 * 
 *      const punch = (a, t) => ('red' === 'green' ? t : decrementHP(t));
 * 
 * 即 const punch = (a, t) => decrementHP(t);
 * 
 * 进一步地，由于：
 * 
 *      decrementHP(t) === t.set("hp", t.get("hp") - 1)
 * 
 * 所以，最终，punch方法变成了一个让某一玩家hp减一的调用：const punch = (a, t) => t.set("hp", t.get("hp") - 1)
 */

// 总之，在引用透明的情况下，我们能够使用【等式推导】的方式来分析代码，从而帮助我们重构代码