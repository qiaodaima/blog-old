import React from 'react';
import cx from 'classnames';
import S from './style.less';

export default class extends React.Component {
    state = {
        isMoveUp: false,
        messageList: [
            '预备，开始',
            'hey boy 你看世界用左眼还是右眼',
            '你对是非的判断是否只有对错之选',
            '当你在恼火没有买到 复刻的新鞋',
            '但有人出生就被没收视力还有听觉',
            '当你在西式餐厅挑剔 螃蟹的个子',
            '世界的另个角落里有孩子正被饿死',
            '我没有夸张 只是把现实扒的精光',
        ],
    };

    componentDidMount() {
        setInterval(this.handleBroadcast, 1000);
    }

    handleBroadcast = () => {
        const { messageList } = this.state;
        const update = () => {
            const copyMessageList = [...messageList];
            const delMessage = copyMessageList.shift();

            this.setState({
                isMoveUp: false,
                messageList: [...copyMessageList, delMessage],
            });
        };

        this.setState({
            isMoveUp: true,
        });

        setTimeout(update, 300);
    };

    render() {
        const { isMoveUp, messageList } = this.state;

        return (
            <div className={S.viewWrap}>
                <ul className={cx(S.messageList, isMoveUp && S.moveUp)}>
                    {messageList.map(item => (
                        <li key={item} className={S.messageItem}>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
