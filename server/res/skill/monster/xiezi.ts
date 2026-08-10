import { SKILL } from '../../../core/skill/skill.js';
import { FAMILIES } from '../../../core/skill/family.js';
import type { CHARACTER } from '../../../core/char/character.js';
import type { EnablePropMap } from '../../../core/skill/skill.js';

export default class extends SKILL {
    name = '蝎子攻击';
    id = 'xiezigongji';
    grade = 0;
    family = FAMILIES.MONSTER;
    attack_actions = [
        '$N挥舞双螯朝$n的$l夹去',
        '$N猛地扑向$n，尾钩刺向$n的$l',
        '$N高高扬起尾钩，狠狠蜇向$n的$l',
        '$N贴地疾窜，双螯与尾钩同时攻向$n',
    ];
    desc = '蝎子攻击方式，会中蝎毒';
    can_enables = ['bite'];

    query_enable_prop(lv: number): EnablePropMap {
        return {
            bite: {
                gj: lv,
                mz: lv,
                ds: lv,
                desc: '你的攻击有可能让对方中蝎毒',
            },
        };
    }

    on_attack_over(me: CHARACTER, target: CHARACTER, par) {
        if (!par.is_dodged && !par.is_parried) {
            var lv = me.query_skill('xiezigongji', 0);
            var sh = parseInt(lv / 10 + 10);
            if (this.random(lv) > 100) {
                target.add_status({
                    id: 'xiedu',
                    name: '蝎毒',
                    desc: '你中了蝎毒，每三秒减少' + sh + '气血',
                    duration: 3000,
                    duration_count: 4,
                    on_interval: function (me, count) {
                        me.from_attack(
                            sh * count,
                            0,
                            '',
                            '<hir>$N觉得被蝎子蜇中的地方一阵麻痒。</hir>',
                        );
                    },
                    downside: true,
                    override: 1,
                });
            }
        }
    }
}
