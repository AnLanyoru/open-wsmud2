
import { Page } from '../base/page.js';
import Util from '../utils/util.js';
import API from '../api.js';
import * as Client from '../client.js';

class BindPhonePage extends Page {
  constructor() {
    super();
    this.template = `
         <div id="bind_panel" class="mypanel" style="display:none;">
            <ul>
                <li class="panel_item active"><span>绑定手机</span></li>
                <li class="content">
                    <h3>你绑定的手机</h3>
                    <input type="text" id="phone_no" placeholder="请输入你的手机号码" class="textbox" />
                    <h3>绑定的手机尾号</h3>
                    <div class="validnum-box">
                        <input type="text" id="phone_valid" placeholder="请输入四位尾号" class="textbox" />
                        <button class="validnum-btn hide">发送验证码</button>
                    </div>
                    <h3>你的密码</h3>
                    <input type="password" id="phone_pwd" placeholder="请输入密码" class="textbox" />
                </li>
                <li class="panel_item" command="CheckValid"><span class="glyphicon glyphicon-edit"></span><span
                        style="margin-left:0.5rem">绑定</span></li>
                <li class="panel_item" command="ToServerPanel"><span
                        class="glyphicon glyphicon-chevron-left"></span><span style="margin-left:0.5rem">返回</span></li>
            </ul>
        </div>
`;
  }

  bind() {
    Client.hide2show("#bind_panel");
    API.GetPhone(function (x) {
      $("#phone_valid").val("");
      $("#phone_pwd").val("");
      if (x.code !== 1)
        return $(".input-error").html(x.result);
      $(".input-error").remove();
      let phone = x.result;
      if (phone) {
        $("#phone_no").prop("disabled", true).val(phone);
        $('#phone_valid').parent().show().prev().show();
        $("#phone_no").prev().html("你已绑定手机，再次验证会取消绑定");
        $("#phone_no").parent().next().find('span:last()').html("解除绑定");
      } else {
        $("#phone_no").prop("disabled", false).val("");
        $("#phone_no").prev().html("你要绑定的手机(不验证，目前仅作为二级密码验证使用)");
        $('#phone_valid').parent().hide().prev().hide();
        $("#phone_no").parent().next().find('span:last()').html("绑定");
      }
    });
  }

  check() {
    var phone = $("#phone_no");
    var phone_no = "", valid_no = "";
    if (!phone.is(":disabled")) {
      phone_no = phone.val();
      if (!phone_no) return Client.showInputError("#phone_no", "请输入你的帐号绑定的手机号码");
      if (!/^1\d{10}$/.test(phone_no)) return Client.showInputError("#phone_no", "手机号码格式错误");
    } else {
      valid_no = $("#phone_valid").val();
      if (!valid_no) return Client.showInputError($("#phone_valid").parent(), "请输入你接收到的六位验证码");
      if (!/^\d{4}$/.test(valid_no)) return Client.showInputError($("#phone_valid").parent(), "请输入六位数字的验证码");
    }
    var pwd2 = $("#phone_pwd").val();
    if (!pwd2) return Client.showInputError("#phone_pwd", "请重复输入你的新密码");
    if (pwd2.length < 6 || pwd2.length > 20) return Client.showInputError("#phone_pwd", "密码长度在6到20之间");

    API.BindPhone(valid_no, phone_no, pwd2, function (x) {
      if (x.code < 1) {
        Client.showInputError($("#phone_valid").parent(), x.result ?? "绑定失败");
        Client.hide2show("#bind_panel");
      } else {
        Client.hide2show("#role_panel");
      }
    });
  }
}

export default BindPhonePage;
