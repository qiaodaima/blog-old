---
nav:
    path: '/shejimoshi'
    title: '设计模式'
    order: 0
group:
    path: '/'
    title: '设计模式'
title: '观察者模式'
order: 0
---

## 什么是观察者模式

先来看看下面一段代码，给按钮绑定一个点击事件，是不是非常熟悉？这就是观察者模式。


```js
const $button = document.querySelector('button');

$button.addEventListener('click', () => {
    console.log('点击了');
});
```
我们不知道按钮什么时候会被点击，只知道按钮被点击的时候需要去执行事先定义好的函数。<br />
举一个例子：上课你在睡觉，你跟你同桌说，等下班主任来了记得提醒我一下，这样你就可以安心的睡觉，不用时刻关系班主任来了没，因为你的同桌在给你放哨<br />
我们分析一下，这个`事件`是`班主任来了`, 班主任来了要干嘛？`提醒你`，
这就是观察者模式，即对未来发生的某个事件作出相应。

```js
你的同桌.addEventListener('班主任来了', () => {
    console.log('提醒你');
});
```

## 如何实现

### 1.事件中心

```js
class Event {
    // 事件中心
    _events = {}

    // 它大概长这个样子
    // _events = {
    //     click: [handler1, handler2, handler3],
    //     '班主任来了': [handler1]
    // }
}

const eventCenter = new Event();
```

把`_events`定义成对象是因为我们会有各种各样的事件类型，对象的数据格式可以很好的满足我们，<br />
`_events[key]`就是我们的某个具体事件列表，`_events[key]` 所对应的值是数组，因为一个事件可能会对应多个处理，比如我们可以给一个按钮绑定多个点击事件

### 2.订阅事件
```js
class Event {
    // 省略一些不必要的代码

    /**
     * 订阅事件
     *
     * @param {String} type 事件名称
     * @param {Function} handler 回调函数
     */
    on = (type, handler) => {
        const listener = this._events[type];

        // 如果没有这个事件
        if (!listener) {
            this._events[type] = [handler];
        }

        // 事件已经存在，则继续追加
        if (listener) {
            listener.push(handler);

            // 避免重复订阅相同事件
            this._events[type] = [...new Set(listener)];
        }

        return this;
    };
}

const handler1 = () => {
    console.log('提醒你');
};

// 你跟你同桌交代的事，是一个订阅某个事件的过程
eventCenter.on('老师来了', handler1);
```

### 3.发布事件
```js
class Event {
    // 省略一些不必要的代码

    /**
     * 发布事件
     *
     * @param {String} type 事件名称
     * @param {*} params 发布信息时携带的参数
     */
    emit = (type, ...params) => {
        const listener = this._events[type];

        // 没有订阅该事件类型
        if (!listener || !listener?.length) {
            return this;
        }

        listener.forEach(handlerItem => {
            handlerItem.call(this, ...params);
        });

        return this;
    };
}

// 当老师真的来了，同桌告诉你，这一个事件发布过程，消息广播
// 在老师来的时候，同桌还额外的附带一些信息给你，比如 班主任眼睛瞎了，
// 这个信息对你很有帮助，这时你可以接着睡不用起来
// emit('老师来了', '班主任眼睛瞎了');
eventCenter.emit('老师来了', '班主任眼睛瞎了');
```

### 4.移除订阅事件
```js
class Event {
    // 省略一些不必要的代码

    /**
     * 指定移除订阅事件
     *
     * @param {String} type 事件名称
     * @param {Function} handler 需要移除的回调函数，不传递则移除该事件类型的所有订阅
     */
    remove = (type, handler) => {
        const listener = this._events[type];

        // 移除该事件类型的所有订阅
        if (!handler) {
            this._events[type] = [];
            return this;
        }

        // 该事件类型还没注册，不需要被移除
        if (!listener) {
            return this;
        }

        this._events[type] = listener.filter(handlerItem => handlerItem !== handler);
        return this;
    }
}

// 有一天，你觉得上课老睡觉总归是不好的，想发愤图强、振兴中华
// 你同桌说，以后班主任来了不要提醒我了，这是一个事件移除过程
// 因此以后老师来了，你同桌不会再告诉你了，你也不会再收到 `老师来了`的消息
eventCenter.remove('老师来了', handler1);
```

## 完整代码
在下面的demo源码中 `event.js`

## 实际运用

公司的一位小伙伴在写一个类似淘宝收货地址的需求，在长按收货地址时`提示用户复制`。
由于每个收货地址都是一个独立的组件，`提示用户复制`也是相互独立的，并不是公用的，所以会 `面临共存的问题`，理想是希望 `它们之间是互斥的`。<br />
假如长按A收货地址时`提示用户复制`，那么再长按B收货地址时，A收货地址`提示用户复制`应该消失，所以这这边涉及到组件通讯问题。
学了该设计模式后，我给该小伙伴的建议是用观察者模式来处理

<code src="./index.jsx" />
