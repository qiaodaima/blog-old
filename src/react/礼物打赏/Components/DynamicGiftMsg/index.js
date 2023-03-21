import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import lottie from 'lottie-web';
import S from './index.m.less';

@inject('CommunityStore')
@observer
export default class extends Component {
    componentDidMount() {
        this.createLottie();
    }

    $lottieWrapId = `dumi`

    createLottie = () => {
        const { dynamicMsg, giftConfig } = this.props.CommunityStore.giftMsg;
        const {
            data,
            playCount
        } = dynamicMsg;

        // 没有数据
        if (data === null) {
            return;
        }

        const $lottie = lottie.loadAnimation({
            container: document.querySelector(`#${this.$lottieWrapId}`),
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: giftConfig[data.giftId].jsonUrl
        });

        $lottie.addEventListener('complete', () => {
            // 手动回到动画第一帧，
            // 不然会一直触发该函数
            $lottie.setCurrentRawFrameValue(0);
            dynamicMsg.currPlayCount += 1;

            if (dynamicMsg.currPlayCount >= playCount) {
                $lottie.destroy();

                setTimeout(() => {
                    this.props.CommunityStore.giftMsg.dynamicMsg.data = null;
                    this.props.CommunityStore.manageGiftMsg();
                }, 300);

                return;
            }

            $lottie.play();
        });

        $lottie.addEventListener('data_ready', () => {
            $lottie.play();
        });
    }

    render() {
        if (this.props.CommunityStore.giftMsg.dynamicMsg.data === null) {
            return null;
        }

        return (
            <div id={this.$lottieWrapId} className={S.diaoSiGift} />
        );
    }
}
