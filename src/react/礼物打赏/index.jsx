/**
 * iframe: 812
 */

import React from 'react';
import { observer, Provider } from 'mobx-react';
import DynamicGiftMsg from './Components/DynamicGiftMsg';
import StaticGiftMsg from './Components/StaticGiftMsg';
import Store from './utils/store';
import S from './style.less';

@observer
export default class extends React.Component {
    communityStore = new Store();

    componentDidMount() {
        // 这个代码不是必要的，仅仅是为了演示效果，模拟出手机的环境
        document.querySelector('html').style.fontSize = '50px';
    }

    componentWillUnmount() {
        this.communityStore.destroy();
        // 这个代码不是必要的，仅仅是为了演示效果，模拟出手机的环境
        document.querySelector('html').style = '';
    }

    render() {
        const showDynamicGiftMsg = this.communityStore.giftMsg.dynamicMsg.data;

        return (
            <Provider CommunityStore={this.communityStore}>
                <div className={S.viewWrap}>
                    {
                        showDynamicGiftMsg && <DynamicGiftMsg />
                    }
                    <StaticGiftMsg />
                </div>
            </Provider>
        );
    }
}
