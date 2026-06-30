import { SKILL } from "../../../../core/skill/skill.js";
import { SKILL_TYPES } from "../../../../core/const.js";
import type { PerformData, EnablePropMap } from "../../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "清心咒";
    id = "qingxinzhou";
    grade = 4;
    force_rad = 0.82;

    desc = "以心为器、以气为弦，音藏于息、韵生于神。可定心神，清邪祟";
    can_enables = ["force"];
    slots = [
        {
            prop: "limit_mp",
            value: (lv: number) => 105 * lv,
            format: (val: number) => "内力上限：+" + val,
            query_needs: function (_lv: number) {
                return [{
                    path: "book/wudao",
                    count: 10
                }, {
                    path: "book/bc#qingxinzhou",
                    count: 25,
                }];
            },
        },
        {
            prop: 'qxz_pwq_sh',
            value: (lv: number) => 50 + int(lv / 200),
            format: (val: number) => `破妄曲附加自身${val}%攻击力的伤害`,
        },
        {
            prop: 'qxz_asq_fy',
            value: (lv: number) => 50 + int(lv / 200),
            format: (val: number) => `安神曲降低${val}%防御的伤害`,
        },
        {
            prop: 'qxz_gm_time',
            value: (lv: number) => 4000,
            format: (val: number) => `共鸣持续时间增加${toSec(val)}秒`,
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                int: 10 + int(lv / 6),
                diff_downside_per: 10,
                limit_mp: lv * 175,
                desc: "唯一：将你内力的82%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        po: {
            name: "破妄曲",
            distime: 16000,
            enable_skill: "force",
            mp: 78,
            release_time: 500,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const addSh = calc_powang_add_sh(me, lv);

                me.remove_status("force");

                me.send_room(
                    "<hiy>$N指拈法印，唇启微吟，一道清越梵音自丹田升起，化入周身经脉，如甘露遍洒。</hiy>",
                    target,
                );

                me.add_status({
                    id: "force",
                    name: "破妄曲",
                    duration: 0,
                    prop: {
                        add_sh: addSh,
                    },
                    start_msg: "<hiy>一缕金色梵音萦绕周身，心台澄明，万邪不侵。</hiy>",
                    finish_msg: "周身梵音渐息，那层护体金光随之敛去。",
                });

                me.reauto_attack();
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const addSh = calc_powang_add_sh(me, lv);
                return `引气成音，持续期间每次攻击附加${addSh}点伤害。`;
            },
        },
        an: {
            name: "安神曲",
            distime: 16000,
            enable_skill: "force",
            mp: 78,
            release_time: 500,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const diffSh = calc_anshen_diff_sh(me, lv);

                me.remove_status("force");

                me.send_room(
                    "<hiy>$N双手合十，口诵真言，一股安详宁和之气自$N体内弥漫开来，似春风拂面。</hiy>",
                    target,
                );

                me.add_status({
                    id: "force",
                    name: "安神曲",
                    duration: 0,
                    prop: {
                        diff_sh: diffSh,
                    },
                    start_msg: "<hiy>一股温润之气护住心脉，百骸如沐春风，痛楚顿减。</hiy>",
                    finish_msg: "护体真言渐渐消散，周身回复如常。",
                });

                me.reauto_attack();
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const diffSh = calc_anshen_diff_sh(me, lv);
                return `凝音成障，持续期间受到的伤害减少${diffSh}点。`;
            },
        },
        gongming: {
            name: "共鸣",
            distime: 45000,
            enable_skill: "force",
            mp: 128,
            release_time: 500,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const dur = calc_gongming_dur(me, lv);
                const val = calc_gongming_value(me, lv);

                me.send_room(
                    "<hiy>$N深吸一口气，一声清啸直冲云霄，音波如水纹般向四周扩散，天地为之共鸣！</hiy>",
                    target,
                );

                const tm = me.team || [me];
                for (let i = 0; i < tm.length; i++) {
                    if (tm[i].hp > 0 && tm[i].is_here(me)) {
                        tm[i].add_status({
                            id: "gongming",
                            name: "共鸣",
                            duration: dur,
                            prop: {
                                gj: val,
                                mz: val,
                            },
                            start_msg: "<hiy>一股澎湃音波灌入四肢百骸，战意高昂，气血翻涌！</hiy>",
                            finish_msg: "共鸣之音渐远，体内那股激昂之力也随之沉寂。",
                        });
                    }
                }

                me.reauto_attack();
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const dur = calc_gongming_dur_str(me, lv);
                const val = calc_gongming_value(me, lv);
                return `引音波共鸣，${dur}秒内你和周围队友增加${val}点攻击力与${val}点命中。`;
            },
        },
    };
}

// ═══════════════════════════════════════════
// 清心咒 — 公共计算函数
// ═══════════════════════════════════════════

/** 破妄曲附加伤害 */
function calc_powang_add_sh(me: CHARACTER, lv: number): number {
    return int(
        (me.int * lv / 1000) 
        + (lv * 2)
        + (me.query_prop("qxz_pwq_sh") / 100 * me.gj));
}

/** 安神曲减伤值 */
function calc_anshen_diff_sh(me: CHARACTER, lv: number): number {
    return int(
        (me.int * lv / 1000) 
        + (lv * 2) 
        + (me.query_prop("qxz_asq_fy") / 100 * me.fy));
}

/** 共鸣持续时间（毫秒） */
function calc_gongming_dur(me: CHARACTER, lv: number): number {
    return (8 + Math.floor(lv / 1000)) * 1000 + me.query_prop("qxz_gm_time");
}

/** 共鸣持续时间显示（秒） */
function calc_gongming_dur_str(me: CHARACTER, lv: number): string {
    return toSec(calc_gongming_dur(me, lv));
}

/** 共鸣攻击力加成 */
function calc_gongming_value(me: CHARACTER, lv: number): number {
    return int((me.int * lv / 1000) + lv);
}

