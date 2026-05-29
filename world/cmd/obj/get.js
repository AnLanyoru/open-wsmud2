import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";
import { WORLD } from "../../../os/world.js";
import { UTIL } from "../../../os/util/util.js";

export default class extends COMMAND {
    command = "get";
    regex = /^(?:(\d+)\s)?(\w+)(?:\s+from\s(\w+))?$/;

    /**
     * @param {CHARACTER} player - 执行命令的角色
     */
    enter(player, count, objid, from) {
    if (!objid) return player.notify("你要捡什么东西？");
    var parent = player.environment;
    if (from) {
        parent = player.find_obj(from, player.environment);
        if (!parent) {
            return player.notify("你要从哪拿走什么东西？");
        }
        if (parent == player) {
            return player.notify("东西就在你身上");
        }
        if (parent.is_character) {
            return player.notify("你不能搜身。");
        }
        if (!parent.is_container) {
            return player.notify("你不能从" + parent.name + "里拿走任何东西。");
        }
    }
    if (objid !== "all" || !from) {
        var obj = parent.find_obj(objid);
        if (!obj) {
            return player.notify("你要捡起什么东西？");
        }
        var get_count = obj.count;

        if (obj.count < get_count) {
            return player.notify("这里没有那么多的" + obj.name + "。");
        }
        if (obj.is_living && obj.is_living()) {
            return player.notify(obj.name + "不用你背。");
        }
        if (obj.no_get) {
            return player.notify("这个东西你捡不起来。");
        }
        if (obj.on_get && obj.on_get(player) === false) return;
        parent = parent || player.environment;
        if (player.is_full()) {
            return player.notify("你身上东西太多了。");
        }
        obj = parent.remove_item(obj, get_count);
        if (!obj) return player.notify("你什么都没捡起来。");
        obj.count = get_count;
        player.add_obj(obj);
        if (from) {
            player.send_room("$N从" + parent.name + "里拿出来" + UTIL.to_c(get_count) + obj.unit + obj.color_name + "。");
        } else {
            player.send_room("$N捡起" + UTIL.to_c(get_count) + obj.unit + obj.color_name + "。");
            player.environment.item_changed(obj, false);
        }


    } else if (objid === "all" && from) {
        var items = parent.query_items(player);
        if (!items || !items.length) { return player.notify("那里面没有东西。") }
        if (player.is_full()) {
            return player.notify("你身上东西太多了。");
        }
        var no_get = [];
        for (var i = 0; i < items.length; i++) {
            if (!getObj(player, items[i], parent)) {
                no_get.push(items[i]);
            }
        }
        parent.clear_items(player, no_get);
        parent.refresh();
    }
}
}

function getObj(me, item, parent) {

    if (!(item.count > 0)) return true;
    if (item.on_get && item.on_get(me) === false) return false;


    if (!me.team || me.team.free_get || !item.grade || parent.no_alloc) {
        if (parent.on_getitem && parent.on_getitem(me, item) === false) return false;
        me.add_obj(item);
    } else {
        var list = [];
        for (var i = 0; i < me.team.length; i++) {
            var tm = me.team[i];
            if (tm.environment && tm.environment.parent === me.environment.parent) {

                if (parent.on_getitem && parent.on_getitem(tm, item) === false) {
                    if (tm === me) return false;
                    continue;
                }
                list.push(tm);
            }
        }
        if (list.length > 1) {
            me.team.objs = me.team.objs || [];
            me.team.objs.push(item);

            item.dice = { user: null, users: [], num: 0 };

            var str = ["{type:\"warn\",content:\"", item.color_name, '",time:60000,cmds:[',
                "{cmd:\"dice 0 ", item.id, '",name:"有需求想要"},{cmd:"dice 1 ', item.id,
                '",name:"无需求想要"},{cmd:"dice 2 ', item.id, '", name: "不想要" }]}'].join("");


            for (let i = 0; i < list.length; i++) {

                if (!list[i].is_player) {
                    var dtype = list[i].query_setting("auto_dice");
                    WORLD.COMMANDS["dice"].enter(list[i], dtype ? (dtype - 1) : 2, item.id);
                } else {
                    list[i].send(str);
                    item.dice.users.push(list[i].id);
                }
            }
            let tm = me.team;
            me.call_out(() => tm.alloc(item), 60000);
        } else if (list.length === 1) {
            me.add_obj(item);
        } else {
            return false;
        }

    }

    if (item.is_equipment && item.grade >= 5) {
        COMMAND.DO("rumor", "听说有人捡到了一" + item.unit + item.name + "。");
    }
    if (parent)
        me.send_room("$N从" + parent.name + "里拿出来" + UTIL.to_c(item.count) + item.unit + item.color_name + "。");
    else
        me.send_room("$N捡起" + UTIL.to_c(item.count) + item.unit + item.color_name + "。");
    return true;
}
