import todos from './data.js';
import changeTheme from './theme.js';
import Todolist from './Todolist.js';

const _todolist = new Todolist(todos);
let darkModeOn = false;
changeTheme(darkModeOn);

const button = document.querySelector('.theme');

button.addEventListener('click', () => {
    darkModeOn = !darkModeOn;
    changeTheme(darkModeOn);
});
