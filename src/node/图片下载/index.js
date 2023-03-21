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
