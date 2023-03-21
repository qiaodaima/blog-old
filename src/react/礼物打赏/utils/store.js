import { observable, action, makeObservable } from 'mobx';
import { ImEvent } from './event';
import giftConfig from './giftConfig.json';
import { sendMsg } from './mock';

// 礼物消息类型
const MsgType = {
    giftReward: 232,
};

const imOn = (type, handler) => {
    ImEvent.remove(type);
    ImEvent.on(type, handler);
};

export default class Store {
    constructor() {
        // 高版本的mobx需要自己手动触发试图更新
        makeObservable(this);

        this.getLiveGiftConfig();

        // 礼物消息
        imOn(MsgType.giftReward, (imMsg) => {
            console.log('--IM消息来了--', imMsg);
            this.saveMsg(imMsg);
        });

        // 模拟发送消息
        this.sendMsgInterval = setInterval(() => {
            sendMsg();
        }, 4000);
    }

    // 获取打赏礼物列表
    getLiveGiftConfig = () => {
        this.giftMsg.giftConfig = {};

        giftConfig.map(gifItem => {
            this.giftMsg.giftConfig[gifItem.id] = gifItem;
        });
    }

    // 直播间礼物消息
    @observable giftMsg = {
        // 第一行
        // 动态单个  动态多个
        // 静态(一次多份、非连击)
        staticSingleFixedMsg: {
            data: null, // IM 消息数据域(单条)
            queueMsg: [], // 消息队列
            enterAnimation: false, // 是否入场
            leaveAnimation: false, // 是否离场
            leaveTimer: null, // 延时离场动画定时器编号
            destroyTimer: null // 延时销毁定时器编号
        },

        // 第二行
        // 静态(一次一个、 连击)、
        // 这边都会执行连击动画，即使消息只有1条，也算是连击
        staticSingleDoubleHitMsg: {
            data: null, // IM 消息数据域(单条)
            queueMsg: [], // 消息队列
            currGiftNum: 0, // 当前礼物数量
            targetGiftNum: 0, // 需要连击到最终的礼物数量
            isNumberTips: false, // 是否执行数字放大动效
            enterAnimation: false, // 是否入场
            leaveAnimation: false, // 是否离场
            leaveTimer: null, // 延时离场动画定时器编号
            destroyTimer: null, // 延时销毁定时器编号
            doubleHitTimer: null // 连击定时器编号
        },

        // 动态礼物消息
        dynamicMsg: {
            data: null, // IM 消息数据域(单条)
            queueMsg: [], // 消息队列
            currPlayCount: 0, // 当前已经播放了多少次动画
            playCount: 1 // 动画需要播放多少次(一份播放一次、多份播放2次)
        },

        // 所有礼物信息(礼物名、静态资源链接等)
        giftConfig: null
    }

    // 把从IM收到的消息 分类存放
    @action
    saveMsg = (giftMsg) => {
        const {
            staticSingleFixedMsg,
            staticSingleDoubleHitMsg,
            dynamicMsg
        } = this.giftMsg;

        // 静态礼物
        if (giftMsg.type === 1) {
            // 第一行  一次多份礼物
            if (giftMsg.isDoubleHit === 0) {
                staticSingleFixedMsg.queueMsg.push(giftMsg);

                const queueMsgLength = staticSingleFixedMsg.queueMsg.length;

                // 消息太多，砍掉一些
                if (queueMsgLength > 400) {
                    staticSingleFixedMsg.queueMsg.splice(0, queueMsgLength - 100);
                }
            }

            // 第二行  静态单个 静态多个连击
            if (giftMsg.isDoubleHit === 1) {
                staticSingleDoubleHitMsg.queueMsg.push(giftMsg);

                const queueMsgLength = staticSingleDoubleHitMsg.queueMsg.length;

                // 消息太多，砍掉一些
                if (queueMsgLength > 400) {
                    staticSingleDoubleHitMsg.queueMsg.splice(0, queueMsgLength - 100);
                }
            }
        }

        // 动态礼物
        if (giftMsg.type === 2) {
            dynamicMsg.queueMsg.push(giftMsg);

            const queueMsgLength = dynamicMsg.queueMsg.length;

            // 消息太多，砍掉一些
            if (queueMsgLength > 20) {
                dynamicMsg.queueMsg.splice(0, queueMsgLength - 5);
            }
        }

        this.manageGiftMsg();
    }

