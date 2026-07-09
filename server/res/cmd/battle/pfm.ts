import { COMMAND } from '../../../core/command.js';
import { SKILL } from '../../../core/skill/skill.js';
import { WEAPON_SKILLS } from '../../../core/const.js';
import type { USER } from '../../../core/char/user.js';
import { PfmFlagType } from '../../../types/events.js';
import type { CharacterStatus } from '../../../core/char/character.js';

export default class extends COMMAND {
    command = 'perform';
    allow_busy = true;
    allow_faint = true;
    regex = /^(\w+)\.(.+?)$/;

    /**
     * @param me - 执行命令的角色
     * @param sk - 装备的基础技能
     */
    enter(me: USER, sk: string, pfmid: string) {
        if (!sk || !pfmid) return me.notify('你要使用什么绝招。');
        if (!me.skills) return me.notify('你目前没有学会任何技能。');
        var baseSkill = me.skills.get(sk);
        if (!baseSkill) return me.notify('你不会用这个技能。');

        var sp_skill = SKILL.get(baseSkill.enable_skill || sk);

        if (!sp_skill) return me.notify('没有这个技能。');

        var sp_myskill = me.skills.get(sp_skill.id);

        if (!sp_myskill || sp_myskill.disable)
            return me.notify('这个技能暂时无法使用，请联系管理员处理。');

        var is_ref = false;
        let pfm = sp_skill.get_pfm(pfmid);
        if (!pfm) {
            if (pfmid == 'ref') {
                pfm = me.query_ref_skill(baseSkill);
            }
            if (!pfm) {
                return me.notify(sp_skill.name + '没有这个绝招。');
            } else {
                is_ref = true;
            }
        }
        if (me.environment?.no_fight && !pfm.allow_safe) return me.notify('这里不允许战斗。');

        var name = '【' + pfm.name + '】';
        //use_type 0 只能战斗中使用， 1，只能非战斗 2，任何时候
        if (me.hp <= 0) return me.notify('你已经倒下，无法使用' + name + '。');
        if (!pfm.allow_busy && me.is_busy)
            return me.notify('你现在手忙脚乱，无法使用' + name + '。');
        if (me.is_faint && !pfm.allow_faint) return me.send('你正在昏迷中。');
        if (!pfm.use_type && !me.is_fighting()) return me.notify(name + '只能在战斗中使用。');
        if (pfm.use_type == 1 && me.is_fighting()) return me.notify('战斗中无法使用' + name + '。');

        const now = Date.now();
        if (me.release_time && now < me.release_time) return me.notify('你上个技能还没释放完成。');

        var lv = me.query_skill(sp_skill.id, 0);
        if (is_ref) lv = parseInt(lv / 2);
        if (me.mp < pfm.query_mp(me, lv)) {
            return me.notify('你的内力不够，无法使用' + name);
        }
        if (pfm.check && !pfm.no_check && !pfm.check(me, lv, sk)) return;

        /** 绝招标识 */
        const key = sk + '.' + pfmid;
        if (me.check_pfm_cd(key, now)) {
            return me.notify(pfm.name + '还没准备好，你还不能使用。');
        }

        if (pfm.enable_skill && pfm.enable_skill != sk) {
            return me.notify(
                name + '需要装备为' + SKILL.get(pfm.enable_skill)?.name + '才可以使用。',
            );
        }

        if (!pfm.pass_weapon_check) {
            if (sk === 'throwing' && !me.can_throwing()) {
                return me.notify('你没有装备暗器，无法使用' + name);
            }

            if (pfm.weapon_type) {
                if (pfm.weapon_type != me.query_weapon_type())
                    return me.notify('你装备的武器不对，无法使用' + name);
            } else {
                let need_weapon = WEAPON_SKILLS.has(sk) ? sk : undefined;
                if (need_weapon && need_weapon !== me.query_weapon_type()) {
                    return me.notify('你装备的武器不对，无法使用' + name);
                }
            }
        }
        const target = me.query_enemy();
        if (!pfm.use_type) {
            if (!target) return me.notify('你要用绝招对付谁？');
        }
        let isrelease = me.check_pfm_use(target ?? me, pfm, lv, sk);
        if (isrelease) {
            me.add_mp(-pfm.query_mp(me, lv) || 0);
            me.set_temp('used_pfm', pfm.id, 20000);
            const time = pfm.query_releasetime(me, lv) ?? 0;
            if (time) me.release_time = time + now;
            else me.release_time = 0;

            const distime = pfm.query_distime(me, lv, is_ref);
            const rtime = isrelease ? pfm.query_releasetime(me, lv) : 0;

            pfm.change_distime(me, sk, distime + rtime, true);
            me.send(`{type:"dispfm",rtime:${rtime}}`);
            if (pfm.is_weapon && sp_skill != me.attack_skill) {
                me.attack_skill = sp_skill;
                me.remove_status('weapon', true);
            }
        }
    }
}
