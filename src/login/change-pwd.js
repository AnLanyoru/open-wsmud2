
import { Page } from '../base/page.js';
import API from '../api.js';
import * as Client from '../client.js';

class ChangePwdPage extends Page {
  constructor() {
    super();
    this.template = `
      <div id="pwd_panel" class="mypanel" style="display:none;">
            <ul>
                <li class="panel_item active"><span>修改密码</span></li>
                <li class="content">
                    <h3>输入你现在的密码</h3>
                    <input type="password" id="update_pwd1" value="" placeholder="输入你现在的密码" class="textbox" />
                    <div id="pwd_bind" style="display:none">
                        <h3>你绑定的手机</h3>
                        <input type="text" id="pwd_phone" placeholder="请输入你的手机号码" class="textbox" />
                        <h3>绑定的手机尾号</h3>
                        <div class="validnum-box">
                            <input type="text" id="pwd_no" placeholder="请输入四位尾号" class="textbox" />
                            <button class="validnum-btn hide">发送验证码</button>
                        </div>
                    </div>
                    <h3>你新的密码</h3>
                    <input type="password" id="update_pwd2" value="" placeholder="你新的密码" class="textbox" />
                    <h3>重复你的新密码</h3>
                    <input type="password" id="update_pwd3" value="" placeholder="重复你的新密码" class="textbox" />
                </li>
                <li class="panel_item" command="UpdatePwd"><span class="glyphicon glyphicon-edit"></span><span
                        style="margin-left:0.5rem">修改</span></li>
                <li class="panel_item" command="ToServerPanel"><span
                        class="glyphicon glyphicon-chevron-left"></span><span style="margin-left:0.5rem">返回</span></li>
            </ul>
        </div>
`;

  }

  open() {
    Client.hide2show("#pwd_panel");
    API.GetPhone(function (x) {
      if (x.code !== 1) return Client.showInputError("#update_pwd1", "获取绑定的手机号失败");

      if (x.result) {
        $("#pwd_phone").prop("disabled", true).val(x.result);
        $("#pwd_bind").show();
      } else {
        $("#pwd_phone").prop("disabled", false).val("");
        $("#pwd_bind").hide();
      }
    });
  }

  update() {
    $('#pwd_panel').find('.input-error').remove();
    var pwd1 = $("#update_pwd1").val();
    var pwd2 = $("#update_pwd2").val();
    var pwd3 = $("#update_pwd3").val();
    if (pwd1.length < 6 || pwd1.length > 20) return Client.showInputError("#update_pwd1", "密码长度在6到20之间");
    if (pwd2.length < 6 || pwd2.length > 20) return Client.showInputError("#update_pwd2", "密码长度在6到20之间");
    if (pwd3 != pwd2) return Client.showInputError("#update_pwd3", "两次密码输入不一致");
    var valid_no;
    if ($("#pwd_bind").is(":visible")) {
      valid_no = $("#pwd_no").val();
      if (!valid_no) return Client.showInputError($("#pwd_no").parent(), "请输入你绑定的手机尾号");
      if (!/^\d{4}$/.test(valid_no)) return Client.showInputError($("#pwd_no").parent(), "请输入你绑定的手机尾号");
    }

    Client.showLoader("正在修改密码", "#pwd_panel");
    API.ChangePassword(pwd1, pwd2, valid_no, function (x) {
      if (x.code) {
        Client.hide2show($("#slist_panel"));
      } else {
        Client.showInputError("#update_pwd1", x.result || '修改失败');
        Client.hide2show("#pwd_panel");
      }
    });
  }
}

export default ChangePwdPage;
