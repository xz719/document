# Git 变基

## 1. 变基 --- rebase

在 Git 中整合来自不同分支的修改主要有两种方法：`merge` 以及 `rebase`。

在前面的文章中已经介绍了`merge`，这里我们来学习另一个指令`rebase`。

### 💡变基的基本操作

回顾之前在 [分支的合并](https://git-scm.com/book/zh/v2/ch00/_basic_merging) 中的一个例子，在该例子中，我们可以看到开发任务分叉到两个不同分支，又各自提交了更新。

![在这里插入图片描述](https://img-blog.csdnimg.cn/68437a90737249b09b1bbd7add4e5713.png#pic_center)

之前介绍过，整合分支最容易的方法是 `merge` 命令。 当两个分支分叉时，它会把两个分支的最新快照（`C3` 和 `C4`）以及二者最近的共同祖先（`C2`）进行**三方合并**，合并的结果是**生成一个新的快照（并提交）**。

![在这里插入图片描述](https://img-blog.csdnimg.cn/67c80d6019584a239421291868d4c852.png#pic_center)

其实，还有一种方法：你可以**提取在 `C4` 中引入的补丁和修改，然后在 `C3` 的基础上应用一次。** 在 Git 中，这种操作就叫做 **变基（rebase）**。 你可以使用 `rebase` 命令**将提交到某一分支上的所有修改都移至另一分支上**，就好像“重新播放”一样。

比如，在这个例子中，执行下面的指令：

```cmd
git checkout experiment
git rebase master
```

即切换到 experiment 分支，**将其变基到 master 上**（这里需要注意一下，因为使用`merge`时，是在合并入的分支上，将要合并的分支合并到当前分支，而使用`rebase`时，则是将当前分支变基到目标分支上）。

`rebase`的原理是：

首先找到这两个分支（即当前分支 `experiment`、变基操作的目标基底分支 `master`） 的**最近共同祖先** `C2`，然后对比当前分支相对于该祖先的历次提交，提取相应的修改并存为临时文件， 然后**将当前分支指向目标基底分支指向的提交对象`C3`**, 最后以此**将之前另存为临时文件的修改依序应用**。

![在这里插入图片描述](https://img-blog.csdnimg.cn/2ffd8a9bd81f4e0682f3d1c5c73b866e.png#pic_center)

此时，`C4'` 提交对象中的快照就和上面使用`merge`时 `C5` 提交对象中的快照一模一样了！

但是，这里需要注意的是，变基过程中，**目标基底分支的指针是不会变化的**！移动是仅仅是当前分支的指针，所以，实际上 `git rebase xxx` 也可以理解为基于xxx进行变基。

比如这个例子中，目标基底分支master是始终没有变化的，仅仅是当前分支experiment发生了移动。

如果你后续想要让master分支跟上进度，只需要执行一次**快进合并（fast-forward）**即可（实际上就是执行`merge`）。

## 2. rebase 与 merge 的区别

对于`merge`和`rebase`，**这两种整合方法的最终结果没有任何区别**，但是**变基使得提交历史更加整洁**。 你在查看一个经过变基的分支的历史记录时会发现，尽管实际的开发工作是并行的， 但它们看上去就像是串行的一样，提交历史是一条直线没有分叉。

一般我们这样做的目的是为了确保在向远程分支推送时能保持提交历史的整洁——例如向某个其他人维护的项目贡献代码时。 在这种情况下，你首先在自己的分支里进行开发，当开发完成时你需要先将你的代码变基到 `origin/master` 上，然后再向主项目提交修改。 这样的话，该项目的维护者就不再需要进行整合工作，只需要快进合并便可。

总的来说，无论是通过变基，还是通过三方合并，整合的最终结果所指向的快照始终是一样的，只不过提交历史不同罢了。

**变基是将一系列提交按照原有次序依次应用到另一分支上，而合并是把最终结果合在一起**。

## 3. 变基的其他使用方法

在对两个分支进行变基时，所生成的“重放”并不一定要在目标分支上应用，你也可以指定另外的一个分支进行应用。 就像 [从一个主题分支里再分出一个主题分支的提交历史](https://git-scm.com/book/zh/v2/ch00/bdiag_e) 中的例子那样。 你创建了一个主题分支 `server`，为服务端添加了一些功能，提交了 `C3` 和 `C4`。 然后从 `C3` 上创建了主题分支 `client`，为客户端添加了一些功能，提交了 `C8` 和 `C9`。 最后，你回到 `server` 分支，又提交了 `C10`。

![在这里插入图片描述](https://img-blog.csdnimg.cn/94633fe387c54e82af89f10e08175934.png#pic_center)

假设你希望将 `client` 中的修改合并到主分支并发布，但暂时并不想合并 `server` 中的修改， 因为它们还需要经过更全面的测试。这时，你就可以使用 `git rebase` 命令的 `--onto` 选项， 选中在 `client` 分支里但不在 `server` 分支里的修改（即 `C8` 和 `C9`），将它们在 `master` 分支上重放：

```console
git rebase --onto master server client
```

以上命令的意思是：**“取出 `client` 分支，找出它从 `server` 分支分歧之后的补丁， 然后把这些补丁在 `master` 分支上重放一遍，让 `client` 看起来像直接基于 `master` 修改一样”**。这理解起来有一点复杂，不过效果非常酷。

![在这里插入图片描述](https://img-blog.csdnimg.cn/c491d2203b71431aa6b42dd36a88b04c.png#pic_center)

现在可以快进合并 `master` 分支了。（如图 [快进合并 `master` 分支，使之包含来自 `client` 分支的修改](https://git-scm.com/book/zh/v2/ch00/bdiag_g)）：

```console
git checkout master
git merge client
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/e4757d6707ea4ea2bcc682905e476bab.png#pic_center)

接下来你决定将 `server` 分支中的修改也整合进来。 使用 `git rebase <basebranch> <topicbranch>` 命令可以直接将主题分支 （即本例中的 `server`）变基到目标分支（即 `master`）上。 这样做能省去你先切换到 `server` 分支，再对其执行变基命令的多个步骤。

```console
git rebase master server
```

如图 [将 `server` 中的修改变基到 `master` 上](https://git-scm.com/book/zh/v2/ch00/bdiag_h) 所示，`server` 中的代码被“续”到了 `master` 后面。

![在这里插入图片描述](https://img-blog.csdnimg.cn/4a521e45ccb24313bf1ed69158b5ff93.png#pic_center)

然后就可以快进合并主分支 `master` 了：

```console
git checkout master
git merge server
```

至此，`client` 和 `server` 分支中的修改都已经整合到主分支里了， 你可以删除这两个分支，最终提交历史会变成下面的样子：

```console
git branch -d client
git branch -d server
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/b6b7caccf61440219fd78cbdd10bf086.png#pic_center)

## 4. 变基的风险

使用变基得遵守一条准则：

**如果提交存在于你的仓库之外，而别人可能基于这些提交进行开发，那么不要执行变基。**

变基操作的实质是**丢弃一些现有的提交，然后相应地新建一些内容一样但实际上不同的提交**。 如果你已经将提交推送至某个仓库，而其他人也已经从该仓库拉取提交并进行了后续工作，此时，如果你用 `git rebase` 命令重新整理了提交并再次推送，你的同伴因此将不得不再次将他们手头的工作与你的提交进行整合，如果接下来你还要拉取并整合他们修改过的提交，事情就会变得一团糟。

总的原则是，**只对尚未推送或分享给别人的本地修改执行变基操作清理历史， 从不对已推送至别处的提交执行变基操作**，这样，你才能享受到两种方式带来的便利。

## 5. Rerere
