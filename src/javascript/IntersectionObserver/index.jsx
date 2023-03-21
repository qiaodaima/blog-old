import React from 'react';
import S from './style.less';

export default class extends React.Component {
    io = null;
    $target1 = null;
    $target2 = null;

    componentDidMount() {
        const option = {
            threshold: [0, 0.5],
        };
        const callback = entries => {
            console.log('变化', entries);
        };

        this.io = new IntersectionObserver(callback, option);

        // 开始观察
        this.io.observe(this.$target1);
        this.io.observe(this.$target2);
    }

    componentWillUnmount() {
        // 关闭观察器
        this.io.disconnect();
    }

    render() {
        return (
            <div className={S.demoWrap}>
                <div className={S.scrollWrap}>
                    <div ref={d => (this.$target1 = d)} className={S.target}>
                        目标元素1
                    </div>
                    <div ref={d => (this.$target2 = d)} className={S.target}>
                        目标元素2
                    </div>
                </div>
            </div>
        );
    }
}
