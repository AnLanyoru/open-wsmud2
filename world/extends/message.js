import { WORLD } from "../../os/world.js";



const MESSAGE = WORLD.MESSAGE;
MESSAGE.pushUserMessage = function (toid, from, msg) {
    let user = this.stores.get(toid);
    if (!user) {
        user = new Map();
        this.stores.set(toid, user);
    }
    let store = user.get(from.id);
    if (!store) {
        store = { name: from.name, items: [] };
        user.set(from.id, store);
    }
    msg.index = store.items.length;
    store.items.push(msg);

}
MESSAGE.getUserMessages = function (me) {
    let store = this.stores.get(me.id);
    let newMessages = [];
    if (this.NOTICES.length) {
        let nt = this.NOTICES[this.NOTICES.length - 1];
        newMessages.push({
            id: "notice",
            content: nt.content.length > 50 ? nt.content.substring(0, 50) : nt.content,
            time: nt.time,
            name: "公告"
        });
    }
    if (store) {
        let diff_time = 24 * 3600000 * 30;
        let now = Date.now();
        store.forEach((x, y) => {
            let last = x.items[x.items.length - 1];
            if (last) {
                if (now - last.time < diff_time)
                    newMessages.push({
                        id: y,
                        name: x.name,
                        content: last.content,
                        time: last.time
                    });
            }
        });
    }
    return newMessages;
}
MESSAGE.getMessageFromID = function (me, from, count) {
    let items = [];
    if (from !== "notice") {
        let store = this.stores.get(me.id);
        if (!store) return;
        let list = store.get(from);
        if (!list) return items;
        items = list.items;
    } else {
        items = this.NOTICES;
    }
    count = count || 0;
    let ary = [];
    let diff_time = 24 * 3600000 * 30;
    let now = Date.now();
    for (let i = 0; i < 13; i++) {
        let index = items.length - count - i - 1;
        if (index < 0) break;
        if (now - items[index].time < diff_time)
            ary.push(items[index]);
    }
    return ary;
}
MESSAGE.getMessageByIndex = function (me, from, index) {
    let store = this.stores.get(me.id);
    if (!store) return;
    let list = store.get(from);
    return list && list.items[index];
}
MESSAGE.save = function () {

    let str = ["["];
    let now = Date.now();
    let diff_time = 24 * 3600000 * 30;
    this.stores.forEach((x, uid) => {
        if (str.length > 1) str.push(",");
        str.push("{id:\"");
        str.push(uid);
        str.push("\",items:[");
        let isReceive = false;
        x.forEach((st, from) => {
            if (isReceive) str.push(",");
            str.push("{uid:\"");
            str.push(from);
            str.push("\",name:\"");
            str.push(st.name);
            str.push("\",items:[");
            let ishasmsg = false;
            for (let i = 0; i < st.items.length; i++) {
                let item = st.items[i];
                if (now - item.time < diff_time) {
                    if (ishasmsg) str.push(",");
                    str.push("{time:");
                    str.push(item.time);
                    str.push(",content:");
                    str.push(JSON.stringify(item.content));
                    if (item.attach) {
                        str.push(",attach:[");
                        for (let j = 0; j < item.attach.length; j++) {
                            str.push("{name:\"");
                            str.push(item.attach[j].name);
                            str.push("\",obj:\"");
                            str.push(item.attach[j].obj);
                            str.push("\",count:");
                            str.push(item.attach[j].count || 1);
                            str.push("}");
                            if (j !== item.attach.length - 1) {
                                str.push(",");
                            }
                        }
                        str.push("]");
                        if (item.rec) {
                            str.push(",rec:true");
                        }
                    }
                    str.push("}");
                    ishasmsg = true;
                }
            }
            str.push("]}");
            isReceive = true;
        });
        str.push("]}");
    });
    str.push("]");
    return str.join("");
}
MESSAGE.saveNotice = function () {
    if (this.NOTICES.length > 500) this.NOTICES.splice(0, this.NOTICES.length - 500);
    return JSON.stringify(this.NOTICES);
}
MESSAGE.load = function (data) {
    this.NOTICES = data.notices ?? [];
    let sts = data.messages ?? [];
    if (!sts) return;
    for (let i = 0; i < sts.length; i++) {
        let st = sts[i];
        let user = new Map();
        for (let j = 0; j < st.items.length; j++) {
            let ust = st.items[j];
            let obj = {
                name: ust.name,
                items: []
            };
            for (let k = 0; k < ust.items.length; k++) {
                let msg = ust.items[k];
                obj.items.push({
                    content: msg.content,
                    time: msg.time,
                    rec: msg.rec,
                    attach: msg.attach,
                    index: obj.items.length
                });
            }
            user.set(ust.uid, obj);
        }
        this.stores.set(st.id, user);
    }
    console.log("消息数据已加载");
}
export default function() {}
