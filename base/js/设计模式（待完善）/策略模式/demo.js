// 所谓策略模式, 就是定义一系列的算法, 将它们封装起来, 并使得它们能够互相替换

// 实现策略模式的关键在于: 将算法的使用与算法的实现分离开来.

/* 
    引用:

        一个基于策略模式的程序至少由两部分组成:

            第一部分是一组【策略类】, 策略类中封装了具体的算法, 负责具体的计算过程. 
            第二部分是【环境类】, 环境类接受客户的请求,随后把请求委托给一个策略类.
        
        要实现第二点, 说明环境类中需要始终保有对某一策略实例的引用. 

    策略模式可以用于组合一系列【算法】，也可用于组合一系列【业务规则】
*/

/* 
    考虑下面场景：

        我们需要通过成绩等级来计算学生的最终成绩，每个等级均有对应的加权值。
*/

// 首先是各个成绩等级的加权值
let levelMap = {
    S: 10,
    A: 8,
    B: 6,
    C: 4,
}

// 由于这个场景下，所有的情况都是已知的，所以直接用对象字面量(常量)的形式直接定义好对应各个成绩等级的组策略即可
let scoreStrategies = {
    basicScore: 80,

    // 等级S的策略
    S: function() {
        return this.basicScore + levelMap['S']
    },
    // 等级A的策略
    A: function() {
        return this.basicScore + levelMap['A']
    },
    // 等级B的策略
    B: function() {
        return this.basicScore + levelMap['B']
    },
    // 等级C的策略
    C: function() {
        return this.basicScore + levelMap['C']
    },
}

// 调用各等级策略的方法，这里实际上相当于一个简化后的环境类
function getScore(level) {
    return scoreStrategies[level] ? scoreStrategies[level]() : 0
}

// 客户请求获取学生最终成绩
console.log(
    getScore('S'),
    getScore('A'),
    getScore('B'),
    getScore('C'),
    getScore('D')
)   // 90 88 86 84 0