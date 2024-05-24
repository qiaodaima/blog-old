---
nav:
  path: '/other'
  title: '其它'
  order: 6
group:
  path: '/'
  title: '其它'
title: 'Makefile'
order: 0
---

## 什么是 Makefile

`Makefile` 是用于管理项目编译过程的文件，特别是在大型项目中，可以通过 Makefile 来自动化编译流程，从而避免手动输入一系列编译命令。Makefile 文件中的规则告诉 `make` 工具如何生成目标文件。它通常用于 C/C++ 项目，但也可以用于其他编程语言和`任务自动化`。

## 快速体验

在多人协作开发项目时，我们希望能够`自动创建一个分支`，
这样既可以保证分支命名规范的一致性，还可以避免手动输入命令的错误，从而节省时间和精力，减少重复劳动的负担。
那我们就以`当前日期`和 `git 用户名`作为分支命名规则。

1. 在`使用 Git 管理`的项目`根目录`中创建一个名为 `Makefile` 的文件

```makefile
# 定义获取当前 git 用户名的命令
USERNAME=$(shell git config user.name)

# 定义获取当前日期的命令，格式为 YYYY/MM/DD
DATE=$(shell date +%Y/%m/%d)

# 定义分支名
BRANCH_NAME=$(DATE)_$(USERNAME)

# 默认目标
new-branch: create-branch

# 目标：创建分支
create-branch:
	@git checkout -b $(BRANCH_NAME)
	@echo "Switched to a new branch '$(BRANCH_NAME)'"
```

然后在`项目根目录`中执行命令`make new-branch`命令，即可自动创建一个分支，其实直接执行命令 `make create-branch`也是可以的，后续会详细介绍。

### 进阶使用

接着我们适当的优化一下这个代码，我们希望可以执行一个这样的命令 `make new-branch-hotfix/table`，即：在分支命名规则之后 `拼接自定义输入`内容。

```makefile
# 定义获取当前 git 用户名的命令
USERNAME=$(shell git config user.name)

# 定义获取当前日期的命令，格式为 YYYY/MM/DD
DATE=$(shell date +%Y/%m/%d)

# 定义分支名
BRANCH_NAME=$(DATE)_$(USERNAME)


# 目标：创建分支-不带后缀
new-branch:
	@git checkout -b $(BRANCH_NAME)
	@echo "Switched to a new branch '$(BRANCH_NAME)'"

# 目标：创建分支-携带自定义后缀
new-branch-%:
	@echo $*
	$(eval _BRANCH_NAME := $(BRANCH_NAME)_$*)
	@git checkout -b $(_BRANCH_NAME)
	@echo "Switched to a new branch '$(_BRANCH_NAME)'"
```

现在我们可以执行命令 `make new-branch-hotfix/table`，它会自动创建一个分支并拼接自定义输入内容。  
当然，原来的 `make new-branch` 命令仍然可以使用。

### 补充说明

```makefile
all: step1 step2

step1:
	echo "This is step 1"

step2:
	@echo "This is step 2"
```

```sh
# 由于没有指定目标，会把第一个目标作为默认目标，执行该目标下的所有命令
$ make
echo "This is step 1"
This is step 1
This is step 2
```

- 不加 `@` 时，`make` 在执行命令之前会先打印出该命令。
- 加上 `@` 时，`make` 在执行命令之前不会打印出该命令。
- 同样的还有 `-` 符号，不加的时候，如果其中的一个命令执行失败会立即停止执行并报错。如果加上了 `-` 符号，会忽略该命令的错误，继续执行后续命令。

## 使用场景

### 同步主分支

在多人协作开发项目时，大家各自从主分支切分支开发，然后陆续往主分支合并代码，那么就意味着，自己的分支有可能是落后于主分支的，
所以往往我们需要不定期`同步主分支代码`，大致流程如下：

1. 切换到主分支 `git checkout develop`
2. 拉取远程主分支代码 `git pull --rebase`
3. 切换到自己的分支 `git checkout myBranch`
4. 同步主分支代码 `git rebase develop`

手敲这么多命令`不仅费时费力`，还`容易出错`，于是我们可以使用 Makefile 来自动完成同步主分支的步骤。

