import { COMMAND } from "../../../os/command.js";

export default function() {
    const WORLD = globalThis.WORLD; const UTIL = globalThis.UTIL; const FAMILIES = globalThis.FAMILIES; const ROOM = globalThis.ROOM; const USERTASK = globalThis.USERTASK;
this.inherits(COMMAND);
this.command = "goto";
this.allow_fight = false;
this.regex = /^(\w+)(?:\s+(\w+))$/;
this.enter = function (me, arg, par) {

    if (!me.can_trans()) return;
    let action = this.actions[arg];
    if (!action) return me.send('没有这个动作设定。');
    if (action(me, par)) {
        me.send('{type:"dialog",dialog:"jh",close:true}');
    }
}
this.actions = {
    home: function (me) {

        let home = me.query_temp("home");
        if (!home) {
            me.moveto('yz/home', me.name + '离开了。', me.name + "走了过来。", 'goto');
            me.notify("你还没购买房屋，和管家谈谈购买吧。");
        } else {
            me.go_home();
        }
        return true;
    },
    kuang: function (me) {
        WORLD.COMMANDS['wakuang'].enter(me);
        return true;
    },
    bp: function (me) {
        let home = me.query_temp("pt");
        if (!home) {
            me.moveto('yz/banghui', me.name + '离开了。', me.name + "走了过来。", 'goto');
            me.notify("你还加入任何帮会，先和帮会管理员聊聊吧。");
        } else {
            let rm = ROOM.Get("banghui/yuanzi");
            let my_room = rm.query_copy2(me);
            if (!my_room) {
                my_room = rm.create_copy2(me);
            }
            me.moveto(my_room, me.name + "离开了。", me.name + "走了进来。", 'goto');
        }
        return true;
    },
    fam1: function (me) {


        let master = me.query_temp('master');
        if (!master) return me.notify_fail('你无门无派，不知道师父在哪里。');
        let area = me.family.area;
        if (!area) return me.notify_fail('你无门无派，不知道师父在哪里。');
        let room_path = find_room(area, master);
        if (!room_path) return me.notify_fail('你的师父现在不在' + area.name + '。');
        me.moveto(room_path, me.name + "离开了。", me.name + "走了进来。");
        // WORLD.COMMANDS['cha'].render_skill(me,);
        return true;
    },
    fam2: function (me, fam) {
        let family = FAMILIES[fam] ?? me.family;
        if (!family) return me.notify_fail('没有这个门派。');
        if (family === FAMILIES.SHASHOU && me.family !== FAMILIES.SHASHOU)
            return me.notify_fail('那里你去不了。');
        let area = family.area;
        if (!area) return me.notify_fail('你还没有加入门派。');
        let room_path = find_room(area, 'pub/mpguanli#' + family.id);
        if (!room_path) return me.notify_fail('门派管理不知道跑哪里去了。');

        me.moveto(room_path, me.name + "离开了。", me.name + "走了进来。", 'goto');
        return true;
    }, fam3: function (me, to_fam) {
        if (!to_fam) {
            to_fam = me.family.battle_family;
            if (!to_fam)
                return me.send('你的门派没有和其他门派产生冲突。');
        }
        let target_fam = FAMILIES[to_fam];
        if (!target_fam || !target_fam.battle_family)
            return me.send('门派战争已经结束了。');
        let room = ROOM.Get(target_fam.area.first).query_copy(target_fam.id);
        if (!room) return me.send('门派战争已经结束了。');
        if (me.level < 1 && me.exp < 1000000) return me.send('那里正在进行门派战争，你实力不够还是不要掺和了。');
        me.moveto(room, me.name + "离开了。", me.name + "走了进来。", 'goto');
        return true;
    }, fam4: function (me) {
        const pt = me.query_party();
        if (!pt) return me.send('你还没加入任何帮派。');
        if (!pt.battle_family) return me.send('你的帮派没有进攻任何门派。');
        let fam = FAMILIES[pt.battle_family];
        let count = me.query_temp('pt_mc');
        if (!me.query_temp('pt_mp')) {
            if (count >= 7)
                return me.notify('你本周内参与帮派战的次数已满。');
            let time = pt.temp.battle.e - Date.now();
            me.set_temp('pt_mp', 1, time);
            count = me.add_temp('pt_mc', 1, UTIL.diff_week_time());
        }
        me.moveto(pt.get_room(ROOM.Get(fam.area.first)),
            me.name + "走了。", me.name + "来了。", 'goto');
        me.notify('<cyn>你已进入帮派战区域，本周已参与' + count + '/7次。</cyn>');
        return true;
    },
    wd1: function (me) {
        let level = me.query_temp('wd_level', 0);
        if (level < 99)
            me.moveto('wudao/ta',
                me.name + "走了。", null, 'goto');
        else
            me.moveto('wudao/ta2',
                me.name + "走了。", null, 'goto');

        return true;
    },
    wd2: function (me) {
        if (me.query_temp('wd_level', 0) < 99)
            return me.send('你要去哪里？');
        me.moveto('wudao/ding',
            me.name + "走了。", null, 'goto');
        return true;
    },

    ddz: function (me) {
        let fam = me.family;
        if (fam.first_npc) {
            if (fam.first_npc.userid === me.id)
                return fam.first_npc.manage(me);
            return fam.first_npc.greeting(me);
        }
        return me.send('你的门派目前没有首席大弟子。');
    }, yamen2: function (me) {
        let task = USERTASK.GET('yamen2');
        task.to_taofan(me);
    }
};
function find_npc(family, path) {
    for (let item of family.def_npcs) {
        if (path !== item[0]) continue;
        let rm = ROOM.Get(item[1]);
        if (!rm) continue;
        let npc = rm.find_obj_bypath(path);

    }
}
function find_room(area, path) {
    let room_path = NPC_ROOMS[path];
    if (room_path) return room_path;
    for (let room of area.rooms) {
        if (room.find_by_path(path)) {
            room_path = room.path;
            break;
        }
    }
    if (!room_path) return;
    NPC_ROOMS[path] = room_path;
    return room_path;
}
const NPC_ROOMS = {

};
}
