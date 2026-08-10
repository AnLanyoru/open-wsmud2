import { SKILL } from '../../../core/skill/skill.js';
import { SKILL_TYPES } from '../../../core/const.js';
import { FAMILIES } from '../../../core/skill/family.js';
import type { PropMap } from '../../../types/props.js';

export default class extends SKILL {
    name = '观山诀';
    id = 'guanshanjue';
    grade = 1;
    family = FAMILIES.WULANG;
    type = SKILL_TYPES.KNOWLEDGE;
    desc =
        '传闻是无浪门前辈从秘境发现的神秘口诀，远观山势辨矿脉，近循山理通经脉，融天地与自身为一的玄妙法门。';
    can_enables = [];

    query_prop(lv: number): PropMap {
        return { kuang1: Math.floor(lv / 300) + 1 };
    }

    slots = [
        {
            prop: 'gsj_wd',
            name: '挖矿武道',
            value: () => 1,
            count: 1,
            query_needs: () => [{ path: 'book/gj', count: 1 }],
            format: () => 'TODO：挖矿期间获得武道残页（待实现）',
        },
        {
            prop: 'gsj_qn',
            name: '潜能增加',
            value: lv => 1 + Math.min(lv / 200),
            count: 3,
            query_needs: () => [{ path: 'book/gj', count: 1 }],
            format: val => '挖矿时获得的潜能+' + val,
        },
        {
            prop: 'gsj_ks',
            name: '等级加速',
            value: lv => 1 + Math.min(lv / 100),
            count: 3,
            query_needs: () => [{ path: 'book/gj', count: 1 }],
            format: val => '观山诀提升的速度+' + val,
        },
    ];
}
