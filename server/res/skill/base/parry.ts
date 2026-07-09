import { SKILL } from '../../../core/skill/skill.js';
import { SKILL_TYPES } from '../../../core/const.js';
import type { PropMap } from '../../../types/props.js';
import type { CHARACTER, DoAttackPar } from '../../../core/char/character.js';

export default class extends SKILL {
    id = 'parry';
    name = '基本招架';
    grade = 0;
    type = SKILL_TYPES.BASE;
    weapon_vs_weapon_actions = [
        '只听见「锵」一声，被$p用手中$i格开了。\n',
        '结果「当」地一声被$p挡开了。\n',
        '但是被$n用手中$i架开。\n',
        '但是$n身子一侧，用手中$i格开。\n',
    ];
    parry_actions = ['但是被$p格开了。\n', '结果被$p挡开了。\n'];
    unarmed_vs_weapon_actions = [
        '但是被$p轻轻一推，$w失了准头，和$p的$l偏了几寸。\n',
        '$p往$N的手腕轻轻一按，结果$w偏向一边。\n',
    ];
    desc = '招架类技能的基础功法，坚持锻炼会提高你的招架能力';

    query_prop(lv: number): PropMap {
        return { zj: lv };
    }

    constructor() {
        super();
        this.set_default(this.id);
    }
}
