
import { Page } from '../base/page.js';
import API from '../api.js';
import * as Client from '../client.js';

class ResetPwdPage extends Page {
  constructor() {
    super();
    this.template = `
     <div id="reset_panel" class="mypanel" style="display:none;">
            <ul>
                <li class="panel_item active"><span>重置你的密码</span></li>
                <li class="content">
                    <h3>你的用户名</h3>
                    <input type="text" id="reset_name" value="" placeholder="请输入用户名，如果账号未绑定手机无法重置" class="textbox" />
                    <h3>你绑定的手机</h3>
                    <input type="text" id="reset_phone" placeholder="请输入你的手机号码" class="textbox" />
                    <h3 class="hide">接收到的验证码</h3>
                    <div class="validnum-box hide">
                        <input type="text" id="reset_no" placeholder="请输入六位验证码" class="textbox" />
                        <button class="validnum-btn ">发送验证码</button>
                    </div>
                    <h3>你新的密码</h3>
                    <input type="password" id="reset_pwd1" value="" placeholder="你新的密码" class="textbox" />
                    <h3>重复你的新密码</h3>
                    <input type="password" id="reset_pwd2" value="" placeholder="重复你的新密码" class="textbox" />
                </li>
                <li class="panel_item" command="ResetPwd"><span class="glyphicon glyphicon-edit"></span><span
                        style="margin-left:0.5rem">重置密码</span></li>
                <li class="panel_item" command="ToLogin"><span class="glyphicon glyphicon-chevron-left"></span><span
                        style="margin-left:0.5rem">返回</span></li>
            </ul>
        </div>
`;

  }

  on_mount() {
  }

  reset() {
    var name = $("#reset_name").val();
    if (!name) return Client.showInputError("#reset_name", "请输入用户名");
    if (!/^[a-z0-9]{5,15}$/.test(name)) return Client.showInputError("#reset_name", "用户名格式错误,需要5-15位字母开头的字母，数字或下划线，不区分大小写");
    var phone = $("#reset_phone").val();
    if (!phone) return Client.showInputError("#reset_phone", "请输入你的帐号绑定的手机号码");
    if (!/^1\d{10}$/.test(phone)) return Client.showInputError("#reset_phone", "手机号码格式错误");
    var valid_no = "";
    var pwd1 = $("#reset_pwd1").val();
    if (!pwd1) return Client.showInputError("#reset_pwd1", "请输入你的新密码");
    var pwd2 = $("#reset_pwd2").val();
    if (!pwd2) return Client.showInputError("#reset_pwd2", "请重复输入你的新密码");
    if (pwd2.length < 6 || pwd2.length > 20) return Client.showInputError("#update_pwd2", "密码长度在6到20之间");
    if (pwd2 != pwd1) return Client.showInputError("#reset_pwd2", "两次密码输入不一致");
    Client.showLoader("正在修改密码", "#reset_panel");
    API.ResetPasswordByPhone(name, phone, valid_no, pwd1, function (x) {
      if (x.code) {
        Client.hide2show("#login_panel");
      } else {
        Client.showInputError("#reset_pwd2", x.result ?? "重置失败");
        Client.hide2show("#reset_panel");
      }
    });
  }
}

export default ResetPwdPage;