    // 给相应的礼物消息类型补充消息
    @action
    manageGiftMsg = () => {
        const {
            staticSingleFixedMsg,
            staticSingleDoubleHitMsg,
            dynamicMsg
        } = this.giftMsg;

        // 当前无动画执行 并且队列里面有消息存在时 才去取消息任务
        const currStaticSingleFixedMsg = !!staticSingleFixedMsg.queueMsg.length && staticSingleFixedMsg.queueMsg[0];
        const currStaticSingleDoubleHitMsg = !!staticSingleDoubleHitMsg.queueMsg.length && staticSingleDoubleHitMsg.queueMsg[0];
        const currDynamicMsg = !!dynamicMsg.queueMsg.length && dynamicMsg.queueMsg[0];

        // 第一行 静态
        // 一次多份礼物
        if (!staticSingleFixedMsg.data && currStaticSingleFixedMsg) {
            staticSingleFixedMsg.queueMsg.shift();

            // 显示相应的静态消息
            staticSingleFixedMsg.data = currStaticSingleFixedMsg;
            this.showStaticGiftMsg(staticSingleFixedMsg);
        }

        // 第二行 静态
        // 单个 静态多个连击
        if (!staticSingleDoubleHitMsg.data && currStaticSingleDoubleHitMsg) {
            this.doubleHitGiftMsg(staticSingleDoubleHitMsg);
        }

        // 动态礼物消息
        if (!dynamicMsg.data && currDynamicMsg) {
            dynamicMsg.queueMsg.shift();

            // 大动效礼物消息只要赋予数据就会自己执行，不需要手动触发
            dynamicMsg.currPlayCount = 0;
            dynamicMsg.playCount = currDynamicMsg.giftNum === 1 ? 1 : 2; // 多份的播放2遍
            dynamicMsg.data = currDynamicMsg;

            // 显示相应的静态消息
            staticSingleFixedMsg.data = currDynamicMsg;
            this.showStaticGiftMsg(staticSingleFixedMsg);
        }
    }

    // 展示静态礼物消息
    @action
    showStaticGiftMsg = (giftMsg) => {
        const showTime = this.giftMsg.giftConfig[giftMsg.data.giftId].showTime;

        // 如果消息队列里面的消息过多，就缩短礼物显示时间
        // 也就是说只有最后一条消息才是正常显示时间，其余都是400毫秒
        const handleShowTime = (giftMsg.queueMsg.length <= 0) ? showTime : 400;

        clearTimeout(giftMsg.leaveTimer);
        clearTimeout(giftMsg.destroyTimer);

        // 入场动画开始执行
        giftMsg.enterAnimation = true;
        giftMsg.leaveAnimation = false;

        // 执行消息退出
        this.quitStaticGiftMsg(giftMsg, handleShowTime, this.manageGiftMsg);
    }

    // 移出静态礼物消息
    @action
    quitStaticGiftMsg = (giftMsg, waitingQuitTime, nextHandle) => {
        clearTimeout(giftMsg.leaveTimer);
        clearTimeout(giftMsg.destroyTimer);

        giftMsg.leaveTimer = setTimeout(() => {
            // 该函数有可能是连击函数在调用
            // 连击函数会在退场动画执行前 一直在运行
            // 因此执行退场动画时，需要清了连击的定时器
            giftMsg.doubleHitTimer && clearInterval(giftMsg.doubleHitTimer);

            giftMsg.enterAnimation = false;
            giftMsg.leaveAnimation = true;

            // 离场动画执行需要花费 .3秒(具体值查看css定义，后期有可能调整)
            // 离场动画执行完之后销毁数据
            giftMsg.destroyTimer = setTimeout(() => {
                giftMsg.enterAnimation = false;
                giftMsg.leaveAnimation = false;
                giftMsg.data = null;

                typeof nextHandle === 'function' && nextHandle();
            }, 400);
        }, waitingQuitTime);
    }

