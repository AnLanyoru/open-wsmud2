import { COMMAND } from "../../../core/command.js";
import { SKILL } from "../../../core/skill/skill.js";
import { SKILL_TYPES } from "../../../core/const.js";
import { USER } from "../../../core/char/user.js";

export default class extends COMMAND {
  command = "enable";
  regex = /^(\w+?)\s+(.+?)$/;
  allow_fight = false;

  /**
   * @param me - 执行命令的角色
   */
  enter(me: USER, base: string, skill: string, no_sent: string) {
    if (!me.skills) return me.notify("你还不会任何技能。");
    var baseskill = me.skills.get(base);
    if (!baseskill) return me.notify("你还不会这个基本技能。");
    var baseskill_base = SKILL.get(base);
    if (!baseskill_base || baseskill_base.type !== SKILL_TYPES.BASE) {
      return me.notify("没有这个基本技能。");
    }

    if (skill === "none") {
      // ===== 取消特殊技能 =====
      var old_name = baseskill.enable_skill;
      if (!old_name) return;
      var old_user_skill = me.skills.get(old_name);
      var old_skill_base = SKILL.get(old_name);
      if (!old_user_skill || !old_skill_base)
        return me.notify("技能错误，取消失败。");

      old_user_skill[base] = false;
      old_skill_base.disenable(me, base);
      baseskill.enable_skill = null;

      // 移除状态
      if (WEAPON_SKILLS[base]) {
        me.remove_status("weapon", true);
      } else {
        me.remove_status(base, true);
      }

      me.notify(
        "你决定取消使用" +
          old_skill_base.query_color_name(me) +
          "做为" +
          baseskill_base.color_name +
          "的特殊技能。",
      );
      if (me.is_player)
        me.notify(
          '{type:"dialog",dialog:"skills",id:"' + base + '",enable:false}',
        );
      else
        me.notify(
          '{type:"dialog",dialog:"skills","from":"' +
            me.id +
            '",id:"' +
            base +
            '",enable:false}',
        );
    } else {
      // ===== 启用特殊技能 =====
      // 先取消旧的
      if (baseskill.enable_skill) {
        var old_user_skill = me.skills.get(baseskill.enable_skill);
        var old_skill_base = SKILL.get(baseskill.enable_skill);
        if (old_user_skill && old_skill_base) {
          old_user_skill[base] = false;
          old_skill_base.disenable(me, base);
        }
        baseskill.enable_skill = null;
      }

      // 移除状态
      if (WEAPON_SKILLS[base]) {
        me.remove_status("weapon", true);
      } else {
        me.remove_status(base, true);
      }

      // 启用新技能
      var sp_skill = me.skills.get(skill);
      var sp_skill_base = SKILL.get(skill);
      if (!sp_skill) {
        me.remove_status(base, true);
        me.init_skill();
        me.recount();
        return me.notify("你不会这个技能。");
      }
      if (
        !sp_skill_base ||
        sp_skill_base.enable(me, base, me.query_skill(skill)) !== true
      )
        return false;

      baseskill.enable_skill = skill;
      sp_skill[base] = true;
      me.notify(
        "你决定使用" +
          sp_skill_base.query_color_name(me) +
          "做为" +
          baseskill_base.color_name +
          "的特殊技能。",
      );
      if (me.is_player)
        me.notify(
          '{type:"dialog",dialog:"skills",id:"' +
            base +
            '",enable:"' +
            skill +
            '"}',
        );
      else
        me.notify(
          '{type:"dialog",dialog:"skills","from":"' +
            me.id +
            '",id:"' +
            base +
            '",enable:"' +
            skill +
            '"}',
        );
    }

    if (!no_sent) {
      me.init_skill();
      me.recount();
      me.notify_hp();
    }
  }
}

const WEAPON_SKILLS = {
  sword: 4,
  blade: 5,
  staff: 7,
  club: 8,
  whip: 9,
};
