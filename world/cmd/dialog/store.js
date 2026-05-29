import { COMMAND } from "../../../os/command.js";

export default function() {
    const WORLD = globalThis.WORLD; const UTIL = globalThis.UTIL;
this.inherits(COMMAND);
this.command = "store";
this.regex = /^(?:(\d+)\s)?(\w+)$/;// /^(?:(\d+))?(?:\s+(\w+))?$/;
this.enter = function (me, count, arg) {
    if (arg && arg.length < 2) {
        count = arg;
        arg = null;
    }
    if (arg) {
        me.items = me.items || [];
        let target = me;
        if (!me.is_player) {
            if (!me.master) return;
            target = WORLD.getUser(me.master);
            if (!target) return;
        }
        target.stores = target.stores || [];
        if (arg === 'all') return this.store_all(target, me);
        let move_item = me.find_obj(arg), store_item = null;
        if (!move_item) return me.notify("你要存什么东西？");

        const st = { items: target.stores, push_item: me.push_item };
        if (target.stores.length >= target.max_store_count) {
            if (!move_item.combined)
                return me.notify("你的仓库放不下那么多东西了。");
            store_item = me.find_obj_bypath(move_item.path, st);
            if (!store_item) return me.notify("你的仓库放不下那么多东西了。");
            //  old_item.count += move_count;
        }
        let move_count = move_item.count;
        if (count !== undefined) {
            move_count = parseInt(count);
        }
        if (!(move_count <= move_item.count)) return me.notify("你要存什么东西？");

        move_item = me.remove_item_byid(arg, move_count);
        if (move_item.combined && store_item) {
            store_item.count += move_count;
            move_item = store_item;
        } else {
            move_item = st.push_item(move_item);
        }


        // move_item = null, move_count = 0;
        // if (count !== undefined) {
        //     move_count = parseInt(count);
        //     if (!(move_count >= 0)) return;
        //     move_item = me.remove_item_byid(arg, move_count);
        //     if (!move_item) return me.notify("你要存什么东西？");
        // } else {
        //     move_item = me.remove_item_byid(arg);
        //     if (!move_item) return me.notify("你要存什么东西？");
        //     move_count = move_item.count;
        // }

        // move_item = st.push_item(move_item);
        me.send("你把" + UTIL.to_c(move_count) + move_item.unit + move_item.color_name + "存入仓库。");

        return me.notify('{type:"dialog",dialog:"list",id:"' +
            arg + '",storeid:"' + move_item.id + '",store:' +
            move_count + ',sum:' + target.stores.length + '}');
    }
    if (!me.is_player) return;
    var items = me.stores || [];
    var str = ['{"type":"dialog","dialog":"list","stores":['];
    if (me.max_store_count > 200) {
        var otype = parseInt(count ?? 0);
        if (!(otype >= 0)) otype = 0;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.otype !== otype) continue;
            if (str.length > 1) str.push(",");
            str.push(item.format_to_pack());
        }
        str.push(']');
        str.push(",max_store_count:");
        str.push(me.max_store_count);
        str.push(",sum:");
        str.push(items.length);
    } else {
        for (var i = 0; i < items.length; i++) {
            if (i > 0) str.push(",");
            str.push(items[i].format_to_pack());
        }
        str.push(']');
        str.push(",max_store_count:");
        str.push(me.max_store_count);
    }
    str.push("}");

    me.send(str.join(""));
}

this.store_all = function (target, me) {//target仓库所有人=玩家 me玩家或者随从
    // if (me !== notifier) return;
    if (me.query_temp('store_all'))
        return me.send('背包的道具已经自动合并到仓库中。');
    const idToIndex = new Map();
    for (let i = 0; i < target.stores.length; i++) {
        let item = target.stores[i];
        if (!item.combined) continue;
        idToIndex.set(item.path, i);
    }

    for (let i = 0; i < me.items.length; i++) {
        let move_item = me.items[i];
        if (!move_item.combined) continue;
        const indexIn = idToIndex.get(move_item.path);
        if (indexIn >= 0) {
            let store_item = target.stores[indexIn];
            store_item.count += move_item.count;
            me.send("你把" + UTIL.to_c(move_item.count) + move_item.unit + move_item.color_name + "存入仓库。");
            target.notify('{type:"dialog",dialog:"list",id:"' + move_item.id + '",storeid:"' + store_item.id + '",store:' + move_item.count + '}');
            me.items.splice(i, 1);
            i--;
        }
    }
    me.send('你将背包中的道具自动合并到仓库中已有的道具。');
    me.set_temp('store_all', 1, 6000);
}
}
