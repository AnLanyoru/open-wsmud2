import { SKILL } from '../../../../core/skill/skill.js';
import type { EnablePropMap } from '../../../../core/skill/skill.js';
import type { CHARACTER, DoAttackPar } from '../../../../core/char/character.js';

export default class extends SKILL {
    name = '密宗心法';
    id = 'mizongxinfa';
    grade = 1;
    force_rad = 0.6;
    desc = '密宗的入门心法';
    can_enables = ['force'];
    learn_condition = {
        max_mp: 200,
        skill: {
            force: 100,
        },
    };

    query_enable_prop(lv: number): EnablePropMap {
        return {
            force: {
                max_hp: lv * 3,
                limit_mp: lv * 10,
                desc: '唯一：将你内力的60%转化为气血',
            },
        };
    }
}
