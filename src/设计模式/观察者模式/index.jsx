import React from 'react';
import { Event } from './event';
import S from './style.less';

const eventCenter = new Event();
const copyEventKey = 'cancelCopy';

class Address extends React.Component {
    state = {
        isShowCopy: false
    }

    componentDidMount() {
        eventCenter.on(copyEventKey, this.cancelCopy);
    }

    componentWillUnmount() {
        eventCenter.remove(copyEventKey, this.cancelCopy);
    }

    cancelCopy = () => {
        this.setState({
            isShowCopy: false
        });
    }

    handleCopy = () => {
        eventCenter.emit(copyEventKey);

        this.setState({
            isShowCopy: true
        });
    }

    render() {
        const { isShowCopy } = this.state;

        return (
            <div onClick={this.handleCopy} className={S.addressItem}>
                <p className={S.userInfo}>
                    <span className={S.userName}>杜甫</span>
                    <span className={S.tel}>15934242345</span>
                </p>

                <address>
                    浙江省杭州市萧山区阿里巴巴蚂蚁金服B幢23室
                </address>

                {
                    isShowCopy && <button className={S.btnCopy}>复制</button>
                }
            </div>
        );
    }
}

export default class extends React.Component {
    render() {
        return (
            <div className={S.viewWrap}>
                <Address />
                <Address />
                <Address />
                <Address />
            </div>
        );
    }
}
