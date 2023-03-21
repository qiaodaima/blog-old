---
nav:
    path: '/javascript'
    title: 'javascript'
    order: 2
group:
    path: '/'
    title: 'javascript'
title: '正则表达式'
order: 0
---

<Alert>
    字节跳动一面挂了，其中有一道笔试题实现价格千分位，不是很难，但是我最终还是没能做出来。<br />
    一开始的想法是用正则，一句话就能搞定。之前都是百度搜，自己能想到的就是自己手动切割。<br />
    由于考虑小数点什么的，然后又是现场当着面试官的面写代码，就很慌，说白了其实就是基础不扎实的表现<br />
</Alert>

## 表达式的创建

采用两条斜线 `//`，然后两条斜线中间书写我们具体的表达式内容，表达式分为 2 种类型

-   精准匹配，比方说 `/娃哈哈/` 就是匹配 `娃哈哈` 不会匹配到其它字符，匹配的东西就是字面量含义
-   模糊匹配，比如 `/\d/` 就是匹配一个数字，具体是哪个数字不管，只要是数字就行

```js
const regExp = /娃哈哈/;

'我爱喝娃哈哈'.replace(regExp, '农夫山泉'); // '我爱喝农夫山泉'
```

## 修饰词

`修饰词` 是用来修饰表达式的，比如 `苹果`，我们可以修饰成 `红彤彤的苹果`, 而正则表达式的修饰词主要有 3 个 `全文搜索` `忽略大小写` `多行搜索` <br />
`修饰词` 放在两条斜线 `//` 的后面，比如 `/娃哈哈/g`

### 全文搜索

```js
const regExp1 = /娃哈哈/; // 只匹配第一个，之后就算有也不匹配
'我爱喝娃哈哈，小明爱喝娃哈哈，隔壁老王爱喝娃哈哈'.replace(regExp1, '农夫山泉'); // '我爱喝农夫山泉，小明爱喝娃哈哈，隔壁老王爱喝娃哈哈'

const regExp2 = /娃哈哈/g; // g: global 全局匹配
'我爱喝娃哈哈，小明爱喝娃哈哈，隔壁老王爱喝娃哈哈'.replace(regExp2, '农夫山泉'); // '我爱喝农夫山泉，小明爱喝农夫山泉，隔壁老爱欢喝农夫山泉'
```

### 忽略大小写

```js
const regExp1 = /fuck/; // 大小写敏感，必须一致才匹配到
'Fuck you, fuck her。'.replace(regExp1, '*'); // 'Fuck you, * her。'

const regExp2 = /fuck/i; // i: ignore case, 忽略大小写
'Fuck you, fuck her。'.replace(regExp2, '*'); // '* you, fuck her。'

const regExp3 = /fuck/gi; // 忽略大小写，且全文匹配，修饰词书写顺序可以随意
'Fuck you, fuck her。'.replace(regExp3, '*'); // '* you, * her。'
```

### 多行搜索

```js
const regExp1 = /^我们/g; // '^' 是以什么开始，后面即使是换行的开头也不算开头，因为换行其实本质只是一个字符只是有特殊的行为表现而已
`我们爱学习，
我们爱工作，
我们被剥削压榨
`.replace(regExp1, '小明'); // 只会匹配到第一个 '我们'，换行的不会被匹配到

// '小明爱学习，
// 我们爱工作，
// 我们被剥削压榨
// '

const regExp2 = /^我们/gm; // 'm' 标识匹配多行的
`我们爱学习，
我们爱工作，
我们被剥削压榨
`.replace(regExp2, '小明');
// '小明爱学习，
// 小明爱工作，
// 小明被剥削压榨
// '
```

## 字符类型

主要有 2 种

-   字面量字符
-   元字符

### 字面量字符

就是字面量本身，比如 `娃哈哈` 就是匹配 `娃哈哈` 本身

### 元字符

当我们表达一些特殊含义的字符，比如 `换行符`、`空格` 等等，这些就是元字符

