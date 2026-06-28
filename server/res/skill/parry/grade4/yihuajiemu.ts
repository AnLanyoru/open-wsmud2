import {SKILL} from "../../../../core/skill/skill.js";
import type {PERFORM, PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "移花接木";
    id = "yihuajiemu";
    grade = 4;
    
    desc = "无";
    can_enables = ["parry"];
    slots = [
        {
            prop: 'slot_0',
            value: (lv: number) => 10,
            format: (val: number) => '移花期间未能阻止对方绝招时冷却将立即结束',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            parry: {
                zj: Math.floor(lv * 1.72),
                fy: Math.floor(lv * 1.52),
                dex: 5 + Math.floor(lv * 0.25),
                con: 5 + Math.floor(lv * 0.25),
            },
        };
    }

    pfm_set: PerformData = {
        pfm_0: {
            name: "移花",
            distime: 25000,
            enable_skill: "parry",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                var time = 8000;
                me.send_room("<him>$N双掌虚引，运起「移花接木」，一股柔劲牵住$n周身气机。</him>", target);
                target.add_status({
                    id: "yihuajiemu",
                    name: "移花牵制",
                    downside: true,
                    duration: time,
                    desc: "躲闪和招架降低33%",
                    prop: {
                        ds_per: -33,
                        zj_per: -33,
                    },
                }, me);
                me.add_status({
                    id: "yihuajiemu_guard",
                    name: "移花接木",
                    duration: time,
                    desc: "抵挡敌人的下一个绝招",
                    on_attach: function(p: CHARACTER): void {
                        p.set_temp("sk/yihuajiemu/guard", 1, time);
                    },
                    on_expire: function(p: CHARACTER): void {
                        p.remove_temp("sk/yihuajiemu/guard");
                    },
                    finish_msg: "$N移花接木的护体真气渐渐散去。",
                });
            },
            query_desc: function(me: CHARACTER, lv: number): string {
                return "以真气牵制敌人，8秒内降低敌人33%躲闪和招架，并能抵挡敌人的下一个绝招。";
            },
        },
    };

    on_parry_pfm(me: CHARACTER, target: CHARACTER, pfm: PERFORM, level: number, sk?: string): boolean {
        if (!me.query_temp("sk/yihuajiemu/guard", 0)) return false;
        me.remove_temp("sk/yihuajiemu/guard");
        me.remove_status("yihuajiemu_guard", true);
        me.send_room("<him>$N双掌轻翻，使出「移花接木」，将$n的绝招劲力牵引开去。</him>", target);
        return true;
    }
}
