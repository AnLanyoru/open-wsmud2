import { SKILL, PERFORM } from '../../../../core/skill/skill.js';
import { SKILL_TYPES, WEAPON_TYPE } from '../../../../core/const.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

/** 完成度 50 */
export default class extends SKILL {
    name = '全真剑法';
    id = 'quanzhenjianfa';
    grade = 3;

    desc = '全真教的镇派剑法';
    can_enables = ['sword'];
    attack_actions = [
        '$N手中$w平平刺出，剑势<HIG>古朴</HIG>厚重，一招「<HIG>星河西坠</HIG>」直取$n$l',
        '$N$w一摆，剑光化作<HIG>一轮满月</HIG>，清辉遍洒，正是一招「<HIG>皓月当空</HIG>」',
        '$N凝神静气，$w抖出<HIG>点点寒星</HIG>，剑招法度森严，正是全真剑法的精要',
        '$N脚踏七星，$w连刺数剑，剑势<HIG>连绵不绝</HIG>，将$n笼罩在剑光之中',
        '$N长剑圈转，一道<HIG>剑气</HIG>横空而出，全真剑法施展开来，端的是气象万千',
    ];
    slots = [
        {
            prop: 'slh_mp',
            value: (lv: number) => 10,
            format: (val: number) => '三连环每次附加5%内力伤害',
        },
    ];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            sword: {
                gj: 10 + Math.floor(lv * 1.6),
                int: Math.floor(lv * 0.127),
                mz: 10 + lv * 1,
            },
        };
    }

    pfm_set: PerformData = {
        huan: {
            name: '三连环',
            distime: 15000,
            enable_skill: 'sword',
            mp: 20,
            use: function (me: CHARACTER, target: CHARACTER, lv: number) {
                var per = calcSLHPer(lv);
                me.send_room(
                    '<HIG>$N脚踏天罡北斗，手中$W一圈一引，连环三剑一气呵成，剑光如<HIG>星河倒卷</HIG>般涌向$n！</HIG>',
                    target,
                );
                for (var i = 0; i < 3; i++) {
                    me.do_attack({
                        target: target,
                        gj: (me.gj * (100 + per)) / 100,
                        mz: me.mz,
                        attack_before: i > 0 ? _tmpl('<HIG>连环不绝，紧跟着又是一剑</HIG>\n') : undefined,
                    });
                }
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number) {
                var per = calcSLHPer(lv);
                return '瞬间攻击３招，每招增加' + per + '%伤害';
            },
        },
    };
}

function calcSLHPer(lv: number): number {
    return 10 + int(lv / 100);
}
