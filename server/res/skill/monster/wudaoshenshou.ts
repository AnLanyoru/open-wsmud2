import { SKILL } from '../../../core/skill/skill.js';
import { FAMILIES } from '../../../core/skill/family.js';
import type { CHARACTER, DoAttackPar } from '../../../core/char/character.js';

const TYPE = 'wd_ss_type';
const ROUND = 'wd_ss_round';
const DEFENSE_OK = 'wd_ss_defense_ok';

interface TrialBeast extends CHARACTER {
    trial_type: number;
    trial_owner: string;
}

/** 四方试炼神兽实际装备的空手攻击技能。 */
export default class extends SKILL {
    name = '神兽扑击';
    id = 'wudaoshenshou';
    grade = 1;
    family = FAMILIES.MONSTER;
    can_enables = ['unarmed', 'dodge'];
    attack_actions = ['$N挟着神兽威势扑向$n的$l'];
    dodge_actions = ['$n周身神光一闪，避开了$N的攻势。\n'];

    on_dodge(target: TrialBeast, attacker: CHARACTER, par: DoAttackPar): void {
        if (target.trial_type !== 0 || attacker.id !== target.trial_owner) return;
        if (
            attacker.is_shadow ||
            target.is_faint ||
            target.is_rash ||
            target.is_miss ||
            par.no_dodge
        ) {
            par.is_dodged = false;
            par.is_parried = false;
            return;
        }
        const round = Math.max(1, Number(attacker.query_temp(ROUND, 1)));
        par.is_dodged = attacker.mz < 10_000 * round;
        par.is_parried = false;
    }

    on_attack_over(me: TrialBeast, target: CHARACTER, par: DoAttackPar): void {
        if (
            me.trial_type !== 1 ||
            target.id !== me.trial_owner ||
            Number(target.query_temp(TYPE, -1)) !== 1
        ) {
            return;
        }
        if (par.is_dodged || par.is_parried) target.set_temp(DEFENSE_OK, true);
    }
}
