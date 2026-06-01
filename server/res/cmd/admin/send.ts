import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { WORLD } from "../../../core/world.js";
import { OBJ } from "../../../core/item/obj.js";

export default class extends COMMAND {
    command = "send";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_level = 6;
    regex = /^(\w+)\s(.+)$/;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, user, arg) {
    if (me && me.user_level < 5) return false;
    if (!arg) return me && me.send("没有消息内容。");
    var msg: any;
    var is_str = typeof arg == "string";
    if (is_str && arg[0] != "{") {
        msg = { content: arg, time: Date.now() };
    } else {
        if (is_str) {
            // 保护Windows路径分隔符: 将非JSON转义的\替换为\\，防止JSON5吞掉反斜杠
            arg = arg.replace(/\\(?!["\\/bfnrtu])/g, "\\\\");
        }
        msg = is_str ? JSON.toObject(arg) : arg;
        if (!msg.content || !msg.attach) return me && me.send("格式错误。");
        msg.time = Date.now();
        for (var i = 0; i < msg.attach.length; i++) {
            let attach = msg.attach[i];
            var objItem = OBJ.CREATE(attach.obj, attach.count);
            if (objItem) {
                attach.name = objItem.unit_name(attach.count);
            }
        }
    }
    var users: CHARACTER[] = [];
    if (user == "all") {
        users = WORLD.USERS;
    } else {
        var player = WORLD.getUser(user);
        if (!player) {
            var dummyUser = new CHARACTER();
            dummyUser.id = user;
            users.push(dummyUser);
        } else {
            users.push(player);
        }
    }

    var msgObj: {
        type: string;
        dialog: string;
        message: {
            id?: string;
            name?: string;
            content: string;
            time: number;
            attach: any[];
            index?: number;
        };
    } = {
        type: "dialog",
        dialog: "message",
        message: {
            id: msg.from || "system",
            name: msg.from_name || "系统",
            content: msg.content,
            time: msg.time,
            attach: msg.attach
        }
    };
    for (var i = 0; i < users.length; i++) {
        let user_msg: {
            time: number;
            content: string;
            attach: any[];
            index?: number;
        } = {
            time: msg.time,
            content: msg.content,
            attach: msg.attach
        };
        let mail_type = msgObj.message.id || "";
        WORLD.MESSAGE.pushUserMessage(users[i].id, {
            id: mail_type, name: msgObj.message.name || ""
        }, user_msg);
        msgObj.message.index = user_msg.index;
        if (users[i].socket) {
            users[i].send(JSON.stringify(msgObj));
        }
        if (RECORD[mail_type]) {
            WORLD.log(users[i], mail_type, msg.content);
        }
    }
    me && me.notify("发送完成，共发送" + users.length);

}
}

const RECORD = {
    top: true,
    score: true,
    weapon: true
};
