---
nav:
    path: '/javascript'
    title: 'javascript'
    order: 2
group:
    path: '/'
    title: 'javascript'
title: '停留上报'
order: 0
---

在某些业务场景下，我们需要分析用户的行为数据，然后调整业务方向，比如 `停留时长上报`。<br />
双十一期间学习了下同事的实现方式，代码本身不是很复杂或者有多么高级，但是这种思路感觉还是很不错的。

```js
// 封装全局的访问上报
const visitReport = params => {
    // params的数据格式
    // params = {
    //     viewTime: 5000, // 停留5秒上报
    //     ...otherParams // 一些需要上报的数据信息
    // }

    const timer = setTimeout(() => {
        // 这里是处理上报的一些逻辑
    }, params.viewTime);

    return () => clearTimeout(timer); // 看中的是这一句，返回一个销毁方法
};

// 调用方 比如在 react的componentDidMount阶段
const params = {
    viewTime: 5,
    userName: '张三',
    id: '瞎几把写的id',
};
const visitTask = visitReport(params);

// 组件销毁阶段再次调用
visitTask();
```
