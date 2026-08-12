import { COMMAND } from '../../../core/command.js';
import { CHARACTER } from '../../../core/char/character.js';
import type { USER } from '../../../core/char/user.js';
import { WORLD } from '../../../core/world.js';
import { SKILL } from '../../../core/skill/skill.js';
import { SkillsMap } from '../../../core/char/skills_map.js';
import { SKILL_TYPES } from '../../../core/const.js';

export default class extends COMMAND {
    command = 'checkskill';
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    regex = /^(\w+)(?:\s(\w+))?$/;

    /**
     * @param  player - 执行命令的角色
     * @param skid
     * @param from
     */
    enter(player: USER, skid: string, from: string) {
        const skill_base = SKILL.get(skid);
        if (!skill_base) {
            return player.send('没有这个技能。');
        }
        // if (skill_base.is_custom && !player.create_for(skid)) {
        //     return player.send('你只能查看公开的技能信息。');
        // }

        let target = player;
        if (from == 'help' || num_reg.test(from)) {
            let lv = parseInt(from);
            return player.send(skill_base.query_desc(player, lv > 0 && lv < 5000 ? lv : 1000));
        } else if (from) {
            target = player.find_obj(from, player.environment) as USER;
            if (!target && player.user_level > 1) {
                const new_target = WORLD.getUser(from);
                if (new_target) target = new_target;
            }
            if (!target || !target.check_character()) {
                return player.send('没有这个人。');
            }
            if (
                target.master !== player.id &&
                player.user_level < 4 &&
                !target.is(player.query_temp('master'))
            ) {
                if (target.on_checkskill) {
                    if (target.on_checkskill(player) === false) return;
                } else {
                    return player.notify('你只能查看自己师父的技能。');
                }
            }
        }
        var obj = {
            type: 'dialog',
            dialog: 'skills',
            id: skid,
            desc: skill_base.query_desc(target, target.query_skill(skid, 1000)),
            is_custom: skill_base.is_custom,
            can_fuse: false,
            is_fused: false,
            fusion_entry: skill_base.type === SKILL_TYPES.SKILL,
        };
        if (!target.skills) target.skills = new SkillsMap();
        const skill = target.skills.get(skid);
        if (skill && skill_base.type === SKILL_TYPES.SKILL) {
            obj.is_fused = !!skill.ref;
            obj.can_fuse = !skill.ref && skill.level >= 3000 && skill_base.query_grade(target) === 5;
        }
        return player.send(JSON.stringify(obj));
    }
}

const num_reg = /^\d+$/;
