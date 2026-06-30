import {SKILL} from "../../../../core/skill/skill.js";
import type {PerformData, EnablePropMap} from "../../../../core/skill/skill.js";
import type {CHARACTER} from "../../../../core/char/character.js";
// ============================================================
// 狂风快刀
// ============================================================

export default class extends SKILL {
    name = "狂风快刀";
    id = "kuangfengkuaidao";
    grade = 3;

    desc = "采花大盗田伯光的成名刀法，出刀如狂风骤雨，迅捷无伦，一刀快似一刀，教人眼花缭乱，防不胜防。";
    can_enables = ["blade"];
    attack_actions = [
        "$N身形一晃，$W挟破风之声劈向$n的$l，快得只见刀光不见刀",
        "$N踏步欺身，$W化作一道白虹，瞬息间已斩至$n$l",
        "$N大喝一声，$W连劈带削，刀影重重笼住$n周身要害",
        "$N刀交左手，右腕急翻，$W自意想不到的方位削向$n的$l",
        "$N旋身借势，$W划出一道弧形刀光，快如电闪般掠向$n的$l",
        "$N口中低啸，$W骤然加快，一刀方出二刀又至，连绵不绝斩向$n",
        "$N足尖一点，身形如风欺近$n，$W已抢先一步抵至$n$l",
        "$N刀势展开，恍若平地起了一阵旋风，$W刀刀不离$n周身要穴",
    ];

    slots = [
        {
            prop: 'kfkd_mz',
            name: "风劲",
            value: (lv: number) => 5 + Math.floor(lv / 200),
            format: (val: number) => `狂风二十一式期间命中增加${val}%`,
        },
        {
            prop: 'kfkd_gj',
            name: "刀罡",
            value: (lv: number) => 5 + Math.floor(lv / 200),
            format: (val: number) => `狂风二十一式期间攻击力增加${val}%`,
        },
        {
            prop: 'kfkd_hsfy',
            name: "破风",
            value: (lv: number) => 5 + Math.floor(lv / 100),
            format: (val: number) => `狂风二十一式期间忽视对方防御${val}%`,
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            blade: {
                gj: Math.floor(lv * 1.5) + 10,
                bj_per: 2 + Math.floor(lv / 500),
                dex: Math.floor(lv * 0.2),
            },
        };
    }

    pfm_set: PerformData = {
        kuang: {
            name: "狂风二十一式",
            distime: 30000,
            enable_skill: "blade",
            mp: 20,
            release_time: 4000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const speedBonus = query_kfkd_gjsd_per(lv);
                const mz_per = me.query_prop("kfkd_mz") || undefined;
                const gj_per = me.query_prop("kfkd_gj") || undefined;
                const diff_fy_per = me.query_prop("kfkd_hsfy") || undefined;
                const buffDuration = 6000;

                me.send_room(
                    "<hiy>$N眼中厉芒一闪，狂啸一声，手中$W骤然化作漫天刀影，狂风般向$n连劈二十一式！</hiy>",
                    target,
                );

                me.add_status({
                    id: "weapon",
                    name: "狂风",
                    desc: "刀出如风，迅捷无伦",
                    duration: buffDuration,
                    override: 0,
                    prop: {
                        gjsd_per: speedBonus,
                        mz_per,
                        gj_per,
                        diff_fy_per,
                    },
                    finish_msg: "$N刀势渐缓，狂风之势随之消散。",
                });
                me.reauto_attack();

                for (let i = 0; i < 21; i++) {
                    me.do_attack({
                        target: target,
                        gj: me.gj,
                        mz: me.mz,
                        attack_before: i > 0 ? "紧跟着" : undefined,
                    });
                }
                me.end_attack(target);
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const speedBonus = query_kfkd_gjsd_per(lv);
                return `快速攻击敌方21招，攻击期间增加你${speedBonus}%的攻速`;
            },
        },
    };
}


// ============================================================
// 狂风快刀 — 公共计算函数（use 与 query_desc 共用，保证一致）
// ============================================================


/** 狂风二十一式：攻速加成百分比，500级封顶100% */
function query_kfkd_gjsd_per(lv: number): number {
    const val = 50 + Math.floor(lv / 10);
    return val > 100 ? 100 : val;
}
