import React from 'react';
import cx from 'classnames';
import S from './style.less';

export default class extends React.Component {
    state = {
        sudokuArray: [
            [6, 0, 2, 0, 3, 4, 0, 9, 0],
            [1, 3, 0, 0, 0, 0, 0, 2, 8],
            [4, 8, 0, 0, 2, 0, 0, 7, 0],
            [0, 2, 0, 0, 0, 1, 8, 5, 3],
            [7, 0, 3, 9, 0, 0, 0, 0, 0],
            [0, 0, 6, 0, 5, 2, 0, 0, 0],
            [2, 0, 0, 6, 0, 0, 0, 0, 4],
            [0, 0, 0, 0, 9, 3, 7, 1, 0],
            [0, 4, 0, 0, 1, 0, 0, 0, 9],
        ]
    }

    renderSudoku = () => {
        const { sudokuArray } = this.state;
        const renderRow = (sudokuArray) => (
            sudokuArray.map(rowItem => (
                <div className={S.row}>
                    {
                        renderCellItem(rowItem)
                    }
                </div>
            ))
        )
        const renderCellItem = (rowItem) => (
            rowItem.map(cellItem => (
                <div className={S.cellItem}>{cellItem ? cellItem : ''}</div>
            ))
        )

        return (
            <div className={S.sudoku}>
                {
                    renderRow(sudokuArray)
                }
            </div>
        );
    }

    render() {
        return (
            <div className={S.gameWrap}>
                {
                    this.renderSudoku()
                }
            </div>
        );
    }
}
