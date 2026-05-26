
import { Page } from '../base/page.js';
import Server from './server.js';
import Util from '../utils/util.js';
import Regist from './regist.js';
import Roles from './roles.js';
import ResetPwd from './reset-pwd.js';
import ChangePwd from './change-pwd.js';
import BindPhone from './bind-phone.js';
import CreateRole from './create-role.js';
import News from './news.js';
import LoginIn from './login-in.js';
import * as Client from '../client.js';

const server = new Server();
const loginIn = new LoginIn();
const regist = new Regist();
const roles = new Roles();
const resetPwd = new ResetPwd();
const changePwd = new ChangePwd();
const bindPhone = new BindPhone();
const createRole = new CreateRole();
const news = new News(); 4

function showNews() {
  let nid = $(this).attr('nid');
  Client.hide2show($("#new_panel "));
  $("#news_frame").attr("src", "/news/" + nid + ".html");
}

class LoginPage extends Page {
  constructor() {
    super();
    this.template = `

        ${loginIn.template}

        ${server.template}
        ${bindPhone.template}

        ${changePwd.template}
        ${resetPwd.template}
        
       ${regist.template}
       ${roles.template}
       ${news.template}
       ${createRole.template}
        <div class="signinfo">©2017 武神传说 </div>
    </div>
`;

  }

  on_mount() {
    $(".login-content").on("click", ".panel_item", (e) => this.LoginCommand(e));
    $(".role-list").on("click", ".role-item", function () {
      $(this).parent().find(".select").removeClass("select");
      $(this).addClass("select");
    });

    $('.new-list>li').on('click', showNews);
    var key = Util.GetUserCookie("p");
    if (!key) {
      return $("#login_panel").show();
    }
    server.showServers();
  }

  LoginCommand(e) {
    var cmd = $(e.currentTarget).attr("command");
    switch (cmd) {
      case "ToRolePanel":
        Client.hide2show($("#role_panel"));
        break;
      case "ToServerPanel":
        Client.closeServer();
        Client.hide2show($("#slist_panel"));
        break;
      case "ToLogin":
        Client.hide2show($("#login_panel"));
        break;
      case "Forget":
        Client.hide2show($("#reset_panel"));
        break;
      case "CancleRegist":
        Client.hide2show($("#login_panel"));
        break;
      case "Down":
        Client.hide2show($("#download"));
        break;
      case "ToRegist":
        Client.hide2show($("#regist_panel"));
        regist.open();
        break;
      case "Regist":
        regist.regist();
        break;
      case "SelectServer":
        server.selectServer();
        break;
      case "LoginIn":
        loginIn.loginIn();
        break;
      case "ResetPwd":
        resetPwd.reset();
        break;
      case "AddRole":
        roles.addRole();
        break;
      case "SelectRole":
        roles.select();
        break;
      case "CreateRole":
        createRole.create();
        break;
      case "BindPhone":
        bindPhone.bind();
        break;
      case "CheckValid":
        bindPhone.check();
        break;
      case "UpdatePwd":
        changePwd.update();
        break;
      case "ToUpdate":
        changePwd.open();
        break;
      case "ReLogin":
        loginIn.relogin();
        break;
      case "DeleteRole":
        roles.delete();
        break;
    }
  }
}

export default LoginPage;
export { roles };