    // 连击礼物消息
    @action
    doubleHitGiftMsg = (giftMsg) => {
        const handleReady = () => {
            const nextMsg = giftMsg.queueMsg[0];

            giftMsg.queueMsg.shift();

            // 计算好 从什么多少开始连击  连击终止数量是多少
            giftMsg.currGiftNum = nextMsg.lastSendNum;
            giftMsg.targetGiftNum = nextMsg.lastSendNum + nextMsg.giftNum;
            giftMsg.data = nextMsg;
        };
        const handleNext = () => {
            const nextMsg = giftMsg.queueMsg[0];

            if (!nextMsg) {
                return;
            }

            // 续接连击的条件
            const condition1 = nextMsg.lastSendNum > 0;
            const condition2 = nextMsg.doubleHitId === giftMsg.data.doubleHitId;
            const condition3 = nextMsg.lastSendNum > giftMsg.data.lastSendNum;

            // 续接连击的条件
            if (condition1 && condition2 && condition3) {
                clearTimeout(giftMsg.leaveTimer);
                clearTimeout(giftMsg.destroyTimer);

                giftMsg.queueMsg.shift();
                giftMsg.data = nextMsg;
                giftMsg.targetGiftNum = nextMsg.lastSendNum + nextMsg.giftNum;
                return;
            }

            // 是相同的连击，该条消息来晚了，直接丢弃掉
            if (condition2) {
                giftMsg.queueMsg.shift();
                handleNext();
                return;
            }

            // 连击中断，是别人的消息
            this.quitStaticGiftMsg(giftMsg, 0, () => {
                this.doubleHitGiftMsg(giftMsg);
            });
        };

        handleReady();

        const showTime = this.giftMsg.giftConfig[giftMsg.data.giftId].showTime;
        let isRunQuitMsgFun = false; // 是否 有在调用退出消息函数

        clearTimeout(giftMsg.leaveTimer);
        clearTimeout(giftMsg.destroyTimer);
        clearInterval(giftMsg.doubleHitTimer);

        // 入场动画开始执行
        giftMsg.enterAnimation = true;
        giftMsg.leaveAnimation = false;

        // 首次连击消息 lastSendNum 为0 避免页面显示0，礼物数量从1开始显示
        // 下一次续接的连击，不需要显示上一个连击的数量
        // 因此 currGiftNum 需要自增一次
        giftMsg.currGiftNum += 1;

        giftMsg.doubleHitTimer = setInterval(() => {
            // 按照我精密严格的逻辑推算，这边 giftMsg.data 一定是有数据的
            // 但是发现控制台有报错的情况 ???? 好郁闷  为什么这边会是null  ????
            // 修改 giftMsg.data 只有在 【this.quitStaticGiftMsg】即 消息执行退场动画
            // 这边无奈的兼容一下下
            if (!giftMsg.data) {
                clearInterval(giftMsg.doubleHitTimer);
                return;
            }

            if (giftMsg.currGiftNum >= giftMsg.targetGiftNum) {
                if (giftMsg.queueMsg.length) {
                    handleNext();
                }

                // 在退场动画执行前，这个定时器是一直在运行的
                // 假如队列没有消息，一直运行这个函数，则执行到最后一条消息是不会执行消息退场
                // 因为 quitStaticGiftMsg 会清除一些定时器  多次调用 quitStaticGiftMsg (会清除退场的执行)
                // 因此只能调用一次 需要避免重复调用
                if (isRunQuitMsgFun === false) {
                    isRunQuitMsgFun = true;
                    this.quitStaticGiftMsg(giftMsg, showTime, this.manageGiftMsg);
                }
            }

            if (giftMsg.currGiftNum < giftMsg.targetGiftNum) {
                isRunQuitMsgFun = false;
                giftMsg.currGiftNum += 1;
                giftMsg.isNumberTips = true;

                // 执行数字放大动效需要花费 .15秒(具体值查看css定义，后期有可能调整)
                setTimeout(() => {
                    giftMsg.isNumberTips = false;
                }, 200);
            }
        }, 250);
    }

    // 销毁
    @action
    destroy = () => {
        clearInterval(this.sendMsgInterval)
        ImEvent.clear();
    }
}
