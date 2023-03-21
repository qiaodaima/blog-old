---
nav:
    path: '/algorithm'
    title: '算法'
    order: 1
group:
    path: '/'
    title: '算法'
title: '昨天今天明天'
order: 1
---

在一些业务场景中，我们常常需要展示时间信息，例如 `2020年09月13日 15:23:16`，但是如果今天的时间是 `2020年09月12日`，
我们展示成 `明天 15:23:16` 是不是体验上更为直观些呢。

<Alert>
    提示：我们肯定是不能将两个时间戳直接进行相减，然后看间隔了几天。<br />
    比如现在是 2020年09月13日 23:50:00，那么2020年09月14日 01:00:00 正确显示应该为明天01:00:00<br />
    虽然它们间隔1小时10分钟，不到1天的时间，但那也不是显示今天，因为我们是要按照自然日来算的。
</Alert>

### 传统的判断方式

-   分别获取 `今天` 和 `需要被处理的时间`的 `0点时间戳`
-   然后它们的差值除以`24小时`就是我们判断的依据

代码实现如下：

```js
// 比如今天是 2020年09月13日 23:50:00 时间戳为 Date.parse(new Date(`2020-09-13 23:50:00`))  1600012200000
// 需要展示的时间是 2020年09月14日 01:00:00 时间戳为 Date.parse(new Date(`2020-09-14 01:00:00`))  1600016400000

const today = new Date(1600012200000); // 2020-09-13 23:50:00 单位毫秒
const handleDay = new Date(1600016400000); // 2020-09-14 01:00:00 单位毫秒

// 获取0点时刻
const todayBeginTime = new Date(
    `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
);

// 获取0点时刻
const handleDayBeginTime = new Date(
    `${handleDay.getFullYear()}-${handleDay.getMonth() +
        1}-${handleDay.getDate()}`,
);
const diff = handleDayBeginTime.getTime() - todayBeginTime.getTime();

console.log(diff / (24 * 60 * 60 * 1000)); // 可以看到结果是1   -2前天  -1昨天  0今天  1明天 2后天
```

### 比较好的思路

-   选取时间戳 `0点` 为参照 也就是以格林威治标准时间`1970-01-01 00:00:00` 为参照
-   分别计算 `今天` 和 `需要被处理的时间` 一共过了多少天
-   然后它们的差值就是我们判断的依据

<Alert>
    提示：这里有一个隐患的坑，我们js获取的时间戳貌似是以我们在的时区为参照，而不是以格林威治标准时间为参照 <br />
    因此如果我们的时间戳不是以标准时间为基准，则需要矫正，否则不需要 <br />
    同理，如果我们的时间戳是后端返回的，需要询问后端， 是以哪个时区为参照
</Alert>

可以分别获取下面两个时间戳对比看看：
<code src="./getTimeStamp.jsx" />

所以最终结果是：

```js
/**
 * 判断一个时间戳和参照时间戳相比，是前天、昨天、今天、明天、后天
 *
 * example: whichDay(1595751285439)
 * return: 0 // 前天-2、昨天-1、今天0、明天1、后天2
 *
 * @param {string} timeStamp 需要判断的时间戳, 单位毫秒
 * @param {string} flagTimeStamp 参照的时间戳，默认是今天, 单位毫秒
 * @returns {bool} 前天-2、昨天-1、今天0、明天1、后天2
 */
export const whichDay = (timeStamp, flagTimeStamp = Date.now()) => {
    const oneDay = 24 * 60 * 60 * 1000; // 一天有多少秒

    // 如果字段是后端接口返回，且是以格林威治标准时间为参照，则不需要这个校正
    // 不采用 new Date().getTimezoneOffset() * 60 * 1000;
    // 下面根据字符串获取时间戳能保持大家参照的是同一个时间，更为的严谨些
    const correct = Date.parse('1970-01-01 00:00:00'); // 格林威治时间和本地时间之间的时差

    return (
        ~~((timeStamp - correct) / oneDay) -
        ~~((flagTimeStamp - correct) / oneDay)
    ); // ~~ 是直接丢弃小数取整 不进行4舍5入
};
```
