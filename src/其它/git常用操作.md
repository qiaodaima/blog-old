---
nav:
    path: '/other'
    title: '其它'
    order: 6
group:
    path: '/'
    title: '其它'
title: 'git常用操作'
order: 0
---

## 配置多个 SSH-Key

```sh
# 一般来说我们都是这么设置
# 然后会在 【~/.ssh】目录下生成2个文件【id_rsa】【id_rsa.pub】
# 邮箱是可以瞎几把写的，不要紧
$ ssh-keygen -t rsa -C "你的邮箱"


# 但是有些时候我们需要生成多个ssh
# 就是后面的名字可以自己取，不一定要以【_rsa】结尾
ssh-keygen -t rsa -C "你的邮箱" -f ~/.ssh/gitee_id_rsa

# 设置仓库信息  --global 是全局的
# 可以不加--global，进入某一个git仓库单独设置 $ git config user.name "用户名"
$ git config --global user.name "用户名"
$ git config --global user.email "你的邮箱"
```

## gitHub 访问速度慢

最近一段时间发现 `GitHub` 经常不能显示主页的用户头像，以及仓库提交 `commit` 的时候也显示不了用户头像。<br />
于是好奇的在网上搜了下，发现挺多人有这个问题。简单点来说就是 DNS 解析太费时了，我们直接把对应的域名存在 `/etc/hosts` 文件即可。<br />
下面这个是我在网上抄的，我自己通过 `ping github.com` 这种方式拿到的 ip 地址去配置不晓得为什么没效果

```js
# GitHub Start 下面这些域名后面可能会动态变化，等没效果了回头再上网查下
140.82.113.3       github.com
140.82.114.20      gist.github.com
151.101.184.133    assets-cdn.github.com
151.101.184.133    raw.githubusercontent.com
151.101.184.133    gist.githubusercontent.com
151.101.184.133    cloud.githubusercontent.com
151.101.184.133    camo.githubusercontent.com
151.101.184.133    avatars0.githubusercontent.com
199.232.68.133     avatars0.githubusercontent.com
199.232.28.133     avatars1.githubusercontent.com
151.101.184.133    avatars1.githubusercontent.com
151.101.184.133    avatars2.githubusercontent.com
199.232.28.133     avatars2.githubusercontent.com
151.101.184.133    avatars3.githubusercontent.com
199.232.68.133     avatars3.githubusercontent.com
151.101.184.133    avatars4.githubusercontent.com
199.232.68.133     avatars4.githubusercontent.com
151.101.184.133    avatars5.githubusercontent.com
199.232.68.133     avatars5.githubusercontent.com
151.101.184.133    avatars6.githubusercontent.com
199.232.68.133     avatars6.githubusercontent.com
151.101.184.133    avatars7.githubusercontent.com
199.232.68.133     avatars7.githubusercontent.com
151.101.184.133    avatars8.githubusercontent.com
199.232.68.133     avatars8.githubusercontent.com
# GitHub End
```

-   刷新浏览器的 DNS `chrome://net-internals/#dns`
-   刷新系统的 DNS `sudo killall -HUP mDNSResponder && echo macOS DNS Cache Reset`
