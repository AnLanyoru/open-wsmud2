import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";
import { WORLD } from "../../../os/world.js";

export default class extends COMMAND {
    command = "pack";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, arg) {
    var target = me;
    if (arg) {
        if (arg == "none") return me.notify('{"type":"dialog","dialog":"pack","money":' + me.money + "}");

        target = me.find_obj(arg, me.environment);
        if (!target && me.user_level > 1) {
            target = WORLD.getUser(arg);
        }
        if (!target) {
            return me.notify("这里没有这个人。");
        }
        if (me.user_level < 4 && target.master != me.id)
            return me.notify("你只能查看自己的背包。");
    }
    var str = ['{"type":"dialog","dialog":"'];

    if (target != me || !me.is_player) {
        str.push('pack2",id:"');
        str.push(target.id);
        str.push('",name:"');
        str.push(target.name);
        str.push('",');
    } else {
        str.push('pack",');
    }
    str.push('"items":[');
    var items = target.items;
    if (items) {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (i > 0) str.push(",");
            str.push(item.format_to_pack());
            // str.push('{name:"');
            // str.push(item.color_name);
            // str.push('",id:"');
            // str.push(item.id);
            // str.push('",count:');
            // str.push(item.count);
            // str.push(',unit:"');
            // str.push(item.unit);
            // str.push('"');
            // str.push(',value:');
            // str.push(parseInt(item.value / 10));
            // if (item.is_equipment) {
            //     str.push(',can_eq:1');
            // }
            // if (item.on_use) {
            //     str.push(',can_use:1');
            // }
            // if (item.on_study) {
            //     str.push(',can_study:1');
            // }
            // if (item.on_open) {
            //     str.push(',can_open:1');
            // }
            // if (item.combine_count) {
            //     str.push(',can_combine:' + item.combine_count);
            // }
            // str.push('}');
        }
    }
    str.push('],"money":');
    str.push(target.money || 0);
    items = target.equipment;
    if (items) {
        str.push(',eqs:[');
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (i > 0) str.push(",");
            if (item) {
                str.push(`[${JSON.stringify(item.color_name ?? "")},${JSON.stringify(item.id ?? "")},${item.grade},${item.on_use ? 1 : 0},${item.is_locked ? 1 : 0}]`);
                // str.push('{name:"');
                // str.push(item.color_name);
                // str.push('",id:"');
                // str.push(item.id);
                // str.push('"');
                // if (item.on_use) {
                //     str.push(',can_use:1');
                // }
                // str.push('}');
            } else {
                str.push("null");
            }

        }
        str.push(']');
    }
    str.push(",max_item_count:");
    str.push(target.max_item_count);
    if (target === me && target.eq_group !== undefined) {
        str.push(",eq_group:");
        str.push(target.eq_group);
    }
    str.push('}');
    me.send(str.join(""));
}
}

