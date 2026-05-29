import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "eq";

    enter(me, oid) {
    var obj = me.find_obj(oid);
    if (!obj) {
        return me.notify("你要装备什么？");
    }
    if (!obj.is_equipment) {
        return me.notify("这个东西不能装备。");
    }
    if (me.fight_type) {
        if (me.query_temp('eq_wea') !== oid)
            return me.notify("战斗中不能更换装备。");
    }
    if (me.release_time) {
        var diff_time = me.release_time - Date.now();
        if (diff_time > 0) {
            return me.notify("你的技能还没释放完成，无法切换装备。");
        }
    }
    if (me.equip(obj) != false && obj.on_use) {
        obj.notify_action(me, true);
        if (me.fight_type) {
            me.remove_temp('eq_wea');
        }
    }

}
}