```makefile
# 定义获取当前分支名的命令
CURRENT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD)

# 定义主分支的名称
DEVELOP_BRANCH=develop

# 目标：同步主分支代码到当前分支
rebase:
	@echo "当前分支: $(CURRENT_BRANCH)"
	@git checkout $(DEVELOP_BRANCH)
	@git pull --rebase
	@git checkout $(CURRENT_BRANCH)
	@git rebase $(DEVELOP_BRANCH)
	@echo "同步完成: $(DEVELOP_BRANCH) -> $(CURRENT_BRANCH)"
```

然后在`项目根目录`中执行命令 `make rebase` 命令，即可自动实现同步主分支

### 发布代码到测试分支

功能开发完成后，我们需要及时将代码同步到测试环境。一般来说，只需`同步代码到测试分支`，
后续的部署工作将由 `CI/CD` 自动完成。大致流程如下：

1. 获取仓库最新信息 `git fetch`
2. 删除本地测试分支 `git branch -D test`
3. 切换到测试分支 `git checkout test`
4. 把自己的分支代码合并到测试分支 `git merge myBranch`
5. 推送到远程测试分支 `git push`
6. 切回到自己的分支 `git checkout myBranch`

```makefile
# 定义获取当前分支名的命令
CURRENT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD)

# 定义测试分支的名称
TEST_BRANCH=test

# 目标：同步代码到测试分支
test:
	@echo "获取仓库最新信息..."
	@git fetch
	@echo "删除本地测试分支（如果存在）..."
	- git branch -D $(TEST_BRANCH) # - 的意思是说忽略报错，遇到报错继续往下执行命令，不要中断执行，因为本地可能没有测试分支
	@echo "切换到测试分支..."
	@git checkout $(TEST_BRANCH) || git checkout -b $(TEST_BRANCH)
	@echo "合并当前分支代码到测试分支..."
	@git merge $(CURRENT_BRANCH)
	@echo "推送到远程测试分支..."
	@git push
	@echo "切回到当前分支..."
	@git checkout $(CURRENT_BRANCH)
	@echo "同步完成: $(CURRENT_BRANCH) -> $(TEST_BRANCH)"
```

然后在`项目根目录`中执行命令 `make test` 命令，即可自动实现 `同步代码到测试分支`

### 用自己的分支代覆盖测试分支

在多人协作开发项目时，合并代码难免会遇到冲突，有的时候我们并不想解决冲突，
而是想`用自己的分支重新构建测试分支`，大致流程如下：

1. 获取仓库最新信息 `git fetch`
2. 切换到主分支 `git checkout develop`
3. 拉取远程主分支代码 `git pull --rebase`
4. 切换到自己的分支 `git checkout myBranch`
5. 同步主分支代码 `git rebase develop` （以上过程其实就是 同步主分支代码到当前分支）
6. 删除本地测试分支 `git branch -D test`
7. 本地创建测试分支 `git checkout -b test`
8. 把本地测试分支强制推送到远程 `git push --set-upstream origin test --force`
9. 切回到自己的分支 `git checkout myBranch`

```makefile
# 定义获取当前分支名的命令
CURRENT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD)

# 定义主分支的名称
DEVELOP_BRANCH=develop

# 定义测试分支的名称
TEST_BRANCH=test

# 目标：同步主分支代码到当前分支
rebase:
	@echo "当前分支: $(CURRENT_BRANCH)"
	@git checkout $(DEVELOP_BRANCH)
	@git pull --rebase
	@git checkout $(CURRENT_BRANCH)
	@git rebase $(DEVELOP_BRANCH)
	@echo "同步完成: $(DEVELOP_BRANCH) -> $(CURRENT_BRANCH)"

# 目标：用自己的分支覆盖测试分支
newTest: rebase  # 将 newTest 目标定义在 rebase 目标之后，确保在创建测试分支之前先同步当前分支代码到最新。
	@echo "尝试删除本地测试分支..."
	@git branch -D $(TEST_BRANCH) || true  # 你会发现这里并没有使用 - 忽略报错，而是使用了或运算来兜底处理
	@echo "基于当前分支创建测试分支..."
	@git checkout -b $(TEST_BRANCH)
	@git push --set-upstream origin $(TEST_BRANCH) --force
	@git checkout $(CURRENT_BRANCH)
	@echo "新测试分支已创建并用当前分支覆盖"
```

