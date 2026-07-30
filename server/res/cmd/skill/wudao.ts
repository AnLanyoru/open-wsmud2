import { COMMAND } from '../../../core/command.js';
import type { USER } from '../../../core/char/user.js';
import { WORLD } from '../../../core/world.js';
import { SKILL } from '../../../core/skill/skill.js';

export default class extends COMMAND {
    command = 'wudao,lingwu';
    allow_fight = false;
    regex = /^(\w+)(?:\s+(ok))?$/;

    enter(me: USER, skillid: string, confirm: string) {
        if (!me.skills) return me.notify('你还不会任何技能。');
        const skill = me.skills.get(skillid);
        if (!skill) return me.notify('你还不会这个技能。');
        const skill_base = SKILL.get(skillid);
        if (!skill_base) return me.notify('没有这个技能。');

        const target_skill = Array.from(WORLD.SKILLS.values()).find(
            target => target.source_skill === skillid,
        );
        if (!target_skill) return this.enter_addin(me, skillid);

        const need_count = target_skill.grade === 4 ? 50 : 100;
        const button =
            '进阶为' +
            target_skill.query_color_name(me) +
            '消耗' +
            need_count +
            '<hiz>门派进阶残页</hiz>';
        if (confirm !== 'ok') return me.send_commands('wudao ' + skillid + ' ok', button);
        if (skill.level < 1000) return me.notify('技能达到1000级后才可以进阶。');

        const pages = me.find_obj_bypath('book/up');
        if (!pages || pages.count < need_count) {
            return me.notify('你的<hiz>门派进阶残页</hiz>不足' + need_count + '份。');
        }
        if (!skill_base.grade_up(me, target_skill)) return me.notify('技能进阶失败。');

        me.remove_obj(pages, need_count);
        return me.notify(
            '<hiy>你的' +
                skill_base.query_color_name(me) +
                '成功进阶为' +
                target_skill.query_color_name(me) +
                '。</hiy>',
        );
    }

    enter_addin(_me: USER, _skillid: string) {}
}
