import React, { Component } from 'react';
import { Provider, observer, inject } from 'mobx-react';
import store from './store';
import S from './style.less';

class TodoItem extends Component {
    render() {
        const { taskTitle, isFinish, changeState } = this.props;

        return (
            <li>
                <label>
                    <input
                        checked={isFinish}
                        onChange={changeState}
                        type="checkbox"
                    />

                    <span>{taskTitle}</span>
                </label>

                <button>删除</button>
            </li>
        );
    }
}

@inject('todolist')
@observer
class Todolist extends Component {
    handleInput = event => {
        const value = event.target.value;
        const { setAddTaskTitle } = this.props.todolist;

        setAddTaskTitle(value);
    };

    handleKeyUp = ({ keyCode }) => {
        if (keyCode !== 13) {
            return;
        }

        const { addTaskTitle, addTodo, setAddTaskTitle } = this.props.todolist;

        addTodo(addTaskTitle);
        setAddTaskTitle('');
    };

    render() {
        const { unfinishedCount, addTaskTitle, todos } = this.props.todolist;

        return (
            <div className={S.pageContent}>
                <div className={S.editWrap}>
                    <p>你今天的主要工作重点是什么？</p>
                    <small>{`你当前还剩余 ${unfinishedCount} 项任务没完成`}</small>
                    <input
                        value={addTaskTitle}
                        onChange={this.handleInput}
                        onKeyUp={this.handleKeyUp}
                        maxLength="36"
                        type="text"
                        placeholder="输入完成后按下回车键添加"
                    />
                </div>

                <ul className={S.taskList}>
                    {todos.map(todo => (
                        <TodoItem
                            key={todo.id}
                            {...todo}
                            changeState={todo.changeState}
                        />
                    ))}
                </ul>
            </div>
        );
    }
}

export default class App extends Component {
    render() {
        return (
            <Provider todolist={store}>
                <Todolist />
            </Provider>
        );
    }
}
