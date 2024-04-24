# Git 基础

## 参考

[Git 中文文档](https://git-scm.com/book/zh/v2)

## 1. 介绍

Git 是目前世界上最先进的**分布式**版本控制系统，有这么几个特点：

1. **分布式**：是用来保存工程源代码历史状态的命令行工具
2. **保存点**：保存点可以追溯源码中的文件，并能得到某个时间点上的整个工程项目额状态；可以在该保存点将多人提交的源码合并，也可以退到某一个保存点上；
3. **离线操作性**：Git 可以离线进行代码提交
4. **基于快照**：Git 提交是将提交点指向提交时的项目快照，提交的东西包含一些元数据(作者,日期，GPG等)；SVN等老式版本控制工具是将提交点保存成补丁文件
5. **Git 的分支和合并**：分支模型是 Git 最显著的特点,因为这改变了开发者的开发模式，SVN等版本控制工具将每个分支都要放在不同的目录中，Git 可以在同一个目录中切换不同的分支;
6. **分支即时性**：创建和切换分支几乎是同时进行的,用户可以上传一部分分支, 另外一部分分支可以隐藏在本地，不必将所有的分支都上传到远程仓库中去;
7. **分支灵活性**：用户可以随时创建合并删除分支,多人实现不同的功能，可以创建多个分支进行开发,之后进行分支合并，这种方式使开发变得快速,简单,安全。

## 2. GIt 基础

### 2.1 获取 Git 仓库

通常有两种获取 Git 项目仓库的方式：

1. 将**尚未进行版本控制的本地目录**转换为 Git 仓库
2. 从其他仓库**克隆一个已存在的仓库**

这两种方式都会在本地得到一个工作就绪的 GIt 仓库。

#### 💡方式一：在已存在的本地目录中初始化仓库

如果你有一个尚未进行版本控制的项目目录，想要用 Git 来控制它，那么首先需要进入该项目目录中。 如果你还没这样做过，那么不同系统上的做法有些不同：

在 Linux 上：

```console
cd /home/user/my_project
```

在 macOS 上：

```console
cd /Users/user/my_project
```

在 Windows 上：

```console
cd /c/user/my_project
```

之后执行：

```console
git init
```

该命令将创建一个名为 **`.git` 的子目录**，这个子目录含有你初始化的 Git 仓库中所有的必须文件，这些文件是 Git 仓库的骨干。 但是，**这个子目录默认并不会在本地文件夹中展示**！

但是，在这个时候，我们仅仅是做了一个初始化的操作，你的项目里的文件还没有被跟踪。 (参见 [Git 内部原理](https://git-scm.com/book/zh/v2/ch00/ch10-git-internals) 来了解更多关于到底 `.git` 文件夹中包含了哪些文件的信息。)

如果在一个**已存在文件的文件夹（而非空文件夹）**中进行版本控制，你应该**开始追踪这些文件并进行初始提交**。 可以通过 `git add` 命令来指定所需的文件来进行追踪，然后执行 `git commit` ：

```console
git add *.c
git add LICENSE
git commit -m 'initial project version'
```

稍后我们再逐一解释这些指令的行为。 现在，你已经得到了一个存在被追踪文件与初始提交的 Git 仓库。但这里需要注意，此时的仓库只是**本地仓库**，并未**关联远程仓库**！

#### 💡方式二：克隆现有的仓库

如果你想获得一份**已经存在了的 Git 仓库**的拷贝，比如说，你想为某个开源项目贡献自己的一份力，这时就要用到 `git clone` 命令。

当你执行 `git clone` 命令的时候，默认配置下**远程 Git 仓库中的每一个文件的每一个版本都将被拉取下来**。

克隆仓库的命令是 `git clone <url>` 。例：

```console
git clone git@gitee.com:xz20010719/vue2-shang-pin-hui-shopping-mall.git
```

该操作会在当前目录下创建一个名为 “vue2-shang-pin-hui-shopping-mall” 的目录，并在这个目录下**初始化一个 `.git` 文件夹**， 从远程仓库拉取下所有数据放入 `.git` 文件夹，然后从中**读取最新版本的文件的拷贝**。 如果你进入到这个新建的 `vue2-shang-pin-hui-shopping-mall` 文件夹，你会发现所有的项目文件已经在里面了，准备就绪等待后续的开发和使用。

当然，目录的名称也是可以定义的！只需要在后面加上你希望的名称就行：

```console
git clone git@gitee.com:xz20010719/vue2-shang-pin-hui-shopping-mall.git myMall
```

### 2.2 更新仓库

#### 记录每次更新到仓库

现在我们的机器上有了一个 **真实项目** 的 Git 仓库，并从这个仓库中检出了所有文件的 **工作副本**。 通常，你会对这些文件做些修改，每当完成了一个阶段的目标，想要将记录下它时，就将它提交到仓库。

而对于工作目录下的每一个文件，其处于以下状态中的某一种：

1. **未跟踪 --- untracked**：

   未跟踪的文件是指那些**未被纳入版本控制的文件**。工作目录中除已跟踪文件外的其它所有文件都属于未跟踪文件，**它们既不存在于上次快照的记录中，也没有被放入暂存区**。 初次克隆某个仓库的时候，工作目录中的所有文件都属于已跟踪文件，并处于未修改状态，因为 Git 刚刚检出了它们， 而你尚未编辑过它们。

2. **已跟踪**：

   已跟踪的文件是指那些**被纳入了版本控制的文件**，在上一次快照中有它们的记录，在工作一段时间后，它们的状态可能是未修改，已修改或已放入暂存区：

   * **Unmodified --- 未修改**
   * **Modified --- 已修改**
   * **Staged --- 已放入暂存区**

   编辑过某些文件之后，由于自上次提交后你对它们做了修改，Git 将它们标记为已修改文件。 在工作时，你可以选择性地将这些修改过的文件放入暂存区，然后提交所有已暂存的修改，如此反复。这样，就形成了一个状态变化的周期，用图描述的话，就是如下过程：

   ![在这里插入图片描述](https://img-blog.csdnimg.cn/c4346afe2a8641f4a7da6b43de3fdac5.png#pic_center)

#### 检查当前文件状态

如果我们需要检查文件所处的状态，可以使用 `git status` 命令查看哪些文件处于什么状态。

现在，让我们在项目下创建一个新的 `README.zh.md` 文件。 如果之前并不存在这个文件，使用 `git status` 命令，你将看到一个新的未跟踪文件：

![在这里插入图片描述](https://img-blog.csdnimg.cn/048be638f88644f68288b05653b96fb1.png#pic_center)

在状态报告中可以看到新建的 `README` 文件出现在 `Untracked files` 下面。 未跟踪的文件意味着 Git 在之前的快照（提交）中没有这些文件。

#### 跟踪新文件

使用命令 `git add` 开始跟踪一个文件。 所以，要跟踪 `README` 文件，运行：

```console
git add README.zh.md
```

此时再运行 `git status` 命令，会看到 `README` 文件已被跟踪，并处于暂存状态：

![在这里插入图片描述](https://img-blog.csdnimg.cn/fb84eef29b5646b59f03a31860eb086e.png#pic_center)

只要在 `Changes to be committed` 这行下面的，就说明是**已暂存状态**。 如果此时提交，那么该文件在你运行 `git add` 时的版本将被留存在后续的历史记录中。 你可能会想起之前我们使用 `git init` 后就运行了 `git add <files>` 命令，开始跟踪当前目录下的文件。

`git add` 命令使用**文件**或**目录的路径**作为参数；如果参数是目录的路径，该命令将递归地跟踪该目录下的所有文件。

#### 暂存已修改的文件

现在我们来修改一个已被跟踪的文件。 如果你修改了一个名为 `README.md` 的已被跟踪的文件，然后运行 `git status` 命令，会看到下面内容：

![在这里插入图片描述](https://img-blog.csdnimg.cn/83c0b2b89a444c619377a5ad87c729d5.png#pic_center)

文件 `README.md` 出现在 `Changes not staged for commit` 这行下面，说明已跟踪文件的内容发生了变化，但还没有放到暂存区。

要暂存这次更新，需要运行 `git add` 命令。 这是个**多功能命令**：可以用它开始**跟踪新文件**，或者**把已跟踪的文件放到暂存区**，还能用**于合并时把有冲突的文件标记为已解决状态**等。

现在让我们运行 `git add` 将“README.md”放到暂存区，然后再看看 `git status` 的输出：

![在这里插入图片描述](https://img-blog.csdnimg.cn/7b935713c19b44f6a05927af603287b6.png#pic_center)

现在两个文件都已暂存，下次提交时就会一并记录到仓库。 假设此时，你想要在 `README.md` 里再加条注释。 重新编辑存盘后，准备好提交。 不过且慢，再运行 `git status` 看看：

![在这里插入图片描述](https://img-blog.csdnimg.cn/c72ca18d22224ad2947c2bcf9e69853c.png#pic_center)

可以看到，现在 `README.md` 文件同时出现在暂存区和非暂存区。

为什么？实际上 Git 只不过**暂存了你运行 `git add` 命令时的版本**。 如果你现在提交，`README.md` 的版本是你最后一次运行 `git add` 命令时的那个版本，而不是你运行 `git commit` 时，在工作目录中的当前版本。 所以，**运行了 `git add` 之后又作了修订的文件，需要重新运行 `git add` 把最新版本重新暂存起来**：

![在这里插入图片描述](https://img-blog.csdnimg.cn/165dee646a104ad2bf48b8b3f74ab863.png#pic_center)

#### 忽略某些文件

一般我们总会**有些文件无需纳入 Git 的管理**，也不希望它们总出现在未跟踪文件列表。 通常都是些自动生成的文件，比如日志文件，或者编译过程中创建的临时文件等。 在这种情况下，我们可以创建一个名为 `.gitignore` 的文件，列出要忽略的文件的模式。

来看一个实际的 `.gitignore` 例子：

```console
$ cat .gitignore
*.[oa]
*~
```

第一行告诉 Git 忽略所有以 `.o` 或 `.a` 结尾的文件。一般这类对象文件和存档文件都是编译过程中出现的。

第二行告诉 Git 忽略所有名字以波浪符（~）结尾的文件，许多文本编辑软件（比如 Emacs）都用这样的文件名保存副本。

此外，你可能还需要忽略 log，tmp 或者 pid 目录，以及自动生成的文档等等。 要养成一开始就为你的新仓库设置好 .gitignore 文件的习惯，以免将来误提交这类无用的文件。

文件 `.gitignore` 的**格式规范**如下：

* 所有空行或者以 `#` 开头的行都会被 Git 忽略。
* 可以使用标准的 glob 模式匹配，它会递归地应用在整个工作区中。
* 匹配模式可以以（`/`）开头防止递归。
* 匹配模式可以以（`/`）结尾指定目录。
* 要忽略指定模式以外的文件或目录，可以在模式前加上叹号（`!`）取反。

所谓的 glob 模式是指 shell 所使用的简化了的正则表达式。 星号（`*`）匹配零个或多个任意字符；`[abc]` 匹配任何一个列在方括号中的字符 （这个例子要么匹配一个 a，要么匹配一个 b，要么匹配一个 c）； 问号（`?`）只匹配一个任意字符；如果在方括号中使用短划线分隔两个字符， 表示所有在这两个字符范围内的都可以匹配（比如 `[0-9]` 表示匹配所有 0 到 9 的数字）。 使用两个星号（``）表示匹配任意中间目录，比如 `a//z` 可以匹配 `a/z` 、 `a/b/z` 或 `a/b/c/z` 等。

我们再看一个 `.gitignore` 文件的例子：

```console
# 忽略所有的 .a 文件
*.a

# 但跟踪所有的 lib.a，即便你在前面忽略了 .a 文件
!lib.a

# 只忽略当前目录下的 TODO 文件，而不忽略 subdir/TODO
/TODO

# 忽略任何目录下名为 build 的文件夹
build/

# 忽略 doc/notes.txt，但不忽略 doc/server/arch.txt
doc/*.txt

# 忽略 doc/ 目录及其所有子目录下的 .pdf 文件
doc/**/*.pdf
```

Tip：GitHub 有一个十分详细的针对数十种项目及语言的 `.gitignore` 文件列表， 你可以在 <https://github.com/github/gitignore> 找到它。

在最简单的情况下，一个仓库可能只根目录下有一个 `.gitignore` 文件，它递归地应用到整个仓库中。 然而，**子目录下也可以有额外的 `.gitignore` 文件。子目录中的 `.gitignore` 文件中的规则只作用于它所在的目录中**。

#### 查看已暂存和未暂存的修改

如果 `git status` 命令的输出对于你来说过于简略，而你**想知道具体修改了什么地方，可以用 `git diff` 命令**。

虽然 `git status` 已经通过在相应栏下列出文件名的方式回答了这个问题，但 `git diff` 能通过文件补丁的格式更加具体地显示哪些行发生了改变。

假如再次修改 README 文件后暂存，然后编辑 `CONTRIBUTING.md` 文件后先不暂存， 运行 `status` 命令将会看到：

```console
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    modified:   README

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md
```

要查看尚未暂存的文件更新了哪些部分，**不加参数直接输入 `git diff`**：

```console
$ git diff
diff --git a/CONTRIBUTING.md b/CONTRIBUTING.md
index 8ebb991..643e24f 100644
--- a/CONTRIBUTING.md
+++ b/CONTRIBUTING.md
@@ -65,7 +65,8 @@ branch directly, things can get messy.
 Please include a nice description of your changes when you submit your PR;
 if we have to read the whole diff to figure out why you're contributing
 in the first place, you're less likely to get feedback and have your change
-merged in.
+merged in. Also, split your changes into comprehensive chunks if your patch is
+longer than a dozen lines.

 If you are starting to work on a particular area, feel free to submit a PR
 that highlights your work in progress (and note in the PR title that it's
```

此命令比较的是**工作目录中当前文件和暂存区域快照之间的差异**。 也就是**修改之后还没有暂存起来的变化内容**。

若要**查看已暂存的将要添加到下次提交里的内容**，可以用 `git diff --staged` 命令。 这条命令将**比对已暂存文件与最后一次提交的文件差异**：

```console
$ git diff --staged
diff --git a/README b/README
new file mode 100644
index 0000000..03902a1
--- /dev/null
+++ b/README
@@ -0,0 +1 @@
+My Project
```

请注意，`git diff` 本身**只显示尚未暂存的改动，而不是自上次提交以来所做的所有改动**。 所以有时候你一下子暂存了所有更新过的文件，运行 `git diff` 后却什么也没有，就是这个原因。

像之前说的，暂存 `CONTRIBUTING.md` 后再编辑，可以使用 `git status` 查看已被暂存的修改或未被暂存的修改。 如果我们的环境（终端输出）看起来如下：

```console
$ git add CONTRIBUTING.md
$ echo '# test line' >> CONTRIBUTING.md
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    modified:   CONTRIBUTING.md

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md
```

现在运行 `git diff` 看暂存前后的变化：

```console
$ git diff
diff --git a/CONTRIBUTING.md b/CONTRIBUTING.md
index 643e24f..87f08c8 100644
--- a/CONTRIBUTING.md
+++ b/CONTRIBUTING.md
@@ -119,3 +119,4 @@ at the
 ## Starter Projects

 See our [projects list](https://github.com/libgit2/libgit2/blob/development/PROJECTS.md).
+# test line
```

然后用 `git diff --cached` 查看已经暂存起来的变化（ `--staged` 和 `--cached` 是同义词）：

```console
$ git diff --cached
diff --git a/CONTRIBUTING.md b/CONTRIBUTING.md
index 8ebb991..643e24f 100644
--- a/CONTRIBUTING.md
+++ b/CONTRIBUTING.md
@@ -65,7 +65,8 @@ branch directly, things can get messy.
 Please include a nice description of your changes when you submit your PR;
 if we have to read the whole diff to figure out why you're contributing
 in the first place, you're less likely to get feedback and have your change
-merged in.
+merged in. Also, split your changes into comprehensive chunks if your patch is
+longer than a dozen lines.

 If you are starting to work on a particular area, feel free to submit a PR
 that highlights your work in progress (and note in the PR title that it's
```

#### 提交更新

现在的暂存区已经准备就绪，可以提交了。 在此之前，请务必确认还有什么已修改或新建的文件还没有 `git add` 过， 否则提交的时候不会记录这些尚未暂存的变化。 这些已修改但未暂存的文件只会保留在本地磁盘。 所以，**每次准备提交前，先用 `git status` 看下**，你所需要的文件是不是都已暂存起来了， 然后再运行提交命令 `git commit`：

```console
git commit
```

这样会启动你选择的文本编辑器来输入提交说明。

编辑器会显示类似下面的文本信息（本例选用 Vim 的屏显方式展示）：

![在这里插入图片描述](https://img-blog.csdnimg.cn/b58b582aea6e4e7bac8c70c9ab3d51c5.png#pic_center)

可以看到，默认的提交消息包含最后一次运行 `git status` 的输出，放在注释行里，另外开头还有一个空行，供你输入提交说明。 你完全可以去掉这些注释行，不过留着也没关系，多少能帮你回想起这次更新的内容有哪些。

 **更详细的内容修改提示可以用 `-v` 选项查看**，这会**将你所作的更改的 diff 输出呈现在编辑器中**，以便让你知道本次提交具体作出哪些修改。

退出编辑器时，**Git 会丢弃注释行，用你输入的提交说明生成一次提交**。

另外，你也可以**在 `commit` 命令后添加 `-m` 选项，将提交信息与命令放在同一行**，如下所示：

![在这里插入图片描述](https://img-blog.csdnimg.cn/73b89bb516624673968b673cc498eeb8.png#pic_center)

 可以看到，提交后它会告诉你，当前是在哪个分支（`learn`）提交的，本次提交的完整 SHA-1 校验和`commit hash`即（`463dc4f`），以及在本次提交中，有多少文件修订过，多少行添加和删改过。

请记住，提交时记录的是放在暂存区域的快照。 任何还未暂存文件的仍然保持已修改状态，可以在下次提交时纳入版本管理。

**每一次运行提交操作，都是对你项目作一次快照，以后可以回到这个状态，或者进行比较**。

#### 跳过使用暂存区域

尽管使用暂存区域的方式可以精心准备要提交的细节，但有时候这么做略显繁琐。 Git 提供了一个跳过使用暂存区域的方式， 只要在提交的时候，**给 `git commit` 加上 `-a` 选项，Git 就会自动把所有已经跟踪过的文件暂存起来一并提交，从而跳过 `git add` 步骤**：

```console
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md

no changes added to commit (use "git add" and/or "git commit -a")
$ git commit -a -m 'added new benchmarks'
[master 83e38c7] added new benchmarks
 1 file changed, 5 insertions(+), 0 deletions(-)
```

这很方便，但是要小心，有时这个选项会将不需要的文件添加到提交中。

#### 移除文件

要从 Git 中移除某个文件，就必须要**从已跟踪文件清单中移除（确切地说，是从暂存区域移除），然后提交**。

可以用 `git rm` 命令完成此项工作，并连带从工作目录中删除指定的文件，这样以后就不会出现在未跟踪文件清单中了。

如果**只是简单地从工作目录中手工删除文件，运行 `git status` 时就会在 “Changes not staged for commit” 部分看到**：

```console
$ rm PROJECTS.md
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        deleted:    PROJECTS.md

no changes added to commit (use "git add" and/or "git commit -a")
```

然后再**运行 `git rm` 记录此次移除文件的操作**：

```console
$ git rm PROJECTS.md
rm 'PROJECTS.md'
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    deleted:    PROJECTS.md
```

下一次提交时，该文件就不再纳入版本管理了。

如果**要删除之前修改过或已经放到暂存区的文件，则必须使用强制删除选项 `-f`**（译注：即 force 的首字母）。 这是一种安全特性，用于防止误删尚未添加到快照的数据，这样的数据不能被 Git 恢复。

另外一种情况是，我们想**把文件从 Git 仓库中删除（亦即从暂存区域移除），但仍然希望保留在当前工作目录中。** 换句话说，你想**让文件保留在磁盘，但是并不想让 Git 继续跟踪**。

当你忘记添加 `.gitignore` 文件，不小心把一个很大的日志文件或一堆 `.a` 这样的编译生成文件添加到暂存区时，这一做法尤其有用。 为达到这一目的，使用 `--cached` 选项：

```console
git rm --cached README
```

`git rm` 命令后面可以列出文件或者目录的名字，也可以使用 `glob` 模式。比如：

```console
git rm log/\*.log
```

注意到星号 `*` 之前的反斜杠 `\`， 因为 Git 有它自己的文件模式扩展匹配方式，所以我们不用 shell 来帮忙展开。 此命令删除 `log/` 目录下扩展名为 `.log` 的所有文件。 类似的比如：

```console
git rm \*~
```

该命令会删除所有名字以 `~` 结尾的文件。

#### 移动文件

不像其它的 VCS 系统，Git 并不**显式跟踪文件移动操作**。 如果在 Git 中重命名了某个文件，仓库中存储的元数据并不会体现出这是一次改名操作。 不过 Git 非常聪明，它会推断出究竟发生了什么，至于具体是如何做到的，我们稍后再谈。

既然如此，当你看到 Git 的 `mv` 命令时一定会困惑不已。 要在 Git 中对文件改名，可以这么做：

```console
git mv file_from file_to
```

它会恰如预期般正常工作。 实际上，即便此时查看状态信息，也会明白无误地看到关于重命名操作的说明：

```console
$ git mv README.md README
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    renamed:    README.md -> README
```

其实，运行 `git mv` 就相当于运行了下面三条命令：

```console
mv README.md README
git rm README.md
git add README
```

如此分开操作，Git 也会意识到这是一次重命名，所以不管何种方式结果都一样。 两者唯一的区别在于，`git mv` 是一条命令而非三条命令，直接使用 `git mv` 方便得多。 不过在使用其他工具重命名文件时，记得在提交前 `git rm` 删除旧文件名，再 `git add` 添加新文件名。

### 2.3 查看提交历史

在提交了若干更新，又或者克隆了某个项目之后，你也许想回顾下提交历史。 完成这个任务最简单而又有效的工具是 `git log` 命令。

我们使用一个非常简单的 ``simplegit'' 项目作为示例。 运行下面的命令获取该项目：

```console
git clone https://github.com/schacon/simplegit-progit
```

当你在此项目中运行 `git log` 命令时，可以看到下面的输出：

```console
$ git log
commit ca82a6dff817ec66f44342007202690a93763949
Author: Scott Chacon <schacon@gee-mail.com>
Date:   Mon Mar 17 21:52:11 2008 -0700

    changed the version number

commit 085bb3bcb608e1e8451d4b2432f8ecbe6306e7e7
Author: Scott Chacon <schacon@gee-mail.com>
Date:   Sat Mar 15 16:40:33 2008 -0700

    removed unnecessary test

commit a11bef06a3f659402fe7563abf99ad00de2209e6
Author: Scott Chacon <schacon@gee-mail.com>
Date:   Sat Mar 15 10:31:28 2008 -0700

    first commit
```

不传入任何参数的默认情况下，`git log` 会按时间先后顺序列出所有的提交，最近的更新排在最上面。 正如你所看到的，这个命令会列出每个提交的 **SHA-1 校验**和、作者的名字和**电子邮件地址**、**提交时间**以及**提交说明**。

![在这里插入图片描述](https://img-blog.csdnimg.cn/3d06d486f4b0497d843f5b276d0257ee.png#pic_center)

### 2.4 撤销操作

在任何一个阶段，你都有可能想要撤消某些操作。 这里，我们将会学习几个撤消你所做修改的基本工具。 注意，有些撤消操作是不可逆的。 这是在使用 Git 的过程中，会因为操作失误而导致之前的工作丢失的少有的几个地方之一。

有时候我们提交完了才发现漏掉了几个文件没有添加，或者提交信息写错了。 此时，可以运行带有 `--amend` 选项的提交命令来重新提交：

```console
git commit --amend
```

这个命令会将暂存区中的文件提交。 如果自上次提交以来你还未做任何修改（例如，在上次提交后马上执行了此命令）， 那么快照会保持不变，而你所修改的只是提交信息。

文本编辑器启动后，可以看到之前的提交信息。 编辑后保存会覆盖原来的提交信息。

例如，你提交后发现忘记了暂存某些需要的修改，可以像下面这样操作：

```console
git commit -m 'initial commit'
git add forgotten_file
git commit --amend
```

最终你只会有一个提交——第二次提交将代替第一次提交的结果。

当你在修补最后的提交时，与其说是修复旧提交，倒不如说是完全用一个 **新的提交** 替换旧的提交， 理解这一点非常重要。从效果上来说，就像是旧有的提交从未存在过一样，它并不会出现在仓库的历史中。修补提交最明显的价值是可以稍微改进你最后的提交，而不会让“啊，忘了添加一个文件”或者 “小修补，修正笔误”这种提交信息弄乱你的仓库历史。

#### 取消暂存的文件

接下来的两个小节演示如何**操作暂存区和工作目录中已修改的文件**。

这些命令在修改文件状态的同时，也会提示如何撤消操作。 例如，你已经修改了两个文件并且想要将它们作为两次独立的修改提交， 但是却意外地输入 `git add *` 暂存了它们两个。如何只取消暂存两个中的一个呢？ `git status` 命令提示了你：

```console
$ git add *
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    renamed:    README.md -> README
    modified:   CONTRIBUTING.md
```

在 “Changes to be committed” 文字正下方，提示使用 `git reset HEAD <file>…` 来取消暂存。 所以，我们可以这样来取消暂存 `CONTRIBUTING.md` 文件：

```console
$ git reset HEAD CONTRIBUTING.md
Unstaged changes after reset:
M CONTRIBUTING.md
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    renamed:    README.md -> README

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md
```

这个命令有点儿奇怪，但是起作用了。 `CONTRIBUTING.md` 文件已经是修改未暂存的状态了。

`git reset` 确实是个危险的命令，如果加上了 `--hard` 选项则更是如此。 然而在上述场景中，工作目录中的文件尚未修改，因此相对安全一些。

到目前为止这个神奇的调用就是你需要对 `git reset` 命令了解的全部。 我们将会在 [重置揭密](https://git-scm.com/book/zh/v2/ch00/_git_reset) 中了解 `reset` 的更多细节以及如何掌握它做一些真正有趣的事。

另外，实际上在许多IDE中，取消暂存的文件都可以通过工具实现。

#### 撤消对文件的修改

如果你并不想保留对 `CONTRIBUTING.md` 文件的修改怎么办？ 你该如何方便地撤消修改——将它还原成上次提交时的样子（或者刚克隆完的样子，或者刚把它放入工作目录时的样子）？ 幸运的是，`git status` 也告诉了你应该如何做。 在最后一个例子中，未暂存区域是这样：

```console
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md
```

它非常清楚地告诉了你如何撤消之前所做的修改。 让我们来按照提示执行：

```console
$ git checkout -- CONTRIBUTING.md
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    renamed:    README.md -> README
```

可以看到那些修改已经被撤消了。

请务必记得 `git checkout -- <file>` 是一个危险的命令。 你对那个文件**在本地的任何修改都会消失**！Git 会用最近提交的版本覆盖掉它。 除非你确实清楚不想要对那个文件的本地修改了，否则请不要使用这个命令。

如果你仍然想保留对那个文件做出的修改，但是现在仍然需要撤消，我们将会在 [Git 分支](https://git-scm.com/book/zh/v2/ch00/ch03-git-branching) 介绍保存进度与分支，这通常是更好的做法。

记住，在 Git 中任何 **已提交** 的东西几乎总是可以恢复的。 甚至那些被删除的分支中的提交或使用 `--amend` 选项覆盖的提交也可以恢复 （阅读 [数据恢复](https://git-scm.com/book/zh/v2/ch00/_data_recovery) 了解数据恢复）。 然而，任何你未提交的东西丢失后很可能再也找不到了。

而同样地，在大部分IDE中，撤销对文件的修改也可以通过工具快速方便的实现，不需要通过命令！

### 2.5 远程仓库

**远程仓库是指托管在因特网或其他网络中的你的项目的版本库**。 你可以有好几个远程仓库，通常有些仓库对你只读，有些则可以读写。 与他人协作涉及管理远程仓库以及根据需要推送或拉取数据。 管理远程仓库包括了解如何添加远程仓库、移除无效的远程仓库、管理不同的远程分支并定义它们是否被跟踪等等。

#### 查看远程仓库

如果想查看你已经配置的远程仓库服务器，可以运行 `git remote` 命令。 它会列出你指定的每一个远程服务器的简写。 如果你已经克隆了自己的仓库，那么至少应该能看到 origin ——这是 Git 给你克隆的仓库服务器的默认名字：

```console
$ git remote
origin
```

你也可以指定选项 `-v`，会显示**需要读写远程仓库使用的 Git 保存的简写与其对应的 URL**。

```console
$ git remote -v
origin https://github.com/schacon/ticgit (fetch)
origin https://github.com/schacon/ticgit (push)
```

如果你的远程仓库不止一个，该命令会将它们全部列出。 例如，与几个协作者合作的，拥有多个远程仓库的仓库看起来像下面这样：

```console
$ cd grit
$ git remote -v
bakkdoor  https://github.com/bakkdoor/grit (fetch)
bakkdoor  https://github.com/bakkdoor/grit (push)
cho45     https://github.com/cho45/grit (fetch)
cho45     https://github.com/cho45/grit (push)
defunkt   https://github.com/defunkt/grit (fetch)
defunkt   https://github.com/defunkt/grit (push)
koke      git://github.com/koke/grit.git (fetch)
koke      git://github.com/koke/grit.git (push)
origin    git@github.com:mojombo/grit.git (fetch)
origin    git@github.com:mojombo/grit.git (push)
```

这表示我们能非常方便地拉取其它用户的贡献。我们还可以拥有向他们推送的权限，这里暂不详述。

注意这些远程仓库使用了不同的协议。我们将会在 [在服务器上搭建 Git](https://git-scm.com/book/zh/v2/ch00/_getting_git_on_a_server) 中了解关于它们的更多信息。

#### 添加远程仓库

我们在之前的章节中已经提到并展示了 `git clone` 命令是如何自行添加远程仓库的， 不过这里将告诉你如何自己来添加它。 **运行 `git remote add <shortname> <url>` 添加一个新的远程 Git 仓库，同时指定一个方便使用的简写**：

```console
$ git remote
origin
$ git remote add pb https://github.com/paulboone/ticgit
$ git remote -v
origin https://github.com/schacon/ticgit (fetch)
origin https://github.com/schacon/ticgit (push)
pb https://github.com/paulboone/ticgit (fetch)
pb https://github.com/paulboone/ticgit (push)
```

现在你可以在命令行中使用字符串 `pb` 来代替整个 URL。 例如，如果你想拉取 Paul 的仓库中有但你没有的信息，可以运行 `git fetch pb`：

```console
$ git fetch pb
remote: Counting objects: 43, done.
remote: Compressing objects: 100% (36/36), done.
remote: Total 43 (delta 10), reused 31 (delta 5)
Unpacking objects: 100% (43/43), done.
From https://github.com/paulboone/ticgit
 * [new branch]      master     -> pb/master
 * [new branch]      ticgit     -> pb/ticgit
```

现在 Paul 的 master 分支可以在本地通过 `pb/master` 访问到——你可以将它合并到自己的某个分支中， 或者如果你想要查看它的话，可以检出一个指向该点的本地分支。 （我们将会在 [Git 分支](https://git-scm.com/book/zh/v2/ch00/ch03-git-branching) 中详细介绍什么是分支以及如何使用分支。）

#### 从远程仓库中抓取与拉取

就如刚才所见，从远程仓库中获得数据，可以执行：

```console
git fetch <remote>
```

这个命令会**访问远程仓库，从中拉取所有你还没有的数据**。 执行完成后，你将会拥有那个远程仓库中所有分支的引用，可以随时合并或查看。

如果你使用 `clone` 命令克隆了一个仓库，命令会自动将其添加为远程仓库并默认以 “origin” 为简写。 所以，`git fetch origin` 会抓取克隆（或上一次抓取）后新推送的所有工作。

必须注意 `git fetch` 命令只会将数据下载到你的本地仓库，它并不会自动合并或修改你当前的工作。 当准备好时你必须**手动将其合并入你的工作**。

如果你的当前分支**设置了跟踪远程分支**（阅读下一节和 [Git 分支](https://git-scm.com/book/zh/v2/ch00/ch03-git-branching) 了解更多信息）， 那么可以用 `git pull` 命令来自动抓取后合并该远程分支到当前分支。

而**没有设置跟踪远程分支**时，需要用如下格式拉取指定分支的代码：

```console
git pull <remote> <branch>
```

 这或许是个更加简单舒服的工作流程。默认情况下，`git clone` 命令会自动设置本地 master 分支跟踪克隆的远程仓库的 `master` 分支（或其它名字的默认分支）。而其他分支则**需要手动设置跟踪远程指定分支**！

#### 推送到远程仓库

当你想分享你的项目时，必须将其推送到上游。 这个命令很简单：`git push <remote> <branch>`。 当你想要将 `master` 分支推送到 `origin` 服务器时（再次说明，克隆时通常会自动帮你设置好那两个名字）， 那么运行这个命令就可以将你所做的备份到服务器：

```console
git push origin master
```

只有当你有所克隆服务器的写入权限，并且之前没有人推送过时，这条命令才能生效。

 当你和其他人在同一时间克隆，他们先推送到上游然后你再推送到上游，你的推送就会毫无疑问地被拒绝。 你必须**先抓取他们的工作并将其合并进你的工作后才能推送**。 阅读 [Git 分支](https://git-scm.com/book/zh/v2/ch00/ch03-git-branching) 了解如何推送到远程仓库服务器的详细信息。

#### 查看某个远程仓库

如果想要查看某一个远程仓库的更多信息，可以使用 `git remote show <remote>` 命令。 如果想以一个特定的缩写名运行这个命令，例如 `origin`，会得到像下面类似的信息：

```console
$ git remote show origin
* remote origin
  Fetch URL: https://github.com/schacon/ticgit
  Push  URL: https://github.com/schacon/ticgit
  HEAD branch: master
  Remote branches:
    master                               tracked
    dev-branch                           tracked
  Local branch configured for 'git pull':
    master merges with remote master
  Local ref configured for 'git push':
    master pushes to master (up to date)
```

它同样会列出远程仓库的 URL 与跟踪分支的信息。 这些信息非常有用，它告诉你正处于 `master` 分支，并且如果运行 `git pull`， 就会抓取所有的远程引用，然后将远程 `master` 分支合并到本地 `master` 分支。 它也会列出拉取到的所有远程引用。

这是一个经常遇到的简单例子。 如果你是 Git 的重度使用者，那么还可以通过 `git remote show` 看到更多的信息。

```console
$ git remote show origin
* remote origin
  URL: https://github.com/my-org/complex-project
  Fetch URL: https://github.com/my-org/complex-project
  Push  URL: https://github.com/my-org/complex-project
  HEAD branch: master
  Remote branches:
    master                           tracked
    dev-branch                       tracked
    markdown-strip                   tracked
    issue-43                         new (next fetch will store in remotes/origin)
    issue-45                         new (next fetch will store in remotes/origin)
    refs/remotes/origin/issue-11     stale (use 'git remote prune' to remove)
  Local branches configured for 'git pull':
    dev-branch merges with remote dev-branch
    master     merges with remote master
  Local refs configured for 'git push':
    dev-branch                     pushes to dev-branch                     (up to date)
    markdown-strip                 pushes to markdown-strip                 (up to date)
    master                         pushes to master                         (up to date)
```

这个命令列出了**当你在特定的分支上执行 `git push` 会自动地推送到哪一个远程分支**。

它也同样地列出了哪些远程分支不在你的本地，哪些远程分支已经从服务器上移除了， 还有**当你执行 `git pull` 时哪些本地分支可以与它跟踪的远程分支自动合并**。

#### 远程仓库的重命名与移除

你可以运行 `git remote rename` 来修改一个远程仓库的简写名。 例如，想要将 `pb` 重命名为 `paul`，可以用 `git remote rename` 这样做：

```console
$ git remote rename pb paul
$ git remote
origin
paul
```

值得注意的是这同样也会修改你所有远程跟踪的分支名字。 那些过去引用 `pb/master` 的现在会引用 `paul/master`。

如果因为一些原因想要移除一个远程仓库——你已经从服务器上搬走了或不再想使用某一个特定的镜像了， 又或者某一个贡献者不再贡献了——可以使用 `git remote remove` 或 `git remote rm` ：

```console
$ git remote remove paul
$ git remote
origin
```

一旦你使用这种方式删除了一个远程仓库，那么所有和这个远程仓库相关的远程跟踪分支以及配置信息也会一起被删除。

## 3. Git 的工作区、暂存区和版本库

了解了 Git 的基本操作后，我们再来理解一下 Git 的工作区、暂存区和版本库这三个概念：

* **工作区 --- workspace**：即 Git 仓库在本地能够看到的文件目录
* **暂存区 --- stage 或 index**：一般存放在 .git 目录下的 index 文件中。
* **版本库 --- repository**：工作区有一个隐藏目录 .git，这个不包括在工作区内，而是称为 Git 的版本库。

下图展示了这三者之间的关系：

![在这里插入图片描述](https://img-blog.csdnimg.cn/61ea173bc005471a88a7d8c265fa9c62.png#pic_center)

图中左侧为工作区，右侧为版本库。在版本库中标记为 “index” 的区域是暂存区（stage/index），标记为 “master” 的是 master 分支所代表的目录树。

可以看出此时 HEAD 指针指向 master 分支。所以图示的命令中出现 HEAD 的地方可以用 master 来替换。

 objects 标识的区域为 Git 的**对象库**，实际位于 “.git/objects” 目录下，里面包含了创建的各种对象及内容。

当对工作区修改（或新增）的文件执行 `git add` 命令时，**暂存区的目录树被更新**，同时**工作区修改（或新增）的文件内容被写入到对象库中的一个新的对象中**，而该对象的ID被记录在暂存区的文件索引中。

当执行提交操作 `git commit` 时，**暂存区的目录树写到版本库（对象库）中**，master 分支会做相应的更新。即 master 指向的目录树就是提交时暂存区的目录树。

当执行 `git reset HEAD` 命令时，**暂存区的目录树会被重写**，**被 master 分支指向的目录树所替换**，但是工作区不受影响。

当执行 `git rm --cached` 命令时，会**直接从暂存区删除文件**，工作区则不做出改变。

当执行 `git checkout .` 或者 `git checkout --` 命令时，会**用暂存区全部或指定的文件替换工作区的文件**。这个操作很危险，会清除工作区中未添加到暂存区中的改动。

当执行 `git checkout HEAD .` 或者 `git checkout HEAD` 命令时，会**用 HEAD 指向的 master 分支中的全部或者部分文件替换暂存区和以及工作区中的文件**。这个命令也是极具危险性的，因为不但会清除工作区中未提交的改动，也会清除暂存区中未提交的改动。

在此之上，再加上远程仓库，它们之间的关系如下：

![在这里插入图片描述](https://img-blog.csdnimg.cn/b01fbd65c6ba41359738e570958b6ff4.png#pic_center)
