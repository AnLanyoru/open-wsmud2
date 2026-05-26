
import { Page } from '../base/page.js';
import API from '../api.js';
import { hide2show, showInputError, showLoader } from '../client.js';

class RegistPage extends Page {
  constructor() {
    super();
    this.initReg = false;
    this.template = `
     <div id="regist_panel" class="mypanel" style="display:none">
            <ul>
                <li class="panel_item active">注册用户</li>
                <li class="content">
                    <h3>你的用户名</h3>
                    <input type="text" id="regist_name" placeholder="请输入用户名" class="textbox" />
                    <h3>你的密码</h3>
                    <input type="password" id="regist_pwd1" placeholder="请输入密码" class="textbox" />
                    <h3>重复你的密码</h3>
                    <input type="password" id="regist_pwd2" placeholder="请输入密码" class="textbox" />
                    <div id="regist_valpanel">
                        <h3>请输入图片验证码</h3>
                        <div class="validnum-box">
                            <input type="text" id="regist_val" value="" placeholder="请输入图片验证码" class="textbox" />
                            <img src="" class="validnum-img" />
                        </div>
                    </div>
                </li>
                <li class="panel_item" command="Regist"><span class="glyphicon glyphicon-saved"></span><span
                        style="margin-left:0.5rem">确定</span></li>
                <li class="panel_item" command="ToLogin"><span class="glyphicon glyphicon-chevron-left"></span><span
                        style="margin-left:0.5rem">取消</span></li>
            </ul>
        </div>
`;
  }

  on_mount() {
  }

  open() {
    if (!this.initReg) {
      this.GetValidationImage();
      $(".validnum-box>.validnum-img").on("click", () => this.GetValidationImage());
      this.initReg = true;
    }
  }

  regist() {
    var name = $("#regist_name").val().toLowerCase();
    var pwd = $("#regist_pwd1").val();
    if (!name) return showInputError("#regist_name", "请输入用户名");
    if (!/^[a-z0-9]{5,15}$/.test(name)) return showInputError("#regist_name", "用户名需要是5-10个英文字符");
    if (!pwd) return showInputError("#regist_pwd1", "请输入密码");
    if (pwd.length < 6 || pwd.length > 20) return showInputError("#regist_pwd1", "密码长度在6到20之间");
    if (pwd != $("#regist_pwd2").val()) return showInputError("#regist_pwd2", "重复密码输入不一致，请重新输入");
    var valno = $("#regist_val").val();
    if (!valno) return showInputError("#regist_valpanel", "请输入图片中的验证码");
    if (valno.length != 4) return showInputError("#regist_valpanel", "请输入图片中的四位验证码");
    let guider = 0, result = /u(\d+)/.exec(location.pathname);
    if (result) {
      guider = parseInt(result[1]);
      if (!(guider > 0)) guider = 0;
    }
    showLoader("正在注册账号");
    API.Regist({
      name, pwd, valno, guider
    }, (x) => {
      if (x.code == 1) {
        showLoader("注册成功，正在获取服务器列表");
        setTimeout(() => window.location.reload(), 500);
      } else {
        showInputError("#regist_name", x.result || '注册失败');
        hide2show($("#regist_panel"));
      }
    });
  }

  GetValidationImage() {
    API.ValidationImage(function (x) {
      $(".validnum-box>.validnum-img").attr('src', "data:image/svg+xml;base64," + x);
    });
  }
}

export default RegistPage;
