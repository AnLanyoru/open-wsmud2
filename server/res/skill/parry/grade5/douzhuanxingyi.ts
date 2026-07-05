import {SKILL, PERFORM} from "../../../../core/skill/skill.js";
import type {PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "斗转星移";
    id = "douzhuanxingyi";
    grade = 5;

    desc = "姑苏慕容的绝技，以彼之道还施彼身";
    can_enables = ["parry"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            parry: {
                zj: Math.floor(lv * 2.2),
                fy: Math.floor(lv * 2.2),
                diff_bj: 4,
                dex: 3 + Math.floor(lv * 0.33),
            },
        };
    }

    pfm_set: PerformData = {
        xing: {
            name: "星移",
            distime: 30000,
            enable_skill: "parry",
            mp: 50,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration = get_xingyi_duration(lv);
                const zjPer = get_xingyi_zj_per(lv);
                me.send_room("<HIO>$N双掌虚抱，劲力暗转，周身真气如星河倒悬，已将斗转星移之势布于四方。</HIO>", target);
                me.add_status({
                    id: "xingyi",
                    name: "星移",
                    duration: duration,
                    desc: `招架提升${zjPer}%，招架成功后将伤害反震给敌人。`,
                    prop: {
                        zj_per: zjPer,
                    },
                    on_expire: function(p: CHARACTER): void {
                        p.remove_temp("sk/dz/xingyi");
                    },
                });
                me.set_temp("sk/dz/xingyi", 1, duration);
            },
            query_desc: function(me: CHARACTER, lv: number): string {
                const sec = toSec(get_xingyi_duration(lv));
                return `${sec}秒内，增加你${get_xingyi_zj_per(lv)}%的招架，招架成功后将伤害的${get_xingyi_reflect_per(lv)}%转移给敌人`;
            },
        },
        dou: {
            name: "斗转",
            distime: 30000,
            enable_skill: "parry",
            mp: 90,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const effectPer = get_douzhuan_effect_per(lv);
                const lastInfo = me.query_temp("sk/dz/last_pfm", null) as { name: string; level: number } | null;
                const pfmName = lastInfo ? lastInfo.name : "绝招";
                me.send_room(`<HIO>$N眸光一闪，已窥破$n武学关窍，竟以彼之道还施彼身——「${pfmName}」之势反卷而回！</HIO>`, target);
                const gj = Math.floor(me.gj * effectPer / 100);
                me.do_attack({
                    target: target,
                    gj: gj,
                    mz: me.mz,
                });
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number): string {
                return `使用前一个攻击你的武器或拳脚绝招攻击敌人，效果是你斗转星移等级的${get_douzhuan_effect_per(lv)}%`;
            },
        },
    };

    on_parry_pfm(me: CHARACTER, target: CHARACTER, pfm: PERFORM, level: number, _sk?: string): boolean {
        // 记录敌人使用的绝招信息，供斗转使用
        if (pfm.name) {
            me.set_temp("sk/dz/last_pfm", { name: pfm.name, level: level }, 30000);
        }
        return false; // 不阻止绝招
    }

    on_parry_over(me: CHARACTER, target: CHARACTER, par: DoAttackPar): void {
        if (!par.is_parried) return;
        if (!me.query_temp("sk/dz/xingyi", 0)) return;
        // 星移状态：招架成功后将伤害反震给敌人
        const lv = me.query_skill("douzhuanxingyi", 0);
        if (lv <= 0) return;
        const reflectPer = get_xingyi_reflect_per(lv);
        const reflectDmg = Math.floor(me.gj * reflectPer / 100);
        me.send_room("<HIO>$N借力打力，将$n的攻势尽数逆转，斗转星移之下，劲力反噬而回！</HIO>", target);
        me.do_attack({
            target: target,
            gj: reflectDmg,
            mz: me.mz,
            no_append: true,
            no_append_target: true,
        });
        me.end_attack(target);
    }
}

// ========== 公共计算函数 ==========

function get_xingyi_duration(lv: number): number {
    return 5000 + lv * 5;
}

function get_xingyi_zj_per(lv: number): number {
    return 30 + int(lv / 100);
}

function get_xingyi_reflect_per(lv: number): number {
    return 100 + int(lv / 20);
}

function get_douzhuan_effect_per(lv: number): number {
    return Math.min(100, 80 + int(lv / 40));
}
