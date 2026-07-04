import {SKILL} from "../../../../core/skill/skill.js";
import type {PerformData, EnablePropMap} from "../../../../core/skill/skill.js";
import type {LearnCondition} from "../../../../types/events.js";
import type {CHARACTER} from "../../../../core/char/character.js";

// ============================================================
// 金蛇游身步 — 公共稀有轻功
// ============================================================

export default class extends SKILL {
    name = "金蛇游身步";
    id = "jinsheyoushenbu";
    grade = 3;

    desc = "金蛇游身步，步法诡谲如金蛇游走，身随步转间宛如万蛇缠身，令敌眼花缭乱。";
    can_enables = ["dodge"];

    dodge_actions = [
        "$n身形如金蛇般诡异一扭，$N的招式堪堪擦身而过。",
        "$n步法游移不定，宛如金蛇蜿蜒，轻松避开了$N的攻击。",
        "只见$n身随步转，一招「金蛇盘身」，倏地绕到一旁，$N顿失目标。",
        "$n足下一点，身形如金蛇出洞般窜出数尺，$N顿时扑了个空。",
        "$n不慌不忙，一式「游蛇戏水」，身形诡异地向旁滑开数尺。",
        "$n如金蛇缠丝般左右摆动，$N招招落空，竟连衣角都碰不到。",
    ];

    learn_condition: LearnCondition = {
        max_mp: 10000,
        skill: {
            dodge: 500,
        },
    };

    pfm_set: PerformData = {
        jinshe: {
            name: "金蛇游身",
            distime: 30000,
            enable_skill: "dodge",
            mp: 20,
            release_time: 4000,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const busyTime = query_jinshe_busy_time(lv);
                const msg =
                    "<HIC>$N身形一晃，步法如金蛇游走，倏忽间幻化出万蛇缠身之象，向$n逼去！</HIC>\n";

                if (me.random(lv / 2) + lv > target.query_skill(target.dodge_skill.id, 0)) {
                    target.add_status({
                        id: "busy",
                        is_busy: true,
                        duration: busyTime,
                        name: "忙乱",
                        downside: true,
                    }, me);
                    me.send_room(
                        msg + "<hiy>$n只觉眼前蛇影重重，不由得手忙脚乱，被$N连攻数招！\n</hiy>",
                        target,
                    );
                } else {
                    me.send_room(
                        msg +
                            "<hir>可是$n以静制动，紧守门户，丝毫不受$N金蛇游身的影响。\n</hir>",
                        target,
                    );
                }
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                const busyTime = query_jinshe_busy_time(lv);
                return "金蛇游身，如有万蛇缠身，成功后使敌人忙乱" + toSec(busyTime) + "。";
            },
        },
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            dodge: {
                ds: Math.floor(lv * 1.5) + 130,
                busy_per: query_jinshe_busy_per(lv),
            },
        };
    }
}

// ============================================================
// 金蛇游身步 — 公共计算函数（use 与 query_desc 共用，保证一致）
// ============================================================

/** 金蛇游身：忙乱时间（毫秒），上限 10000ms */
function query_jinshe_busy_time(lv: number): number {
    return Math.min(10000, 2000 + lv * 4);
}

/** 忙乱时间百分比加成，上限 50% */
function query_jinshe_busy_per(lv: number): number {
    return Math.min(50, 10 + Math.floor(lv / 100));
}
