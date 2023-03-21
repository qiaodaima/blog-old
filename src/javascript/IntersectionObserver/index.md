---
nav:
    path: '/javascript'
    title: 'javascript'
    order: 2
group:
    path: '/'
    title: 'javascript'
title: 'IntersectionObserver'
order: 0
---

在很多业务场景下，我们需要监听元素是不是在屏幕内，然后做一些操作，之前一直是用 `getBoundingClientRect()` 这个方法来实现。<br />
有一次琛哥分享了一个 `API` 给我 [IntersectionObserver][1], 原来还可以这么优雅的实现。
具体用法可以查看 `MDN`

<code src="./index.jsx" />

[1]: http://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html