-   `\` ---> 转义字符
-   `\t` ---> 水平制表符
-   `\v` ---> 垂直制表符
-   `\n` ---> 换行符
-   `\r` ---> 回车符
-   `\0` ---> 空字符
-   `\f` ---> 换页符

```js
const regExp1 = /\n/g; // 删除回车字符
`你拍1，
我拍2，
他拍3`.replace(regExp1, ''); // '你拍1，我拍2，他拍3'

const regExp2 = /\//g; // 不能直接写 '/', 即特殊字符不能直接书写字面量，需要用 `\` 转义
'2020/12/11'.replace(regExp2, '-'); // '2020-12-11'
```

### 边界类

-   `^` 以 xxx 开始
-   `$` 以 xxx 结束
-   `\b` 单词边界
-   `\B` 非单词边界

```js
const regExp1 = /^is/g; // 只匹配开头的 'is', 其它的不匹配。感觉这边也没必要用 'g' 模式
'is that a dog, yes it is'.replace(regExp1, '-'); // '- that a dog, yes it is'

const regExp2 = /is$/g; // 只匹配以 'is' 结尾的，其余的一律不匹配
'is that a dog, yes it is'.replace(regExp2, '-'); // 'is that a dog, yes it -'

const regExp3 = /\bi\b/g; // 匹配单词 'i', 但是不匹配其它单词中间的 'i'
'cus i really wanna rock with you'.replace(regExp3, 'me'); // 'cus me really wanna rock with you'

const regExp4 = /\Bis\b/g; // 匹配以 'is' 结尾的单词
`If this is love I don't want it`.replace(regExp4, '-'); // 'If th- is love I don't want it'
```

## 纵向模糊匹配

有些时候我们需要匹配 `某几个指定值`，类似 `或`的意思，可以理解成集合

```js
const regExp1 = /[他她它]/g; // 这里不是整体匹配'他她它'，是分别匹配 '他'、'她'、'它'
'他指着她，她怀里抱着它'.replace(regExp1, '*'); // '*指着*，*怀里抱着*'

const regExp2 = /[^他她它]/g; // 这里是取反，意思是除了 '他'、'她'、'它'，其它的都匹配
'他指着她，她怀里抱着它'.replace(regExp2, '*'); // '他**她*她****它'

const regExp3 = /他她它/g; // 匹配 '他她它' 3个必须是一个整体，不是分别匹配 '他'、'她'、'它'
'他说她一直搞不懂他她它的区别是什么'.replace(regExp3, '*'); // '他说她一直搞不懂*的区别是什么'

const regExp4 = /我们|他们/g; // '|' 是或的意思, 匹配 '我们' 或 '他们'
'我们吃泡面，他们喝泡面汤'.replace(regExp4, '*'); // '*吃泡面，*喝泡面汤'

const regExp5 = /you|your/g; // '|' 是惰性、短路的匹配，也就是说从左到右开始判断，一旦满足就不继续判断了
'you-your-your-you'.replace(regExp5, '*'); // '*-*r-*r-*' // 匹配到 'you'不会匹配到 'your'

// TODO：这个正则写不来
// const regExp4 = //g; // 除了 '他她它' 都匹配
// '他说她一直搞不懂他她它的区别是什么'.replace(regExp4, '*'); // '*********他她它******'
```

## 范围

比如我们希望特定的值是 `0到9`，我们可以写成 `/[0123456789]/`，但这样显得很臃肿

```js
const regExp1 = /[0123456789]/g; // 这么写不够优雅
'1去23里，烟村45家。亭台67座，8910枝花。'.replace(regExp1, '*'); // '*去**里，烟村**家。亭台**座，****枝花。'

const regExp2 = /[0-9]/g; // 闭区间，包含0和9本身。 还可以这么写 /[a-z][A-Z][0-9]/
'1去23里，烟村45家。亭台67座，8910枝花。'.replace(regExp2, '*'); // '*去**里，烟村**家。亭台**座，****枝花。'
'2020-12-06'.replace(regExp2, 'A'); // 'AAAA-AA-AA', // 这里并没有匹配到 '-'

