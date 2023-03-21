---
nav:
    path: '/algorithm'
    title: '算法'
    order: 1
group:
    path: '/'
    title: '算法'
title: '洗牌算法'
order: 0
---

## 场景

一副扑克牌有 54 张，如何将这个 54 张牌的顺序打乱

## 思路 1

-   把 54 张牌存在一个数组里面
-   准备一个新数组，长度也是 54，
-   生成一个随机数`[0, 53]`, 比如是 `2`，然后 `push` 到这个新数组里面
-   重复 53 次即可

### 缺陷

但是这样有一个问题，比如第一次产生的随机数是 `2`, 那后面还有可能产生随机数`2`，
也就是说已经产生的随机数不能再产生，而且越到后面，重复的概率越大

### 解决方案

-   每产生一个随机数，则把相应的牌从数组中删除，然后随机数生成范围减少
-   比如第一次产生随机数为 `2`，则把`2`删除，后面的牌都往前挪，然后下次生成的随机数范围为 `[0, 52]`

### 优化

-   每次把牌删除后，需要把数组都往前面移动比较麻烦，费时费力
-   比如第一次产生随机数为 `2`，则把 `2` 和 `倒数第1张牌` 调换顺序，然后下次生成的随机数范围为 `[0, 52]`
-   第二次产生随机数为 `6`，则把 `6` 和 `倒数第2张牌` 调换顺序，然后下次生成的随机数范围为 `[0, 51]`，以此类推

```js
/**
 * 按照区间生成随机数
 *
 * example: getRoundNumber(5, 15, 3)
 * return: [9, 6, 13]
 *
 * example: getRoundNumber(6, 20, 1)
 * return: 10
 *
 * @param {number} min 最小值 默认值 0
 * @param {number} max 最大值 默认值 1
 * @param {number} number 要生成几个随机数，默认生成1个
 * @returns {number|array} 生成的随机数 [min, max] 左闭右闭区间
 */
const getRoundNumber = (min = 0, max = 1, number = 1) => {
    const tempMin = Math.ceil(min);
    const tempMax = Math.floor(max);
    const result = [];

    for (let i = 0; i < number; i++) {
        result.push(
            Math.floor(Math.random() * (tempMax - tempMin + 1)) + tempMin,
        );
    }

    return number === 1 ? result[0] : result;
};

// 54张牌
const array = Array.from({ length: 54 }, (item, index) => index + 1);

// 洗牌
const shuffle = array => {
    const length = array.length;

    for (let i = 0; i < length; i++) {
        const roundIndex = getRoundNumber(0, length - 1 - i);

        // 用解构赋值交换2个变量
        [array[roundIndex], array[length - 1 - i]] = [
            array[length - 1 - i],
            array[roundIndex],
        ];
    }
};

shuffle(array);

console.log(array);
```
