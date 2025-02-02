# 真题训练 --- google

## 1. 岛屿数量问题

```cmd
题目描述：给你一个由 '1'（陆地）和 '0'（水）组成的的二维网格，请你计算网格中岛屿的数量。
岛屿总是被水包围，并且每座岛屿只能由水平方向或竖直方向上相邻的陆地连接形成。
此外，你可以假设该网格的四条边均被水包围。

示例 1:
输入:
11110
11010
11000
00000
输出: 1

示例 2:
输入:
11000
11000
00100
00011
输出: 3
```

### 1.1 💡思路分析

首先，我们要将题干翻译为简单直接的算法语言。从示例中可以看出，所谓的“网格”，不过就是二维数组，而“岛屿”就是相互连接的 1，“水”则是 0。那么，题目就可以翻译为如下：

> 已知一个二维数组，定义“相互连接的1”为一个块（这里的相互连接，意思就是 1 和 1 之间可以不经过 0 就相互抵达），求符合条件的块的数量。

翻译到这个程度之后，我们不难找出【相互连接】这个关键词作为我们做题的抓手，进而去形成一个初步的思路 --- 若当前所在位置是 1，从 1 出发，可以抵达的所有 1 都和它算作同一个岛屿。

既然是【所有】，那么就与枚举有关，既然是枚举，那么就可以联想到 DFS 和 BFS！

这里我们选择用 DFS 来做。

在明确了 DFS 的大方向之后，结合题意，我们可以提取出以下关键问题：

1. 如何实现对不同岛屿的统计？
2. 已经计算过的岛屿如何排除？

对于第一个问题，从起点出发，遵循“不撞水面（也就是 0）不回头”的原则，枚举当前可以触及的所有 1。当枚举无法继续进行时，说明当前这座岛屿被遍历完毕，记为一个。**也就是说每完成一次 DFS，就累加一个岛屿**。

对于第二个问题，本质上是为了避免重复计算，每遍历过一个 1，就把它置为 0，后续再次路过时就会自动忽略了。

接下来就可以编码了。

### 1.2 编码实现

```js
/**
 * @param {character[][]} grid
 * @return {number}
 */
// 入参是二维数组
const numIslands = function (grid) {
  const moveX = [0, 1, 0, -1];
  const moveY = [1, 0, -1, 0];
  // 处理二维数组的边界情况
  if (!grid || grid.length === 0 || grid[0].length === 0) {
    return 0;
  }
  // 初始化岛屿数量
  let count = 0;
  // 缓存二维数组的行数和列数
  let row = grid.length,
    column = grid[0].length;
  // 以行和列为线索，尝试“逐个”遍历二位数组中的坑位
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < column; j++) {
      if (grid[i][j] === "1") {
        // 每遇到1，就进入dfs，探索岛屿边界
        dfs(grid, i, j);
        // 每完成一个 dfs，就累加一个岛屿
        count++;
      }
    }
  }
  return count;

  // 编写探索岛屿边界的逻辑
  function dfs(grid, i, j) {
    // 如果试图探索的范围已经越界，则return
    if (
      i < 0 ||
      i >= grid.length ||
      j < 0 ||
      j >= grid[0].length ||
      grid[i][j] === "0"
    ) {
      return;
    }
    // 遍历过的坑位都置0，防止反复遍历
    grid[i][j] = "0";
    // 遍历完当前的1，继续去寻找下一个1
    for (let k = 0; k < 4; k++) {
      dfs(grid, i + moveX[k], j + moveY[k]);
    }
  }
};
```

### 1.3 技巧

这道题里有一个值得关注的做题技巧，就是对 `moveX` 和 `moveY` 两个数组的设定：

```js
const moveX = [0, 1, 0, -1]  
const moveY = [1, 0, -1, 0]   
```

结合代码的上下文可以看出，我们借助这两个数组，可以完成对当前格子的“垂直”和“水平”两个方向上的相邻格子的检查：

```js
for(let k=0; k<4; k++) {
  dfs(grid, i+moveX[k], j+moveY[k])
}
```

后续再次遇到题干中说明了“水平”、“垂直”方向上相邻关系的模拟类题目，就可以直接使用这个技巧。

## 2. “扫地机器人”问题

```cmd
题目描述：房间（用格栅表示）中有一个扫地机器人。格栅中的每一个格子有空和障碍物两种可能。
扫地机器人提供4个API，可以向前进，向左转或者向右转。每次转弯90度。
当扫地机器人试图进入障碍物格子时，它的碰撞传感器会探测出障碍物，使它停留在原地。
请利用提供的4个API编写让机器人清理整个房间的算法。
```

