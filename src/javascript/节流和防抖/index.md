---
nav:
    path: '/javascript'
    title: 'javascript'
    order: 2
group:
    path: '/'
    title: 'javascript'
title: '节流和防抖'
order: 0
---

## 开场

`问题：如何让一个函数只运行一次？` <br />
按照传统的做法，用一个变量标记一下就行，如果运行了就不再继续往下执行

```js
let used = false; // 标识是否执行过

const fn = () => {
    console.log('执行了');
};

if (!used) {
    used = true; // 标记已经执行过
    fn();
}
```

这里有一个问题，就是变量 `used`是全局的，我们知道函数的作用域是局部的，即 `函数可以访问外部，但是外部并不能访问到函数内部`，<br />
所以我们需要用一个 `闭包`来实现

<Alert>
    基本套路格式：用一个A函数返回一个B函数，我们在函数B里面实现我们的逻辑，在A函数和B函数之间形成的局部作用域来存放一些我们需要存储的一些变量
</Alert>

```js
/**
 * 让函数只运行一次
 *
 * @param {Function} fn 需要被处理的函数
 */
const once = fn => {
    let used = false;

    return (...params) => {
        if (used) {
            return;
        }

        used = true;
        fn.call(this, ...params);
    };
};

const sayHi = () => {
    console.log('Hi ~');
};

const handleSayHi = once(sayHi);

handleSayHi(); // Hi ~
handleSayHi(); // undefined
handleSayHi(); // undefined
```

## 防抖

<Alert>
    在某个时间范围内，函数只会执行一次，如果在这个时间内再次被触发，则重新计时。也就是说很有可能，一次也不会触发。<br />
    比如你给自己计划睡4个小时再起床，如果有人吵到你，则重新计时。<br />
    应用例子：输入框输入东西进行实时搜索的时候，为了性能，我们没必要用户时，时时刻刻都进行搜索，我们可以等用户输入完成再搜索
</Alert>

```js
/**
 * 函数防抖
 *
 * @param {function} fn 需要被防抖的函数
 * @param {number} fps 防抖的频率，单位毫秒，默认200毫秒
 * @returns {function} 被防抖后的函数
 */
export const debounce = (fn, fps = 200) => {
    let timer = null;

    return function(...params) {
        clearTimeout(timer);

        timer = setTimeout(() => {
            fn.call(this, ...params);
        }, fps);
    };
};
```

## 节流

<Alert>
    节流本质上是防抖的一个升级版，因为节流在某个时间内很有可能一次都不会执行，而节流保证了，在一定时间内，肯定会执行一次。
    节流可以简单的理解为稀释掉函数的运行次数，比如原本可能执行100次，稀释掉后，可能只执行50次。
</Alert>

```js
/**
 * 函数节流
 *
 * @param {function} fn 需要被节流的函数
 * @param {number} fps 节流的频率，单位毫秒，默认500毫秒
 * @returns {function} 被节流后的函数
 */
export const throttle = (fn, fps = 500) => {
    let timer = null;
    let timeStampFlag = Date.now();
    let isFirst = true;

    return function(...params) {
        const nowTimeStamp = Date.now();
        const isOvertime = nowTimeStamp - timeStampFlag > fps;

        clearTimeout(timer);

        // 第一次不延时执行
        if (isFirst) {
            isFirst = false;
            fn.call(this, ...params);
            return;
        }

        // 超时
        if (isOvertime) {
            timeStampFlag = Date.now();
            fn.call(this, ...params);
            return;
        }

        timer = setTimeout(() => {
            fn.call(this, ...params);
        }, fps);
    };
};
```
