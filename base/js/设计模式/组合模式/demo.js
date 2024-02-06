// 文件夹 --- 组合对象
class Folder {
  constructor(name) {
    this.name = name;
    this.parent = null;
    this.files = [];
  }

  // 向文件夹中添加文件的方法
  add (file) {
    // 将文件的父节点指向本文件夹
    file.parent = this
    this.files.push(file)
    return this
  }

  // 扫描文件夹，显示该文件夹下的所有文件信息
  scan () {
    // 委托给其下的叶对象完成
    this.files.forEach((f) => {
        f.scan()
    })
  }

  // 将某一文件从文件夹中移除
  remove (file) {
    // 若不指定某一文件，则将该文件夹中的所有文件移除
    if (typeof file === 'undefined') {
        this.files = []
        return;
    }
    // 若指定了文件，则将其移除
    this.files = this.files.filter((f) => {
        return f !== file
    })
  }
}

// 文件 --- 叶对象
class File {
    constructor (name) {
        this.name = name
        this.parent = null
    }

    // 叶对象需与组合对象保持一致的接口！即需要实现所有组合对象中的方法
    add (file) {
        // 文件中不允许添加文件，抛错
        throw new Error('文件下不允许添加文件！')
    }

    scan () {
        let fullPath = [this.name]
        let parent = this.parent

        // 如果有父节点，则遍历找到该文件的完整路径
        while(parent) {
            // 向路径的前面加入父节点的名称
            fullPath.unshift(parent.name)
            // 继续向上查找
            parent = parent.parent
        }
        // 输出本文件的完整路径
        console.log(fullPath.join('/'))
    }

    remove () {
        this.parent.remove(this)
    }
}

/**
 * test ----------------------
 */

// 新建几个文件夹
let webFolder = new Folder('Web')
let frontFolder = new Folder('前端')
let cssFolder = new Folder('CSS');
let jsFolder = new Folder('JS');
let backFolder = new Folder('后端');

// 维护文件夹之间的嵌套关系
webFolder.add(frontFolder).add(backFolder)
frontFolder.add(cssFolder).add(jsFolder)

// 新建几个文件
let file1 = new File('HTML权威指南.pdf');
let file2 = new File('CSS权威指南.pdf');
let file3 = new File('JavaScript权威指南.pdf');
let file4 = new File('MySQL基础.pdf');
let file5 = new File('Web安全.pdf');
let file6 = new File('Linux菜鸟.pdf');

// 向文件夹中添加文件
frontFolder.add(file1)
cssFolder.add(file2)
jsFolder.add(file3)
backFolder.add(file4).add(file6)
webFolder.add(file5)

// 移除某一文件或移除某一文件夹下的所有文件
// file6.remove()
backFolder.remove()

// 扫描
webFolder.scan();