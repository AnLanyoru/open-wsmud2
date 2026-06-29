import { SKILL } from "../../../core/skill/skill.js";
import { WEAPON_TYPE } from "../../../core/const.js";
import { FAMILIES } from "../../../core/skill/family.js";
import type { PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "小无相功";
    id = "xiaowuxianggong2";
    source_skill = "xiaowuxianggong";
    grade = 5;
    force_rad = 0.75;
    family = FAMILIES.XIAOYAO;
    desc = "逍遥派的一门奇特武功，其主要特点是不着形相，无迹可寻，可以模仿别人的绝学";
    can_enables = ["sword", "unarmed", "force"];

    attack_actions = [
        "$N挥拳攻击$n的$l", "$N往$n的$l一抓", "$N往$n的$l狠狠地踢了一脚",
        "$N提起拳头往$n的$l捶去", "$N对准$n的$l用力挥出一拳"
    ];
    attack_actions2 = [
        "$N用$W往$n的$l刺去", "$N用$W往$n的$l砍去", "$N挥动$W,斩向$n的$l"
    ];

    query_attack_action(me: CHARACTER, _target: CHARACTER): string {
        const type: string = me.query_weapon_type();
        if (type === WEAPON_TYPE.NONE)
            return this.attack_actions.random();
        return this.attack_actions2.random();
    }

    query_enable_prop(lv: number): EnablePropMap {
        const attr: number = 2 + Math.floor(lv / 3);
        return {
            force: {
                str: attr,
                dex: attr,
                con: attr,
                limit_mp: lv * 300,
                desc: "唯一：将你内力的75%转化为气血",
            },
            unarmed: {
                str: attr,
                dex: attr,
                con: attr,
            },
            sword: {
                str: attr,
                dex: attr,
                con: attr,
            },
        };
    }

    pfm_set: PerformData = {
        wux: {
            name: "无相",
            distime: 20000,
            mp: 40,
            no_copy: true,
            allow_busy: true,
            release_time: 4000,
            query_name(_me: CHARACTER, type: string): string {
                if (!type) return this.name!;
                return "无相" + ALLOW_TYPES.get(type);
            },
            use(me: CHARACTER, target: CHARACTER, lv: number, sk: string): void | boolean {
                const prev: string = target.query_temp("used_pfm", String(''));
                if (!prev) return me.notify_fail("<cyn>" + target.name + "最近没有使用绝招，你无法模仿。</cyn>");
                const str: string[] = prev.split("/");
                const spSkill = SKILL.get(str[0]);
                if (!spSkill) {
                    return me.notify_fail("没有这个技能。");
                }
                if (spSkill.grade > 5)
                    return me.notify_fail("对方使用的武功太高深，你无法模仿。");
                const pfm = spSkill.get_pfm(str[1]);
                if (!pfm) {
                    return me.notify_fail(spSkill.name + "没有这个绝招。");
                }
                if (pfm.no_copy) return me.notify_fail("这个绝招不能模仿。");
                if (me.is_busy && !pfm.allow_busy) return me.notify_fail("你现在正手忙脚乱，无法模仿别人的技能。");

                let isEnable: boolean = false;
                if (pfm.enable_skill) {
                    if (sk === pfm.enable_skill) {
                        isEnable = true;
                    } else {
                        return me.notify_fail(this.query_name(me, sk) + "不能模仿" + pfm.name + "。");
                    }
                }

                const up: number = Math.min(60 + Math.floor(lv / 40), 100);
                me.use_pfm(target, pfm, Math.floor(up * lv / 100), sk);

                if (sk !== 'force'
                    && spSkill.grade <= 5
                    && isEnable
                    && !me.is_in("yz/leitai/leitai")
                    && spSkill.family !== FAMILIES.MONSTER) {
                    me.send(`{type:"warn",content:"你学会了绝招【${pfm.name}】，是否记录到【无我】？",time:60000,cmds:[{cmd:"xwxcopy ${pfm.enable_skill}",name:"记录"},{cmd:"",name:"放弃"}]}`);
                    me.set_temp('copy_pfm', prev, 60000);
                }
            },
            query_desc(_me: CHARACTER, lv: number): string {
                const up: number = Math.min(60 + Math.floor(lv / 40), 100);
                return "模仿敌人的上一个绝招，效果是你小无相功等级的" + up + "%，如果你的小无相品阶不低于对方技能的品阶并且是武器技能，你将学会这个绝招";
            },
        },
        wuwo: {
            name: "无我",
            distime: 20000,
            mp: 40,
            no_copy: true,
            allow_busy: true,
            release_time: 4000,
            check: (_me: CHARACTER, _lv: number, base_type?: string) => base_type !== 'force',
            query_name(_me: CHARACTER, type: string): string {
                if (!type) return this.name!;
                return "无我" + ALLOW_TYPES.get(type);
            },
            query_releasetime(me: CHARACTER, lv: number): number {
                return me.query_temp("wuwo_gcd", this.release_time!);
            },
            query_distime(me: CHARACTER, lv: number, isref?: boolean) {
                let dis = me.query_temp("wuwo_cd", this.distime!);
                if (isref) dis *= SKILL.REF_CD;
                return dis;
            },
            use(me: CHARACTER, target: CHARACTER, lv: number, sk: string): void | boolean {
                const prev: string = me.query_temp("cp2_pfm_" + sk, String(''));
                const baseSkill = SKILL.get(sk);
                if (!baseSkill) return;
                if (!prev) {
                    return me.notify_fail("<cyn>你最近没有模仿并学会任何绝招，无法使用装备为【" + baseSkill.name + "】的无我。</cyn>");
                }
                const str: string[] = prev.split("/");
                const spSkill = SKILL.get(str[0]);
                if (!spSkill) {
                    return me.notify_fail("没有这个技能。");
                }
                if (spSkill.family === FAMILIES.MONSTER) return me.notify_fail("怪物专属技能无法模仿。");
                if (spSkill.grade > 5) return me.notify_fail("对方使用的武功太高深，你无法模仿。");
                const pfm = spSkill.get_pfm(str[1]);
                if (!pfm) {
                    return me.notify_fail(spSkill.name + "没有这个绝招。");
                }
                if (pfm.no_copy) return me.notify_fail("这个绝招不能模仿。");
                if (me.is_busy && !pfm.allow_busy) return me.notify_fail("你现在正手忙脚乱，无法模仿别人的技能。");

                if (sk === "sword" && me.query_weapon_type() !== WEAPON_TYPE.SWORD) {
                    return me.notify("你使用的武器不对。");
                } else if (sk === "blade" && me.query_weapon_type() !== WEAPON_TYPE.BLADE) {
                    return me.notify("你使用的武器不对。");
                }

                if (pfm.enable_skill === sk && !me.skills.get("xiaowuxianggong2")?.[sk]) {
                    return me.notify_fail("<cyn>你的小无相功需要装备为" + baseSkill.name + "才可以使用【" + pfm.name + "】。</cyn>");
                }

                const up: number = Math.min(70 + Math.floor(lv / 100), 100);
                me.use_pfm(target, pfm, Math.floor(up * lv / 100), sk);
                me.set_temp("wuwo_cd", pfm.query_distime(me, lv));
                me.set_temp("wuwo_gcd", pfm.query_releasetime(me, lv));
            },
            query_desc(_me: CHARACTER, lv: number): string {
                const up: number = Math.min(70 + Math.floor(lv / 100), 100);
                return "使用你无相模仿并学会的绝招，效果是你小无相功等级的" + up + "%，绝招需要和你的小无相装备的基本技能一样";
            },
        },
    };
}

const ALLOW_TYPES: Map<string, string> = new Map([
    ["force", "(内功)"],
    ["sword", "(剑法)"],
    ["unarmed", "(拳脚)"],
]);
