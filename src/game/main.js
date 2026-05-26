
import { Page } from '../base/page.js';
import Combat from '../combat.js';
import MAP from '../map.js';
import * as ToolAction from './tool.js';
import Dialog from '../dialog/base.js';
import { Confirm } from '../confirm.js';
import { Warn } from '../confirm.js';
import Process from '../process.js';
import Setting from '../setting.js';
import SCRIPT from '../script.js';

let isShowChat = false;

class GameMainPage extends Page {
    constructor() {
        super();
        this.template = `
    <div class="container" style="display:none;">
        <div class="dialog hide">
            <div class="dialog-header">
                <span class="dialog-icon glyphicon glyphicon-map-marker"></span>
                <span class="dialog-title"></span>
                <span class="dialog-close glyphicon glyphicon-remove-circle"></span>
            </div>
            <div class="dialog-content"></div>
            <div class="dialog-footer "></div>
        </div>
        <div class="content-room">
            <div class="map-panel"></div>
            <div class="room-title">
                <span class="room-name"></span><span class='glyphicon glyphicon-map-marker map-icon'></span>
            </div>
            <div style="text-indent: 2em;" class="room_desc"></div>
            <div style="text-indent: 2em;" class="room_exits"></div>
            <div class="room_items" style="max-height: 8rem; overflow-y: auto;"></div>
        </div>
        <div class='channel'></div>
        <div class="content-message"></div>
        <div class="tool-bar bottom-bar">
            <span class="state-bar" command="stateinfo" style="visibility:hidden"><span class="title"></span></span>
            <span command="stopstate" class="tool-item state-tool" style="display:none;"><span
                    class="glyphicon glyphicon-off tool-icon"></span><span class="tool-text">停止</span></span>
            <span command="showchat" class="tool-item"><span
                    class="glyphicon glyphicon-volume-down tool-icon"></span><span class="tool-text">聊天</span></span>
            <span command="events" class="tool-item"><span class="glyphicon glyphicon-dashboard tool-icon"></span><span
                    class="tool-text">活动</span><span class="tag hide"></span></span>
            <span command="showcombat" class="tool-item"><span class="glyphicon glyphicon-flash tool-icon"></span><span
                    class="tool-text">动作</span></span>
            <span command="showtool" class="tool-item br-tool hide-tool"></span>
            <div class="tool-bar right-bar">
                <span command="setting" class="tool-item" style="display:none"><span
                        class="glyphicon glyphicon-cog tool-icon"></span><span class="tool-text">设置</span></span>
                <span class="tool-item" command="jh" style="display:none"><span
                        class="glyphicon glyphicon-home tool-icon"></span><span class="tool-text">江湖</span></span>
                <span command="stats" class="tool-item" style="display:none"><span
                        class="glyphicon glyphicon-stats tool-icon"></span><span class="tool-text">排行</span></span>
                <span command="message" class="tool-item" style="display:none"><span
                        class="glyphicon glyphicon-envelope tool-icon"></span><span class="tool-text">社交</span><span
                        class="tag hide"></span></span>
                <span command="shop" class="tool-item" style="display:none"><span
                        class="glyphicon glyphicon-shopping-cart tool-icon"></span><span
                        class="tool-text">商城</span></span>
                <span command="tasks" class="tool-item" style="display:none"><span
                        class="glyphicon glyphicon-exclamation-sign tool-icon"></span><span
                        class="tool-text">任务</span><span class="tag hide"></span></span>
                <span command="skills" class="tool-item" style="display:none"><span
                        class="glyphicon glyphicon-book tool-icon"></span><span class="tool-text">技能</span></span>
                <span command="pack" class="tool-item" style="display:none"><span
                        class="glyphicon glyphicon-briefcase tool-icon"></span><span class="tool-text">背包</span></span>
                <span class="tool-item" command="score" style="display:none"><span
                        class="glyphicon glyphicon-user tool-icon"></span><span class="tool-text">属性</span></span>
            </div>
        </div>
        <div class="custom-panel"></div>
        <div class="content-bottom">
            <div class="combat-panel hide">
                <div class="room-commands"></div>
                <div class="combat-commands"></div>
            </div>
        </div>
        <div class="chat-panel hide">
            <div class="channel-box" channel="chat">
                <span class="selected" channel="chat">世界</span>
                <span channel="tm">组队</span>
                <span channel="fam">门派</span>
                <span channel="say">房间</span>
                <span channel="es">全区</span>
                <span channel="pty">帮派</span>
                <span channel="emote">表情</span>
            </div>
            <div class="chat-input">
                <input class="sender-box" />
                <span class="glyphicon glyphicon-send sender-btn"></span>
            </div>
            <div class="channel-emotes hide"></div>
        </div>
    </div>
`;

    }

