import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";
import { WORLD } from "../../../os/world.js";
import { UTIL } from "../../../os/util/util.js";
import { ROOM } from "../../../os/room/room.js";
import { USER } from "../../../os/char/user.js";

export default class extends COMMAND {
    command = "relive";
    allow_die = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, arg) {
    if (!WORLD.is_server(me)) {
        return WORLD.on_cross_user_relive(me);
    }
    if (me.hp > 0) return me.notify("你还没死呢。");
    if (!me.environment) return me.notify("你不知道在哪。");
    if (me.query_temp("relive")) {
        return me.notify("你已经使用了天师符，正在等待复活。");
    }

    me.die = USER.prototype.die;
    var dt = new Date();
    var isqmhd = dt.getMonth() === 3 && dt.getDate() === 5;
    var ismaxcount = false;
    if (isqmhd) {
        let next = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours() + 1);
        ismaxcount = me.add_temp('died', 1, next.getTime() - dt.getTime()) < 11;
    }

    // me.add_temp('died', 1, UTIL.diff_time());
    if (arg == "locale") {
        if (me.environment.no_relive)
            return me.notify('这里不能复活。');


        if (!isqmhd) {
            var fu = me.find_obj_bypath("cash/tianshifu");
            if (!fu || !fu.count) return me.notify("你身上没有天师符。");
            me.remove_obj(fu, 1);
        }
        if (isqmhd && ismaxcount) {
            WORLD.DATA.set_temp("new_die", me.id, 600000);
            WORLD.DATA.set_temp("new_die_type", 1, 600000);
            // me.add_temp('die1', 1, 3600000 * 28);
        }

        me.set_temp("relive", 1, 5000);
        me.notify("<MAG>你拿出一张天师符，口中念念有词!</MAG><hik>\n五秒后将原地复活</hik>");

        this.call_out(x => {
            me.hp = me.max_hp;
            me.mp = me.max_mp;
            me.notify('{type:"die",relive:true}');
            if (me.force_skill.on_relive) {
                me.force_skill.on_relive(me);
            }
            if (me.environment.on_relive && me.environment.on_relive(me, true) === false) {
                return;
            }
            me.clear_status();
            let room = me.environment;
            me.environment = null;
            me.moveto(room, null, "<mag>" + me.name + "的尸体发出阵阵光芒。</mag>");
        }, 5000);


    } else {
        var area = me.environment.parent;
        var area_name = null;
        if (area) area_name = area.name;


        if (me.environment.on_relive && me.environment.on_relive(me, false) === false) {
            return;
        }

        var recover_room = me.environment.query_recover_room();
        var is_fb = me.environment.is_fb();
        if (is_fb) {
            me.environment.clear_copy(me);
        }
        // if(me.query_temp('ns_bt')){
        //     let npc=me.environment.find_obj_bypath('pub/nianshou');
        //     if(npc){
        //         npc.destroy();
        //         //me.remove_temp('ns_bt');
        //     }
        // }



        me.environment.item_changed(me, false);
        var room = ROOM.Get(recover_room);
        me.hp = 1;
        me.clear_status();
        room.do_enter(me, true, "<wht>你忽然发现前面多了一个人影，不过那人影又好像已经在那里很久了，只是你一直没发觉。</wht>");

        area.on_leaved(me);

        if (isqmhd && ismaxcount) {
            WORLD.DATA.set_temp("new_die", me.id, 600000);
            WORLD.DATA.set_temp("new_die_type", 2, 600000);
            //me.add_temp('die2', 1, 3600000 * 28);
        }
        if (area_name && is_fb) {
            me.notify("你的副本" + area_name + "失败了。");
        }
        me.notify('{type:"die",relive:true}');
        if (me.force_skill.on_relive) {
            me.force_skill.on_relive(me);
        }
        if ((!me.team || me.team[0] === me) && me.query_temp('fbbs', 0) === 1) {
            me.remove_temp('fbbs');
        }
    }
}
}

