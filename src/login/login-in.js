
import { Page } from '../base/page.js';
import API from '../api.js';
import * as Client from '../client.js';
import ServerPage from './server.js';
import loader from '../img/loader.gif';

const server = new ServerPage();

class LoginInPage extends Page {
  constructor() {
    super();
    this.template = `
 <div class="login-content">
        <div id="loader" class="loader hide"><img src="${loader}" alt="" /><span id="loader_msg">正在登陆</span></div>
        <div class="error hide"></div>
        <div id="login_panel" class="mypanel" style="display:none;">
            <ul>
                <li class="panel_item active">
                    <span>欢迎登陆</span>
                </li>
                <li class="content">
                    <h3>你的用户名</h3>
                    <input type="text" id="login_name" value="" placeholder="请输入用户名" class="textbox" />
                    <h3>你的密码</h3>
                    <input type="password" id="login_pwd" value="" placeholder="请输入密码" class="textbox" />
                </li>
                <li class="panel_item" command="LoginIn"><span class="glyphicon glyphicon-log-in"></span><span
                        style="margin-left:0.5rem">登陆</span></li>
                <li class="panel_item" command="ToRegist"><span class="glyphicon glyphicon-edit"></span><span
                        style="margin-left:0.5rem">注册</span></li>
                <li class="panel_item" command="Forget"><span class="glyphicon glyphicon-question-sign"></span><span
                        style="margin-left:0.5rem">忘记密码</span></li>
            </ul>
        </div>
`;
  }

  relogin() {
    Client.hide2show($("#login_panel"));
    var myDate = new Date();
    myDate.setTime(-1000);
    var data = document.cookie;
    var dataArray = data.split("; ");
    for (var i = 0; i < dataArray.length; i++) {
      var varName = dataArray[i].split("=");
      document.cookie = varName[0] + "=''; expires=" + myDate.toGMTString();
    }
  }

  loginIn() {
    var name = $("#login_name").val().toLowerCase();
    var pwd = $("#login_pwd").val();
    if (!name) return Client.showInputError("#login_name", "请输入用户名");
    if (!/^[a-z0-9]{5,15}$/.test(name)) return Client.showInputError("#login_name", "用户名格式错误,需要5-15位字母开头的字母，数字或下划线，不区分大小写");
    if (!pwd) return Client.showInputError("#login_pwd", "请输入密码");
    if (pwd.length < 6 || pwd.length > 20) return Client.showInputError("#login_pwd", "密码长度在6到20之间");
    Client.showLoader("正在登录", "#login_panel");
    API.Login(name, pwd, (x) => {
      if (x.code) {
        server.showServers();
      } else {
        Client.showInputError("#login_name", x.result || '登陆失败');
        Client.hide2show("#login_panel");
      }
    });
  }
}

export default LoginInPage;
