import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";
import type { PropMap } from "../../../types/props.js";
import type { PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER } from "../../../core/char/character.js";

export default class extends SKILL {
    name = "太极剑法";
    id = "taijijian2";
    source_skill = "taijijian";
    grade = 5;
    family = FAMILIES.WUDANG;
    desc = "由武当祖师张三丰所创，武当派不传之秘，太极三绝技之一";
    can_enables = ["sword"];
    attack_actions = SKILL.get("taijijian")?.attack_actions || [];

    query_prop(lv: number, _me?: CHARACTER): PropMap {
        return {
            int: 10 + Math.floor(lv / 6),
            zj_per: Math.floor(lv / 300) + 5,
        };
    }

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 20 + lv * 2,
                mz: 20 + lv * 2,
                zj: 20 + lv * 2,
                mz_per: Math.floor(lv / 300) + 3,
                desc: "对忙乱中的敌人伤害增加" + (10 + Math.floor(lv / 100)) + "%",
            },
        };
    }

    pfm_set: PerformData = {
        chan: {
            name: "缠字诀",
            distime: 20000,
            enable_skill: "sword",
            mp: 10,
            release_time: 500,
            use: function (me: CHARACTER, _target: CHARACTER, lv: number): void {
                // 以连绵不绝的攻势迷惑附近敌人，使之无法脱身，忙乱状态持续(3+lv*0.01)秒，每命中多一人冷却增加(10-lv*0.001)秒。
                if (!me.enemy || !me.enemy.length) return;
                const list: CHARACTER[] = [];
                for (const x of me.enemy) {
                    if (x.check_character()) {
                        list.push(x);
                    }
                }
                if (!list.length) return;

                const time: number = Math.min(lv * 10 + 3000, 16000);

                me.send_room("<CYN>$N剑势一展，使出太极剑法「缠字诀」，剑光如织，连绵不绝地卷向周围敌人！</CYN>");

                let hitCount = 0;
                for (const enemy of list) {
                    hitCount++;
                    enemy.add_status({
                        id: "busy",
                        name: "忙乱",
                        desc: "你被太极剑法的缠字诀困住，无法脱身。",
                        duration: time,
                        is_busy: true,
                        downside: true,
                    }, me);
                }
                // 每命中多一人冷却增加，每额外命中一人增加 max(10000-lv, 5000)ms 冷却
                if (hitCount > 1) {
                    this.change_distime(me, "chan", (hitCount - 1) * Math.max(10000 - lv, 5000));
                }
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const time: number = Math.min(lv * 10 + 3000, 16000) / 1000;
                const extraCd: number = Math.max(10000 - lv, 5000) / 1000;
                return "以连绵不绝的攻势迷惑附近敌人，使之无法脱身，" + time + "秒内处于忙乱状态，每命中多一人冷却增加" + extraCd + "秒。";
            },
        },
        lian: {
            name: "连字诀",
            distime: 15000,
            enable_skill: "sword",
            mp: 10,
            release_time: 4000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                // 快速出剑，瞬间对敌人快速攻击3+lv/100次（上限7次），攻击中命中增加100%，附加自己3%的内力伤害
                const atkCount: number = Math.min(Math.floor(lv / 100) + 3, 7);
                const mz: number = Math.floor(me.mz * 2);
                const powerGj: number = Math.floor(me.max_mp * 0.03);

                me.send_room("<HIY>$N剑法陡然加快，使出了太极剑法「连字诀」，剑光如电，瞬间连刺而出！</HIY>");

                for (let i = 0; i < atkCount; i++) {
                    me.do_attack({
                        target: target,
                        gj: me.gj,
                        mz: mz,
                        attack_before: "紧跟着",
                        power_gj: powerGj,
                    });
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const atkCount: number = Math.min(Math.floor(lv / 100) + 3, 7);
                const powerGj: number = Math.floor(me.max_mp * 0.03);
                return "快速出剑，瞬间对敌人快速攻击" + atkCount + "次，攻击中命中增加100%，附加自己3%(" + powerGj + ")的内力伤害";
            },
        },
        sui: {
            name: "随字决",
            distime: 20000,
            enable_skill: "sword",
            mp: 10,
            release_time: 500,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                // 造成攻击力百分比伤害，命中后使对方降低命中和躲闪
                const gjPer: number = 100 + Math.floor(lv / 5);
                const per: number = 10 + Math.floor(lv / 200);
                const time: number = lv * 10 + 3000;

                if (me.do_attack({
                    target: target,
                    gj: Math.floor(me.gj * gjPer / 100),
                    mz: me.mz,
                    attack_msg: "<HIM>$N剑随意走，使出太极剑法「随字决」，四周真气涌动化为数个大小太极，向$n刺去！</HIM>",
                    damage_msg: "<red>只见$n被剑气击中，真气紊乱，感觉眼前的景物似幻似真，几乎要站立不住！</red>",
                })) {
                    target.add_status({
                        id: "sui",
                        name: "太极",
                        desc: "你的命中和躲闪降低了" + per + "%",
                        duration: time,
                        downside: true,
                        prop: {
                            mz_per: -per,
                            ds_per: -per,
                        },
                        finish_msg: "<CYN>$N从太极剑的影响中恢复过来。</CYN>",
                    }, me);
                }
                me.end_attack(target);
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const gjPer: number = 100 + Math.floor(lv / 5);
                const per: number = 10 + Math.floor(lv / 200);
                const time: number = (lv * 10 + 3000) / 1000;
                return "造成" + gjPer + "%攻击力的伤害，命中后使对方在" + time + "秒内降低" + per + "%命中和躲闪";
            },
        },
    };
}
