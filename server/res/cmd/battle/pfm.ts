import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { SKILL } from "../../../core/skill/skill.js";
import { WEAPON_TYPE } from "../../../core/const.js";

export default class extends COMMAND {
    command = "perform";
    allow_busy = true;
    allow_faint = true;
    regex = /^(\w+)\.(.+?)$/;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, sk, pfmid) {
    if (!sk || !pfmid) return me.notify("你要使用什么绝招。");
    if (!me.skills) return me.notify("你目前没有学会任何技能。");
    var baseSkill = me.skills[sk];
    if (!baseSkill) return me.notify("你不会用这个技能。");




    var sp_skill = SKILL.get(baseSkill.enable_skill || sk);

    if (!sp_skill) return me.notify("没有这个技能。");

    var sp_myskill = me.skills[sp_skill.id];

    if (!sp_myskill || sp_myskill.disable)
        return me.notify("这个技能暂时无法使用，请联系管理员处理。");


    var is_ref = false;
    let pfm = sp_skill.get_pfm(pfmid);
    if (!pfm) {
        if (pfmid == 'ref') {
            pfm = me.query_ref_skill(me.skills[baseSkill.enable_skill]);
        }
        if (!pfm) {
            return me.notify(sp_skill.name + "没有这个绝招。");
        } else {
            is_ref = true;
        }

    }
    if (me.environment?.no_fight && !pfm.allow_safe) return me.notify("这里不允许战斗。");


    var name = "【" + pfm.name + "】";
    //0 只能战斗中使用， 1，只能非战斗 2，任何时候
    if (me.hp <= 0) return;
    if (!pfm.allow_busy && me.is_busy) return me.notify("你现在手忙脚乱，无法使用" + name + "。");
    if (me.is_faint && !pfm.allow_faint) return me.send("你正在昏迷中。");
    if (!pfm.use_type && !me.is_fighting()) return me.notify(name + "只能在战斗中使用。");
    if (pfm.use_type == 1 && me.is_fighting()) return me.notify("战斗中无法使用" + name + "。");


    var lv = me.query_skill(sp_skill.id, 0);
    if (is_ref) lv = parseInt(lv / 2);
    if (me.mp < pfm.query_mp(me, lv)) {
        return me.notify("你的内力不够，无法使用" + name);
    }
    if (pfm.check?.(me, lv, sk) === false) return;

    if (pfm.enable_skill && pfm.enable_skill != sk) {
        return me.notify(name + "需要装备为" + (SKILL.get(pfm.enable_skill)?.name ?? pfm.enable_skill) + "才可以使用。");
    }
    if (sk === "throwing" && !me.can_throwing()) {
        return me.notify("你没有装备暗器，无法使用" + name);
    }

    if (pfm.weapon_type) {
        if (pfm.weapon_type != me.query_weapon_type())
            return me.notify("你装备的武器不对，无法使用" + name);
    } else {
        let need_weapon = WEAPON[sk];
        if (need_weapon && need_weapon !== me.query_weapon_type()) {
            return me.notify("你装备的武器不对，无法使用" + name);
        }
        // if (!NOWEAPON[pfm.enable_skill]) {
        //     if (pfm.enable_skill != me.query_weapon_type()) {
        //         return me.notify("你装备的武器不对，无法使用" + name);
        //     }
        // }
    }
    if (!pfm.no_check && pfm.check?.(me, lv) === false) {
        return;
    }
    var key = "pfm/" + sk + "/" + pfmid;
    if (me.query_temp(key)) {
        return me.notify(pfm.name + "还没准备好，你还不能使用。");
    }
    var target = me.query_enemy();
    if (!pfm.use_type) {
        if (!target) return me.notify("你要用绝招对付谁？");

    }

    var now = Date.now();
    if (me.release_time && now < me.release_time)//上个技能还没释放完
    {
        return me.notify("你上个技能还没释放完成。");
    }


    var isrelease = false;

    if (me.query_prop('no_pfm')) {

        me.send_room("<red>$N释放技能" + pfm.name + "，但是没有产生任何效果。</red>\n");
        me.remove_status('bikou');
        isrelease = true;
    } else if (target && target.parry_skill && target.parry_skill.on_parry_pfm) {
        isrelease = target.parry_skill.on_parry_pfm(target, me, pfm, lv, sk);

    } else {
        if (pfm.is_weapon && sp_skill != me.attack_skill) {
            //me.attack_skill = sp_skill;
            me.remove_status('weapon', true);
        }
        isrelease = pfm.use?.(me, target, lv, sk) !== false;
    }




    if (isrelease) {
        me.add_mp(-(pfm.query_mp?.(me, lv) ?? 0));
        //释放成功才算释放时间
        // if (!pfm.use_type) {
        //     //保存目标被释放的技能
        //     me.set_temp("used_pfm", pfm.id, 20000);
        // }
        me.set_temp("used_pfm", pfm.id, 20000);
        var time = pfm.query_releasetime?.(me, lv) ?? 0;
        if (time) me.release_time = time + now;
        else me.release_time = 0;

        var distime = pfm.query_distime?.(me, lv, is_ref) ?? 0;
        var rtime = isrelease ? (pfm.query_releasetime?.(me, lv) ?? 0) : 0;

        me.set_temp(key, 1, distime + rtime);
        me.notify('{type:"dispfm",id:"' + sk + "." + pfmid + '",rtime:'
            + rtime + ',distime:' + (distime + rtime) + '}');
        if (pfm.is_weapon && sp_skill != me.attack_skill) {
            me.attack_skill = sp_skill;
            me.remove_status('weapon', true);
        }

    }

}
}

const NOWEAPON = {
    "force": true,
    "unarmed": true, "dodge": true,
    "parry": true, throwing: true
};
const WEAPON = {
    sword: "sword",
    blade: "blade",
    staff: "staff",
    club: "club",
    whip: "whip"
};
