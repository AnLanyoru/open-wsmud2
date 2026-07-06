import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";
import type { PropMap } from "../../../types/props.js";
import type { PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

/**
 * 独孤剑诀 (品级6 终极)
 * 完善度50
 */
export default class extends SKILL {
    name = "独孤剑诀";
    id = "dugujiujian4";
    grade = 6;
    family = FAMILIES.HUASHAN;
    is_ultimate = true;
    desc = "上古剑门镇派之术，无剑无我，手持天地";
    can_enables = ["sword"];
    attack_actions = SKILL.get("dugujiujian")?.attack_actions || [];
    attack_actions2 = (SKILL.get("dugujiujian") as any)?.attack_actions2 || [];

    query_attack_action(me: CHARACTER): string {
        if (me.query_temp("weapon", 0) || me.query_temp("jianyi", 0)) {
            return (this.attack_actions2 as string[]).random();
        }
        return (this.attack_actions as string[]).random();
    }

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: lv * 3,
                gjsd: 300,
                add_sh_per: 5 + int(lv / 200),
                mz_per: 5 + int(lv / 200),
                bj_per: 2 + int(lv / 400),
                desc: "无剑：你的剑无法被卸下\n无我：战斗中进入忘我境界，持续提高你的战斗力",
            },
        };
    }

    pfm_set: PerformData = {
        jianyi: {
            name: "剑意",
            distime: 30000,
            enable_skill: "sword",
            mp: 1890,
            release_time: 500,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                let time: number = 5000 + lv * 2;
                if (time > 15000) time = 15000;
                const per: number = 50 + int(lv / 50);
                me.send_room("<him>$N闭目凝神，周身剑气凛然——独孤剑诀·剑意！刹那间剑心通明，天地万物皆可为剑。</him>\n", target);
                me.add_status({
                    id: "weapon",
                    name: "剑意",
                    desc: "剑心通明，无坚不摧",
                    duration: time,
                    prop: {
                        gjsd_per: 100,
                        add_sh_per: per,
                        mz_per: per,
                        zj_per: per,
                    },
                    finish_msg: "$N剑意渐散，缓缓归于平静。",
                });
                me.set_temp("jianyi", 1, time);
                me.reauto_attack();
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                let time: number = 5000 + lv * 2;
                if (time > 15000) time = 15000;
                const per: number = 50 + int(lv / 50);
                return "独孤剑诀之剑意，" + toSec(time) + "秒内你的招式无迹可寻使敌人难以破解，出招速度加快到极限，增加" + per + "%最终伤害，命中，招架几率。";
            },
        },
        jianlai: {
            name: "剑来",
            distime: 60000,
            enable_skill: "sword",
            mp: 2150,
            release_time: 4000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const duration: number = 8000 + int(lv / 1000) * 1000;
                me.send_room("<HIM>$N举剑向天，沉声喝道：「剑来！」霎时间万剑齐鸣，天地大道凝兵而至，环绕$N周身！</HIM>\n", target);
                // 飞剑每轮攻击附带真实伤害
                me.add_status({
                    id: "jianlai",
                    name: "剑来",
                    desc: "飞剑环绕，攻击附带真实伤害",
                    duration: duration,
                    finish_msg: "$N周身剑气散去，飞剑化作流光没入虚空。",
                });
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const duration: number = 8000 + int(lv / 1000) * 1000;
                let sh_per: number = 50 + int(lv / 100);
                if (sh_per > 100) sh_per = 100;
                return "召唤飞剑攻击附近敌人，飞剑持续" + toSec(duration) + "秒，你的攻击会对敌人造成" + sh_per + "%攻击力的真实伤害";
            },
        },
    };

    // 攻击时附带剑来伤害
    on_attack(me: CHARACTER, target: CHARACTER, par: DoAttackPar): number {
        if (me.query_status("jianlai")) {
            let sh_per: number = 50 + int(me.query_skill("dugujiujian4", 0) / 100);
            if (sh_per > 100) sh_per = 100;
            const real_dmg = int(me.gj * sh_per / 100);
            target.damage3(real_dmg, me);
            me.send_room("<WB-HIC>一道剑影划过，$n的身上多出一道莫名伤口，受到" + real_dmg + "点真实伤害！</WB-HIC>", target);
        }
        return 0;
    }
}

// ========== 公共计算函数 ==========

/** 剑意持续时间 */
export function jianyi_time(lv: number): number {
    const t: number = 5000 + lv * 2;
    return t > 15000 ? 15000 : t;
}

/** 剑意百分比加成 */
export function jianyi_per(lv: number): number {
    return 50 + int(lv / 50);
}

/** 剑来持续时间 */
export function jianlai_time(lv: number): number {
    return 8000 + int(lv / 1000) * 1000;
}

/** 剑来伤害百分比 */
export function jianlai_sh_per(lv: number): number {
    const p: number = 50 + int(lv / 100);
    return p > 100 ? 100 : p;
}
