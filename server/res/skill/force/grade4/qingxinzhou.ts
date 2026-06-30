import {SKILL} from "../../../../core/skill/skill.js";
import {SKILL_TYPES} from "../../../../core/const.js";
import type {PerformData, EnablePropMap} from "../../../../core/skill/skill.js";
import type {CHARACTER, DoAttackPar} from "../../../../core/char/character.js";

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
                    count:  10
                },{
                    path: "book/bc#qingxinzhou",
                    count: 25,
                }];
            },
        },
        {
            prop: 'qxz_pwq_sh',
            value: (lv: number) => Math.floor(lv * 0.55),
            format: (val: number) => `破妄曲附加自身${val}%攻击力的伤害`,
        },
        {
            prop: 'qxz_asq_fy',
            value: (lv: number) => Math.floor(lv * 0.55),
            format: (val: number) => `安神曲降低${val}%防御的伤害`,
        },
        {
            prop: 'qxz_gm_time',
            value: (lv: number) => 4000,
            format: (val: number) => `共鸣持续时间增加${val / 1000}秒`,
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                int: Math.floor(lv * 0.176),
                diff_downside_per: 10,
                limit_mp: lv * 175,
                desc: "唯一：将你内力的82%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        powang: {
            name: "破妄曲",
            distime: 16000,
            enable_skill: "force",
            mp: 78,
            release_time: 500,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const dur = calc_powang_dur(lv);
                const addSh = calc_powang_add_sh(me, lv);

                me.send_room(
                    "<hiy>$N指拈法印，唇启微吟，一道清越梵音自丹田升起，化入周身经脉，如甘露遍洒。</hiy>",
                    target,
                );

                me.add_status({
                    id: "force",
                    name: "破妄曲",
                    duration: dur,
                    prop: {
                        add_sh: addSh,
                    },
                    start_msg: "<hiy>一缕金色梵音萦绕周身，心台澄明，万邪不侵。</hiy>",
                    finish_msg: "周身梵音渐息，那层护体金光随之敛去。",
                });

                me.reauto_attack();
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const dur = calc_powang_dur_str(lv);
                const addSh = calc_powang_add_sh(me, lv);
                return `引气成音，${dur}秒内每次攻击附加${addSh}点伤害。`;
            },
        },
        anshen: {
            name: "安神曲",
            distime: 16000,
            enable_skill: "force",
            mp: 78,
            release_time: 500,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const dur = calc_anshen_dur(lv);
                const diffSh = calc_anshen_diff_sh(me, lv);

                me.send_room(
                    "<hiy>$N双手合十，口诵真言，一股安详宁和之气自$N体内弥漫开来，似春风拂面。</hiy>",
                    target,
                );

                me.add_status({
                    id: "force",
                    name: "安神曲",
                    duration: dur,
                    prop: {
                        diff_sh: diffSh,
                    },
                    start_msg: "<hiy>一股温润之气护住心脉，百骸如沐春风，痛楚顿减。</hiy>",
                    finish_msg: "护体真言渐渐消散，周身回复如常。",
                });

                me.reauto_attack();
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const dur = calc_anshen_dur_str(lv);
                const diffSh = calc_anshen_diff_sh(me, lv);
                return `凝音成障，${dur}秒内受到的伤害减少${diffSh}点。`;
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
                const gj = calc_gongming_gj(lv);
                const mz = calc_gongming_mz(lv);

                me.send_room(
                    "<hiy>$N深吸一口气，一声清啸直冲云霄，音波如水纹般向四周扩散，天地为之共鸣！</hiy>",
                    target,
                );

                me.add_status({
                    id: "force",
                    name: "共鸣",
                    duration: dur,
                    prop: {
                        gj: gj,
                        mz: mz,
                    },
                    start_msg: "<hiy>一股澎湃音波灌入四肢百骸，战意高昂，气血翻涌！</hiy>",
                    finish_msg: "共鸣之音渐远，体内那股激昂之力也随之沉寂。",
                });

                me.reauto_attack();
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const dur = calc_gongming_dur_str(me, lv);
                const gj = calc_gongming_gj(lv);
                const mz = calc_gongming_mz(lv);
                return `引音波共鸣，${dur}秒内你和周围队友增加${gj}点攻击力与${mz}点命中。`;
            },
        },
    };
}

// ═══════════════════════════════════════════
// 清心咒 — 公共计算函数
// ═══════════════════════════════════════════

/** 破妄曲持续时间（毫秒），每级增加5ms确保等级提升能感知到持续时间增长 */
function calc_powang_dur(lv: number): number {
    return 5000 + lv * 5;
}

/** 破妄曲持续时间显示（秒） */
function calc_powang_dur_str(lv: number): string {
    const val = calc_powang_dur(lv) / 1000;
    return val.toFixed(1).replace(/\.0$/, '');
}

/** 破妄曲附加伤害 */
function calc_powang_add_sh(me: CHARACTER, lv: number): number {
    return lv * 2 + me.query_prop("qxz_pwq_sh");
}

/** 安神曲持续时间（毫秒），每级增加5ms确保等级提升能感知到持续时间增长 */
function calc_anshen_dur(lv: number): number {
    return 5000 + lv * 5;
}

/** 安神曲持续时间显示（秒） */
function calc_anshen_dur_str(lv: number): string {
    const val = calc_anshen_dur(lv) / 1000;
    return val.toFixed(1).replace(/\.0$/, '');
}

/** 安神曲减伤值 */
function calc_anshen_diff_sh(me: CHARACTER, lv: number): number {
    return lv * 2 + me.query_prop("qxz_asq_fy");
}

/** 共鸣持续时间（毫秒） */
function calc_gongming_dur(me: CHARACTER, lv: number): number {
    return (8 + Math.floor(lv / 1000)) * 1000 + me.query_prop("qxz_gm_time");
}

/** 共鸣持续时间显示（秒） */
function calc_gongming_dur_str(me: CHARACTER, lv: number): string {
    const val = calc_gongming_dur(me, lv) / 1000;
    return val.toFixed(1).replace(/\.0$/, '');
}

/** 共鸣攻击力加成 */
function calc_gongming_gj(lv: number): number {
    return lv;
}

/** 共鸣命中加成 */
function calc_gongming_mz(lv: number): number {
    return lv;
}
