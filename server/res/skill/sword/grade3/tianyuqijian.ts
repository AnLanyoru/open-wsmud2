import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "天羽奇剑";
    id = "tianyuqijian";
    grade = 3;

    desc = "飘渺峰灵鹫宫的剑法绝技";
    can_enables = ["sword"];
    attack_actions = [
        "$N手中$w一抖，剑光如<HIM>天羽</HIM>飘落，轻盈灵动中暗藏杀机，直取$n$l",
        "$N$w斜刺，剑势飘忽如<HIM>飞絮</HIM>，在天光云影中变幻莫测，令$n难以捉摸",
        "$N身形一转，$w化作<HIM>数道虹影</HIM>，剑光交织如天罗地网，罩向$n周身",
        "$N$w连刺，剑光如<HIM>流星</HIM>划过天际，瞬息之间已攻至$n面前",
        "$N长剑挥洒，剑意如<HIM>天女散花</HIM>，漫天剑影纷纷扬扬落向$n的$l"
    ];
    slots = [
        {
            prop: 'tnsf_fy',
            value: (lv: number) => 10,
            format: (val: number) => '天女散花无视对方防御10%',
        },
        {
            prop: 'tyj_gj',
            value: (lv: number) => 10,
            format: (val: number) => '天羽诀额外附加30%攻击力',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: Math.floor(lv * 1.32),
                mz: Math.floor(lv * 1.22),
                bj_per: 5,
            },
        };
    }

    pfm_set: PerformData = {
        tian: {
            name: "天女散花",
            distime: 20000,
            enable_skill: "sword",
            mp: 37,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var targetFy = target.fy || 0;
                var baseCount = calcTNSFBaseCount(lv);
                var count = baseCount + int((1000 - targetFy) / 200);
                if (count < 3) count = 3;
                if (count > 10) count = 10;
                me.send_room("<HIM>$N手中$W一振，剑光化作漫天飞花，如天女散花般纷纷扬扬罩向$n！</HIM>", target);
                for (var i = 0; i < count; i++) {
                    me.do_attack({
                        target: target,
                        gj: me.gj,
                        mz: me.mz,
                        attack_before: i > 0 ? "<HIM>剑花纷飞，紧跟着又是一剑</HIM>" : undefined,
                    });
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var baseCount = calcTNSFBaseCount(lv);
                return "进行数次攻击，敌人的防御越低抵挡的数量越少，基础攻击" + baseCount + "次";
            },
        },
        yu: {
            name: "天羽诀",
            distime: 15000,
            enable_skill: "sword",
            mp: 48,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var per = calcTYJPer(lv);
                me.send_room("<HIM>$N清啸一声，施出天羽四奇剑——梅兰竹菊四剑齐出，剑气纵横交错，天地为之变色！</HIM>", target);
                var swords = [
                    { name: "<HIR>梅剑</HIR>", diff_fy: 100, msg: "<HIR>$N剑如寒梅傲雪，剑气破空，无视$n防御！</HIR>" },
                    { name: "<HIG>兰剑</HIG>", no_parry: true, msg: "<HIG>$N剑如幽兰空谷，剑势飘忽，$n无法招架！</HIG>" },
                    { name: "<HIY>竹剑</HIY>", msg: "<HIY>$N剑如翠竹凌云，剑光万道，$n无从躲闪！</HIY>", mz_bonus: true },
                    { name: "<HIW>菊剑</HIW>", bj: 100, msg: "<HIW>$N剑如秋菊傲霜，剑芒暴长，必定暴击！</HIW>" },
                ];
                for (var i = 0; i < 4; i++) {
                    var sw = swords[i];
                    var opt: any = {
                        target: target,
                        gj: me.gj * per / 100,
                        mz: me.mz,
                        attack_msg: sw.msg,
                    };
                    if (sw.diff_fy) opt.diff_fy = sw.diff_fy;
                    if (sw.no_parry) opt.no_parry = true;
                    if (sw.mz_bonus) opt.mz = me.mz * 10;
                    if (sw.bj) opt.bj = sw.bj;
                    me.do_attack(opt);
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var per = calcTYJPer(lv);
                return "使用天羽四奇剑攻击敌人，梅剑：无视防御，兰剑：无法招架，竹剑：无法躲闪，菊剑：必定暴击，每剑造成" + per + "%伤害";
            },
        },
    };
}

function calcTNSFBaseCount(lv: number): number {
    return 3 + int(lv / 200);
}

function calcTYJPer(lv: number): number {
    return 100 + int(lv / 50);
}
