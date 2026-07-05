import {SKILL} from "../../../../core/skill/skill.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "披麻泼墨";
    id = "pimapomo";
    grade = 4;

    desc = "梅庄四庄主丹青生所创武功，将泼墨画技与披麻皴法融入功法，招架时如笔墨流转，化去攻势";
    can_enables = ["parry"];
    slots = [
        {
            prop: 'pmfs_sc',
            value: (_lv: number) => 10,
            format: (_val: number) => '反势可累计的伤害延长2秒',
        },
        {
            prop: 'pmcs_mz',
            value: (_lv: number) => 10,
            format: (_val: number) => '缠势的判定成功的命中有效值增加20%',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            parry: {
                zj: Math.floor(lv * 1.83),
                fy: Math.floor(lv * 1.82),
                diff_bj: Math.min(10, 2 + Math.floor((lv - 1) / 500)),
            },
        };
    }

    pfm_set: PerformData = {
        fan: {
            name: "反势",
            distime: 35000,
            enable_skill: "parry",
            mp: 40,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const recentDmg = me.query_temp("sk/pm/recent_dmg", 0);
                me.remove_temp("sk/pm/recent_dmg");
                const maxPct = get_fanshi_max_pct(lv);
                const gj = Math.max(me.gj, Math.min(me.gj * maxPct / 100, recentDmg));
                me.send_room("<HIM>$N身随墨转，将方才所受攻势尽数化入笔意，披麻皴法一气挥洒，如泼墨山水般朝$n反卷而去！</HIM>", target);
                me.do_attack({
                    target: target,
                    gj: gj,
                    mz: me.mz,
                });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number): string {
                const sec = get_fanshi_window(lv);
                const maxPct = get_fanshi_max_pct(lv);
                return `将你最近${sec}秒内受到伤害一次性反击给当前敌人，范围在100-${maxPct}%攻击力之间`;
            },
        },
        chan: {
            name: "缠势",
            distime: 40000,
            enable_skill: "parry",
            mp: 70,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = get_chanshi_duration(lv);
                const sdReduce = get_chanshi_sd_reduce(lv);
                const fyReduce = get_chanshi_fy_reduce(lv);
                me.send_room("<HIG>$N剑势如墨线蜿蜒，披麻皴法层层递进，以连绵不绝的笔意将$n笼罩其中，令其如陷墨海，步履维艰。</HIG>", target);
                target.add_status({
                    id: "chan",
                    name: "缠势",
                    downside: true,
                    duration: duration,
                    desc: `被披麻泼墨剑势缠绕，攻击速度降低${sdReduce}%，防御降低${fyReduce}。`,
                    prop: {
                        gjsd_per: -sdReduce,
                        fy: -fyReduce,
                    },
                }, me);
            },
            query_desc: function(me: CHARACTER, lv: number): string {
                const sec = toSec(get_chanshi_duration(lv));
                return `以剑势缠绕目标${sec}秒，使其攻击速度降低${get_chanshi_sd_reduce(lv)}%，防御降低${get_chanshi_fy_reduce(lv)}。`;
            },
        },
    };

    on_damage(me: CHARACTER, sh: number, _from: CHARACTER): number {
        const lv = me.query_skill("pimapomo", 0);
        if (lv <= 0) return sh;
        const window = get_fanshi_window(lv) * 1000 + 3000;
        const current = me.query_temp("sk/pm/recent_dmg", 0);
        me.set_temp("sk/pm/recent_dmg", current + sh, window);
        return sh;
    }
}

// ========== 公共计算函数 ==========

function get_fanshi_window(lv: number): number {
    return 2 + int(lv / 1000);
}

function get_fanshi_max_pct(lv: number): number {
    return 1000 + int(lv / 10);
}

function get_chanshi_duration(lv: number): number {
    return 8000 + int(lv / 1000) * 1000;
}

function get_chanshi_sd_reduce(lv: number): number {
    return 20 + int(lv / 500);
}

function get_chanshi_fy_reduce(lv: number): number {
    return lv * 2;
}
