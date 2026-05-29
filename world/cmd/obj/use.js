import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "use";
    allow_busy = true;
    allow_die = true;
    allow_faint = true;
    regex = /^(\w+)(?:\s(\w+))?$/;

    enter(player, objid, par) {
    var obj = player.find_obj(objid);

    var iseq = false;
    if (!obj) {
        for (var i = 0; i < player.equipment.length; i++) {
            if (player.equipment[i] && player.equipment[i].id == objid) {
                obj = player.equipment[i];
            }
        }
        if (!obj)
            return player.notify("你身上没有这个东西。");
        iseq = true;

    } else {
        if (obj.is_equipment && !obj.is_shortcut) return player.notify(obj.color_name + "需要装备才可以使用。");
    }
    if (player.hp <= 0 && !obj.allow_die) return player.notify("你现在是灵魂状态，不能那么做。");
    if (obj.is_shortcut) {
        if (obj.is_equipment && !iseq) {
            if (obj.eq_type != EQUIP_TYPE.WEAPON) return player.notify("你目前只能设置武器的快捷操作。");
            player.do_command("eq", objid);
            return;
        }
    }
    if (player.is_in("yz/leitai/leitai"))
        return player.notify("擂台自动出招。");
    if (!obj.on_use) return player.notify("这个东西不能用。");

    if (player.is_fighting() && !obj.allow_fight) return player.notify("你正在战斗，待会再说。");

    if (!obj.count) return;
    if (player.is_busy && !obj.allow_busy) return player.notify("你现在手忙脚乱，无法使用" + obj.name + "。");
    if (player.is_faint && !obj.allow_faint) return player.notify("你现在昏迷中，无法使用" + obj.name + "。");

    var use_msg = obj.action_msg || "用";
    var key = "disobj_" + (obj.distype || objid);
    if (obj.distime && player.query_temp(key)) {
        return player.notify("你刚" + use_msg + "过" + obj.color_name + "，还是等会再" + use_msg + "吧。");
    }
    if (obj.grade < 3) {
        if (obj.path === 'cash/jing#0' || obj.path === 'cash/jing#1') {
            return player.send(obj.color_name + '无法使用。');
        }
    } else if (obj.grade === 5) {
        if (!player.is_player && obj.path === 'cash/biguan') {
            return player.send('你无法使用' + obj.color_name + '。');
        }
    }

    if (obj.on_use(player, par) === false) return;

    if (!obj.no_consume)
        player.remove_obj(obj, 1);

    if (obj.showAction || obj.is_shortcut)
        player.notify('{type:"disobj",id:"' + obj.id + '",time:' + (obj.distime || 0) + ',count:' + (obj.count) + '}');
    if (obj.distime) {
        player.set_temp(key, 1, obj.distime);
    }

}
}

const EQUIP_TYPE = globalThis.EQUIP_TYPE;
