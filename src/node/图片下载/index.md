---
nav:
    path: '/node'
    title: 'node'
    order: 4
group:
    path: '/'
    title: 'node'
title: '图片下载'
order: 0
---

最近在做一个项目经验总结，然后需要用到一些图片。之前公司用的图片都是在线链接的形式，我需要把这些图片下载到本地。
人工的方式太笨了，刚好最近学习 node，于是想自己动手写个脚本来解放劳动力。

## 思路分析

-   需要下载哪些图片？我们可以把需要下载的图片地址存在一个数组里面，依次声明好。为了方便，我们在一个单独的文件夹中分若干个文件声明
-   读取这些文件，然后取出 url 进行下载
-   把下载的文件放在一个指定的目录中，比如这个目录叫做`download`

## 目录结构

```js
node
├─图片下载
|  ├─index.js // 入口文件，我们实现功能的地方
|  ├─download // 图片下载的存放目录
|  ├─data // 数据源
|  |  ├─1.json
|  |  └─2.json
```

`1.json`

```
[
    "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png",
    "https://img.alicdn.com/tfs/TB1UDHOcwoQMeJjy0FoXXcShVXa-286-118.png"
]
```

`2.json`

```
[
    "https://vm.gtimg.cn/tencentvideo/vstyle/web/v6/style/img/common/sprite_head_logo.svg",
    "https://im.qq.com/assets/images/logo@2x.png",
    "https://sqimg.qq.com/qq_product_operations/im/2015/icons.png"
]
```

`index.js`

```js
const fs = require('fs');
const request = require('request');

const enterDir = './data'; // 入口文件夹
const imageDownloadDir = './download'; // 图片的存放目录
const imageUrlArr = []; // 需要下载的图片url集合

/**
 * 从指定文件内容中提取出图片url
 *
 * @param {*} file 需要读取的文件
 * @returns {array} 图片url集合
 */
const getImageUrl = file => {
    const fileContent = fs.readFileSync(file, 'utf-8');
    const imageReg = /http[s]?:\/\/.+\.(jpg|gif|png|svg)/g;

    return fileContent.match(imageReg);
};

/**
 * 根据图片url下载该图片
 *
 * @param {*} imageUrl 图片链接地址
 * @param {*} filename 文件名
 * @param {*} callback 下载完成之后的回调函数
 */
const downloadImage = (imageUrl, filename, callback) => {
    const handlerFilename = filename || imageUrl.split('/').pop();
    const handleCallback = typeof callback === 'function' ? callback : () => {};

    request({ url: imageUrl })
        .pipe(fs.createWriteStream(handlerFilename))
        .on('close', handleCallback);
};

// 遍历所有文件，取出图片url
fs.readdirSync(enterDir).forEach(fileName => {
    const imageUrl = getImageUrl(`${enterDir}/${fileName}`);

    imageUrlArr.push(...imageUrl);
});

// 判断下载文件夹是否存在，不存在的话则创建一个
try {
    fs.accessSync(imageDownloadDir, fs.constants.F_OK);
} catch (error) {
    fs.mkdirSync(imageDownloadDir, error => {
        console.log(error);
    });
}

imageUrlArr.forEach(imageUrl => {
    const imageName = imageUrl.split('/').pop();

    downloadImage(imageUrl, `${imageDownloadDir}/${imageName}`);
});
```
