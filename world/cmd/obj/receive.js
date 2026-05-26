this.inherits(COMMAND);
this.command = "receive";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.allow_faint = true;
this.regex = /^(\w+)\s(\d+)$/;
const MESSAGE = WORLD.MESSAGE;
this.enter = function (me, from, index) {
    //if (from === 'all') return this.receive_all(me);

    if (index !== undefined)
        this.receive_single(me, from, index);
    else if (from)
        this.receive_from(me, from);
    else
        this.receive_all(me);
}
this.receive_single = function (me, from, index) {
    let msg = MESSAGE.getMessageByIndex(me, from, index);
    if (!msg) return me.send("没有这个消息。");
    if (msg.rec) return me.send("你已经领取了。");

    if (!msg.attach) return me.send("这个消息没有附件。");
    // if (me.is_full()) return me.send("你身上东西太多了。");
    this.receive_item(me, msg, from, index);
}
this.receive_item = function (me, msg, from, index) {
    msg.rec = true;
    for (var i = 0; i < msg.attach.length; i++) {
        var count = msg.attach[i].count || 1;
        var obj = OBJ.CREATE(msg.attach[i].obj, count);
        if (!obj) continue;
        if (obj.on_receive) {
            obj.on_receive(me);
        } else {
            obj = me.add_obj(obj);
            me.notify("你领取了" + obj.unit_name(count) + "。");
            if (obj.grade > 5) {
                COMMAND.DO("rumor", "听说有人得到了一" + obj.unit + obj.name + "。");
            }
        }
    }
    me.send('{dialog:"message",type:"dialog",receive:"' + from + '",index:' + index + '}');
}

this.receive_from = function (me, from) {
    let stores = MESSAGE.stores.get(me.id);
    if (!stores) return;
    if (me.is_full()) return me.send("你身上东西太多了。");
    let store = stores.get(from);
    if (!store) return me.send("没有这个消息类型。");
    let list = store.items;
    let count = 0;
    for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (!item.attach || item.rec) continue;
        this.receive_item(me, item, from, i);
        count++;
    }
    if (count > 0)
        return me.send('领取完毕，共收取' + count + '条消息的附件。');
    return me.send('没有可领取的消息。');
}
this.receive_all = function (me) {
    let store = MESSAGE.stores.get(me.id);
    if (!store) return;
    if (me.is_full()) return me.send("你身上东西太多了。");
    let count = 0;
    store.forEach((x, y) => {
        let list = x.items;
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            if (!item.attach || item.rec) continue;
            this.receive_item(me, item, y, i);
            count++;
        }
    });
    if (count > 0)
        return me.send('领取完毕，共收取' + count + '条消息的附件。');
    return me.send('没有可领取的消息。');
}