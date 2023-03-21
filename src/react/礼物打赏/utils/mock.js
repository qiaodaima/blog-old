import { ImEvent } from './event';
import giftConfig from './giftConfig.json';
import userImage0 from '../images/user/00.jpg';
import userImage1 from '../images/user/01.jpg';
import userImage2 from '../images/user/02.jpg';
import userImage3 from '../images/user/03.jpg';
import userImage4 from '../images/user/04.jpg';
import userImage5 from '../images/user/05.jpg';

const getRoundNumber = (min = 0, max = 1, number = 1) => {
    const tempMin = Math.ceil(min);
    const tempMax = Math.floor(max);
    const result = [];

    for (let i = 0; i < number; i++) {
        result.push(Math.floor(Math.random() * (tempMax - tempMin + 1)) + tempMin);
    }

    return number === 1 ? result[0] : result;
}

// 所有的礼物ID集合
const giftIdArr = giftConfig.map(item => item.id);

// 礼物消息类型
const MsgType = {
    giftReward: 232,
};

// 创建一条礼物消息
const createGiftMsg = (options) => {
    return {
        doubleHitId: Math.random(),
        giftId: giftIdArr[getRoundNumber(0, giftIdArr.length - 4, 1)],
        giftNum: getRoundNumber(1, 20),
        headimgurl: [
            userImage0,
            userImage1,
            userImage2,
            userImage3,
            userImage4,
            userImage5,
        ][getRoundNumber(0, 5, 1)],
        isDoubleHit: 0,
        lastSendNum: 0,
        type: 1,
        username: [
            '诸葛日照',
            '上官飞燕',
            '欧阳修',
            '司徒浩南',
            '东方不败',
            '轩辕春燕'
        ][getRoundNumber(0, 5, 1)],
        ...options
    };
}

// 模拟礼物消息
export const sendMsg = () => {
    const msgType = getRoundNumber(0, 90, 1);

    // 静态(一次多份、非连击)
    if (msgType >= 60) {
        ImEvent.emit(MsgType.giftReward, createGiftMsg());
        return;
    }

    // 静态(一次一个、 连击)、
    if (msgType >= 30) {
        // 模拟断开的连击
        if (msgType >= 30) {
            const giftId = giftIdArr[getRoundNumber(0, giftIdArr.length - 4, 1)];

            ImEvent.emit(MsgType.giftReward, createGiftMsg({
                doubleHitId: giftId,
                giftId,
                giftNum: 5,
                isDoubleHit: 1
            }));

            setTimeout(() => {
                ImEvent.emit(MsgType.giftReward, createGiftMsg({
                    doubleHitId: giftId,
                    giftId,
                    giftNum: getRoundNumber(1, 20, 1),
                    isDoubleHit: 1,
                    lastSendNum: 5,
                }));
            }, 2500);
            return;
        }

        ImEvent.emit(MsgType.giftReward, createGiftMsg({
            isDoubleHit: 1
        }));
        return;
    }

    // 动态礼物消息
    if (msgType >= 0 && msgType <= 20) {
        ImEvent.emit(MsgType.giftReward, createGiftMsg({
            giftId: giftIdArr[getRoundNumber(giftIdArr.length - 4, giftIdArr.length - 1, 1)],
            giftNum: getRoundNumber(1, 5),
            type: 2,
        }));
        return;
    }
}
