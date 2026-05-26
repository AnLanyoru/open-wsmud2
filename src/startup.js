

import './styles/global.css';
import './styles/main.css';
import './styles/dialog.css';
import $ from 'jquery';
globalThis['$'] = $;
import { SendCommand, ReceiveMessage } from './client.js';
globalThis['SendCommand'] = SendCommand;
globalThis['ReceiveMessage'] = ReceiveMessage;

import { Confirm, Warn } from './confirm.js';
import Dialog from './dialog/base.js';
import Process from './process.js';
globalThis['Confirm'] = Confirm;
globalThis['Warn'] = Warn;
globalThis['Process'] = Process;
globalThis['Dialog'] = Dialog;

import MainPage from './main.js';

function startup() {
    const mainPage = new MainPage();
    mainPage.onCompile();
    mainPage.mount(document.body);

    Process.init();

}
$(startup);
