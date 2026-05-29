import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";
import { WORLD } from "../../../os/world.js";
import { UTIL } from "../../../os/util/util.js";
import { NPC } from "../../../os/char/npc.js";
import { USER } from "../../../os/char/user.js";

export default class extends COMMAND {
    command = "biwu";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    biwu_state = {
    allow_busy: false,
    allow_state: false,
    allow_die: false,
    allow_die: false
};
    regex = /^(emei|wudang|shaolin|huashan|xiaoyao|gaibang|shashou|none)?\s*(\d+)(?:\s+(ok))?$/;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, fam, type, par) {

    if (!me.can_trans()) return;
    if (!WORLD.COMMANDS.events.check_command(this.biwu_state, me)) return;
    let index = parseInt(type);
    if (!(index > 0 && index < 11)) return me.notify('错误的对手编号。');

    if (fam && me.family.id !== fam.toUpperCase())
        return me.notify('你只能挑战自己门派的高手榜单。');
    const top_key = fam ? "top_fam" : "top";
    let top = me.query_temp(top_key, 999);
    if (top === index) {
        return me.notify('你不能挑战自己。');
        // return me.send_commands('biwu recopy', '更新擂台使用的技能和装备属性');
    }
    if (top <= index)
        return me.notify('你只能挑战积分比你高的对手。');
    let max = Math.floor(me.query_temp("ex_jl", 0) / 40);

    let count = me.query_temp('top_c', 0);
    if (count >= max) return me.notify('你今天的挑战次数已经用尽，每日精力每消耗40增加一次挑战机会。');
    if (!par) {
        me.notify(`<hig>当你每消耗40精力后，增加一次挑战机会，当前可挑战次数${count}/${max}</hig>`);
        if (count < max) {
            fam = fam ? (fam + " ") : "";
            return me.send_commands('biwu ' + fam + type + " ok", '确定挑战');
        }
        return;
    }
    if (me.state) return me.send('你正在' + me.state.title + "。");
    if (me.status && me.status.length)
        return me.send('你需要清理掉自身的增益效果才可上擂台挑战。');
    if (me.hp / me.max_hp < 0.9 || me.mp / me.max_mp < 0.9)
        return me.send('你先调整好自身的状态再来挑战吧。');

    this.start_biwu(me, fam, index - 1);

}
    start_biwu(me, fam, index) {
    let tops = STATS.TOPS;
    if (fam) tops = STATS['tops_' + fam.toUpperCase()];
    if (!tops) return me.send('错误的对手，无法挑战。');

    var npc = tops[index];
    if (!npc) {
        return me.send(me, "错误的对手。");
    }
    if (me.moveto('yz/leitai/leitai') === false) return;

    npc = this.create_npc(npc);
    let room = me.environment;

    me.die = challenge_end;
    npc.die = challenge_end;
    room.on_heart_beat = this.on_heart_beat;
    room.biwu_step = 0;
    me.auto_pfm = true;
    me.check_pfms = this.check_pfms;
    me.init_pfms = this.init_pfms;

    npc.fight_type = 0;
    room.item_changed(npc, true, npc.name + "跳上了擂台。");
    npc.full();
    me.add_temp('top_c', 1, UTIL.diff_time());
    me.set_temp('biwu_fam', fam);
    me.call_interval(x => {
        me.send_message("\n<hic>挑战还有" + (3 - x) + "秒钟正式开始！</hic>", true);
    },
        1000,
        3,
        function () {
            npc.do_kill(me);
        }
    );

    me.send('{type:"dialog",dialog:"stats",close:true}');
}
    surrender(me) {
    // if (!me.fight_type)
    //     return me.send('你还没开始战斗呢。');
    let npc = me.environment.items[1];
    if (npc.is_player) {
        npc = me.environment.items[0];
    }
    me.end_fight();
    npc.end_fight();
    challenge_over(me, 2);
    challenge_fail(me);
}
    on_heart_beat(dt) {
    this.biwu_step++;
    if (this.biwu_step < 60) return;
    if (!this.items.length) {
        return;
    }
    let me = this.items[0], npc = this.items[1];
    if (npc && npc.is_player) {
        me = npc;
        npc = this.items[0];
    }
    me.end_fight();
    npc?.end_fight();
    challenge_over(me, 2);
    challenge_fail(me);
    me.notify("<yel>挑战超时，自动离开擂台。</yel>");
}
    create_npc(player, fam) {
    var npc = NPC.CLONE('pub/gaoshou1');
    for (var i = 0; i < COPY_PROPS.length; i++) {
        npc[COPY_PROPS[i]] = player[COPY_PROPS[i]];
    }
    npc.equipment = [];
    if (player.equipment) {
        var eqs = player.equipment;
        for (var i = 0; i < eqs.length; i++) {
            if (!eqs[i]) continue;
            var obj = eqs[i].clone(player);
            npc.equipment[obj.eq_type] = obj;
            if (obj.on_eq) obj.on_eq(npc);
        }
    }
    npc.skills = {};
    if (player.skills) {
        for (var sk in player.skills) {
            let item = player.skills[sk];
            npc.skills[sk] = { ...item };
        }
    }
    npc.attack_count = 3;
    if (player.is_player) {

        npc.title = player.query_title("family");
        npc.age = player.query_age();
        npc.userid = player.id;
        npc.score = player.query_temp(fam ? 'top_fam_sc' : "top_sc", 0);
        npc.top_index = player.query_temp(fam ? 'top_fam' : "top", 0);

        npc.id = "top_" + (fam ? fam.toUpperCase() : "") + "_" + (npc.top_index - 1);
    } else {
        npc.title = player.title;
        npc.age = player.age;
        npc.userid = player.userid;
        npc.score = player.score;
        npc.top_index = player.top_index;
    }

    for (let key of COPY_TEMPS) {
        let value = player.query_temp(key);
        if (value) {
            npc.set_temp(key, value);
        }
    }
    npc.clear_prop();
    npc.init();
    npc.recount = this.recount;
    npc.recount();
    npc.check_pfms = this.check_pfms;
    npc.init_pfms = this.init_pfms;

    if (npc.force_skill.on_relive) {
        npc.force_skill.on_relive(npc);
    }

    npc.hp = npc.max_hp;

    return npc;
}
    recount() {
    this.max_hp = parseInt(this.con * 5 + (this.max_mp * this.query_force_rad() + this.query_prop("max_hp") + this.query_prop("con") * this.con) * (100 + this.query_prop("hp_per")) / 100);

    this.max_hp = this.max_hp;
    if (this.max_hp < 1) this.max_hp = 1;
    if (this.hp > this.max_hp) this.hp = this.max_hp;

    this.gjsd = 4000 - this.query_prop("gjsd");
    if (this.gjsd > 500) {
        this.gjsd = parseInt(this.gjsd - (this.gjsd * this.query_prop("gjsd_per") / 100));
    }
    if (this.gjsd < 500) this.gjsd = 500;

    this.gj = parseInt(this.str + (this.query_prop("gj") + this.query_prop("str") * this.str / 10) * (100 + this.query_prop("gj_per")) / 100);
    this.fy = parseInt(((this.str + this.con) / 10 + this.query_prop("fy") + this.query_prop("con") * this.con / 10) * (100 + this.query_prop("fy_per")) / 100);
    this.mz = parseInt((this.dex / 2 + this.query_prop("mz")) * (100 + this.query_prop("mz_per")) / 100);
    this.ds = parseInt((this.dex / 2 + this.query_prop("ds") + this.query_prop("dex") * this.dex / 10) * (100 + this.query_prop("ds_per")) / 100);
    this.zj = parseInt((this.str / 2 + this.query_prop("zj") + this.query_prop("str") * this.str / 10) * (100 + this.query_prop("zj_per")) / 100);
    this.bj = parseInt(this.dex / 10 + this.query_prop("bj_per"));
    if (this.parry_skill && this.parry_skill.on_recount_parry) {
        this.zj += this.parry_skill.on_recount_parry(this);
    }
    if (this.dodge_skill && this.dodge_skill.on_recount_dodge) {
        this.ds += this.dodge_skill.on_recount_dodge(this);
    }
    this.diff_sh_per = this.query_prop('diff_sh_per');
    if (this.diff_sh_per > 80) {
        this.diff_sh_per = 80 + Math.sqrt((this.diff_sh_per - 80) * 4);
        if (this.diff_sh_per > 99.9999) this.diff_sh_per = 99.9999;
    }
    this.diff_sh_per += this.query_prop('diff_sh_per2');

}
    check_pfms(target) {
    if (!this.auto_skills) this.init_pfms()
    if (!this.equipment[0] && this.items[0] && this.random(3) === 0) {
        return this.equip(this.items[0]);
    }
    if (this.auto_eqs.length > 0 && this.random(3) === 1) {
        let eqs = [];
        for (var i = 0; i < this.auto_eqs.length; i++) {
            let obj = this.auto_eqs[i];
            let key = "disobj_" + (obj.distype || obj.id);
            if (obj.distime && this.query_temp(key)) {
                continue;
            }
            eqs.push(obj);
        }
        if (eqs.length > 0) {
            let obj = eqs.random();

            if (obj.on_use(this) !== false) {
                if (obj.distime) {
                    this.set_temp("disobj_" + (obj.distype || obj.id), 1, obj.distime);
                }
                return;
            }
        }
    }
    return CHARACTER.prototype.check_pfms.call(this, target);
}
    init_pfms() {
    CHARACTER.prototype.init_pfms.call(this);
    this.auto_eqs = [];
    for (var i = 1; i < this.equipment.length; i++) {
        if (this.equipment[i] && this.equipment[i].on_use) {
            this.auto_eqs.push(this.equipment[i]);
        }
    }
}
    setStatsTitle(player, index, fam) {
    if (fam) return;//门派称号先不用

    if (index < 10) {
        let title = "天下第" + TOPS[index];
        player.add_title(title, "top");
        player.notify('<hiy>你的高手榜称号变动为【'
            + title + '】。</hiy>');
    }
    else
        player.add_title(null, "top");
}
    checkStats(player) {
    let top = player.query_temp("top");
    if (top) {
        this.check_fams_stats(player, STATS.TOPS, top);
    }
    top = player.query_temp("top_fam");
    if (top) {
        this.check_fams_stats(player, STATS['tops_' + player.family.id], top, player.family.id);
    }

}
    check_fams_stats(player, tops, top, fam) {
    let npc = tops[top - 1];
    if (!npc) return;
    let top_key = fam ? "top_fam" : "top";
    if (npc.userid !== player.id) {
        for (let i = 0; i < tops.length; i++) {
            if (tops[i].userid === player.id) {
                player.set_temp(top_key, i + 1);
                return this.setStatsTitle(player, i, fam);
            }
        }
        player.remove_temp(top_key);
        this.setStatsTitle(player, 9999, fam);
    }
}
    updateTopStats(top, index, fam) {
    let top_user = top.userid ? WORLD.getUser(top.userid) : null;
    let top_key = fam ? "top_fam" : "top";
    if (index > 0) {
        top.top_index = index + 1;
        top.id = "top_" + (fam ? fam.toUpperCase() : "") + "_" + index;
        if (top_user) {
            top_user.set_temp(top_key, index + 1);
            this.setStatsTitle(top_user, index, fam);

        }
    } else {
        top.top_index = -1;
        if (top_user) {
            top_user.remove_temp(top_key);
            this.setStatsTitle(top_user, 10, fam);
        }
    }
}
    checkTopindex(sc, tops) {
    let index = -1;
    for (let i = tops.length - 1; i >= 0; i--) {
        let item = tops[i];
        if (item.score >= sc) return index;
        index = i;
    }
    return 0;
}
    updatePlayerStats(player, sc, fam) {

    //玩家挑战没上榜不用管，挑战失败减分也不会下榜，因为没有记录以下的玩家
    //这里只会上升不会下降
    let tops = STATS.TOPS;
    let top_key = "top";
    if (fam) {
        tops = STATS['tops_' + fam.toUpperCase()];
        top_key = "top_fam";
    }
    if (!tops) return;
    let index = this.checkTopindex(sc, tops);
    if (index < 0) {
        return;
    }
    let top = player.query_temp(top_key, 0);
    if (top > 0) {
        tops[top - 1].score = sc;
        if (top <= index + 1) return;
        tops.splice(top - 1, 1);
    }
    player.set_temp(top_key, index + 1);
    tops.splice(index, 0, this.create_npc(player, fam));
    if (tops.length > 10) {
        this.updateTopStats(tops.splice(tops.length - 1)[0], -1, fam);
    }
    if (top == 0) {
        top = tops.length;
    }
    for (let i = index + 1; i < top; i++) {
        this.updateTopStats(tops[i], i, fam);
    }
    if (!fam) {
        this.setStatsTitle(player, index);
        //  player.notify('<hiy>恭喜你获得称号【' + "天下第" + TOPS[index] + '】</hiy>');
    }
}
    biwu_watch(me) {

}
}

