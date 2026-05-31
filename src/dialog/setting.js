
import Util from '../utils/util.js';
import Setting from '../setting.js';
import { GameClient, hide2show, ReceiveMessage } from '../client.js';

export default {
    footer: [["显示", "setting"], ["<yel>高级</yel>", "custom"]
        , ["快捷键", "keys"], ["扩展", "extend"]
    ],
    selectitem: null,
    init: function () {
        if (this.settingElement) return;
        if (Util.isMobile) this.footer.splice(2, 1);

        this.settingElement = $(setting_template);
        this.extendElement = $(extend_template);
        this.keysElement = $(keys_template);
        this.customElement = $(custom_template);
        Dialog.injectStyle(setting_css);
        var elems = this.settingElement.find(".setting-item");
        for (var i = 0; i < elems.length; i++) {
            var item = $(elems[i]);
            var prop = item.attr("for");
            if (!prop) continue;
            var value = Setting[prop];
            switch (prop) {
                case "fontsize":
                    this.select_color(item.find(".color-item"), value, "fontSize");
                    break;
                case "font":
                    this.select_color(item.find(".color-item"), value, "fontFamily");
                    break;
                case "fontcolor":
                    this.select_color(item.find(".color-item"), value, "backgroundColor");
                    break;
                case "backcolor":
                    this.select_color(item.find(".color-item"), value, "backgroundColor");
                    break;
                case "combat_size":
                case "menu_size":
                case "dialog_size":
                    this.select_value(item.find(".color-item"), value);
                    break;
                case "auto_pfm":
                case "auto_pfm2":
                    if (value) {
                        item.find(".switch ").addClass("on");
                        item.find(".switch-text").html("开");
                        this.customElement.find("#" + prop).show().val(value);
                    }
                    break;
                case "auto_work":
                    if (value) {
                        item.find(".switch ").addClass("on");
                        item.find(".switch-text").html("开");
                        this.customElement.find("#" + prop).show().val(value != 1 ? value : "");
                    }
                    break;
                case "top_safe_distance":
                case "bottom_safe_distance":
                    item.find(".setting-range").val(value);
                    item.find(".range-value").text(value);
                    break;
                default:
                    if (value == 1) {
                        item.find(".switch ").addClass("on");
                        item.find(".switch-text").html("开");
                    }
                    break;
            }
        }
        var customItems = this.customElement.find(".setting-item");
        for (var i = 0; i < customItems.length; i++) {
            var item = $(customItems[i]);
            var prop = item.attr("for");
            if (!prop) continue;
            var value = Setting[prop];
            if (value) {
                item.find(".switch").addClass("on");
                item.find(".switch-text").html("开");
                if (prop === "auto_pfm" || prop === "auto_pfm2") {
                    this.customElement.find("#" + prop).show().val(value);
                } else if (prop === "auto_work") {
                    this.customElement.find("#" + prop).show().val(value != 1 ? value : "");
                }
            }
        }
    },
    show: function () {
        if (this.isShow) return;
        this.footerChanged("setting");
        Dialog.icon("cog");
        Dialog.title("设置");
        Dialog.footerElement.empty();
        for (var i = 0; i < this.footer.length; i++) {
            var elem = $("<span class='footer-item' for='" + this.footer[i][1] + "'>"
                + this.footer[i][0] + "</span>").appendTo(Dialog.footerElement);
            if (i == 0) elem.addClass("select");
        }
        this.isShow = true;
    }, select_color: function (elems, value, style) {
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].style[style] == value) {
                $(elems[i]).addClass("select");
            } else {
                $(elems[i]).removeClass("select");
            }
        }
    }, select_value: function (elems, value) {
        for (var i = 0; i < elems.length; i++) {
            if ($(elems[i]).attr('value') == value) {
                $(elems[i]).addClass("select");
            } else {
                $(elems[i]).removeClass("select");
            }
        }
    },
    footerChanged: function (item) {

        let elem = this[item + "Element"];
        if (!elem || elem === this.selectitem) return this.child?.command(item);
        this.selectitem && this.selectitem.remove();
        this.selectitem = elem;
        if (this.child && this.child.hide() === false) return;
        this.child = null;

        if (item == "setting") {
            this.selectitem.on("click", ".switch", this.switchClick);
            this.selectitem.on("click", ".color-item", this.colorClick);
            this.selectitem.on("input", ".setting-range", this.rangeInput);
        } else if (item == "custom") {
            this.selectitem.on("click", ".switch", this.switchClick);
            this.selectitem.on("click", ".setting-ok", this.save_custom);
        } else {
            this.child = Dialog[item];
            this.child.show(this.selectitem);
        }
        this.selectitem.appendTo(Dialog.contentElement);
    }, helpClick: function () {
        var elem = $(this);
        var act = elem.attr("action");
        switch (act) {
            case "tologin":
                break;
            case "torole":
                GameClient.Close();
                hide2show("#role_panel", function () {
                    Process.player = null;
                    Process.clear();
                });
                break;
            case "toserver":
                Process.player = null;
                GameClient.Close();
                break;
            default:

                break;
        }
    },
    close_help: function () {
        if (this.frame) {
            this.frame.remove();
            this.selectitem.removeClass("help-detl");
            this.frame = null;
        }
    }, hide: function () {
        if (this.child && this.child.hide() === false) {
            return false;
        }
        this.close();
    }, close: function () {
        this.child?.close();
        this.selectitem?.remove();
        this.isShow = false;
        this.selectitem = null;
        this.child = null;
    }
    , save_custom: function () {
        if ($(".dialog-custom>.setting-item[for='auto_pfm']>.switch").is(".on")) {
            var val = $("#auto_pfm").val();
            if (!val) return ReceiveMessage("<hir>你没有设置自动出招的绝招。</hir>");
            if (val.length > 300) return ReceiveMessage("<hir>你设置的出招过长。</hir>");
            Setting.save("auto_pfm", val);
        }
        if ($(".dialog-custom>.setting-item[for='auto_pfm2']>.switch").is(".on")) {
            var val = $("#auto_pfm2").val();
            if (!val) return ReceiveMessage("<hir>你没有设置自动反击的绝招。</hir>");
            if (val.length > 300) return ReceiveMessage("<hir>你设置的出招过长。</hir>");
            Setting.save("auto_pfm2", val);
        }
        if ($(".dialog-custom>.setting-item[for='auto_work']>.switch").is(".on")) {
            var val = $("#auto_work").val();
            if (val && val.length > 400) return ReceiveMessage("<hir>你设置的过长。</hir>");
            Setting.save("auto_work", val || 1);
        }
        ReceiveMessage("<hic>设置已保存。</hic>");

    }, get_pfms: function (id) {
        if (!Combat.Skills) {
            return ReceiveMessage("<hir>你没有可用的绝招设置。</hir>");
        }
        var str = [];
        for (var i = 0; i < Combat.Skills.length; i++) {
            if (str.length > 0) str.push(",");
            str.push(Combat.Skills[i].id);

        }
        $("#" + id).val(str.join(""));
        ReceiveMessage("已预设置为你默认的绝招(未保存)，你可以修改为适合你的出招顺序后点击保存");


    }, switchClick: function (e) {
        var elem = $(this);
        var forProp = elem.parent().attr("for");
        //if (!forProp) return;
        var value = 0;
        if (elem.is(".on")) {
            elem.removeClass("on");
            elem.find(".switch-text").html("关");
        } else {
            elem.addClass("on");
            elem.find(".switch-text").html("开");
            value = 1;
        }
        switch (forProp) {
            case "auto_pfm":
            case "auto_pfm2":
                if (value) {
                    $("#" + forProp).show();
                    Dialog.setting.get_pfms(forProp);
                    Setting[forProp] = 0;
                } else {
                    $("#" + forProp).hide();
                    Setting.save(forProp, 0);
                }
                break;
            case "auto_work":
                if (value) {
                    $("#" + forProp).show();
                } else {
                    $("#" + forProp).hide();
                    Setting.save(forProp, 0);
                }
                break;
            default:
                Setting.save(forProp, value);
                break;
        }
        e.cancelable = true;
        return false;
    },
    rangeInput: function () {
        var elem = $(this);
        var forProp = elem.parent().attr("for");
        var value = parseInt(elem.val()) || 0;
        Setting[forProp] = value;
        Setting.set_prop(forProp, value);
        elem.siblings(".range-value").text(value);
        localStorage.setItem("ui_" + forProp, value);
    },
    COLORS: {
        "rgb(255, 255, 255)": "#fff",
        "rgb(189, 195, 199)": "#bdc3c7",
        "rgb(0, 128, 0)": "#008000"
    }
    , colorClick: function () {
        var elem = $(this);
        if (elem.is(".select")) return;
        var par = elem.parent();
        par.children().removeClass("select");
        elem.addClass("select");
        var forProp = par.closest(".setting-item").attr("for");
        if (!forProp) return;
        var value = "";
        switch (forProp) {
            case "combat_size":
            case "dialog_size":
            case "menu_size":
                value = elem.attr('value');
                break;
            case "fontsize":
                value = elem[0].style.fontSize;
                break;
            case "fontcolor":
                value = Dialog.setting.COLORS[elem[0].style.backgroundColor] ?? "";
                break;
            case "backcolor":
                value = elem[0].style.backgroundColor;
                break;
            case "font":
                value = elem[0].style.fontFamily;
                if (!value) value = "none";
                break;
        }
        Setting.save(forProp, value);
    }
};


