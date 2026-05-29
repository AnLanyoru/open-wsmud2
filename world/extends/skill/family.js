import { WORLD } from "../../../os/world.js";
import { FAMILIES, FAMILY } from "../../../os/skill/family.js";
import { NPC } from "../../../os/char/npc.js";
import { ROOM } from "../../../os/room/room.js";
import { EVENTS } from "../../../os/task/events.js";
import { COMMAND } from "../../../os/command.js";

FAMILY.prototype.init = function () {
    if (!this.def_npcs) return;
    for (let item of this.def_npcs) {
        let rm = ROOM.Get(item[1]);
        if (!rm) throw new Error('房间' + item[1] + "不存在");
        let npc = NPC.CLONE(item[0]);
        if (!npc) throw new Error('npc ' + item[0] + "不存在");
        rm.items.push(npc);
        rm.max_item_count = 100;
        npc.environment = rm;
        if (npc.is(this.boss_path) && !this.boss) {
            this.boss = npc;
        }
        npc.on_died = this.on_npc_die;
        npc.relive = this.on_famnpc_relive;
    }
}
FAMILY.UPDATE_NPC = function (path) {
    for (let key in FAMILIES) {
        let fam = FAMILIES[key];
        if (!fam.def_npcs) continue;
        fam.update_npc(path);
    }
}
FAMILY.prototype.update_npc = function (path) {
    for (let item of this.def_npcs) {
        let spath = item[0];
        if (spath.startsWith(path)) {
            let rm = ROOM.Get(item[1]);
            if (!rm) continue;
            let npc = rm.find_obj_bypath(spath);
            npc.destroy();
            npc = NPC.CREATE(spath, rm);
            if (npc.is(this.boss_path)) {
                this.boss = npc;
            }
            npc.on_died = this.on_npc_die;
            npc.relive = this.on_famnpc_relive;
        }
    }
}
FAMILY.prototype.on_famnpc_relive = function () {
    if (!this.die_room) return;
    this.die_room.item_changed(this, true);
    this.die_room = null;

    if (this.equipment && this.items[0] && !this.equipment[0]) {
        this.equip(this.items[0]);
    }
}
FAMILY.prototype.on_npc_die = function (me) {
    //这里的this是被击杀的NPC
    var fam = FAMILIES[this.family.id];
    if (!me) return;
    var fam2 = FAMILIES[me.family.id];
    if (fam == fam2) {
        me.notify("<cyn>你残害同门，门派功绩减少。</cyn>");
        me.add_temp("gongji", -1);
        return;
    }
    if (!fam || !fam2 || fam == FAMILIES.NONE || fam2 == FAMILIES.NONE) return;

    me.add_temp("killer_" + fam.id, 1, 600000);//十分钟门派仇恨
    me.notify("<red>你击杀了" + fam.name + "的弟子，对方门派在10分钟内可以对你发出追杀令。</red>");
    if (fam.battle_family || fam2.battle_family) {
        return;
    }
    fam.check_battle(this, me);
}


FAMILY.prototype.check_battle = function (npc, killer, target) {
    // if (!killer) return;
    var to_fam = killer ? killer.family : target;
    if (!to_fam || !to_fam.can_battle || !this.can_battle) return;

    if (this.battle_family || to_fam.battle_family) return;
    if (this.query_temp("battle") ||
        to_fam.query_temp("battle")
        || !this.boss || !to_fam.boss) return;
    this.battle_family = to_fam.id;
    to_fam.battle_family = this.id;
    if (killer) {
        if (npc !== this.boss) {
            this.on_kill(npc, killer);
        } else if (this.first_npc) {
            this.first_npc
                .do_command("chat",
                    killer.family.name + "欺人太甚，门下弟子" + killer.name + "击杀我派" +
                    npc.name + "，" + this.name + "众弟子听令，对" + killer.family.name + "弟子格杀勿论！");
        } else {

        }

        to_fam.on_battle(this);
    }


    this.begin_attack(to_fam);
    to_fam.begin_attack(this);
    npc.send_fam("<hiy>\n你的门派和" + to_fam.name + "的战斗开始了，请回门派防守或者进攻对方门派。\n战斗时间30分钟，结束条件是对方或己方掌门被击杀。</hiy>");

    to_fam.send("<hiy>\n你的门派和" + this.name + "的战斗开始了，请回门派防守或者进攻对方门派。\n战斗时间30分钟，结束条件是对方或己方掌门被击杀。</hiy>");


}

