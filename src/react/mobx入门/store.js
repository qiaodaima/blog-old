import { observable, computed, action } from 'mobx';

class Todo {
    id = Math.random();
    @observable taskTitle = '';
    @observable isFinish = false;

    constructor(taskTitle) {
        this.taskTitle = taskTitle;
    }

    @action changeState = () => {
        this.isFinish = !this.isFinish;
    };
}

export default new (class TodoList {
    @observable addTaskTitle = '';
    @observable todos = [];

    @computed get unfinishedCount() {
        return this.todos.filter(todo => todo.isFinish === false).length;
    }

    @action setAddTaskTitle = value => {
        this.addTaskTitle = value;
    };

    @action addTodo = taskTitle => {
        taskTitle && this.todos.unshift(new Todo(taskTitle));
    };
})();