const setting_template = `
 <div class="setting dialog-setting">

            <h3>房间信息</h3>
            <div class="setting-item" for="hide_roomdesc">
                <span class="title">
                    不显示房间描述
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="exits_dir">
                <span class="title">
                    出口描述使用方向描述
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="show_command">
                <span class="title">
                    在房间列出NPC或道具的可用命令
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>

            <div class="setting-item" for="show_roomitem">
                <span class="title">
                    在命令栏列出房间内的可用物品
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="item_firstme">
                <span class="title">
                    自己始终显示在房间物品第一列
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>

            <div class="setting-item" for="keep_msg">
                <span class="title">
                    切换房间时不清空上房间信息
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_move">
                <span class="title">
                    不显示玩家进出房间描述
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_plist">
                <span class="title">
                    隐藏玩家列表(只显示自己和NPC)
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="no_spmsg">
                <span class="title">
                    聊天信息不分开显示
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="auto_sortitem">
                <span class="title">
                    按品质自动排列背包和技能
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="no_message">
                <span class="title">
                    不显示其他玩家或NPC的房间消息(基本忽略所有战斗，动作描述，慎用)
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="show_sa">
                <span class="title">
                    动作栏显示快捷操作
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="float_dialog">
                <span class="title">
                    NPC对话选项显示为浮动窗口
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>

            <h3>战斗信息</h3>

            <div class="setting-item" for="auto_showcombat">
                <span class="title">
                    战斗时自动打开战斗面板
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="auto_hideroom">
                <span class="title">
                    战斗时自动隐藏房间信息
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="no_combatmsg">
                <span class="title">
                    不显示其他玩家的战斗信息
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="no_mcmsg">
                <span class="title">
                    不显示自己的普通战斗信息
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="action_wrap">
                <span class="title">
                    动作栏允许换行
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="combat_wrap">
                <span class="title">
                    技能栏允许换行
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>

            <div class="setting-item" for="show_hpnum">
                <span class="title">
                    显示血量为数字
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_hp">
                <span class="title">
                    关闭血条显示
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="show_damage">
                <span class="title">
                    显示伤害统计
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <h3>基本设置</h3>
            <div class="setting-item" for="show_send">
                <span class="title">
                    显示指令
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="fullscreen">
                <span class="title">
                    全屏显示
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="font">
                <span class="title">
                    字体(仅浏览器)
                </span>
                <span class="color-list">
                    <span class="color-item">默</span>
                    <span class="color-item" style="font-family:宋体;">宋</span>
                    <span class="color-item" style="font-family:楷体;">楷</span>
                    <span class="color-item" style="font-family:隶书;">隶</span>
                </span>
            </div>
            <div class="setting-item" for="fontsize">
                <span class="title">
                    字体大小
                </span>
                <span class="color-list">
                    <span class="color-item" style="font-size:0.75rem;">字</span>
                    <span class="color-item" style="font-size:0.875rem;">字</span>
                    <span class="color-item" style="font-size:1rem;">字</span>
                    <span class="color-item" style="font-size:1.25rem;">字</span>
                </span>
            </div>

            <div class="setting-item" for="fontcolor">
                <span class="title">
                    正常字体颜色
                </span>
                <span class="color-list">
                    <span class="color-item select" style="background-color:#008000"></span>
                    <span class="color-item" style="background-color:#ffffff"></span>
                    <span class="color-item" style="background-color:#bdc3c7"></span>
                </span>
            </div>
            <div class="setting-item" for="combat_size">
                <span class="title">
                    底部操作栏大小
                </span>
                <span class="color-list">
                    <span class="color-item" value="0.8em">0.8</span>
                    <span class="color-item" value="0.9em">0.9</span>
                    <span class="color-item" value="1em">x1</span>
                    <span class="color-item" value="1.2em">x1.2</span>
                </span>
            </div>
            <div class="setting-item" for="dialog_size">
                <span class="title">
                    顶部窗口大小
                </span>
                <span class="color-list">
                    <span class="color-item" value="0.8em">0.8</span>
                    <span class="color-item" value="0.9em">0.9</span>
                    <span class="color-item" value="1em">x1</span>
                    <span class="color-item" value="1.2em">x1.2</span>
                </span>
            </div>
            <div class="setting-item" for="menu_size">
                <span class="title">
                    菜单栏大小
                </span>
                <span class="color-list">
                    <span class="color-item" value="0.8em">0.8</span>
                    <span class="color-item" value="0.9em">0.9</span>
                    <span class="color-item" value="1em">x1</span>
                    <span class="color-item" value="1.2em">x1.2</span>
                </span>
            </div>
            <div class="setting-item" for="top_safe_distance">
                <span class="title">
                    顶部安全距离
                </span>
                <input type="range" class="setting-range" value="0" min="0" max="100" />
                <span class="range-value">0</span>
            </div>
            <div class="setting-item" for="bottom_safe_distance">
                <span class="title">
                    底部安全距离
                </span>
                <input type="range" class="setting-range" value="0" min="0" max="100" />
                <span class="range-value">0</span>
            </div>
            <h3>游戏设置</h3>
            <div class="setting-item" for="no_master">
                <span class="title">
                    不接受玩家拜师
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="no_team">
                <span class="title">
                    不接受玩家组队邀请
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="hide_equip">
                <span class="title">
                    隐藏自己的装备
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="show_cus">
                <span class="title">
                    允许其他玩家查看自己的自创武功
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_fight">
                <span class="title">
                    不接受比试
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>

            <div class="setting-item" for="ban_pk">
                <span class="title">
                    PK保护
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <h3>频道设置 </h3>
            <div class="setting-item" for="off_chat">
                <span class="title">
                    屏蔽公共频道
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_fam">
                <span class="title">
                    屏蔽门派频道
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_es">
                <span class="title">
                    屏蔽全区频道
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <div class="setting-item" for="off_pty">
                <span class="title">
                    屏蔽帮派频道
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
        </div>
`;
const custom_template = `  <div class="setting dialog-custom">

            <div class="setting-item" for="auto_pfm">
                <span class="title">
                    当你击杀玩家或NPC时，自动出招
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <textarea class="settingbox hide" spellcheck="false" id="auto_pfm"></textarea>
            <div class="setting-item" for="auto_pfm2">
                <span class="title">
                    当你被玩家击杀时，自动反击
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <textarea class="settingbox hide" spellcheck="false" id="auto_pfm2"></textarea>
            <div class="setting-item" for="auto_work">
                <span class="title">
                    当你学习，练习，打坐中断后，自动去挖矿或以下操作
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <textarea class="settingbox hide" spellcheck="false" id="auto_work"></textarea>

            <div class="setting-item" for="auto_get">
                <span class="title">
                    当你击杀NPC后自动拾取战利品
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>

            <!-- <div class="setting-item" for="extend">
                <span class="title">
                    自定义操作按钮
                </span>
                <span class="switch">
                    <span class="switch-button">
                    </span>
                    <span class="switch-text">
                        关
                    </span>
                </span>
            </div>
            <textarea class="settingbox hide" spellcheck="false" id="extend"></textarea> -->

            <button class="setting-ok">保存设置</button>
        </div>`;
