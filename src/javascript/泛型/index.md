---
nav:
  path: '/javascript'
  title: 'javascript'
  order: 2
group:
  path: '/'
  title: 'javascript'
title: '泛型入门'
order: 0
---

## 什么是泛型？

我的初步理解是：`存放变量的一种变量`，那么如何理解这一句话？

## 举一个 🌰

小关：今天中午你吃什么？<br />
小张：不晓得诶，要不你吃什么我就吃什么吧 <br />

虽然我们不知道他们具体要吃什么，但是有一点可以明确，
他俩吃的食物是一样的 <br />

`类似 any，但又不像 any 那么自由，相互之前存在某种约束关系`

## 快速上手案例

```ts
// 输入什么 则 输出什么
const echo = input => {
  return input;
};
```

如何把上面的函数加上 `ts`类型来进行约束呢？

```ts
// 输入什么 则 输出什么
const echo = (input: number): number => {
  return input;
};
```

这么做的话，这个函数只能接收`数字类型`，没有办法接受其它类型的参数

```ts
// 输入什么 则 输出什么
const echo = (input: any): any => {
  return input;
};
```

可是这样的话，这 2 个 `any` 并`没有任何关联关系`

既然我们`没办法预期会输入什么类型`，我们不妨`定义一个存放变量的变量` `T`,
那么刚才的代码可以改写成这样：

```ts
// 输入什么 则 输出什么
const echo = (input: T): T => {
  return input;
};
```

可是这样你会发现编辑器报错 `找不到名称“T”`，这是因为`变量` `要先定义`才可以使用，
我们可以在`函数体`前面加上 `<T>`即可

```ts
// 输入什么 则 输出什么
const echo = <T>(input: T): T => {
  return input;
};
```

到这里，我们的类型补充就算是彻底完成了 ✌🏻

## 也许你有些疑问 🤔

`T` 是关键字么？可不可以换成别的字母？

前面一开始就说过了，`泛型`可以理解是一种`存放变量的变量`，所以本质上也是变量，那么 `T` 可以理解成是`变量名`，
因此下面的代码都是正确的

```ts
// 输入什么 则 输出什么
const echo = <A>(input: A): A => {
  return input;
};
```

```ts
// 输入什么 则 输出什么
const echo = <abc>(input: abc): abc => {
  return input;
};
```

就像`构造函数`函数名`首字母大写`、以`_`开头的变量示意是`私有变量`，
在这里`T` 是 `type` 的简写，这些都是你应该养成的良好习惯

## 练一练 ✍🏻

```ts
// 从数组元素中查找特定元素;
const findItemFromArray = array => {
  return array[0];
};

// 答案：
// 从数组元素中查找特定元素
const _findItemFromArray = <T>(array: T[]): T | undefined => {
  return array[0];
};
```

## 多个类型参数

```ts
// 交换数组中的 2 个元素
const swap = tuple => {
  const [first, second] = tuple;

  return [second, first];
};
```

上面这个函数，如何加上 `ts`来进行约束呢？我们先按照传统的思路来写，大致会写下面这样：

```ts
// 交换 2 个元素
const swap = (tuple: [any, any]): [any, any] => {
  const [first, second] = tuple;

  return [second, first];
};
```

结合刚才所学的知识，我们可以把 `any` 看成一个变量，但是为了区分，这里我们需要`定义 2 个变量` `first` 和`second`，因此代码可以改写成：

```ts
// 交换 2 个元素
const swap = (tuple: [F, S]): [S, F] => {
  const [first, second] = tuple;

  return [second, first];
};
```

因为`变量`要先定义才可以使用， 所以我们可以在`函数体`前面加上 `<F, S>`即可，即`多个参数用逗号分割`，所以最终代码如下：

```ts
const swap = <F, S>(tuple: [F, S]): [S, F] => {
  const [first, second] = tuple;

  return [second, first];
};
```

## 泛型约束

### 举一个 🌰

我们可以写一个函数来实现找工作，于是大概可以这么写:

```ts
// 找工作，钱多 && 不加班
const finJob = <G>(jobs: G[]) => {
  return jobs.filter(job => job.salary >= 3000 && job.overtime === false);
};
```

此时编辑器会报错提示你 `类型“G”上不存在属性“salary”` `类型“G”上不存在属性“overtime”`

那是因为我们不能瞎找，`G` 的范围太广了，我们必须要进行约束范围，肯定从高薪`IT行业`里面找，于是代码可以变成这样：

```ts
// 先声明一个IT行业类型的接口
interface JobIT {
  salary: number;
  overtime: boolean;
}

// 找工作，钱多 && 不加班
const finJob = <G extends JobIT>(jobs: G[]) => {
  return jobs.filter(job => job.salary >= 3000 && job.overtime === false);
};
```

即`先声明`一个 IT 行业类型的`接口`，然后通过关键字 `extends` 来进行约束

### 又一个 🌰

下面的代码如何加上 `ts`类型来进行约束呢？

```ts
// 通过 key 获取值
const getValueFromMapSource = (key, MapSource) => {
  return MapSource[key];
};
```

经过上面的学习，我们大致可以写出如下代码：

```ts
// 通过 key 获取值
const getValueFromMapSource = <K, M>(key: K, MapSource: M): M[K] => {
  return MapSource[key];
};
```

看起来似乎没有什么毛病，但是你会发现编辑器报错`类型“K”无法用于索引类型“M”`，<br />

这是因为我们需要约束 `K`必须是 `M` 的 `key` 值才可以， 我们可以使用关键字 `extends` 和 `keyof` 来进行约束

```ts
// 通过 key 获取值
const getValueFromMapSource = <K extends keyof M, M>(key: K, MapSource: M): M[K] => {
  return MapSource[key];
};
```