const regExp3 = /[0-9-]/g; // '-'用在区间有特殊含义，并不会匹配 '-' 本身，如果需要匹配 '-' 可以单独写一个'-'
'2020-12-06'.replace(regExp3, 'A'); // 'AAAAAAAAAA', // 这里匹配到了 '-'
```

### 预定义范围

正则表达式内置了一些 `范围类` 提供我们使用

-   `.` ---> `[^\r\n]` 除了回车符和换行符之外的所有字符
-   `\d` ---> `[0-9]` 数字字符
-   `\D` ---> `[^0-9]` 非数字字符
-   `\s` ---> `[\t\n\x0B\f\r]` 空白符
-   `\S` ---> `[^\t\n\x0B\f\r]` 非空白符
-   `\w` ---> `[a-zA-Z_0-9]` 单词字符(字母数字下划线)
-   `\W` ---> `[^a-zA-Z_0-9]` 非单词字符

```js
const regExp1 = /\d\s/g; //一个数字 一个空白符；

'1 空格 2 空格 3 空格 4 空格 5 空格'.replace(regExp1, '+'); // '+空格 +空格 +空格 +空格 +空格'
```

## 量词

-   `?` 0 次 或者 1 次 (最多出现 1 次)
-   `+` 1 次 或者 多次 (至少出现 1 次)
-   `*` 0 次 或者 多次 (任意次) ，和 Linux 的*有点区别，Linux 的*表示任意字符
-   `{n}` n 次
-   `{n,m}` n 次到 m 次
-   `{n,}` 至少 n 次
-   `{0, m}` 最多 m 次

```js
const regExp1 = /\d{3}/g; // 匹配3个数字
'1和数字12个数字123个数字1234个数字12345个数字123456个数字'.replace(
    regExp1,
    '+',
); // '1和数字12个数字+个数字+4个数字+45个数字++个数字'

const regExp2 = /-W\d{1,}H\d{1,}/g; // 匹配 '-W1125H450' 这里实际是一个图片url链接然后携带了尺寸信息
'...d033e0d31970-W1125H450'.replace(regExp2, '+'); // '...d033e0d31970+'

const regExp3 = /-W\d+H\d+/g; // 匹配 '-W1125H450'
'...d033e0d31970-W1125H450'.replace(regExp2, '+'); // '...d033e0d31970+'
```

## 组

在日期格式化时，我们常见这种需求：把 `07-12-2020` 转换成 `2020-12-07`, 如果有类似 `变量` 的概念，把 `年` `月` `日` 分别提取出来，后面怎么排列都是很容易的

-   `(abc)` 捕获组
-   `(?:abc)` 不要捕获

```js
const regExp1 = /(\d{2})-(\d{2})-(\d{4})/g; // 用 '()' 包起来就表示一个组，$1表示组1，同理$2表示组2
'07-12-2020'.replace(regExp1, '$3-$2-$1'); // '2020-12-07'

const regExp2 = /(\d{2})-(?:\d{2})-(\d{4})/g; // 第二个括号 不在是捕获组了，所以现在一共只有2个组可以用
'07-12-2020'.replace(regExp2, '$2-$1'); // '2020-07'
```

## 断言

就是匹配的时候，需要满足一些特性的条件，不然即使匹配上，但是条件没满足，也不算

-   `a(?=b)` 匹配到 a 时，必须满足条件 b
-   `a(?!b)` 匹配到 a 时，必须不满足条件 b

```js
const style = `
.viewWrap {
    position: relative;
    height: 42px;
    overflow: hidden;

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        list-style: none;
        font-family: monospace;
    }
}
.messageList {
    display: flex;
    flex-direction: column;

    &.moveUp {
        transform: translate(0, -42px);
        transition: all 0.3s; // 过渡属性加在这边
    }
}
.messageItem {
    opacity: 0.6;
    padding: 0 20px;
    height: 42px;
    line-height: 42px;
    font-size: 22px;
    color: #fff;
    background: rgba(0, 0, 0, 1);
}
`;
const regExp1 = /[\.#]\w{1,}(?=[\s\S]{)/gm; // 匹配一个css类或者id选择器

style.match(regExp1); // [".viewWrap", ".messageList", ".moveUp", ".messageItem"]
```
