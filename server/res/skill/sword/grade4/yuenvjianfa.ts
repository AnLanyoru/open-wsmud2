import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import {SKILL_TYPES, WEAPON_TYPE} from "../../../../core/const.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "越女剑法";
    id = "yuenvjianfa";
    grade = 4;

    desc = "传说是古代一位女子所创，剑势轻盈灵动如猿猱穿林，迅捷中暗藏杀机。";
    can_enables = ["sword"];
    attack_actions = [
        "$N身形一纵，如灵猿穿林，一招「<HIG>灵猿探月</HIG>」，$w疾点$n的$l",
        "$N忽地翻身倒纵，$w自腋下穿出，正是「<HIY>白猿献果</HIY>」，剑光一闪直取$n",
        "$N脚步轻点，身法飘逸如猿猱，一招「<HIC>猿臂轻舒</HIC>」，$w如电刺向$n的$l",
        "$N身形急转，$w化作一团银光，正是「<HIM>越女穿林</HIM>」，剑影重重罩向$n",
        "$N凌空翻身，头下脚上，一招「<HIW>猿攀绝壁</HIW>」，$w自下而上挑向$n的$l",
        "$N身形一晃，化作数道残影，正是「<HIG>群猿逐月</HIG>」，数道剑光同时刺向$n的$l",
        "$N一声清啸，$w直进中宫，使出「<HIY>白虹贯日</HIY>」，剑光如练直贯$n",
        "$N身剑合一，如灵猿跃涧，一招「<HIC>越女击剑</HIC>」，剑光快如闪电刺向$n的$l"
    ];
    learn_condition = {
        max_mp: 15000,
        skill: {
            sword: 300
        }
    };
    slots = [
        {
            prop: 'yn_lengque',
            value: (lv: number) => 10,
            format: (val: number) => '猿跃式每多命中一个敌人减少5秒冷却',
        },
        {
            prop: 'yn_zhuijia',
            value: (lv: number) => 10,
            format: (val: number) => '破竹式追加次数增加3次',
        },
        {
            prop: 'yn_baoji',
            value: (lv: number) => 10,
            format: (val: number) => '破竹式附加额外的暴击率13%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 16 + Math.floor(lv * 1.1),
                mz: 2 + Math.floor(lv * 1.82),
                dex: Math.floor(lv * 0.14),
                diff_fy_per: 6,
            },
        };
    }

    pfm_set: PerformData = {
        yuan: {
            name: "猿跃式",
            distime: 30000,
            enable_skill: "sword",
            mp: 75,
            release_time: 1000,
            attack_msgs: [
                "<hiy>$N身形一纵，如灵猿跃涧，$w直刺$n的$l</hiy>",
                "<hiy>$N翻身疾进，$w如白猿献果，疾点$n</hiy>",
                "<hiy>$N凌空倒翻，$w自下而上撩向$n</hiy>",
                "<hiy>$N身形一晃，$w化作数道残影罩向$n</hiy>",
                "<hiy>$N如猿猱般腾挪，$w连绵不绝地攻向$n</hiy>",
            ],
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var self = this as PERFORM;
                var count = calcYuanyueCount(lv);
                var extra = Math.floor(me.query_prop("dex") / 20);
                count += extra;
                if (count > 10) count = 10;
                me.send_room("<hiy>$N清啸一声，身如灵猿纵跃，$w化作漫天剑影，向$n发起连绵攻势！</hiy>\n", target);
                for (var i = 0; i < count; i++) {
                    me.do_attack({
                        target: target,
                        attack_msg: self.attack_msgs![i % self.attack_msgs!.length],
                    });
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var count = calcYuanyueCount(lv);
                return "灵猿纵跃般发动" + count + "段突袭，身法越高攻击次数越多。";
            },
        },
        po: {
            name: "破竹式",
            distime: 10000,
            enable_skill: "sword",
            mp: 90,
            release_time: 1500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number) {
                var maxExtra = calcPozhuMaxExtra(lv);
                var diffFy = calcPozhuDiffFy(lv);
                me.send_room("<hiw>$N$w急振，剑势如破竹般连绵不绝，一击得手后更不罢休！</hiw>\n", target);
                var extraCount = 0;
                for (var i = 0; i <= maxExtra; i++) {
                    var sh = me.do_attack({
                        target: target,
                        gj: me.gj,
                        mz: me.mz,
                        diff_fy: diffFy * i,
                        attack_msg: (i === 0 ? "<hiw>$N一剑直刺，势如破竹</hiw>" : "<hiw>$N得势不饶人，连环追击！</hiw>"),
                    });
                    if (sh && me.random(100) < 50 + Math.floor(lv / 20)) {
                        extraCount++;
                    } else {
                        break;
                    }
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number) {
                var maxExtra = calcPozhuMaxExtra(lv);
                var diffFy = calcPozhuDiffFy(lv);
                return "暴击后会继续追加攻击，每次叠加" + diffFy + "%忽视防御，每追加一次增加5秒冷却，最多追加" + maxExtra + "次";
            },
        },
    };
}

function calcYuanyueCount(lv: number): number {
    return 3 + Math.floor(lv / 200);
}

function calcPozhuMaxExtra(lv: number): number {
    const e = 1 + Math.floor(lv / 300);
    if (e > 4) return 4;
    return e;
}

function calcPozhuDiffFy(lv: number): number {
    const d = 6 + Math.floor(lv / 50);
    if (d > 30) return 30;
    return d;
}
