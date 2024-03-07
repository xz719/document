// 所谓单例模式，就是保证一个类仅有一个实例，并提供一个访问该实例的全局访问点

// 实现单例模式的核心在于：1. 确保只有一个实例；2. 提供全局访问点

/* 
    1. 考虑下面的情况，我们需要设置一个管理员，但系统中始终只会有一个管理员，且该管理员不会变化
*/
// 指定管理员
function createAdmin(name) {
    this.admin = name
}

createAdmin.prototype.getCurAdmin = function() {
    return this.admin
}

// 单例设置管理员，并获取该管理员实例
const SingletonSetAdmin = (function() {
    // 利用闭包，保存一个内部变量
    let admin = null;

    return function(name) {
        // 只有当系统中不存在管理员时，才指定一个新的管理员，这样就保证了系统中始终只有一个管理员
        if (!admin) {
            admin = new createAdmin(name)
        }

        return admin
    }
})()

// 第一次尝试设置管理员
console.log(SingletonSetAdmin('original admin').getCurAdmin())              // 设置成功！输出：original admin

// 第二次尝试设置管理员
console.log(SingletonSetAdmin('try to update admin').getCurAdmin())         // 设置失败，仍然输出：original admin

// 第三次尝试设置管理员
console.log(SingletonSetAdmin('try to update admin again').getCurAdmin())   // 设置失败，仍然输出：original admin

// 即，实现了系统中仅存在一个实例，且我们可以通过某些方式访问到这个实例