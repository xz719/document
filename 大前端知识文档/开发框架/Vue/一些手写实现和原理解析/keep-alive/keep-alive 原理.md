# keep-alive

## 是什么？

* keep-alive 是一个 Vue 全局组件
* keep-alive 本身不会渲染出来，也不会出现在父组件链中
* keep-alive 包裹动态组件时，会**缓存不活动的组件**，而不是销毁它们

## 怎么用？

keep-alive 接收三个参数：

* `include`：可传**字符串、正则表达式、数组**，名称匹配成功的组件会被缓存
* `exclude`：可传**字符串、正则表达式、数组**，名称匹配成功的组件不会被缓存
* `max`：可传**数字**，限制缓存组件的最大数量

`include` 和 `exclude`，传数组情况居多

具体使用如下：

1. 包裹动态组件：

   ```vue
   <!-- 通过 v-bind 传数组 -->
   <keep-alive :include="allowList" :exclude="noAllowList" :max="amount"> 
        <component :is="currentComponent"></component> 
   </keep-alive>
   ```

2. 包裹路由组件（router-view）：

   ```vue
   <!-- 通过 v-bind 传数组 -->
   <keep-alive :include="allowList" :exclude="noAllowList" :max="amount"> 
        <router-view></router-view> 
   </keep-alive>
   ```

## 原理

### 组件基础

根据前面的了解可以知道，keep-alive 是一个全局组件且接收三个参数。首先我们来看看 keep-alive 在它的各个生命周期中都干了些什么：

* `created`：初始化一个 `cache` 和一个 `keys`，`cache` 用于存储缓存组件的虚拟 DOM，`keys` 则用于存放缓存组件的 key。
* `mounted`：实时监听 `include`、`exclude` 的变化，并执行相应操作。
* `destroyed`：删除所有缓存相关内容。

由此，我们基本上可以写出 keep-alive 的基础结构如下：

```js
export default {
    name: "keep-alive",
    abstract: true,     // 该属性尤其重要，因为 keep-alive 组件是不会被渲染到页面上的！
    props: {
        include: patternTypes,  // 这里实际上就是声明 include、exclude 可以接收的类型，字符串、数组、正则都可以
        exclude: patternTypes,
        max: [String, Number]
    },
    // created
    created() {
        this.cache = Object.create(null) // 创建对象来存储缓存组件的虚拟DOM
        this.keys = [] // 创建数组来存储缓存组件的key
    },
    // mounted
    mounted() {
        // 实时监听 include、exclude 的变动
        this.$watch('include', val => {
            // ...
        })
        this.$watch('exclude', val => {
            // ...
        })
    },
    // mounted
    destroyed() {
        for (const key in this.cache) { // 删除所有的缓存
            // ...
        }
    },

    // ...其他方法
}
```

### 删除缓存

#### pruneCacheEntry 函数

先从简单的开始，在上面的生命周期中，我们说过，在 destroyed 生命周期钩子中，会将所有缓存删除，而这个操作就通过调用 pruneCacheEntry 方法来实现的，下面来看看这个方法里面都做了哪些事情：

```js
// src/core/components/keep-alive.js

function pruneCacheEntry (
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key]
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy() // 执行组件的 destroy 钩子函数
  }
  cache[key] = null  // 设为null
  remove(keys, key) // 删除对应的元素
}
```

简单来说，就是：

1. 执行缓存组件的 destroy 钩子函数
2. 将 cache 中的对应项置为 null
3. 删除 keys 中的 key

结合 destroyed 钩子中的遍历操作，实际上就是将整个缓存 cache 遍历一遍，并执行所有缓存组件的 destroy 钩子函数，最后将 cache、keys 完全清空。

### 渲染

https://juejin.cn/post/7043401297302650917?searchId=20240727133430300A0966B2F62FF1F841