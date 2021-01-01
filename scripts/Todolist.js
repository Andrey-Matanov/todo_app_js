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

        this.renderTodos();
    }

    setCurrentTodosCategory = (event) => {
        this.currentTodosCategory = event.target.innerText;

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
        event.preventDefault();
        const input = document.querySelector('.new_todo_input');

        this.todos.push({
            id: uuid.v4(),
            title: input.value,
            completed: false,
        });
        input.value = '';

        this.renderTodos();
    };

    removeTodo = (event) => {
        const id = event.target.dataset.id;

        this.todos = this.todos.filter((todo) => todo.id != id);

        this.renderTodos();
    };

    markTodoAsCompleted = (event) => {
        const title = event.target.parentNode.children[1].innerText;
        const todo = this.todos.find((todo) => todo.title === title);

        todo.completed = !todo.completed;

        this.renderTodos();
    };

    removeCompletedTodos = () => {
        this.todos = this.todos.filter((todo) => todo.completed === false);

        this.renderTodos();
    };

    restoreDefaultTodos = () => {
        localStorage.removeItem('todos');

        document.location.reload();
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

        this.renderTodos();
    };

    addEventListeners = () => {
        const addTodoButton = document.querySelector('.add_todo_button');
        const newTodoInput = document.querySelector('.new_todo_input');
        const completeTodoButtons = document.querySelectorAll('.todo');
        const removeCompletedButton = document.querySelector(
            '.clear_completed_button'
        );
        const restoreDefaultTodosButton = document.querySelector(
            '.restore_default_button'
        );
        const allTodosButton = document.querySelector('.all_todos_button');
        const activeTodosButton = document.querySelector(
            '.active_todos_button'
        );
        const completedTodosButton = document.querySelector(
            '.completed_todos_button'
        );

        newTodoInput.addEventListener('keydown', (e) => {
            console.log(e);
            if (e.keyCode === 13) {
                this.addTodo;
            }
        });
        addTodoButton.addEventListener('click', this.addTodo);

        completeTodoButtons.forEach((todo) => {
            const [checkbox, title, removeButton] = todo.children;
            checkbox.addEventListener('click', this.markTodoAsCompleted);
            removeButton.addEventListener('click', this.removeTodo);
        });

        removeCompletedButton.addEventListener(
            'click',
            this.removeCompletedTodos
        );

        restoreDefaultTodosButton.addEventListener(
            'click',
            this.restoreDefaultTodos
        );

        allTodosButton.addEventListener('click', this.setCurrentTodosCategory);
        activeTodosButton.addEventListener(
            'click',
            this.setCurrentTodosCategory
        );
        completedTodosButton.addEventListener(
            'click',
            this.setCurrentTodosCategory
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
            });
        }
    };

    renderTodos = () => {
        this.setCurrentTodos();

        const todos = document.querySelector('.todos');
        const notCompletedAmout = document.querySelector(
            '.not_completed_amount'
        );
        const itemsText = document.querySelector('.items_text');
        let todosHTML = '';
        let notCompletedTodosAmount = 0;

        this.currentTodos.forEach(({ id, title, completed }) => {
            if (!completed) {
                notCompletedTodosAmount++;
            }

            todosHTML += `
            <div class="todo_dnd_zone">
                <div class="todo" id=${id}>
                    <input
                        class="complete_todo ${completed ? 'completed' : ''}"
                        type="checkbox" 
                        name="completed" 
                        ${completed ? 'checked' : ''}
                    />
                    <p class="title">${title}</p>
                    <button data-id=${id} class="remove_todo">X</button>
                </div>
            </div>
            `;
        });

        notCompletedAmout.innerText = notCompletedTodosAmount;
        notCompletedTodosAmount === 1
            ? (itemsText.innerText = 'item')
            : (itemsText.innerText = 'items');

        todos.innerHTML = todosHTML;
        this.addEventListeners();
        this.dragAndDrop();
        localStorage.setItem('todos', JSON.stringify(this.todos));
    };
}