FAMILY.prototype.begin_attack = function (fam) {

    this.battle_score = 0;
    this.set_temp("battle", 1, 3600000);
    this.call_out(this.battle_over, 30 * 60000, "timeout");

    this.area.rooms[0].create_copy(this.id, 0);

    this.area.notify_update();

    this.create_guards();
    this.create_npcs();

    EVENTS.add(this.create_event());
}
FAMILY.prototype.create_event = function (rm) {
    let target_fam = FAMILIES[this.battle_family];
    return {
        id: this.id + "_bat",
        name: "门派战争",
        desc: "你的门派正在和" + target_fam.name + "发生战争，击杀对方弟子会获得丰厚奖励。",
        time: Date.now() + 30 * 60000,
        grade: 2,
        command: "进入战场",
        check: (me) => me.family === this,
        on_command: function (me) {
            me.do_command('goto', 'fam3');
        }
    }
}
FAMILY.prototype.get_room = function (rm) {
    return rm.query_copy(this.id);
}
FAMILY.prototype.create_guards = function () {
    if (!this.boss_guard) return;

    var boss_room = this.get_room(ROOM.Get(this.boss_guard[0]));
    var npc = NPC.CLONE("pub/menpai");
    npc.init_from(this, 5);
    npc.name = this.boss.name;
    npc.desc = this.boss.desc;
    npc.title = "<ora>" + this.boss.title + "</ora>";

    npc.age = this.boss.age;
    npc.gender = this.boss.gender;
    this.npcs.push(npc);
    boss_room.item_changed(npc, true);

    this.battle_boss = npc;
    for (var i = 0; i < this.boss_guard.length; i++) {
        for (var j = 0; j < 2; j++) {
            npc = NPC.CLONE("pub/menpai");
            npc.init_from(this, i == 0 ? 4 : 3);
            var rm = this.get_room(ROOM.Get(this.boss_guard[i]));

            this.npcs.push(npc);
            rm.item_changed(npc, true);
        }
    }


}
FAMILY.prototype.remove_npcs = function (npc) {
    this.npcs.remove(npc);
    if (this.battle_boss) {
        this.battle_boss.remove_status("boss");
    }
}
FAMILY.prototype.create_npc = function (level) {
    var npc = NPC.CLONE("pub/menpai");
    npc.init_from(this, level);
    return npc;
}
// let rm = null;
// if (lv === 2 && this.guard_rooms) {
//     rm = ROOM.Get(this.guard_rooms.random());
// }
// if (!rm) rm = this.area.rooms.random();
FAMILY.prototype.create_npcs = function () {
    if (this.npcs.length < 27) {
        let count = 27 - this.npcs.length;
        for (let i = 0; i < count; i++) {
            let lv = i > 15 ? 2 : (i < 8 ? 0 : 1);
            let rm = this.get_room(this.area.rooms.random());
            let npc = this.create_npc(lv);
            this.npcs.push(npc);
            rm.item_changed(npc, true);
        }
        if (this.battle_boss) {
            this.battle_boss.add_status({
                id: "boss",
                name: "号令",
                prop: {
                    hp_per: 30,
                    // gj_per: 30,
                    fy_per: 30,
                    ds_per: 30,
                    mz_per: 30
                },
                no_clear: true,
                override: 1,
                count: count,
                max_count: 100,
                duration: 0,
                desc: "当你的门派还有NPC存活时，增加你的属性"
            });
        }
    }
    this.create_handler = this.call_out(this.create_npcs, 200000);
}
FAMILY.prototype.battle_over = function (suc_type) {
    if (!this.battle_family) return;
    var fam = FAMILIES[this.battle_family];
    if (!fam) return;
    this.battle_family = null;
    if (this.create_handler) clearTimeout(this.create_handler);
    for (var i = 0; i < this.npcs.length; i++) {
        if (this.npcs[i].hp > 0) {
            this.npcs[i].send_room("$N急匆匆的走掉了。");
            this.npcs[i].destroy();
        }
    }
    this.npcs.length = 0;
    if (suc_type == "suc") {
        COMMAND.DO("sys", "" + this.name + "和" + fam.name + "的战斗结束了，" + this.name + "获得了最终胜利，接下来的一小时" + this.name + "所有弟子练功效率提高50%。");

        this.add_battle_status(50);
        EVENTS.add(this.finish_event(50, fam));
    } else if (suc_type == "die") {
        this.send("<hir>由于你的门派掌门被击杀，和" + fam.name + "的战斗失败了。</hir>");
    } else if (suc_type == "fail") {
        this.send("<hir>由于你的门派掌门被击杀，和" + fam.name + "的战斗失败了。</hir>");
    } else {
        if (this.battle_score > fam.battle_score) {
            this.send("<hiy>和" + fam.name + "的战斗结束了，你的门派占得优势，接下来的一小时" + this.name + "所有弟子练功效率提高20%。</hiy>");
            this.add_battle_status(20);
            EVENTS.add(this.finish_event(20, fam));

        } else {
            this.send("<hiy>和" + fam.name + "的战斗结束了，你的门派没有取得优势。</hiy>");
            EVENTS.add(this.finish_event(0, fam));

        }

    }
    if (FAMILIES.SHASHOU.query_temp('ss_target') === this.id) {
        let sc = 0;
        if (suc_type === 'suc') sc = 0;
        else if (suc_type === 'fail') sc = 50;
        else sc = this.battle_score > fam.battle_score ? 0 : 20;
        EVENTS.remove(FAMILIES.SHASHOU.id + "_bat");
        EVENTS.add(FAMILIES.SHASHOU.finish_event(sc, this));
        FAMILIES.SHASHOU.remove_temp('ss_target');
        if (sc > 0) {
            FAMILIES.SHASHOU.add_battle_status(sc);
            FAMILIES.SHASHOU.send("<hiy>和"
                + this.name + "的战斗结束了，你的门派占得优势，接下来的一小时所有弟子练功效率提高" + sc + "%。</hiy>");
        } else {
            FAMILIES.SHASHOU.send("<hiy>和"
                + this.name + "的战斗结束了，你的门派没有取得优势。</hiy>");
        }


    }
    //  console.log(this.name, "战斗结束，清理NPC：", this.npcs.length);
    if (this.battle_boss)
        this.battle_boss.destroy();
    this.battle_boss = null;
    this.area.notify_update();
    this.call_out(this.clear_room, 300000);//300秒后清理战场副本
    EVENTS.remove(this.id + "_bat");
}