const STATS = WORLD.STATS;
function challenge_end(killer) {
    if (this.on_die && this.on_die(killer) === false) {
        this.hp = 1;
        return false;
    }
    let me = killer, npc = this;
    if (this.is_player) {
        npc = killer, me = this;
    }
    if (me.hp <= 0) me.hp = 1;
    me.end_fight();
    npc.end_fight();
    if (killer === me) {
        challenge_over(me, 1, npc);
        challenge_success(me, npc);
    } else {
        challenge_over(me, 0, npc);
        challenge_fail(me, npc);
        //  me.notify("<cyn>挑战失败，你的积分保持不变。</cyn>");
    }
}
function challenge_over(me, result, npc) {
    me.environment.on_heart_beat = null;
    me.die = USER.prototype.die
    me.auto_pfm = false;
    me.auto_skills = null;

    me.check_pfms = USER.prototype.check_pfms;
    me.init_pfms = USER.prototype.init_pfms;

    let leitai = me.environment;
    if (result === 0)
        me.moveto('yz/leitai/ltx', null, me.name +
            "被" + npc.name + "一脚踢下了擂台。", 'fightend');
    else if (result === 1) {
        me.moveto('yz/leitai/ltx', null, me.name +
            "走了下来。", 'fightend');
    } else {
        me.moveto('yz/leitai/ltx', null, me.name +
            "被赶下来。", 'fightend');
    }
    leitai.items.length = 0;
    me.clear_downside(true);
}
function challenge_fail(me, npc) {
    me.notify("<cyn>挑战失败，擂台积分保持不变。</cyn>");
    me.remove_temp('biwu_fam');
}
function challenge_success(me, npc) {
    const fam = me.query_temp('biwu_fam');
    let top_key = fam ? "top_fam_sc" : "top_sc";
    let sc = me.query_temp(top_key, 0);
    let target_sc = npc.score ?? 0;
    let add = Math.floor((target_sc - sc) / 2);
    if (add === 0) {
        add = 1;
    }
    if (add > 0) {
        sc += add;
        me.set_temp(top_key, sc);
    } else {
        add = 0;
    }
    if (fam)
        me.notify("<hig>挑战成功，当前" + me.family.name + "榜单积分" + sc + "。</hig>");
    else
        me.notify("<hig>挑战成功，当前总榜积分" + sc + "。</hig>");
    if (add > 0)
        WORLD.COMMANDS.biwu.updatePlayerStats(me, sc, fam);
    me.remove_temp('biwu_fam');
}
const COPY_TEMPS = ["copy_pfm_sword",//"copy_pfm",
    "copy_pfm_unarmed", "jiuyang", "zyy"];
const COPY_PROPS = ["str", "con", "dex", "int", "gender", "max_mp", "exp", "pot", "kar", "per"
    , "name", "hp", "max_hp", "mp"];
const TOPS = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
