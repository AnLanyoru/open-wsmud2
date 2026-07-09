import { SKILL } from '../../../core/skill/skill.js';
import { WEAPON_TYPE } from '../../../core/const.js';
import { FAMILIES } from '../../../core/skill/family.js';
import type { PerformData, EnablePropMap } from '../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../core/char/character.js';

/** 完成度 50 */
export default class extends SKILL {
    name = '穿心掌';
    id = 'chuanxinzhang2';
    source_skill = 'chuanxinzhang';
    grade = 4;
    family = FAMILIES.SHASHOU;
    desc = '杀手楼的拳脚功夫，出招阴狠毒辣';
    can_enables = ['unarmed', 'parry'];
    attack_actions = SKILL.get('chuanxinzhang')?.attack_actions || [];

    slots = [
        {
            prop: 'chuanxin_gj',
            value: (lv: number) => 50 + int(lv / 100),
            format: (val: number) => `掌心雷附加的攻击力增加${val}%`,
        },
        {
            prop: 'chuanxin_stun',
            value: (lv: number) => 1000,
            format: (val: number) => `掌心雷造成昏迷的时间增加${toSec(val)}秒`,
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            unarmed: {
                gj: Math.floor(lv * 1.7) + 20,
                bj_per: 1 + int(lv / 300),
                mz: Math.floor(lv * 1.7) + 10,
            },
            parry: {
                zj: Math.floor(lv * 1.4) + 20,
                ds: Math.floor(lv * 1.4) + 20,
                dex: int(lv / 7) + 2,
            },
        };
    }

    pfm_set: PerformData = {
        chuan: {
            name: '掌心雷',
            distime: 30000,
            enable_skill: 'unarmed',
            mp: 20,
            release_time: 0,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const p: number = chuanxin_dmg_per(lv);
                const t: number = chuanxin_stun_time(lv);
                const sh: number = me.do_attack({
                    target: target,
                    gj: (me.gj * p) / 100,
                    attack_msg: '<hir>$N暗藏真气于掌心，一招「掌心雷」闪烁着雷光直贯$n</hir>',
                    mz: me.mz,
                    no_weapon: true,
                });
                if (sh) {
                    target.add_status(
                        {
                            id: 'faint',
                            is_faint: true,
                            duration: t,
                            name: '昏迷',
                            downside: true,
                            finish_msg: '<hiy>慢慢的$N又恢复了知觉...</hiy>\n',
                            start_msg: '<hir>$N只觉得眼前一黑，接着什么都不知道了。</hir>\n',
                        },
                        me,
                    );
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                const p: number = chuanxin_dmg_per(lv);
                return `对敌人造成${p}%攻击力的伤害，命中后昏迷对方${toSec(chuanxin_stun_time(lv))}秒`;
            },
        },
    };
}

// ========== 公共计算函数 ==========

/** 掌心雷伤害百分比 */
export function chuanxin_dmg_per(lv: number): number {
    return 100 + int(lv / 10);
}

/** 掌心雷昏迷时间（毫秒） */
export function chuanxin_stun_time(lv: number): number {
    const t: number = 6000 + int(lv / 1000) * 1000;
    return t > 10000 ? 10000 : t;
}
