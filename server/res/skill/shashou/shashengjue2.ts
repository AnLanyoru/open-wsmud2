import {SKILL} from "../../../core/skill/skill.js";
import {FAMILIES} from "../../../core/skill/family.js";
import type {PerformData, EnablePropMap } from "../../../core/skill/skill.js";
import type { CHARACTER, DoAttackPar } from "../../../core/char/character.js";

/** 完成度 50 */
export default class extends SKILL {
    name = "杀生决";
    id = "shashengjue2";
    source_skill = "shashengjue";
    grade = 4;
    force_rad = 0.75;
    family = FAMILIES.SHASHOU;
    desc = "杀手楼的高级内功";
    can_enables = ["force"];

    slots = [
        {
            prop: "shasheng_mp",
            value: (lv: number) => 10,
            format: (val: number) => "内力上限：+120000",
        },
        {
            prop: "shasheng_zhan",
            value: (lv: number) => 10,
            format: (val: number) => "斩杀持续时间增加2秒",
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                gj: 2 + lv * 2,
                mz: 1 + lv * 2,
                add_bjsh_per: 1 + int(lv / 300),
                limit_mp: lv * 160,
                desc: "唯一：将你内力的75%转化为气血",
            },
        };
    }

    pfm_set: PerformData = {
        zhan: {
            name: "斩杀",
            distime: 30000,
            enable_skill: "force",
            mp: 20,
            release_time: 500,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const time: number = zhansha_time(lv);
                const gj: number = zhansha_gj(lv);
                const bj: number = zhansha_bj(lv);
                me.send_room("<hir>$N默运杀生决，全身黑气笼罩，仅剩双眼一片血红，有如杀神降世！</hir>\n", target);
                me.add_status({
                    id: "force",
                    name: "杀神",
                    desc: "攻击力与暴击大幅提升",
                    duration: time,
                    prop: {
                        gj_per: gj,
                        bj_per: bj,
                    },
                    finish_msg: "$N周身黑气渐渐散去，杀意消退。",
                });
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const time: number = zhansha_time(lv);
                const gj: number = zhansha_gj(lv);
                const bj: number = zhansha_bj(lv);
                return "全力战斗，" + toSec(time) + "秒内增加自己" + gj + "%攻击力，" + bj + "%暴击几率";
            },
        },
        tuoli: {
            name: "隐杀",
            distime: 45000,
            enable_skill: "force",
            mp: 0,
            release_time: 500,
            no_auto: true,
            allow_busy: true,
            use: function (me: CHARACTER, _target: CHARACTER, _lv: number): void {
                if (!me.environment) return me.notify("你不知道在哪。");
                if (me.is_rash) return me.notify("你现在无法使用轻功身法。");
                if (!me.environment.exits)
                    return me.notify("这里无法逃脱。");
                const list: string[] = Object.keys(me.environment.exits);
                if (!list.length) return me.notify("这里无法逃脱。");
                const func: ((...args: any[]) => any) | undefined = YS_ROOMS.get(me.environment.path);
                if (func && func(me, list) === false) return;
                me.send_room("\n<blk>$N的身形一闪，渐渐模糊不见了。<blk>\n");
                me.end_fight();
                me.do_command("go", list.random());
            },
            query_desc: function (_me: CHARACTER, lv: number): string {
                return "脱离战斗，迅速隐入其他房间";
            },
        },
    };
}

// ========== 公共计算函数 ==========

/** 斩杀持续时间（毫秒） */
export function zhansha_time(lv: number): number {
    const t: number = 10000 + lv * 5;
    return t > 20000 ? 20000 : t;
}

/** 斩杀攻击力百分比 */
export function zhansha_gj(lv: number): number {
    return 20 + int(lv / 100);
}

/** 斩杀暴击率百分比 */
export function zhansha_bj(lv: number): number {
    return 30 + int(lv / 300);
}

// ========== 隐杀特殊房间处理 ==========

const YS_ROOMS: Map<string, (...args: any[]) => any> = new Map([
    ["yz/leitai/leitai", function (me: CHARACTER): void {
        me.send_room("\n<blk>$N的身形一闪，渐渐模糊不见了。<blk>\n");
    }],
    ["wudao/ta", function (me: CHARACTER, list: string[]): boolean | void {
        const lv: number = me.query_temp("wd_level", 0);
        if (lv >= 89) {
            list.length = 1;
            list[0] = "out";
        }
    }],
]);