const keys_template = ` <div class="setting dialog-skeys"></div>`;
const extend_template = ` <div class="setting dialog-extend"></div>`;


const setting_css = `
.setting {
    padding-bottom: 0.625em;
    height: 30em;
}

.setting-item {
    line-height: 2em;
    padding-left: 1em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
    display: flex;
    flex-direction: row;
}

.setting-item>.title {
    margin-right: 0.625em;
    flex: 1;
    text-align: left;
    white-space: initial;
}

.setting-item>.color-list {

    margin-right: 1em;
}
.color-list>.color-item {
    width: 3em;
    height: 1.25em;
    display: inline-block;
    border: 2px solid #cecece;
    line-height: 1.25em;
    text-align: center;
    border-radius: 1em;
    box-sizing: content-box;
}

.color-list>.select {
    border-color: #ff0000;
}
.setting-item>.button {
    flex: 0;
    background-color: #222;
    padding-left: 1em;
    padding-right: 1em;
    border-left: 1px solid gray;
}

.setting-item>.button:active {
    background-color: #111;
}


.setting>h3 {
    color: #C0C0C0;
    border-bottom: 1px solid #343434;
    padding-bottom: 0.5em;
}

.setting>.settingbox {
    margin-left: 0.625em;
    border: 1px solid gray;
    background-color: transparent;
    color: unset;
    resize: none;
    width: 98%;
    height: 3rem;
}

.setting .setting-range {
    flex: 1;
    max-width: 8em;
    margin: 0 0.5em;
    accent-color: #008000;
    cursor: pointer;
}

.setting .range-value {
    width: 2.5em;
    text-align: center;
    color: #cecece;
}

.setting>.setting-ok {
    border: 1px solid gray;
    background-color: transparent;
    color: unset;
    width: 5rem;
    height: 1.7rem;
    margin-top: 1rem;
    margin-bottom: 3rem;
}

.dialog-skeys {
    height: 30em;
    overflow-y: auto;
}


.dialog-skeys>.selected {
    border-left-color: #00FF00;
    color: #00FF00;
}



.extend-list {
    margin-top: 0.5em;
    height: 30em;
    text-align: center;
}

.extend-list>.buttons {
    text-align: center;
}

.extend-list>.buttons>button {
    margin: 0.5em;
    color: gray;
    background-color: #111;
    line-height: 2em;
}


.extend-add {
    display: flex;
    flex-direction: column;
    margin-top: 0.5em;
    height: 30em;
}


.extend-row {
    line-height: 2em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    border-top: 1px solid #222;
    border-bottom: 1px solid #222;
    border-right: 1px solid transparent;
}

.extend-row>.extend-input {
    flex: 1;
    border: none;
    outline: none;
    background-color: black;
    color: #cecece;
    padding-left: 1em;
}

.extend-row>input {
    height: 2em;
}

.extend-row>textarea {
    height: 100%;
    resize: none
}

.extend-row>.extend-menus {
    display: flex;
    flex-direction: column;
}

.extend-row>.extend-row-header {
    width: 8em;
    text-align: center;
}

.extend-help {
    padding-inline-start: 0.5em;
    width: 100%;
    text-align: center;
    color: gray;
    flex: 1;
    overflow: auto;
    list-style-position: inside;
    text-align: left;
    white-space: normal;
    line-height: 1.5em;
}

.extend-menus>.switch {
    margin-top: 1em;
    width: 7em;
    margin-left: 0.5em;
}

.extend-menus>button {
    margin: 1em 0px;
    color: gray;
    background-color: #111;
}

.skey-item {
    line-height: 2em;
    padding-left: 1em;
    border-radius: 4px;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: gray;
    white-space: nowrap;
    overflow-x: auto;
    margin-bottom: 0.5em;
    background-color: #111;
    cursor: pointer;
    display: flex;
    flex-direction: row;
}

.skey-item>.skey-name {
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: gray;
    overflow: hidden;
}

.skey-item>.skey-key {
    background-color: #222;
    width: 7em;
    text-align: center;
}

.switch {
    display: inline-block;
    position: relative;
    height: 2em;
    width: 5em;
    line-height: 2em;
    border-radius: 1em;
    background: #222;
    cursor: pointer;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    vertical-align: middle;
    text-align: center;
}

.switch>.switch-button {
    position: absolute;
    left: 0px;
    height: 2em;
    width: 2em;
    border-radius: 1em;
    background: gray;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    -webkit-transition: 0.3s;
    left: 0px;
}

.switch>.switch-text {
    color: #898989;
    margin-left: 0.625em;
}

.on {
    background-color: #008000;
}

.on>.switch-button {
    right: 0px;
    left: auto;
    background-color: #eee;
}

.on>.switch-text {
    margin-right: 0.625em;
    margin-left: 0px;
    color: #eee;
}
`;
