import todos from './data.js';
import changeTheme from './theme.js';
import Todolist from './Todolist.js';

const changeThemeSetMode = () => {
    if (localStorage.getItem('darkModeOn') == 'true') {
        localStorage.setItem('darkModeOn', 'false');
    } else {
        localStorage.setItem('darkModeOn', 'true');
    }

    changeTheme();
};

const _todolist = new Todolist(todos);
const changeThemeButton = document.querySelector('.theme');

if (localStorage.getItem('darkModeOn') === null) {
    localStorage.setItem('darkModeOn', false);
}

changeThemeButton.addEventListener('click', changeThemeSetMode);
