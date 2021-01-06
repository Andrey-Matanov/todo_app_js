import changeTheme from './theme.js';

export default class Todolist {
    constructor(todos) {
        if (localStorage.getItem('todos')) {
            this.todos = JSON.parse(localStorage.getItem('todos'));
        } else {
            this.todos = todos;
            localStorage.setItem('todos', JSON.stringify(this.todos));
        }
        this.currentTodos = this.todos;
        this.currentTodosCategory = 'All';
        this.errorTimer = null;

        this.renderTodos();
    }

    setCurrentTodosCategory = (event) => {
        this.currentTodosCategory = event.target.innerText;

        document
            .querySelectorAll('.todos_categories__button')
            .forEach((button) =>
                button.classList.remove('todos_categories__button__selected')
            );

        event.target.classList.add('todos_categories__button__selected');

        this.renderTodos();
    };

    setCurrentTodos = () => {
        switch (this.currentTodosCategory) {
            case 'Active': {
                this.currentTodos = this.todos.filter(
                    (todo) => todo.completed === false
                );
                break;
            }
            case 'Completed': {
                this.currentTodos = this.todos.filter(
                    (todo) => todo.completed === true
                );
                break;
            }
            default: {
                this.currentTodos = this.todos;
                break;
            }
        }
    };

    addTodo = (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();

            const input = document.querySelector('.add_todo_input');

            if (this.validateInput(input.value)) {
                this.todos.push({
                    id: uuid.v4(),
                    title: input.value,
                    completed: false,
                });
                input.value = '';

                this.renderTodos();
            }
        }
    };

    validateInput = (input) => {
        const words = input.split(' ');

        for (let word of words) {
            if (word.length > 63) {
                clearTimeout(this.errorTimer);
                const addTodoError = document.querySelector('.add_todo__error');

                addTodoError.classList.add('add_todo__error__visible');
                this.errorTimer = setTimeout(() => {
                    addTodoError.classList.remove('add_todo__error__visible');
                }, 5000);

                return false;
            }
        }

        return true;
    };

    removeTodo = (event) => {
        const id = event.target.dataset.id;

        this.todos = this.todos.filter((todo) => todo.id != id);
        this.renderTodos();
    };

    markTodoAsCompleted = (event) => {
        const title = event.target.parentNode.children[1].innerText;
        const todo = this.todos.find((todo) => {
            return todo.title === title;
        });

        todo.completed = !todo.completed;
        this.renderTodos();
    };

    removeCompletedTodos = () => {
        this.todos = this.todos.filter((todo) => todo.completed === false);

        this.renderTodos();
    };

    clearTodolist = () => {
        this.todos = [];

        this.renderTodos();
    };

    restoreDefaultTodos = () => {
        localStorage.removeItem('todos');

        document.location.reload();
    };

    addEventListeners = () => {
        const newTodoInput = document.querySelector('.add_todo_input');
        const completeTodoButtons = document.querySelectorAll('.todo');
        const removeCompletedButton = document.querySelector(
            '.clear_completed_button'
        );
        const clearTodosButton = document.querySelector(
            '.clear_todolist_button'
        );
        const restoreDefaultTodosButton = document.querySelector(
            '.restore_default_button'
        );
        const todosCategoriesButtons = document.querySelectorAll(
            '.todos_categories__button'
        );

        newTodoInput.addEventListener('keydown', this.addTodo);

        completeTodoButtons.forEach((todo) => {
            const [todoInformation, removeButton] = todo.children;
            const [checkbox, title] = todoInformation.children;
            checkbox.addEventListener('click', this.markTodoAsCompleted);
            title.addEventListener('click', this.markTodoAsCompleted);
            removeButton.addEventListener('click', this.removeTodo);
        });

        removeCompletedButton.addEventListener(
            'click',
            this.removeCompletedTodos
        );

        clearTodosButton.addEventListener('click', this.clearTodolist);

        restoreDefaultTodosButton.addEventListener(
            'click',
            this.restoreDefaultTodos
        );

        todosCategoriesButtons.forEach((todo) =>
            todo.addEventListener('click', this.setCurrentTodosCategory)
        );
    };

    dragAndDrop = () => {
        const draggableElements = document.querySelectorAll('.todo');

        draggableElements.forEach((todo) => {
            todo.setAttribute('draggable', true);
            todo.addEventListener('dragstart', (e) => {
                const id = todo.id;
                e.dataTransfer.setData('text/plain', id);
            });
        });

        for (const dropZone of document.querySelectorAll('.todo_dnd_zone')) {
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();

                dropZone.classList.add('todo_dnd_zone__over');
            });

            dropZone.addEventListener('dragleave', (e) => {
                dropZone.classList.remove('todo_dnd_zone__over');
            });

            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();

                const droppedElementId = e.dataTransfer.getData('text/plain');
                const droppedElement = document.getElementById(
                    droppedElementId
                );
                const droppedElementParent = droppedElement.parentNode;
                const targetId = e.currentTarget.firstElementChild.id;

                this.swapTodos(droppedElementId, targetId);
                this.renderTodos();
            });
        }
    };

    swapTodos = (firstTodoId, secondTodoId) => {
        let number1;
        let number2;

        for (let i = 0; i < this.todos.length; i++) {
            if (this.todos[i].id == firstTodoId) {
                number1 = i;
            }

            if (this.todos[i].id == secondTodoId) {
                number2 = i;
            }
        }

        const temp = this.todos[number1];
        this.todos[number1] = this.todos[number2];
        this.todos[number2] = temp;
    };

    renderTodos = () => {
        this.setCurrentTodos();

        const todos = document.querySelector('.todos');
        const notCompletedAmount = document.querySelector(
            '.not_completed_amount'
        );
        const itemsText = document.querySelector('.items_text');
        let todosHTML = '';
        let notCompletedTodosAmount = 0;

        if (!this.todos.length) {
            todosHTML = `
            <h2 class="todo_list__empty">Todolist is currently empty</h2>
            `;
        } else if (!this.currentTodos.length) {
            if (this.currentTodosCategory == 'Active') {
                todosHTML = `
                <h2 class="todo_list__empty">No active todos</h2>
                `;
            } else {
                todosHTML = `
                <h2 class="todo_list__empty">No completed todos</h2>
                `;
            }
        } else {
            this.currentTodos.forEach(({ id, title, completed }) => {
                todosHTML += `
                <div class="todo_dnd_zone">
                    <div class="todo" id=${id}>
                        <div class="todo__information">
                            <input
                                class="complete_todo ${
                                    completed ? 'completed' : ''
                                }"
                                type="checkbox" 
                                name="completed_input" 
                                aria-labelledby="Complete Todo Checkbox"
                                ${completed ? 'checked' : ''}
                            />
                        <p class="title ${
                            completed ? 'completed' : ''
                        }">${title}</p>
                        </div>
                        <button data-id=${id} class="remove_todo">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>
                        </button>
                    </div>
                </div>
                `;
            });
        }

        this.todos.forEach((todo) => {
            if (!todo.completed) notCompletedTodosAmount += 1;
        });

        notCompletedAmount.innerText = notCompletedTodosAmount;
        notCompletedTodosAmount === 1
            ? (itemsText.innerText = 'item')
            : (itemsText.innerText = 'items');

        todos.innerHTML = todosHTML;
        this.addEventListeners();
        this.dragAndDrop();
        changeTheme();
        localStorage.setItem('todos', JSON.stringify(this.todos));
    };
}