```js
interface Robot {
  // 若下一个方格为空，则返回true，并移动至该方格
  // 若下一个方格为障碍物，则返回false，并停留在原地
  boolean move();

  // 在调用turnLeft/turnRight后机器人会停留在原位置
  // 每次转弯90度
  void turnLeft();
  void turnRight();

  // 清理所在方格
  void clean();
}
```

```cmd
示例:
输入:
room = [
[1,1,1,1,1,0,1,1],
[1,1,1,1,1,0,1,1],
[1,0,1,1,1,1,1,1],
[0,0,0,1,0,0,0,0],
[1,1,1,1,1,1,1,1]
],
row = 1,
col = 3
解析: 房间格栅用 0 或 1 填充。0 表示障碍物，1 表示可以通过。 机器人从 row=1，col=3 的初始位置出发。在左上角的一行以下，三列以右。

注意:
输入只用于初始化房间和机器人的位置。你需要“盲解”这个问题。换而言之，你必须在对房间和机器人位置一无所知的情况下，只使用 4 个给出的API解决问题。 
扫地机器人的初始位置一定是空地。
扫地机器人的初始方向向上。
所有可抵达的格子都是相连的，亦即所有标记为 1 的格子机器人都可以抵达。
可以假定格栅的四周都被墙包围。
```

### 2.1 💡思路分析

与上面的岛屿问题类似，这里的房间显然也是一个二维数组。

#### 2.1.1 整体思路

这道题涉及到对二维数组网格的枚举，可能与岛屿数量问题的基本思路一致（将 `DFS` 作为优先方法来考虑）。那么我们就沿着这个思路向下分析：

1. 机器人从初始位置出发，检查上下左右四个方向是否有障碍物，进而决定是否进入对应方向的格子完成清扫。
2. 因为题目强调了“所有可抵达的格子都是相连的，亦即所有标记为 1 的格子机器人都可以抵达”，所以我们借助 `DFS` 尝试枚举所有可抵达的格子是完全没有问题的。`DFS` 的主要递归逻辑其实就是步骤 1。
3. 当某一个方向已经“撞到南墙”后，机器人应该逐渐回溯到上一个位置，尝试新的方向。
4. 最后，由于递归边界其实就是**障碍物/已经清扫过的格子**。所以别忘了对已经清扫过的格子做个标记。

整体思路有了，下面就需要对各具体步骤进行分析了。

#### 2.1.2 机器人的前进规则

题目的复杂之处在于强调了“上下左右”的概念，它要求我们先旋转、再判断、最后根据判断结果决定是否需要前进。也就是说，我们不仅需要考虑机器人的前进坐标，还需要考虑机器人的旋转角度。其实无论旋转也好、前进也罢，本质上都是让它“自己动”。大家记住，“自己动”往往和循环有关。比如说上一道题里，我们就是用一个固定 `k=4` 的循环来完成了上下左右四个方向的前进：

```js
for(let k=0; k<4; k++) {
  dfs(grid, i+moveX[k], j+moveY[k])
}
```

在这道题里，我们同样可以用类似的循环来实现四个方向的旋转+前进。明确了循环结构的设计，现在继续来分析循环体。

既然题目已经把步骤拆成了旋转和前进两步，那么我们就有必要把旋转角度和前进坐标之间的关系对应起来。假设机器人现在所在的格子坐标是 `(i, j)`，它的旋转角度以及对应的前进坐标之间就有以下关系（结合题意我们把“上”这个初始方向记为 0 度）：

```js
（定义逻辑）  
// 初始化角度为 0 度  
let dir = 0   
...   

（判断逻辑）
// 将角度和前进坐标对应起来
switch(dir) {
    // 0度的前进坐标，是当前坐标向上走一步
    case 0:   
        x = i - 1  
        break
    // 90度（顺时针）的前进坐标，是当前坐标向右走一步
    case 90: 
        y = j + 1   
        break
    // 180度（顺时针）的前进坐标，是当前坐标向下走一步
    case 180: 
        x = i + 1  
        break
    // 270度（顺时针）的前进坐标，是当前坐标向左走一步
    case 270: 
        y = j - 1
        break
    default:
        break
}
...
（叠加逻辑）
// 注意这里我给机器人的规则就是每次顺时针转一个方向，所以是 turnRight
robot.turnRight() 
// turnRight的同时，dir需要跟着旋转90度  
dir += 90  
// 这里取模是为了保证dir在[0, 360]的范围内变化
dir %= 360 
```

#### 2.1.3 如何优雅地对已处理过的格子做标记

在这道题里，是否还可以沿用“岛屿数量”问题中直接修改二维数组的思路？就这道题来说，题给的四个 `API` 都不是我们自己实现的，一旦改了全局的 `room` 变量，谁知道会影响哪个 `API` 呢。保险起见，我们应该优先考虑**不污染 `room` 变量的实现方法**，所以，我们借助 `Set` 数据结构：