FAMILY.prototype.clear_room = function () {
    const rm = this.area.rooms[0];
    rm.clear_by_area(rm.parent, this.id);
}

FAMILY.prototype.finish_event = function (suc, target_fam) {
    let msg = suc > 0 ? "你的门派占得优势，所有弟子获得鼓舞，练功效率+" +
        suc + "%。" : "你的门派没有取得优势。";
    return {
        id: this.id + "_settle",
        name: "门派战争",
        desc: "你的门派和" + target_fam.name + "战斗结束了，" + msg,
        time: this.temp["battle"].e,
        grade: 2,
        command: "领取战利品",
        check: (me) => me.family === this,
        on_command: (me) => {
            // if (!suc) return me.send('你所在的门派没有在战争中取得优势，请再接再厉。');
            this.battle_settle(me)
        }
    }
}




FAMILY.prototype.add_battle_status = function (t) {
    this.battle_gift = t;
    this.add_temp("lianxi_per", t, 3600000);
    this.add_temp("study_per", t, 3600000);
    this.add_temp("dazuo_per", t, 3600000);

}
FAMILY.prototype.on_login = function (me) {
    if (this.first_npc && me.id == this.first_npc.userid) {
        if (!this.is_init_first)
            this.init_dadizi(this.first_npc, me);
        this.send('{type:"msg",ch:"fam",content:"' + this.first_npc.title + me.name + '上线了。",uid:0,name:"",fam:"' + this.name + '"}');
    }
}
FAMILY.prototype.set_dadizi = function (id, name) {
    this.tops = {};

    if (this.boss)
        this.boss.do_command("fam", '本门弟子' + name + '表现突出，提升为' + this.top_name + '。');

    this.is_init_first = false;
    WORLD.DATA.set_temp(this.id + "_top", id);
    WORLD.DATA.set_temp(this.id + "_top_name", name);
    if (this.first_npc) {
        if (this.first_npc.environment.is_shadow) {
            var rm = ROOM.Get(this.first_npc.environment.path);
            var npc = rm.find_obj_bypath('pub/dadizi#' + this.id);
            if (npc) {
                this.first_npc = npc;
            } else {
                this.first_npc = null;
                return;
            }
        }
        this.init_dadizi(this.first_npc, WORLD.getUser(id));
        this.area.notify_update();
    }
}
FAMILY.prototype.init_dadizi = function (npc, me) {
    this.first_npc = npc;
    npc.name = WORLD.DATA.query_temp(this.id + "_top_name") || this.top_name;
    npc.title = this.top_name;
    npc.userid = WORLD.DATA.query_temp(this.id + "_top");
    if (!me) return;
    npc.level = me.level;
    var copy_prop = ["str", "con", "dex", "int", "gender", "max_mp", "exp", "pot", "kar", "per"
        , "name", "skills", "hp", "max_hp", "mp"];
    for (var i = 0; i < copy_prop.length; i++) {
        npc[copy_prop[i]] = me[copy_prop[i]];
    }
    npc.equipment = [];
    if (me.equipment) {
        var eqs = me.equipment;
        for (var i = 0; i < eqs.length; i++) {
            if (!eqs[i]) continue;
            var obj = eqs[i].clone(me);
            npc.equipment[obj.eq_type] = obj;
        }
    }
    npc.max_hp = npc.hp = npc.max_hp * 2;
    npc.age = me.query_age();
    npc.clear_prop();
    npc.init();
    npc.recount();
    npc.auto_skills = null;
    npc.environment && npc.environment.item_changed(npc, true);
    this.is_init_first = true;
    this.first_npc_exp = npc.exp;
}
FAMILY.prototype.send_channel = function (me, msg) {

    var msg = '{type:"msg",ch:"fam",content:"' + msg + '",fam:"' + this.name + '", name:"' + (me ? me.name : "门派管理") + '" }';
    this.send(msg);
}
FAMILY.SAVE = function () {
    var obj = {};
    for (var key in FAMILIES) {
        var fam = FAMILIES[key];
        if (fam.tops) {
            obj[key + "_tops"] = fam.tops;
        }
        obj.temp = fam.temp;
    }
    return JSON.stringify(obj);
}
FAMILY.LOAD = function (str) {
    var obj = JSON.toObject(str);
    if (!obj) return;
    for (var key in FAMILIES) {
        var fam = FAMILIES[key];
        if (obj[key + "_tops"]) {
            fam.tops = obj[key + "_tops"];
        }
        fam.temp = obj.temp;

    }
}

const TITLES = ['入门弟子', '弟子', '执事', '护法', '长老', '供奉'];

FAMILY.prototype.query_task_title = function (me) {
    let level = me.query_temp('sm_level', 0);
    return me.family.name + TITLES[level];
}

FAMILY.prototype.query_job_title = function (level) {
    return TITLES[level];
}
export default function() {}
