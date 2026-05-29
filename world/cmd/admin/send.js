import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";
import { WORLD } from "../../../os/world.js";
import { OBJ } from "../../../os/item/obj.js";

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
    var msg;
    var is_str = typeof arg == "string";
    if (is_str && arg[0] != "{") {
        msg = { content: arg, time: Date.now() };
    } else {
        msg = is_str ? JSON.toObject(arg) : arg;
        if (!msg.content || !msg.attach) return me && me.send("格式错误。");
        msg.time = Date.now();
        for (var i = 0; i < msg.attach.length; i++) {
            let attach = msg.attach[i];
            var obj = OBJ.CREATE(attach.obj, attach.count);
            if (obj) {
                attach.name = obj.unit_name(attach.count);
            }
        }
    }
    var users = [];
    if (user == "all") {
        users = WORLD.USERS;
    } else {
        var player = WORLD.getUser(user);
        if (!player) player = { id: user };
        users.push(player);
    }

    var obj = {};
    obj.type = "dialog";
    obj.dialog = "message";
    obj.message = {
        id: msg.from || "system",
        name: msg.from_name || "系统",
        content: msg.content,
        time: msg.time,
        attach: msg.attach
    };
    for (var i = 0; i < users.length; i++) {
        let user_msg = {
            time: msg.time,
            content: msg.content,
            attach: msg.attach
        };
        let mail_type = obj.message.id;
        WORLD.MESSAGE.pushUserMessage(users[i].id, {
            id: mail_type, name: obj.message.name
        }, user_msg);
        obj.message.index = user_msg.index;
        if (users[i].socket) users[i].send(JSON.stringify(obj));
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
