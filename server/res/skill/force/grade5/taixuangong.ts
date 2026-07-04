import {SKILL} from "../../../../core/skill/skill.js";
import type {PerformData, EnablePropMap} from "../../../../core/skill/skill.js";
import type {CHARACTER, DoAttackPar} from "../../../../core/char/character.js";

export default class extends SKILL {
    name = "太玄功";
    id = "taixuangong";
    grade = 5;
    force_rad = 0.8;

    desc = "失传已久的绝学，相传藏于海外孤岛石壁之上，"
        + "千百年来无人能解，直至有人于字迹笔画间悟得经脉运行之法，"
        + "自此劲随意走，气与神合，无招无式而自成杀伐。";

    can_enables = ["force"];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: 100 + lv * 2,
                add_sh_per: 5 + Math.floor(lv / 300),
                diff_busy: 3000 + lv,
                limit_mp: lv * 286,
                desc: "当你命中敌人会造成" + taixuan_neigong_dmg(lv) + "内功伤害，不可招架\n唯一：将你内力的80%转化为气血",
            },
        };
    }

    /**
     * 太玄内劲——每次攻击附加内功伤害（power_gj 通道，不可招架）
     * 白首太玄状态下内功伤害翻倍
     */
    on_attack(me: CHARACTER, _target: CHARACTER, par: DoAttackPar): number {
        const lv = me.query_skill("taixuangong", 0);
        if (lv <= 0) return 0;
        if (!par.power_gj) par.power_gj = 0;
        let dmg = taixuan_neigong_dmg(lv);
        if (me.query_temp("tx_bs", 0)) {
            dmg *= 2;
        }
        par.power_gj += dmg;
        return 0;
    }

    /**
     * 白首太玄——命中后恢复气血
     */
    on_attack_over(me: CHARACTER, _target: CHARACTER, _par: DoAttackPar, sh: number): void {
        if (sh <= 0) return;
        if (me.query_temp("tx_bs", 0)) {
            const lv = me.query_skill("taixuangong", 0);
            const pct = baishou_recover_pct(lv);
            const heal = Math.floor(me.gj * pct / 100);
            me.add_hp(heal);
        }
    }

    pfm_set: PerformData = {
        sha: {
            name: "十步杀一人",
            distime: 30000,
            enable_skill: "force",
            mp: 20,
            release_time: 4000,
            allow_busy: true,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                if (!target) {
                    me.notify_fail("没有目标！");
                    return;
                }
                const diffFy = shibu_diff_fy(lv);
                const maxCount = shibu_max_count(lv);
                let count = 3;
                me.send_room("<hio>$N长吟：「十步杀一人，千里不留行！」身影倏动，如电光石火般向$n发起连击。</hio>", target);
                for (let i = 0; i < count && count <= maxCount; i++) {
                    const sh = me.do_attack({
                        target, gj: me.gj, mz: me.mz,
                        diff_fy: diffFy,
                        no_weapon: true,
                    });
                    if (sh > 0 && i === count - 2 && count < maxCount) {
                        count++;
                    }
                }
                me.end_attack(target);
            },
            query_desc: function(_me: CHARACTER, lv: number) {
                const diffFy = shibu_diff_fy(lv);
                const maxCount = shibu_max_count(lv);
                return "快速向敌人发起连击，突破对方" + diffFy + "%防御，命中可增加攻击次数（最多" + maxCount + "次），无视忙乱。";
            },
        },
        bai: {
            name: "白首太玄",
            distime: 45000,
            enable_skill: "force",
            mp: 20,
            release_time: 4000,
            use: function(me: CHARACTER, target: CHARACTER, lv: number): void {
                const dur = baishou_duration(lv);
                me.send_room("<hio>$N长吟：「谁能书阁下，白首太玄经！」真气流转，衣袂飘飘。</hio>", target);
                me.add_status({
                    id: "force",
                    name: "白首太玄",
                    duration: dur,
                    prop: {},
                    on_attach: (p: CHARACTER) => p.set_temp("tx_bs", 1, dur),
                    on_expire: (p: CHARACTER) => p.remove_temp("tx_bs"),
                    finish_msg: "$N气沉丹田，周身流转的太玄真气徐徐敛归经脉。",
                });
                me.reauto_attack();
                me.end_attack(target);
            },
            query_desc: function(_me: CHARACTER, lv: number) {
                const dur = baishou_duration(lv);
                const pct = baishou_recover_pct(lv);
                return "将太玄功力运转周身，" + toSec(dur) + "秒内太玄功附加内功伤害翻倍，每次命中后恢复攻击力" + pct + "%的气血。";
            },
        },
    };
}

// ============ 公共计算函数 ============

/** 太玄内功伤害 */
function taixuan_neigong_dmg(lv: number): number {
    return Math.floor(lv * lv / 500) + lv + 1000;
}

/** 十步杀一人——忽视防御百分比 */
function shibu_diff_fy(lv: number): number {
    return 30 + Math.floor(lv / 100);
}

/** 十步杀一人——最大攻击次数 */
function shibu_max_count(lv: number): number {
    return 5 + Math.floor(lv / 200);
}

/** 白首太玄——持续时间（毫秒），封顶15秒 */
function baishou_duration(lv: number): number {
    return Math.min(15000, 3000 + lv * 10);
}

/** 白首太玄——恢复气血百分比，封顶50% */
function baishou_recover_pct(lv: number): number {
    return Math.min(50, 30 + Math.floor(lv / 100));
}
