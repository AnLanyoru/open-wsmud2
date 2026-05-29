import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";
import { WORLD } from "../../../os/world.js";

export default class extends COMMAND {
    command = "message";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;
    regex = /^(\w+)\s(\w+)$/;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, arg, arg2) {
    if (arg === 'delete') {
        if (!arg2) return this.delete_all(me);
        return this.delete_from(me, arg2);
    }
    var obj = {};
    obj.type = "dialog";
    obj.dialog = "message";
    if (arg) {
        obj.items = MESSAGE.getMessageFromID(me, arg);
        obj.id = arg;
    } else {
        obj.messages = MESSAGE.getUserMessages(me);
    }

    // obj.messages = [];
    // let notices = MESSAGE.getNotice();
    // for (let nt of notices) {
    //     obj.messages.push({
    //         id: "notice",
    //         content: nt.content,
    //         time: nt.time,
    //         name: "公告"
    //     });
    // }
    // let stores = MESSAGE.getUserMessages(me);

    // let diff_time = 24 * 3600000 * 30;
    // let now = Date.now();
    // if (stores) {

    // }
    me.send(JSON.stringify(obj));
}
    delete_from(me, from) {
    let stores = MESSAGE.stores.get(me.id);
    if (!stores) return me.send('你没有消息。');
    let store = stores.get(from);
    if (!store) return me.send('你没有这个类型的消息。');
    if (!this.check_store(store)) {
        return me.send('你有未领取的消息，无法删除。');
    }
    stores.delete(from);
    me.send('{type:"dialog",dialog:"message",clear:"' + from + '"}');
}
    delete_all(me) {
    let stores = MESSAGE.stores.get(me.id);
    if (!stores) return;
    stores.forEach((x, y) => {
        if (!this.check_store(x)) {
            return me.send('你有未领取的消息，无法删除。');
        }
    });
    MESSAGE.stores.delete(me.id);
    me.send('{type:"dialog",dialog:"message",clear:true}');
}
    check_store(store) {
    let items = store.items;
    for (let item of items) {
        if (item.attach && !item.rec)
            return false;
    }
    return true;
}
}

const MESSAGE = WORLD.MESSAGE;