```js
（以下是定义逻辑）
//初始化一个 set 结构来存储清扫过的坐标
const boxSet =  new Set()  
...

（以下是判断逻辑）
// 标识当前格子的坐标
let box = i + '+' + j  
// 如果已经打扫过，那么跳过
if(boxSet.has(box)) return 
// 打扫当前这个格子
robot.clean()  
// 记住这个格子
boxSet.add(box)
```

分析完了这些问题，我们就可以开始编码了。

### 2.2 编码实现

```js
/**
 * @param {Robot} robot
 * @return {void}
 */
const cleanRoom = function(robot) {
    // 初始化一个 set 结构来存储清扫过的坐标
    const boxSet =  new Set()  
    // 初始化机器人的朝向
    let dir = 0  
    // 进入 dfs
    dfs(robot, boxSet, 0, 0, 0)

    // 定义 dfs  
    function dfs(robot, boxSet, i, j, dir) {
        // 记录当前格子的坐标
        let box = i + '+' + j  
        // 如果已经打扫过，那么跳过
        if(boxSet.has(box)) return 
        // 打扫当前这个格子
        robot.clean()  
        // 记住这个格子
        boxSet.add(box)

        // 四个方向试探
        for(let k=0;k<4;k++) {
            // 如果接下来前进的目标方向不是障碍物（也就意味着可以打扫）
            if(robot.move()) {
                // 从当前格子出发，试探上右左下
                let x = i, y = j
                // 处理角度和坐标的对应关系
                switch(dir) {
                    case 0:   
                        x = i - 1  
                        break
                    case 90: 
                        y = j + 1   
                        break  
                    case 180: 
                        x = i + 1  
                        break  
                    case 270: 
                        y = j - 1
                        break   
                    default:
                        break
                }
                dfs(robot, boxSet, x, y, dir)
                // 一个方向的dfs结束了，意味着撞到了南墙，此时我们需要回溯到上一个格子 
                robot.turnLeft()
                robot.turnLeft()
                robot.move()
                robot.turnRight()
                robot.turnRight()
            }
            // 转向 
            robot.turnRight() 
            dir += 90  
            dir %= 360 

        }
    }
}
```

## 3. “合并区间”问题

```cmd
题目描述：给出一个区间的集合，请合并所有重叠的区间。

示例 1:
输入: [[1,3],[2,6],[8,10],[15,18]]
输出: [[1,6],[8,10],[15,18]]
解释: 区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].

示例 2:
输入: [[1,4],[4,5]]
输出: [[1,5]]
解释: 区间 [1,4] 和 [4,5] 可被视为重叠区间。
```

### 3.1 💡思路分析

现在来一起解决一个并没有许多套路的数学问题。

这个题里，你什么都可以忽略，但是请一定抓住【区间】二字，并记住下面这样一个规律：

> 对于区间类问题，尝试以区间内的第一个元素为索引进行排序，往往可以帮助我们找到问题的突破点

比如题中给了我们这样一个例子：

```js
[[1,3],[2,6],[8,10],[15,18]] 
```

这个例子就是一个排序过的区间，当区间排序后，区间与区间之间的重叠关系会变得非常有迹可循：

```js
[1, 3]
  [2, 6]
            [8, 10]
                        [15, 18]
```

可以看出，对于有序区间，我们其实可以从头开始，**逐个合并首尾有交集的区间** --- 比如上面区间关系图中的 `[1, 3]` 和 `[2, 6]`，由于前一个区间的尾部（3）和下一个区间的头部（2）是有交错关系的（这个交错关系用数学语言表达出来就是 `前一个的尾部 >= 下一个的头部`），因此我们可以毫不犹豫地把它们合并为一个区间：

```js
[1, 3] + [2, 6] ==> [1, 6]
```

遵循这个合并规则，我们可以编码如下：

### 3.2 编码实现

```js
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
const merge = function(intervals) {
    // 定义结果数组
    const res = []  
    // 缓存区间个数
    const len = intervals.length
    // 将所有区间按照第一个元素大小排序
    intervals.sort(function(a, b) {
        return a[0] - b[0]
    }) 
    // 处理区间的边界情况
    if(!intervals || !intervals.length) {
        return []
    }
    // 将第一个区间（起始元素最小的区间）推入结果数组（初始化）
    res.push(intervals[0])
    // 按照顺序，逐个遍历所有区间
    for(let i=1; i<len; i++) {
        // 取结果数组中的最后一个元素，作为当前对比的参考
        let prev = res[res.length-1]  
        // 若满足交错关系（前一个的尾部 >= 下一个的头部）
        if(prev[1] >= intervals[i][0]) {
            prev[1] = Math.max(prev[1], intervals[i][1])
        } else {
            res.push(intervals[i])
        }
    }
    return res
}
```