然后在`项目根目录`中执行命令 `make newTest` 命令，即可自动实现 `用自己的分支重新构建测试分支`

## 总结

通过上述案例不难明白，我们一个个的任务，可以被看成是一个个的目标，即：希望这个任务具体完成一件什么事。  
一个目标允许被拆解成多个小目标，即：一个目标可以依赖于其它目标。

执行 make 命令时，Makefile 的执行并不是从文件顶部依次往下执行的，而是根据默认目标来决定从哪里开始执行。  
默认目标通常是 Makefile 中定义的第一个目标。如果你运行 make 而不指定任何目标，make 会从默认目标开始，并按照依赖关系进行构建。

上述案例演示了 Makefile 的一些基本使用，相信你已经掌握了它的基本语法，  
你可以把日常一些重复性的工作编写成一个个 Makefile 目标，来提高工作效率。

下面是上述 Makefile 的完整代码：

```makefile
# 定义获取当前 git 用户名的命令
USERNAME=$(shell git config user.name)

# 定义获取当前日期的命令，格式为 YYYY/MM/DD
DATE=$(shell date +%Y/%m/%d)

# 定义分支名
BRANCH_NAME=$(DATE)_$(USERNAME)

# 定义获取当前分支名的命令
CURRENT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD)

# 定义主分支的名称
DEVELOP_BRANCH=develop

# 定义测试分支的名称
TEST_BRANCH=test

# 目标：创建分支-不带后缀
new-branch:
	@git checkout -b $(BRANCH_NAME)
	@echo "Switched to a new branch '$(BRANCH_NAME)'"

# 目标：创建分支-携带自定义后缀
new-branch-%:
	@echo $*
	$(eval _BRANCH_NAME := $(BRANCH_NAME)_$*)
	@git checkout -b $(_BRANCH_NAME)
	@echo "Switched to a new branch '$(_BRANCH_NAME)'"

# 目标：同步主分支代码到当前分支
rebase:
	@echo "当前分支: $(CURRENT_BRANCH)"
	@git checkout $(DEVELOP_BRANCH)
	@git pull --rebase
	@git checkout $(CURRENT_BRANCH)
	@git rebase $(DEVELOP_BRANCH)
	@echo "同步完成: $(DEVELOP_BRANCH) -> $(CURRENT_BRANCH)"

# 目标：同步代码到测试分支
test:
	@echo "获取仓库最新信息..."
	@git fetch
	@echo "删除本地测试分支（如果存在）..."
	- git branch -D $(TEST_BRANCH) # - 的意思是说忽略报错，遇到报错继续往下执行命令，不要中断执行，因为本地可能没有测试分支
	@echo "切换到测试分支..."
	@git checkout $(TEST_BRANCH) || git checkout -b $(TEST_BRANCH)
	@echo "合并当前分支代码到测试分支..."
	@git merge $(CURRENT_BRANCH)
	@echo "推送到远程测试分支..."
	@git push
	@echo "切回到当前分支..."
	@git checkout $(CURRENT_BRANCH)
	@echo "同步完成: $(CURRENT_BRANCH) -> $(TEST_BRANCH)"

# 目标：用自己的分支覆盖测试分支
newTest: rebase  # 将 newTest 目标定义在 rebase 目标之后，确保在创建测试分支之前先同步当前分支代码到最新。
	@echo "尝试删除本地测试分支..."
	@git branch -D $(TEST_BRANCH) || true  # 你会发现这里并没有使用 - 忽略报错，而是使用了或运算来兜底处理
	@echo "基于当前分支创建测试分支..."
	@git checkout -b $(TEST_BRANCH)
	@git push --set-upstream origin $(TEST_BRANCH) --force
	@git checkout $(CURRENT_BRANCH)
	@echo "新测试分支已创建并用当前分支覆盖"
```
