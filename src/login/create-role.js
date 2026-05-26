
import { Page } from '../base/page.js';
import API from '../api.js';
import * as Client from '../client.js';
import { RefreshInput } from './roles.js';

window.RefreshInput = RefreshInput;

class CreateRolePage extends Page {
    constructor() {
        super();
        this.template = `


        <div class="mypanel" id="addrole_panel">
            <ul>
                <li class="panel_item active">创建你的角色卡</li>
                <li class="content">
                    <div class="input-error"></div>
                    <div>
                        <h3 class="regist-title-text">你的称呼，2-5个中文字符</h3><span onclick="RefreshInput('name');"
                            class="glyphicon glyphicon-refresh regist-title-ref"></span>
                    </div>
                    <div>
                        <input type="text" placeholder="请输入姓名" id="reg_name" class="textbox" style="width:250px;" />
                    </div>
                    <h3>你的性别</h3>
                    <div>
                        <label><input type="radio" name="role_gander" id="gender_0" checked="checked" />男</label>
                        <label><input type="radio" name="role_gander" />女</label>
                    </div>
                    <div>
                        <h3 class="regist-title-text">你的先天属性</h3><span
                            class="glyphicon glyphicon-refresh regist-title-ref" onclick="RefreshInput('prop');"></span>
                    </div>
                    <table>
                        <tr>
                            <td style="width:5rem">臂力：<span class="glyphicon glyphicon-exclamation-sign"
                                    style="color:#bbbbbb" data-container="body" data-toggle="popover"
                                    data-trigger="hover" data-content="影响人物的攻击力，招架等"></span></td>
                            <td style="width:5rem"><input type="text" id="reg_str" class="hide_txt" value="20" /></td>
                            <td style="width:5rem">根骨：<span class="glyphicon glyphicon-exclamation-sign"
                                    style="color:#bbbbbb" data-container="body" data-toggle="popover"
                                    data-trigger="hover" data-content="影响人物的内力上限，气血，防御等"></span></td>
                            <td><input type="text" id="reg_con" class="hide_txt" value="20" /></td>
                        </tr>
                        <tr>
                            <td style="width:2.5rem">身法：<span class="glyphicon glyphicon-exclamation-sign"
                                    style="color:#bbbbbb" data-container="body" data-toggle="popover"
                                    data-trigger="hover" data-content="影响人物的躲闪，暴击等属性"></span></td>
                            <td style="width:5rem"><input type="text" id="reg_dex" class="hide_txt" value="20" /></td>
                            <td style="width:2.5rem">悟性：<span class="glyphicon glyphicon-exclamation-sign"
                                    style="color:#bbbbbb" data-container="body" data-toggle="popover"
                                    data-trigger="hover" data-content="影响人物对技能的领悟速度等"></span></td>
                            <td style="width:5rem"><input type="text" id="reg_int" class="hide_txt" value="20" /></td>
                        </tr>
                    </table>
                    <div style="margin:0.5rem 0px;color:#999999">需要在15-30之间，并且总和等于80</div>
                </li>
                <li class="panel_item" command="CreateRole"><span class="glyphicon glyphicon-saved"></span><span
                        style="margin-left:0.5rem">创建</span></li>
                <li class="panel_item" command="ToRolePanel"><span class="glyphicon glyphicon-off"></span><span
                        style="margin-left:0.5rem">返回</span></li>
            </ul>
        </div>
`;
    }

    create() {
        var player = {};
        player.name = $("#reg_name").val();
        player.gender = $("#gender_0").is(":checked") ? 1 : 2;
        player.str = parseInt($("#reg_str").val());
        player.con = parseInt($("#reg_con").val());
        player.dex = parseInt($("#reg_dex").val());
        player.int = parseInt($("#reg_int").val());

        if (!/^[\u4E00-\u9FA5]{2,5}$/.test(player.name)) return Client.showInputError("#reg_name", "名称格式错误，只能使用2-5位中文字符");
        if (player.str < 15 || player.str > 30) return Client.showInputError("#reg_name", "臂力需要在15-30之间");
        if (player.con < 15 || player.con > 30) return Client.showInputError("#reg_name", "根骨需要在15-30之间");
        if (player.dex < 15 || player.dex > 30) return Client.showInputError("#reg_name", "身法需要在15-30之间");
        if (player.int < 15 || player.int > 30) return Client.showInputError("#reg_name", "悟性需要在15-30之间");
        if (player.str + player.con + player.dex + player.int != 80) return Client.showInputError("#reg_name", "先天属性需要在15-30之间，并且总和等于80");
        Client.showLoader("正在创建角色", "#addrole_panel");
        SendCommand("createrole " + player.name + " " + player.gender + " " + player.str + " " + player.con + " " + player.dex + " " + player.int);
    }
}

export default CreateRolePage;
