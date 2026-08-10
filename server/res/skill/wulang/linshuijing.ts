import { SKILL } from '../../../core/skill/skill.js';
import { SKILL_TYPES } from '../../../core/const.js';
import { FAMILIES } from '../../../core/skill/family.js';
import type { PropMap } from '../../../types/props.js';

export default class extends SKILL {
    name = '临水经';
    id = 'linshuijing';
    grade = 1;
    family = FAMILIES.WULANG;
    type = SKILL_TYPES.KNOWLEDGE;
    desc =
        '传闻是无浪门前辈从秘境发现的神秘口诀，学会后明显提升你的钓鱼技巧\n当你加入无浪门后通过钓鱼就能提升等级';
    can_enables = [];

    query_prop(lv: number): PropMap {
        return { diaoyu1: Math.floor(lv / 300) + 1 };
    }

    slots = [
        {
            prop: 'lsj_wd',
            name: '钓鱼武道',
            value: () => 1,
            count: 1,
            query_needs: () => [{ path: 'book/gj', count: 1 }],
            format: () => 'TODO：钓鱼期间获得武道残页（待实现）',
        },
        {
            prop: 'lsj_qn',
            name: '潜能增加',
            value: lv => 1 + Math.min(lv / 200),
            count: 3,
            query_needs: () => [{ path: 'book/gj', count: 1 }],
            format: val => '钓鱼时获得的潜能+' + val,
        },
        {
            prop: 'lsj_ks',
            name: '等级加速',
            value: lv => 1 + Math.min(lv / 100),
            count: 3,
            query_needs: () => [{ path: 'book/gj', count: 1 }],
            format: val => '临水经提升的速度+' + val,
        },
    ];
}
