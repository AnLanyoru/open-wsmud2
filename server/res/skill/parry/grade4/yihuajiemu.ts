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
            prop: 'yh_cd',
            value: (_lv: number, _grd: number) => 1,
            format: (_val: number) => '移花期间未能阻止对方绝招时冷却将立即结束',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            parry: {
                zj: Math.floor(lv * 1.7) + 20,
                fy: Math.floor(lv * 1.5) + 20,
                dex: 5 + Math.floor(lv * 0.25),
                con: 5 + Math.floor(lv * 0.25),
            },
        };
    }

    pfm_set: PerformData = {
        yi: {
            name: "移花",
            distime: 25000,
            enable_skill: "parry",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const this_pfm_id = this.id;
                const time = get_yihua_duration(lv);
                const buff_value = get_yihua_buff_value(lv);
                me.send_room("<mag>$N默运移花接木神功，你感觉周围真气似乎被$N牵引，犹如陷入泥潭寸步难行。</mag>", target);
                target.add_status({
                    id: "yi",
                    name: "牵制",
                    downside: true,
                    duration: time,
                    desc: `被移花接木所牵制`,
                    prop: {
                        ds_per: -buff_value,
                        zj_per: -buff_value,
                    },
                }, me);
                const self = this;
                me.add_status({
                    id: "yihua",
                    name: "移花",
                    duration: time,
                    desc: "抵挡敌人的下一个绝招",
                    on_expire: function(p: CHARACTER): void {
                        if (p.query_temp("yh_cd", 0)) 
                            self.set_distime(p, "parry", 0);
                    },
                });
            },
            query_desc: function(me: CHARACTER, lv: number): string {
                const second = get_yihua_duration(lv) / 1000
                return `以真气牵制敌人，${second}秒内降低敌人${get_yihua_buff_value(lv)}%躲闪和招架，并能抵挡敌人的下一个绝招。`;
            },
        },
    };

    on_parry_pfm(me: CHARACTER, target: CHARACTER, pfm: PERFORM, level: number, sk?: string): boolean {
        if (!me.query_temp("yihua", 0)) return false;
        me.remove_status("yihua", true);
        me.send_room(`<mag>$N真气牵引，使出移花接木大法，$n的${pfm.name}犹如石沉大海，再无声息。</mag>`, target);
        return true;
    }
}


function get_yihua_duration(lv: number): number {
    return lv * 3 + 5000
}

function get_yihua_buff_value(lv: number): number {
    return parseInt(lv / 300 + 30)
}