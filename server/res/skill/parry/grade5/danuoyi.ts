import { SKILL } from '../../../../core/skill/skill.js';
import type { PerformData, EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar, CharacterStatus } from '../../../../core/char/character.js';

/** 完成度 80 */
export default class extends SKILL {
    name = '大挪移';
    id = 'danuoyi';
    grade = 5;

    family = FAMILIES.MONSTER;
    desc = '明教的镇教之宝残篇，运劲用力的一项顶级法门。';
    can_enables = ['parry'];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            parry: {
                zj: int(lv * 2.7),
                fy: int(lv * 1.6),
                hp_per: 3 + int(lv / 500),
                fy_per: 3 + int(lv / 500),
                desc: `当你招架会积蓄力量，最高${get_max_layers(lv)}层，每层增加${lv}防御，招架成功积蓄两层，失败积蓄一层`,
            },
        };
    }

    pfm_set: PerformData = {
        da: {
            name: '大挪移',
            distime: 15000,
            enable_skill: 'parry',
            mp: 20,
            use: function (me: CHARACTER, target: CHARACTER, lv: number): void {
                const dmgBonus: number = int(1 / 2) * me.gj;
                me.send_room(
                    '<HIO>$N双臂一震，乾坤大挪移心法运转，将积蓄的层层劲力汇于一击，如天塌地陷般朝$n轰去！</HIO>',
                    target,
                );
                me.do_attack({
                    target: target,
                    gj: me.gj,
                    mz: me.mz,
                    power_gj: dmgBonus,
                    attack_msg:
                        '<HIO>$N牵引乾坤之力，将层层叠叠的澎湃劲力汇于掌心，一掌推出，势若崩雷！</HIO>',
                    damage_msg:
                        '<hir>乾坤劲力透体而入，$n全身骨骼咯咯作响，已被这积蓄已久的巨力震得五脏移位！</hir>',
                    miss_msg: '<cyn>$n见$N掌力汹涌，不敢硬接，急忙侧身闪避。</cyn>',
                });
                me.end_attack(target);
            },
            query_desc: function (me: CHARACTER, lv: number): string {
                return '使用大挪移一次反击敌人，伤害为乾坤的层数/2*你的攻击力';
            },
        },
    };

}

// ========== 公共计算函数 ==========

export function get_max_layers(lv: number): number {
    return 10 + int(lv / 400);
}

export function get_daozhuan_heal_per(lv: number): number {
    return 3 + int(lv / 1000);
}

