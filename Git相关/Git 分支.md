# Git 分支

## 1. 分支简介

为了真正理解 Git 处理分支的方式，我们需要回顾一下 Git 是如何保存数据的。

或许你还记得 [起步](https://git-scm.com/book/zh/v2/ch00/ch01-getting-started) 的内容， Git 保存的不是文件的变化或者差异，而是一系列不同时刻的 **快照** 。

在进行提交操作时，Git 会保存一个**提交对象（commit object）**。

该提交对象会包含一个**指向暂存内容快照的指针**。 但不仅仅是这样，该提交对象还包含了作者的姓名和邮箱、提交时输入的信息以及**指向它的父对象的指针**。需要注意的是，首次提交产生的提交对象没有父对象，普通提交操作产生的提交对象有一个父对象， 而由多个分支合并产生的提交对象有多个父对象！

为了能够更加形象地进行说明，假设现在在一个工作目录中，有三个文件，其结构如下：

```console
-index
|
|---README
|---test.rb
|---LICENSE
```

我们需要暂存并提交这三个文件。

```console
git add README test.rb LICENSE
git commit -m 'The initial commit of my project'
```

使用 `git add` 进行**暂存**操作时，会为每一个文件计算**校验和**（使用我们在 [起步](https://git-scm.com/book/zh/v2/ch00/ch01-getting-started) 中提到的 SHA-1 哈希算法），然后会把**当前版本的文件快照保存到 Git 仓库中** （Git 使用 *blob* 对象来保存它们），最终将校验和加入到暂存区域等待提交。

下一步便是使用 `git commit` 进行提交，Git 会先计算每一个子目录（本例中只有项目根目录）的校验和， 然后在 Git 仓库中这些校验和保存为**树对象**。

随后，Git 便会创建一个**提交对象**， 它除了包含上面提到的那些信息外，还包含**指向这个树对象的指针**（即指向项目的根目录）。 如此一来，Git 就可以在需要的时候重现此次保存的快照。

所以此时 Git 仓库中有5个对象：

* 一个提交对象，其中包含着**指向树对象的指针**，以及**所有的提交信息**
* 一个树对象，其中记录着**项目的目录结构**和**每一个 blob 对象的索引**
* 三个 blob 对象，其中保存了文件的**快照（snapshot）**

它们的结构如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/02e282e16bc34efb99d5e93d90a07ed5.png#pic_center)

可以看到，这5个对象之间通过**指针**进行连接，并**将提交对象作为其根节点**，共同构成了**一次暂存提交操作的完整内容**（也可以理解为一个版本）！

需要注意的是，上述是**第一次提交时生成的提交对象**！而如果我们后续再次进行修改，然后再次进行暂存和提交，同样也会生成对应的提交对象，而其中会包含**一个指向上一个提交对象（也就是前面所说的父对象）的指针**！

多次执行修改、暂存以及提交操作后，在 Git 版本库中的 object 文件夹中，就会形成如下的结构：

![在这里插入图片描述](https://img-blog.csdnimg.cn/610f582fe410417e8ec4e6b4968d86f7.png#pic_center)

这里的 Snapshot A、B、C 实际上就是前面说到的树对象。

了解了 Git 保存各版本数据的方式后，我们就可以进入对分支的学习了。

Git 的分支，其实本质上仅仅是**指向提交对象的可变指针**。 Git 的默认分支名字是 `master`。 在多次提交操作之后，你其实已经有一个指向最后那个提交对象的 `master` 分支。 `master` 分支会在每次提交时自动向前移动。

另外需要注意的是：Git 的 `master` 分支并不是一个特殊分支。 它就跟其它分支完全没有区别。 之所以几乎每一个仓库都有 master 分支，是因为 `git init` 命令默认创建它，并且大多数人都懒得去改动它。

如果我们将分支的概念加入上述的提交对象中，会得到以下结构：

![在这里插入图片描述](https://img-blog.csdnimg.cn/5b8990ded1c94a22af41445b59c475dc.png#pic_center)

可以看到，所谓的分支，只不过是指向某一个提交对象的指针！同时，我们可以看到其中有一个特殊的指针：`HEAD`，后续我们会对这个特殊的指针进行详细的介绍。

### 💡分支的创建

Git 是怎么创建新分支的呢？ 很简单，它只是为你**创建了一个可以移动的新的指针**。 比如，创建一个 `testing` 分支， 你需要使用 `git branch` 命令：

```console
git branch testing
```

这会在**当前所在的提交对象上**创建一个指针。注意是当前所在的提交对象上！一定要注意这一点，不然后续创建分支时很可能会出现分支起点不对而导致代码被污染的情况！

完成创建后的结构如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/8ed9be370ec54d4eaa3fc9be59a3ead4.png#pic_center)

可以看到新创建的分支 `testing` 和 `master` 指向同一个提交对象（提交历史）。

但是这里还有一个问题：**Git 是如何知道当前在哪一个分支上的呢？**这就要依靠前面提到过的那个特殊的**指针 `HEAD`** 了！ 在 Git 中，它是一个指针，指向**当前所在的本地分支**（译注：将 `HEAD` 想象为当前分支的别名）。 在本例中，因为 `git branch` 命令仅仅 **创建** 一个新分支，并不会自动切换到新分支中去，所以此时 `HEAD` 指针仍指向 `master` 分支，即我们当前仍在 master 分支上。

![在这里插入图片描述](https://img-blog.csdnimg.cn/f9454f2ad4f144a0ad8d36ac0da2dc01.png#pic_center)

当然，我们也可以使用特定的命令，查看各个分支指针所指向的提交对象：

```
git log --oneline --decorate
```

效果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/e864cf56bd264576b9210b09d6c2775d.png#pic_center)

比较上下内容，可以发现它们实际上是一样的，只不过 Git Graph 插件通过具象化的形式将文字转为了图表！同时可以发现，`HEAD` 指向当前分支 `test-VIFI01-v2`！

### 💡分支切换

要切换到一个已存在的分支，你需要使用 `git checkout` 命令。 我们现在切换到新创建的 `testing` 分支去：

```console
git checkout testing
```

这样 `HEAD` 就指向 `testing` 分支了。

![在这里插入图片描述](https://img-blog.csdnimg.cn/7a5724a056124bf7a0d063826bfae7f9.png#pic_center)

那么，这样的实现方式好在哪里？此时如果我们在 `testing` 分支上，再次修改、暂存、提交一次，那么提交历史就会变成这样：

![在这里插入图片描述](https://img-blog.csdnimg.cn/c5ace2b974b84ed4b9a71aebe09595df.png#pic_center)

可以看到，`testing` 分支向前移动了，但是 `master` 则没有，其仍然**指向在其上最后一次提交所对应的提交对象！**

若我们此时切换回 master 分支：

```
git checkout master
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/86482e7a9ddf47e3867bcb4926d827d9.png#pic_center)

这条命令做了两件事。 一是**使 `HEAD` 指回 `master` 分支**，二是**将工作目录恢复成 `master` 分支所指向的快照内容**。 也就是说，你现在做修改的话，项目将始于一个较旧的版本。 本质上来讲，这就是忽略 `testing` 分支所做的修改，以便于向另一个方向进行开发。

需要注意的是，在切换分支时，工作目录中的内容会被改变，即恢复成目标分支所指向的快照内容，而当 Git 不能干净利落地完成这个工作时，它会禁止切换分支。（例如在某一分支上进行了一些修改，但并没有将其放入暂存区，此时就无法切换分支！）

此时，如果我们再在 master 分支上进行一些修改并将其暂存并提交，那么就会导致项目的提交历史产生**分叉**（参见 [项目分叉历史](https://git-scm.com/book/zh/v2/ch00/divergent_history)）：

![在这里插入图片描述](https://img-blog.csdnimg.cn/dd195e06a98c4eb0b50412fcbc80b0d1.png#pic_center)

当然提交历史的分叉也是可见的，不论是通过指令还是插件。

对于较为复杂的项目，还是推荐通过插件来查看提交历史的分叉情况：

![在这里插入图片描述](https://img-blog.csdnimg.cn/b3e842a837c94bc48c64556af960dc63.png#pic_center)

由于 Git 的分支实质上仅是包含**所指对象校验和**（长度为 40 的 SHA-1 值字符串）的文件，所以它的创建和销毁都异常高效。 创建一个新分支就相当于往一个文件中写入 41 个字节（40 个字符和 1 个换行符），如此的简单能不快吗？

在 Git 中，任何规模的项目都能在瞬间创建新分支。 同时，由于每次提交都会记录父对象，所以寻找恰当的合并基础（译注：即共同祖先）也是同样的简单和高效。 这些高效的特性使得 Git 鼓励开发人员频繁地创建和使用分支。

接下来，让我们看看你为什么应该这样做。

## 2. 分支的新建与合并

为了形象地描述这部分内容，我们会在一个场景中进行介绍：

 你将经历如下步骤：

1. 开发某个网站。
2. 为实现某个新的用户需求，创建一个分支。
3. 在这个分支上开展工作。

正在此时，你突然接到一个电话说有个很严重的问题需要**紧急修补**。 你将按照如下方式来处理：

1. 切换到你的线上分支（production branch）。
2. 为这个紧急任务新建一个分支，并在其中修复它。
3. 在测试通过之后，切换回线上分支，然后合并这个修补分支，最后将改动推送到线上分支。
4. 切换回你最初工作的分支上，继续工作。

### 💡新建分支

首先，初始的项目提交历史应该是下面这个样子的：

![在这里插入图片描述](https://img-blog.csdnimg.cn/25957ceafd544514bae61429064b0bdf.png#pic_center)

现在，你需要解决编号为 #53 的问题。 那么就需要新建一个分支并同时切换到那个分支上，你可以运行一个带有 `-b` 参数的 `git checkout` 命令：

```
$ git checkout -b iss53
Switched to a new branch "iss53"
```

此时你已经检出到该分支 （也就是说，你的 `HEAD` 指针指向了 `iss53` 分支）

然后你继续在 `iss53` 分支上工作，并且做了一些提交。 在此过程中，`iss53` 分支在不断的向前推进。

因此项目的提交历史变成了下面这样：

![在这里插入图片描述](https://img-blog.csdnimg.cn/fe2c4f8256234a8e9733891d48e34694.png#pic_center)

现在你接到那个电话，有个紧急问题等待你来解决。 有了 Git 的帮助，你**不必把这个紧急问题和 `iss53` 的修改混在一起**， 你也**不需要花大力气来还原关于 53# 问题的修改，然后再添加关于这个紧急问题的修改，最后将这个修改提交到线上分支**。 你所要做的仅仅是切换回 `master` 分支。

但是，在你这么做之前，要**留意你的工作目录和暂存区里那些还没有被提交的修改**， 它可能会和你即将检出的分支产生冲突从而阻止 Git 切换到该分支。

最好的方法是，在你切换分支之前，保持好一个干净的状态，并使用 `git status` 命令检查一下分支的状态。 有一些方法可以绕过这个问题（即，**暂存 --- stashing** 和 **修补提交 --- commit amending**）， 我们会在 [贮藏与清理](https://git-scm.com/book/zh/v2/ch00/_git_stashing) 中看到关于这两个命令的介绍。

现在，我们假设你已经把你的修改全部提交了，这时你可以切换回 `master` 分支了：

```console
$ git checkout master
Switched to branch 'master'
```

这个时候，你的工作目录和你在开始 #53 问题之前一模一样，现在你可以专心修复紧急问题了。此时，需要新建一个 hotfix 分支，并在该分支上解决问题并提交：

```console
$ git checkout -b hotfix
Switched to a new branch 'hotfix'

...修复问题

$ git commit -a -m 'fixed the broken email address'
[hotfix 1fb7853] fixed the broken email address
 1 file changed, 2 insertions(+)
```

此时，项目的提交历史如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/6fbd67b467f443daac5b6e80d0facfc1.png#pic_center)

### 💡合并分支 --- 情况1

待测试人员测试完成，确保修复是正确的之后，此时需要**将 `hotfix` 分支合并回 `master` 分支**，从而将修复部署到线上。

你可以使用 `git merge` 命令来达到上述目的：

```console
$ git checkout master
$ git merge hotfix
Updating f42c576..3a0874c
Fast-forward
 index.html | 2 ++
 1 file changed, 2 insertions(+)
```

在合并的时候，你应该注意到了“快进（fast-forward）”这个词。 由于你想要**合并的分支 `hotfix` 所指向的提交 `C4` 是你所在的提交 `C2` 的直接后继**， 因此 Git 会**直接将指针向前移动**。

换句话说，当你试图合并两个分支时， 如果顺着一个分支走下去能够到达另一个分支，那么 Git 在合并两者的时候， 只会简单的将指针向前推进（指针右移），因为这种情况下的合并操作没有需要解决的分歧——这就叫做 “**快进（fast-forward）**”。

现在，最新的修改已经在 `master` 分支所指向的提交快照中，你可以着手发布该修复了。当前的项目提交历史如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/7560d314a40a4f649425ab594c1d9b37.png#pic_center)

而对于 hotfix 分支，此时已经不再需要它了，所以可以通过 `git branch -d` 来将其删除。

### 💡合并分支 --- 情况2

现在你可以切换回你正在工作的分支继续你的工作，也就是针对 #53 问题的那个分支（`iss53` 分支）。

当你在 `iss53` 分支上继续工作并提交后，项目的提交历史会变成这样：

![在这里插入图片描述](https://img-blog.csdnimg.cn/0a3de63b667540849cd7c242813d2fca.png#pic_center)

此时可以看到，我们先前在 `hotfix` 分支上所做的工作并没有包含到 `iss53` 分支中，此时你有两个选择：

1. 拉取 `master` 分支，将最新的 `master` 分支合并到 `iss53` 分支上，从而保持 `iss53` 分支是领先于 `master` 的，待 `iss53` 分支完成其工作后，将其合并到 `master` 中。
2. 不合并 `master`，待 `iss53` 分支完成其工作后，将其合并到 `master` 中。

第一种方式虽然繁琐，但相比于第二种方式的优势在于：如果是较为复杂的项目，如果你不保持开发分支始终领先于 `master` 分支，那么在最后将其合并入 `master` 分支时，可能会出现**冲突**！

这里我们暂时只讨论第二种方式，后续会对合并时的冲突以及如何解决冲突进行详细的介绍。

假设你已经修正了 #53 问题，并且打算将你的工作合并入 `master` 分支。 为此，你需要合并 `iss53` 分支到 `master` 分支，这和之前你合并 `hotfix` 分支所做的工作差不多。 你只需要检出到你想合并入的分支，然后运行 `git merge` 命令：

```console
$ git checkout master
Switched to branch 'master'
$ git merge iss53
Merge made by the 'recursive' strategy.
index.html |    1 +
1 file changed, 1 insertion(+)
```

这和你之前合并 `hotfix` 分支的时候看起来有一点不一样。 在这种情况下，**你的开发历史从一个更早的地方开始分叉开来（diverged）**。

因为，**`master` 分支所在提交并不是 `iss53` 分支所在提交的直接祖先**，Git 不得不做一些额外的工作。 出现这种情况的时候，Git 会使用两个分支的末端所指的快照（`C4` 和 `C5`）以及这两个分支的公共祖先（`C2`），做一个简单的**三方合并**。

![在这里插入图片描述](https://img-blog.csdnimg.cn/3db03f0ed81143d9819eced476eb0b69.png#pic_center)

合并后的结果如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/538e24d9a55e42f9853d12400d2d9413.png#pic_center)

和之前将分支指针向前推进所不同的是，Git 将此次三方合并的结果**做了一个新的快照并且自动创建一个新的提交指向它**。这个被称作一次**合并提交**，它的特别之处在于他有**不止一个父提交**。

### 💡有冲突的分支合并

有时候合并操作不会如此顺利。

 如果你在两个不同的分支中，对同一个文件的同一个部分进行了不同的修改，Git 就没法干净的合并它们。 例如，如果你对 #53 问题的修改和有关 `hotfix` 分支的修改都涉及到同一个文件的同一处，在合并它们的时候就会产生合并冲突：

```console
$ git merge iss53
Auto-merging index.html
CONFLICT (content): Merge conflict in index.html
Automatic merge failed; fix conflicts and then commit the result.
```

此时 Git 做了合并，但是**没有自动地创建一个新的合并提交**。

Git 会暂停下来，等待你去解决合并产生的冲突。 你可以在合并冲突后的任意时刻使用 `git status` 命令来查看那些**因包含合并冲突而处于未合并（unmerged）状态的文件**：

```console
$ git status
On branch master
You have unmerged paths.
  (fix conflicts and run "git commit")

Unmerged paths:
  (use "git add <file>..." to mark resolution)

    both modified:      index.html

no changes added to commit (use "git add" and/or "git commit -a")
```

任何因包含合并冲突而有待解决的文件，都会以**未合并状态（Unmerged）**标识出来。 Git 会在有冲突的文件中加入标准的冲突解决标记，这样你可以打开这些包含冲突的文件然后手动解决冲突。 出现冲突的文件会包含一些特殊区段，看起来像下面这个样子：

```html
<<<<<<< HEAD:index.html
<div id="footer">contact : email.support@github.com</div>
=======
<div id="footer">
 please contact us at support@github.com
</div>
>>>>>>> iss53:index.html
```

这表示 `HEAD` 所指示的版本（也就是你的 `master` 分支所在的位置，因为你在运行 merge 命令的时候已经检出到了这个分支）在这个区段的上半部分（`=======` 的上半部分），而 `iss53` 分支所指示的版本在 `=======` 的下半部分。 为了解决冲突，你必须选择使用由 `=======` 分割的两部分中的一个，或者你也可以自行合并这些内容。 例如，你可以通过把这段内容换成下面的样子来解决冲突：

```html
<div id="footer">
please contact us at email.support@github.com
</div>
```

上述的冲突解决方案仅保留了其中一个分支的修改，并且 `<<<<<<<` , `=======` , 和 `>>>>>>>` 这些行被完全删除了。

在你解决了所有文件里的冲突之后，还需要进行两步操作来完成合并：

1. 对每个文件**使用 `git add` 命令来将其标记为冲突已解决**。 一旦暂存这些原本有冲突的文件，Git 就会将它们标记为冲突已解决。

2. 如果你对结果感到满意，并且确定之前有冲突的的文件都已经暂存了，这时你可以**输入 `git commit` 来完成合并提交**。 默认情况下提交信息看起来像下面这个样子：

   ```console
   Merge branch 'iss53'
   
   Conflicts:
       index.html
   #
   # It looks like you may be committing a merge.
   # If this is not correct, please remove the file
   # .git/MERGE_HEAD
   # and try again.
   
   
   # Please enter the commit message for your changes. Lines starting
   # with '#' will be ignored, and an empty message aborts the commit.
   # On branch master
   # All conflicts fixed but you are still merging.
   #
   # Changes to be committed:
   # modified:   index.html
   #
   ```

   如果你觉得上述的信息不够充分，不能完全体现分支合并的过程，你可以修改上述信息， 添加一些细节给未来检视这个合并的读者一些帮助，告诉他们你是如何解决合并冲突的，以及理由是什么。

## 3. 多人协同开发

在学习多人协同开发之前，首先需要了解几个概念。

### 1. 长期分支

因为 Git 使用简单的三方合并，所以就算在一段较长的时间内，反复把一个分支合并入另一个分支，也不是什么难事。 也就是说，在整个项目开发周期的不同阶段，你可以同时拥有多个开放的分支；你可以定期地把某些主题分支合并入其他分支中。

许多使用 Git 的开发者都喜欢使用这种方式来工作，比如只在 `master` 分支上保留完全稳定的代码——有可能仅仅是已经发布或即将发布的代码。 他们还有一些名为 `develop` 或者 `next` 的平行分支，被用来做后续开发或者测试稳定性——这些分支不必保持绝对稳定，但是一旦达到稳定状态，它们就可以被合并入 `master` 分支了。 这样，在确保这些已完成的主题分支（短期分支，比如之前的 `iss53` 分支）能够通过所有测试，并且不会引入更多 bug 之后，就可以合并入主干分支中，等待下一次的发布。

事实上我们刚才讨论的，是随着你的提交而不断右移的指针。 **稳定分支的指针总是在提交历史中落后一大截，而前沿分支的指针往往比较靠前**。

![在这里插入图片描述](https://img-blog.csdnimg.cn/2f0861035475418e87e46c284caddcb2.png#pic_center)

通常把他们想象成**流水线（work silos）**可能更好理解一点，那些经过测试考验的提交会被遴选到更加稳定的流水线上去。如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/52c3d17d6d134c88970f8dbbbb079ff6.png#pic_center)

你可以用这种方法维护不同层次的稳定性。再次强调一下，使用多个长期分支的方法并非必要，但是这么做通常很有帮助，尤其是当你在一个非常庞大或者复杂的项目中工作时。

### 2. 远程分支

远程引用是对远程仓库的引用（指针），包括分支、标签等等。 你可以通过 `git ls-remote <remote>` 来显式地获得远程引用的完整列表， 或者通过 `git remote show <remote>` 获得远程分支的更多信息。 然而，一个更常见的做法是利用**远程跟踪分支**。

**远程跟踪分支是远程分支状态的引用**。它们是你无法移动的本地引用。一旦你进行了网络通信， Git 就会为你移动它们以精确反映远程仓库的状态。请将它们看做**书签**， 这样可以提醒你该分支在远程仓库中的位置就是你最后一次连接到它们的位置。

它们以 `<remote>/<branch>` 的形式命名。 例如，如果你想要看你最后一次与远程仓库 `origin` 通信时 `master` 分支的状态，你可以查看 `origin/master` 分支。 你与同事合作解决一个问题并且他们推送了一个 `iss53` 分支，你可能有自己的本地 `iss53` 分支， 然而在服务器上的分支会以 `origin/iss53` 来表示。

这可能有一点儿难以理解，让我们来看一个例子。 假设你的网络里有一个在 `git.ourcompany.com` 的 Git 服务器。 如果你从这里克隆，Git 的 `clone` 命令会为你自动将其命名为 `origin`，拉取它的所有数据， 创建一个指向它的 `master` 分支的指针，并且在本地将其命名为 `origin/master`。 Git 也会给你一个与 origin 的 `master` 分支在指向同一个地方的本地 `master` 分支，这样你就有工作的基础。

需要注意的是，远程仓库名字 “origin” 与分支名字 “master” 一样，在 Git 中并没有任何特别的含义。 如果你运行 `git clone -o booyah`，那么你默认的远程分支名字将会是 `booyah/master`。

![在这里插入图片描述](https://img-blog.csdnimg.cn/cfc2801406f343f59dd30eaaaab91338.png#pic_center)

上面就是进行一次克隆的结果，即拉取远程仓库的所有数据并在本地创建对远程分支的引用。

如果你在本地的 `master` 分支做了一些工作，在同一段时间内有其他人推送提交到 `git.ourcompany.com` 并且更新了它的 `master` 分支，这就是说你们的提交历史已走向不同的方向。 即便这样，**只要你保持不与 `origin` 服务器连接（并拉取数据），你的 `origin/master` 指针就不会移动**。

![在这里插入图片描述](https://img-blog.csdnimg.cn/3d371d14d8bb40ac985f2b3946ca1573.png#pic_center)

可以看到本地对于远程分支的引用并不指向远程仓库中的最新位置，而是**指向该分支在远程仓库中你最后一次连接到远程仓库时的位置**！

这就导致，本地的分支和远程的分支是可以分叉的！

假如此时运行 `git fetch <remote>` 命令（在本例中为 `git fetch origin`）。从中抓取本地没有的数据，并且更新本地数据库，移动 `origin/master` 指针到更新之后的位置。那么此时的提交历史如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/b973a3547ffd49db90cff651eea7635e.png#pic_center)

这里需要注意，从远程仓库获取信息时，有两种方式：

1. `git fetch <remote>` --- 该命令的效果是抓取远程仓库的所有数据并更新本地仓库，但从上面的例子可以看到，它**并不会将本地的某一分支与其对应的远程分支进行合并**，例如在上面的例子中，执行 fetch 命令后，仅仅是更新了本地仓库，并没有将远程分支 `origin/master` 和本地分支 `master` 进行合并！
2. `git pull <remote> <branch>` --- 该命令会拉取指定远程分支的代码并合并到当前本地分支。

### 3. 跟踪远程分支

当然，如果每次执行 `git pull` 时，都在后面加上指定的远程分支名，即麻烦也容易出错，因此我们可以**为本地分支建立对某一远程分支的追踪关系**。

建立追踪关系有三种方式：

1. **手动建立追踪关系**：

   ```console
   git branch --set-upstream-to=<remote>/<branch> <本地分支名>
   ```

2. **push时建立追踪关系**：

   ```console
   git push -u <远程主机名> <本地分支名>
   ```

   加上-u参数，这样push时，本地指定分支就和远程主机的**同名分支**建立追踪关系。

3. **新建分支时建立追踪关系**：

   ```console
   git checkout -b <本地分支名> <remote>/<branch>
   ```

   此时，新分支指针指向 <远程主机名>/<远程分支名> 所指的位置。具体位置可用 git log --oneline --graph 查看。

### 4. 变基

详细介绍参考另一篇笔记：

### 5. 分支策略

在 Git 中，常见的分支管理策略包括以下几个方面：

1. **主分支**：**主分支通常是最稳定的分支**，用于发布生产版本。在 Git 中，主分支通常是 `master` 分支或者 `main` 分支。
2. **开发分支**：开发分支通常从主分支派生而来，在其上进行新功能或修复错误的开发。在 Git 中，通常使用 `develop` 分支作为开发分支。
3. **特性分支**：特性分支是为了开发单独的功能而创建的分支。这些分支通常从开发分支派生而来，并在实现目标后被合并回开发分支。在 Git 中，通常使用 `feature/` 分支命名约定来表示特性分支。
4. **发布分支/灰度分支**：发布分支是用于**准备发布版本的分支**，也称为灰度分支，通常从主分支派生而来。这些分支应该包含与发布相关的所有更改，并且应该经过全面测试和审核后再合并回主分支。在 Git 中，通常使用 `release/` 分支或 `gray/` 分支命名约定来表示发布分支。
5. **热修复分支**：热修复分支通常用于**快速修复紧急问题**，例如安全漏洞或崩溃。这些分支通常从主分支派生而来，并且只包含必要的更改。在 Git 中，通常使用 `hotfix/` 分支命名约定来表示热修复分支。
6. 此外，还可能会有**测试分支** `test/`等。

通过采用合适的 Git 分支管理策略，可以帮助团队更好地组织和管理代码，提高团队的协作能力和生产效率。除了上述常见的分支管理策略，还可以根据团队的具体需求和工作流程定制适合自己的分支管理策略。

### 6. 多人协作

Git 是一个优秀的多人协作工具，以下是 Git 多人协作的一些最佳实践：

1. **使用分支**：使用分支可以帮助团队成员在不影响主分支的情况下进行开发和测试，避免代码冲突和错误。建议采用主分支、开发分支、特性分支、发布分支、热修复分支等**分支管理策略**。
2. **提交规范**：每次提交代码时应该附加有意义的提交信息，描述本次提交的更改内容和目的。建议采用语义化版本号和提交信息模板等规范，以便更好地记录和追踪代码变更历史。
3. **定期合并**：团队成员应该定期将自己的分支合并回主分支或者开发分支。这可以避免较大的代码冲突和错误，并且保持代码库的整洁和可维护性。
4. **代码审查**：通过代码审查可以确保代码的质量和一致性，并且可以识别和纠正潜在的问题和错误。建议采用 pull request 和 code review 等工具和流程，以便团队成员对彼此的代码进行审查和反馈。
5. **团队协作**：团队成员之间应该保持及时和有效的沟通，共享技术和经验，并尽可能避免个人行为和偏见对项目和团队产生不良影响。

通过采用上述最佳实践，可以帮助团队高效协作、保证代码质量和稳定性，并提高团队的生产力和创造力。

### 7. 多人协作时的冲突解决

当进行多人协作时，难免会出现代码存在冲突而导致推送失败的情况，此时我们就需要解决冲突。

下面用一个例子来模拟一下：

假设你和同事在同一个分支上工作，此时他已经完成了一些工作并将这些工作提交到了远程仓库的分支上。而恰巧你的工作中，对某些同样的文件进行了修改。此时，你尝试推送到远程：

```console
$ git add env.txt

$ git commit -m "add new xxx"
[dev 7bd91f1] add new env
 1 file changed, 1 insertion(+)
 create mode 100644 env.txt

$ git push origin xxx
To github.com:michaelliao/learngit.git
 ! [rejected]        xxx -> xxx (non-fast-forward)
error: failed to push some refs to 'git@github.com:michaelliao/learngit.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.
hint: 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

此时推送失败，因为你的同事的最新提交和你试图推送的提交有冲突。

解决办法也很简单，Git 已经提示我们，**先用`git pull`把最新的提交从`origin/master`抓下来，然后，在本地合并，解决冲突，再推送**。

此时执行 `git pull` ，会提示有冲突，此时手动解决冲突即可（如何解决可以参考前面的内容）。

解决冲突后，再次提交，然后推送。

因此，多人协作的工作模式通常是这样：

1. 首先，可以试图用 `git push origin <branch-name>` 推送自己的修改；

2. 如果推送失败，则因为远程分支比你的本地更新，需要先用 `git pull` 试图合并；
3. 如果合并有冲突，则解决冲突，并在本地提交；
4. 没有冲突或者解决掉冲突后，再用 `git push origin <branch-name>` 推送就能成功！

这就是多人协作的工作模式，一旦熟悉了，就非常简单。