    on_mount() {
        $(".container").on("click", ContainerCommand);
        $(".channel-box").on("click", "span", ChannelChanged);

        $(".combat-commands").on("click", ".pfm-item", Combat.Perform).on('wheel', Combat.Scroll);
        $(".room-commands").on('wheel', Combat.Scroll);
        $(".sender-box").on("keyup", OnSendBoxKeyDown);

        $(".room_items").on("click", ".room-item", Process.selectItem);
        $(".bottom-bar").on("click", '.tool-item,.state-bar,.item-command', MenuClick);
        $(".map-panel").on("click", open_map);
        $(".sender-btn").on("click", SendChatMessage);

        $(".room_exits").on("pointerdown",
            Process.before_click_exits).on("pointerup", Process.click_exits);
        $(".room-title>.map-icon").on("click", MAP.LoadMap.bind(MAP));
    }
}

let last_click = 0;
function open_map() {
    last_click = last_click || 0;
    if (Date.now() - last_click > 500) {
        last_click = Date.now();
        return;
    }
    Dialog.show("map");
}
function MenuClick(item) {
    var cmd = $(this).attr("command");
    if (!cmd) {
        cmd = $(this).attr("cmd");
        if (cmd) SendCommand(cmd);
        return false;
    }
    return HandlerMenuCommand(cmd);
}
function HandlerMenuCommand(cmd) {
    switch (cmd) {
        case "showtool":
            ToolAction.ShowTools();
            break;
        case "showchat":
            return ShowChat();
        case "showcombat":

            return Combat.Show();
        case "stopstate":
            if (Dialog.extend.is_record)
                return Dialog.extend.stop_record();
            SendCommand("state stop");
            break;
        case "stateinfo":
            SendCommand("state info");
            break;
        default:
            Dialog.show(cmd);
            break;
    }
    return false;
}
function ShowChat() {
    var elem = $(".chat-panel").toggleClass("hide");
    if (!elem.is(".hide")) {
        isShowChat = true;
        elem.find("input").val("").focus();
    } else {
        isShowChat = false;
    }
    return false;
}
function OnSendBoxKeyDown(e) {
    if (e.keyCode == 13) {
        SendChatMessage();
    }
}
function SendChatMessage() {
    var value = $(".sender-box").val();
    if (!value) return;
    if (value.length > 100) return ReceiveMessage("<hir>你输入的内容太多了。</hir>");
    var channel = $(".channel-box").attr("channel");
    $(".sender-box").val("").focus();
    SendCommand(channel + " " + value + "");

}

function ChannelChanged() {
    var elem = $(this);
    var ch = elem.attr("channel");
    if (ch == "emote") {
        return ShowEmotePanel();
    }

    if (elem.is(".selected")) return;
    var parent = elem.parent();
    parent.children().removeClass("selected");
    elem.addClass("selected");
    parent.attr("channel", ch);
    $(".sender-box").focus();
    return false;
}
function ShowEmotePanel() {
    var panel = $(".channel-emotes");
    if (panel.is(".hide")) {
        panel.removeClass("hide");
        if (!Process.emtoes) {
            SendCommand("emote");
            Process.emtoes = [];
            $(".sender-box").blur();
            panel.on("click", "span", function () {
                var text = $(this).html();
                $(".sender-box").val("*" + text).focus();
                $(".channel-emotes").addClass("hide");
            });
        }
    } else {
        $(".channel-emotes").addClass("hide");
    }
}
function ContainerCommand(e) {
    var elem = $(e.target);
    var cmd = elem.attr("cmd");
    if (!cmd) cmd = elem.parent().attr("cmd");
    if (cmd) {
        let char = cmd[0];
        if (char == "_") {
            var str = cmd.split(" ");
            switch (str[0]) {
                case "_confirm":
                    Confirm.Process(str);
                    break;
                case "_setting":
                    Setting.save(str[1], str[2]);
                    break;
                case "_trade":
                    Dialog.trade.confirm(str[1]);
                    break;
                case "_close":
                    Warn.Close(elem);
                    break;
                case "_hide":
                    break;
                case "_closed":
                    Dialog.hide();
                case "_party":
                    Dialog.party.command(str[1]);
                    break;

            }
        } else if (char === '#') {
            SCRIPT.run(cmd);
        }
        else {
            SendCommand(cmd);
            if (!elem.closest('.dialog-fb').length &&
                elem.closest(".dialog-content").length > 0) {
                elem.closest(".item-commands").remove();
            }
        }
        return false;
    } else {
        if (isShowChat) {
            if (!elem.closest(".chat-panel").length) {
                $(".chat-panel").addClass("hide");
                isShowChat = false;
            }
        }
    }
    Confirm.Close();
}

export default GameMainPage;
window.HandlerMenuCommand = HandlerMenuCommand;
