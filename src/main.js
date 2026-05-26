import { Page } from './base/page.js';
import LoginPage from './login/index.js';
import GameMainPage from './game/main.js';

const login = new LoginPage();
const game = new GameMainPage();

class MainPage extends Page {
    constructor() {
        super();
        this.template = `${login.render()}\n${game.render()}`;

    }

    on_mount() {
        login.on_mount();
        game.on_mount();
    }
}

export default MainPage;
