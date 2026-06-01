import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { WORLD } from "../../../core/world.js";
import { UTIL } from "../../../core/util/util.js";

export default class extends COMMAND {
    command = "auto";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    admin = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, type) {

}
}

WORLD.check_user_next = function (me) {

    var type = me.query_setting("auto_work");
    if (!type || !me.hp || me.is_faint || me.is_busy || me.environment.is_fb()) return;
    me.state = null;
    me.send("{type:\"state\"}");

    me.environment.item_changed(me, true);
    if (type == 1) {

        me.do_command("wakuang");

    } else {
        var str = type.split(",");
        for (var i = 0; i < str.length; i++) {
            me.command(str[i]);
        }
    }
    return false;
}
WORLD.auto_get = function (me, corpse, npc) {
    if (npc && npc.damages) {
        for (var i = 0; i < npc.die_room.items.length; i++) {
            var item = npc.die_room.items[i];
            if (item.is_player && item.query_setting("auto_get") && npc.damages[item.id]) {
                //item.do_command('get', "all from " + corpse.id);
                WORLD.COMMANDS['get'].enter(item, "", "all", corpse.id);

            }
        }
    } else if (me && me.is_player) {
        if (!me.is_here(corpse) || !me.query_setting("auto_get") || me.state || !me.hp) return;

        //me.do_command('get', "all from " + corpse.id);
        WORLD.COMMANDS['get'].enter(me, "", "all", corpse.id);
    }
    //if (me && me.is_player) {
    //    me.add_temp('killed', 1, UTIL.diff_time());
    //}
}
WORLD.auto_pfm = function (me, target) {
    if (me.hp <= 0 || target.hp <= 0) return;
    if (me.query_setting("auto_pfm")) {
        var setting = me.query_setting("auto_pfm");
        if (!setting.split) return WORLD.log(me, 'auto', setting);
        var str = setting.split(",");
        for (var i = 0; i < str.length; i++) {
            var ps = str[i].split(".");

            WORLD.COMMANDS["perform"].enter(me, ps[0], ps[1]);
        }
    }

    if (target.query_setting("auto_pfm2")) {
        var str = target.query_setting("auto_pfm2").split(",");
        for (var i = 0; i < str.length; i++) {
            var ps = str[i].split(".");
            WORLD.COMMANDS["perform"].enter(target, ps[0], ps[1]);
        }
    }
}
