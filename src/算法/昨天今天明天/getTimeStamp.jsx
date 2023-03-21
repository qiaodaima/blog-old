import React from 'react';

export default class extends React.Component {
    getTimeStamp = dateString => event => {
        const result = Date.parse(dateString);
        alert(result);
    };

    render() {
        return (
            <>
                <button onClick={this.getTimeStamp('1970-01-01 00:00:00')}>
                    获取1970-01-01 00:00:00时间戳
                </button>

                <button
                    onClick={this.getTimeStamp('1970-01-01 08:00:00')}
                    style={{ marginLeft: '20px' }}
                >
                    获取1970-01-01 08:00:00时间戳
                </button>
            </>
        );
    }
}
