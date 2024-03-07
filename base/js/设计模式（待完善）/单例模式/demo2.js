// 在 demo1 中，已经实现了一个简单的单例模式，但如果我们需要在另一个场景中使用单例模式呢？

// 比如：我们的系统中还需要一个监管者，这个监管者同样符合前面设置管理员的要求，即系统中始终只会有一个监管者，且该监管者不会变化

// 那么，我们要如何实现？把前面的代码复制过来，然后修改构造函数和设置单例的方法？

// 这样的话，代码的通用性会很差。实际上，我们可以写一个通用的设置单例方法!
/* 
    设置单例方法，接收一个创建某一类实例的函数，且每次调用函数时, 都会创建一个闭包, 用于保存该类的唯一实例,
    
    返回一个函数, 用于获取当前系统中的唯一实例, 当系统中没有该类的实例时, 创建一个实例
*/
function setSingleton(fn) {
    let instance = null

    return function() {
        if (!instance) {
            instance = fn.apply(this, arguments)
        }

        return instance
    } 
}

// 用该单例方法来实现我们前面的例子
// 创建管理员
function createAdmin(name) {
    this.admin = name
}

createAdmin.prototype.getCurAdmin = function() {
    return this.admin
}

// 获取系统中的管理员单例
let getAdminSingleton = setSingleton(function (name) {
    let admin = new createAdmin(name)
    return admin
})

// 尝试重复设置管理员
console.log(getAdminSingleton('a').getCurAdmin())   // a
console.log(getAdminSingleton('b').getCurAdmin())   // a, 即当前系统中有且只有一个管理员实例!

// 现在, 我们要实现针对监管者的单例模式, 我们仅需要准备好监管者的构造函数即可
// 创建监管者
function createWatcher(name) {
    this.watcher = name
}

createWatcher.prototype.getCurWatcher = function() {
    return this.watcher
}

// 获取系统中的监管者单例
let getWatcherSingleton = setSingleton(function (name) {
    let watcher = new createWatcher(name)
    return watcher
})

// 尝试重复设置监管者
console.log(getWatcherSingleton('a watcher').getCurWatcher())   // a watcher
console.log(getWatcherSingleton('b watcher').getCurWatcher())   // a watcher, 系统中有且只有一个监管者!


// 下面是一个更具象化的例子: 假如我们现在需要保证页面中有且只有一个div元素, 我们应该如何实现?
// 首先需要准备创建div元素的方法
function createDiv (html) {
    let div = document.createElement('div')
    div.innerHTML = html
    document.body.append(div)
    return div
}

// 经过单例处理后的创建div方法
let getDivSingleton = setSingleton(function () {
    let div = createDiv.apply(this, arguments)
    return div
})

// 尝试多次创建div元素
let div = getDivSingleton('the only div')
getDivSingleton('try to create another div')
getDivSingleton('try to create another div again')
// 无论尝试多少次, 页面中始终只有一个内容为 the only div 的div元素!

/* 
    总结
*/

/* 
    问题在于: 为什么 setSingleton 方法能够实现单例模式? 或者说, 它为什么能够保证一个类在系统中仅有一个实例? 

    让我们回过头来看看 setSingleton 方法:

        function setSingleton(fn) {
            let instance = null

            return function() {
                if (!instance) {
                    instance = fn.apply(this, arguments)
                }

                return instance
            } 
        }

    对于 setSingleton 方法本身, 其的执行结果是返回一个函数, 所以其是一个高阶函数. 在 setSingleton 方法执行期间, 会创建一个变量instance, 然后在返回的函数中使用它.

    从而, 构成了一个闭包, 其目的在于, 利用闭包的特性, 将变量instance封装为一个私有变量, 使得外部无法随意改变这个变量. 

    然后, 我们再来看 setSingleton 方法所返回的函数. 其内容很简单, 就是当instance的指向不为空时, 利用接收的创建实例方法来创建一个该类的实例. 

    综合以上, setSingleton 方法能够实现单例模式的关键在于: 将创建变量instance的操作与真正创建类实例的操作分离开来, 保证变量instance的私有性且instance始终指向已存在的实例, 然后, 对外部提供的创建实例方法进行处理, 确保只有在instance无法找到已存在的实例时, 才会创建实例.

    另外, 每次我们调用 setSingleton 方法时, 都会产生一个新的变量instance以及其的闭包, 从而使得我们能够实现针对不同类的单例模式, 即, 保证了该方法的通用性!
*/

/* 
    单例模式的应用场景很多, 比如: Windows系统中的任务管理器和回收站, 就是很典型的单例应用, 我们无法打开两个任务管理器或回收站. 

    而在 JS 中, 单例模式一般有以下应用场景：

    1. 配置管理器：在一个应用程序中，可能需要读取一个配置文件，但是如果多个对象都去读取同一个配置文件，会造成资源的浪费和配置的不一致。可以使用单例模式来确保只有一个对象去读取配置文件，并将配置信息存储在内存中，其他对象可以通过该单例对象获取配置信息。
    2. 状态管理器：在一个应用程序中，可能有多个组件需要共享一些状态，比如全局状态、用户信息等等。可以使用单例模式来确保只有一个对象管理这些状态，并提供方法来获取、更新这些状态、Vuex。
    3. 消息总线：在一个应用程序中，可能有多个组件需要进行通信，比如发送事件、监听事件等等。可以使用单例模式来确保只有一个对象管理消息总线，并提供方法来发送、监听消息。
    4. 资源管理器：在一个应用程序中，可能需要管理一些共享的资源，比如图片、音频等等。可以使用单例模式来确保只有一个对象管理这些资源，并提供方法来获取、释放这些资源。
    
    总的来说, 单例模式一般在满足以下条件时使用:

        * 资源共享的情况下, 避免由于资源操作时导致的性能或损耗. 
        * 控制资源的情况下, 方便资源之间的相互通信.

    总之，在 JavaScript 中，单例模式同样可以应用于需要确保某些对象只有一个实例的场景。
    但是需要注意的是，JavaScript 是一门动态语言，单例对象可以被修改或重新赋值，需要谨慎使用。
    此外，单例模式也可能会带来一些问题，比如可能会影响代码的可测试性、可扩展性和可维护性，需要根据具体情况来决定是否使用单例模式
*/
