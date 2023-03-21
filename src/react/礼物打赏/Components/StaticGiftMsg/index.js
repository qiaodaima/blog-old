import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import cx from 'classnames';
import S from './index.m.less';

@inject('CommunityStore')
@observer
class GiftMessage extends Component {
    render() {
        const { messageType } = this.props;
        const { giftMsg } = this.props.CommunityStore;
        const {
            staticSingleFixedMsg,
            staticSingleDoubleHitMsg
        } = giftMsg;
        const giftMsgDada =  {
            '1': staticSingleFixedMsg,
            '2': staticSingleDoubleHitMsg
        }[messageType];
        const {
            data,
            isNumberTips,
            enterAnimation,
            leaveAnimation,
            currGiftNum
        } = giftMsgDada;

        if (data === null) {
            return null;
        }

        const {
            username,
            headimgurl,
            giftId,
            giftNum,
            isDoubleHit,
        } = data;
        const handleGiftNum = isDoubleHit ? currGiftNum : giftNum;

        return (
            <div className={cx(S.giftMessage, S[`message${messageType}`], enterAnimation && S.enter, leaveAnimation && S.leave, isNumberTips && S.giftNumberTips)}>
                <div className={S.user}>
                    <div
                        style={{ backgroundImage: `url("${headimgurl}")` }}
                        className={S.userImage}
                    />

                    <div className={S.textWrap}>
                        <p className={S.userName}>{username}</p>
                        <p className={S.tips}>{`送出 ${giftMsg.giftConfig[giftId].title}`}</p>
                    </div>
                </div>

                <div className={S.giftItem}>
                    <div
                        style={{ backgroundImage: `url("${giftMsg.giftConfig[giftId].image}")` }}
                        className={S.gift}
                    />

                    <div className={S.numberWrap}>
                        {
                            handleGiftNum.toString().split('').map(i => (
                                <span key={`dumi${Date.now()}${Math.random()}`}  className={cx(S.numberItem, S[`n${i}`])} />
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}

@inject('CommunityStore')
@observer
export default class extends Component {
    render() {
        return (
            <>
                <GiftMessage messageType={1}/>
                <GiftMessage messageType={2}/>
            </>
        );
    }
}
