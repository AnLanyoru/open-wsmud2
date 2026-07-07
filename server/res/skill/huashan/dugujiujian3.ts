import {SKILL} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type { PropMap } from "../../../types/props.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

/**
 * 独孤九剑隐藏分支 (品级6)
 * 完善度50
 */
export default class extends SKILL {
    name = "独孤九剑";
    id = "dugujiujian3";
    grade = 6;
    family = FAMILIES.HUASHAN;
    is_hidden = true;
    desc = "为独孤求败所创，以无招胜有招的宗旨胜破天下武功。";
    can_enables = ["sword","parry"];
    attack_actions = SKILL.get("dugujiujian")?.attack_actions || [];
    parry_actions = SKILL.get("dugujiujian")?.parry_actions || [];
    attack_actions2 = (SKILL.get("dugujiujian") as any)?.attack_actions2 || [];
    parry_msg2 = (SKILL.get("dugujiujian") as any)?.parry_msg2 || [];

    query_attack_action(me: CHARACTER): string {
        if (me.query_temp("sk_dg_wz", 0)) {
            return (this.attack_actions2 as string[]).random();
        }
        return (this.attack_actions as string[]).random();
    }

    query_prop(lv: number, me?: CHARACTER): PropMap {
        return {
            add_sh_per: 5 + int(lv / 300),
        };
    }

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 10 + lv * 2,
                gjsd: 300,
                bj_per: 2 + int(lv / 400),
                mz: 10 + lv * 2,
            },
            parry: {
                zj: 10 + lv * 2,
                str: 1 + int(lv / 3),
                dex: 1 + int(lv / 3),
                desc: "破解招架敌人招式后立刻反击敌人",
            },
        };
    }

    pfm_set: PerformData = {
        wu: {
            name: "无招",
            distime: 28500,
            enable_skill: "sword",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const time: number = 5000 + lv * 10;
                const gj: number = 30 + int(lv / 100);
                const mz: number = 15 + int(lv / 200);
                me.send_room("<him>$N双目微阖，周身剑意翻涌，竟已臻至无招无形、无我无剑之化境！</him>\n", target);
                me.add_status({
                    id: "weapon",
                    name: "无招",
                    desc: "招式无迹可寻，出招如电",
                    duration: time,
                    prop: {
                        gjsd_per: 100,
                        gj_per: gj,
                        mz_per: mz,
                    },
                    on_attach: (p: CHARACTER) => p.set_temp("sk_dg_wz", 1, time),
                    on_expire: (p: CHARACTER) => p.remove_temp("sk_dg_wz"),
                    finish_msg: "$N剑意缓缓收敛，从无招之境退了出来。",
                });
                me.reauto_attack();
            },
            query_desc: function(me: CHARACTER, lv: number): string {
                const time: number = 5000 + lv * 10;
                const gj: number = 30 + int(lv / 100);
                const mz: number = 15 + int(lv / 200);
                return "独孤九剑之无招胜有招，" + toSec(time) + "秒内你的招式无迹可寻使敌人难以破解，出招速度加快到极限，增加" + gj + "%攻击，" + mz + "%命中。";
            },
        },
        pojian: {
            name: "破字诀",
            distime: 28500,
            enable_skill: "parry",
            mp: 20,
            release_time: 500,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                let time: number = 3000 + lv * 5;
                if (time > 10000) time = 10000;
                const zj: number = 100;
                me.send_room("<HIW>$N剑尖斜指，随意挥洒，招招从出其不意的方位直指$n招式中的破绽！</HIW>\n", target);
                me.add_status({
                    id: "parry",
                    name: "破招",
                    desc: "独孤九剑之破字诀，大幅提升招架几率，招架成功时反击威力大增",
                    duration: time,
                    prop: {
                        zj_per: zj,
                    },
                    on_attach: (p: CHARACTER) => p.set_temp("sk_dg_pz", 1, time),
                    on_expire: (p: CHARACTER) => p.remove_temp("sk_dg_pz"),
                    finish_msg: "$N破字诀剑意渐散，剑势复归平常。",
                });
                me.reauto_attack();
            },
            query_desc: function(me: CHARACTER, lv: number): string {
                let time: number = 3000 + lv * 5;
                if (time > 10000) time = 10000;
                return "天下武功，无招不破，使用后你在" + toSec(time) + "秒内大幅增加你的招架几率，招架成功后立即强力反击";
            },
        },
        poqi: {
            name: "破气诀",
            distime: 19000,
            enable_skill: "sword",
            mp: 20,
            release_time: 3000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const sh: number = me.do_attack({
                    target: target,
                    attack_msg: "<hib>$N脚踏玄步，施出独孤九剑「破气式」，$W如白虹贯日，直刺$n气海！</hib>",
                    miss_msg: "<CYN>然$n识得此招厉害，不敢硬接，急退数丈避了开去。</CYN>",
                    no_parry: true,
                    damage_msg: "<hir>$n气门被$N一剑戳中，只觉丹田剧痛，全身真气如潮水般狂泻而出！</hir>",
                });
                if (sh) {
                    target.add_mp(-int(lv / 6));
                    let time: number = 3000 + lv * 10;
                    if (time > 16000) time = 16000;
                    target.add_status({
                        id: "busy",
                        is_busy: true,
                        name: "忙乱",
                        downside: true,
                        desc: "你处于忙乱状态，无法攻击、招架",
                        duration: time,
                    }, me);
                }
                me.end_attack(target);
            },
            query_desc: function(me: CHARACTER, lv: number): string {
                let time: number = 3000 + lv * 10;
                if (time > 16000) time = 16000;
                return "独孤九剑之破气式，精准攻击敌方气海要穴，无法招架，命中后减少敌人" + int(lv / 6) + "内力，并使敌人忙乱" + toSec(time) + "秒。";
            },
        },
    };

    // 招架反击
    on_parry_over(me: CHARACTER, target: CHARACTER, par: DoAttackPar): void {
        if (par.is_parried) {
            if (!me.query_temp("sk_dg_pr", 0)) {
                const isPozi: boolean = !!me.query_temp("sk_dg_pz", 0);
                const base_gj: number = me.gj / 2 + me.random(me.gj / 2);
                const gj: number = isPozi ? base_gj * 2 : base_gj;
                const msg: string = isPozi
                    ? "<hir>$N「破字诀」剑意勃发，$W化作漫天剑影，悍然反噬$n！</hir>"
                    : this.parry_msg2.random();
                me.do_attack({
                    target: target,
                    attack_msg: msg,
                    gj: gj,
                    mz: me.mz,
                });
                me.end_attack(target);
                me.set_temp("sk_dg_pr", 1, 100);
            }
        }
    }
}

// ========== 公共计算函数 ==========

/** 无招持续时间 */
export function wu_time(lv: number): number {
    return 5000 + lv * 10;
}

/** 无招攻击百分比 */
export function wu_gj(lv: number): number {
    return 30 + int(lv / 100);
}

/** 无招命中百分比 */
export function wu_mz(lv: number): number {
    return 15 + int(lv / 200);
}

/** 破字诀持续时间 */
export function pozi_time(lv: number): number {
    const t: number = 3000 + lv * 5;
    return t > 10000 ? 10000 : t;
}

/** 破气诀忙乱时间 */
export function poqi_busy(lv: number): number {
    const t: number = 3000 + lv * 10;
    return t > 16000 ? 16000 : t;
}
