import { COMMAND } from "../../../os/command.js";

export default function() {
    const SKILL = globalThis.SKILL; const SKILL_TYPES = globalThis.SKILL_TYPES;
this.inherits(COMMAND);
this.command = "enable";
this.regex = /^(\w+?)\s+(.+?)$/;
this.allow_fight = false;
this.enter = function (me, base, skill, no_sent) {
    if (!me.skills) return me.notify("你还不会任何技能。");
    var baseskill = me.skills[base];
    if (!baseskill) return me.notify("你还不会这个基本技能。");
    var baseskill_base = SKILL.get(base);
    if (!baseskill_base || baseskill_base.type !== SKILL_TYPES.BASE) {
        return me.notify("没有这个基本技能。");
    }
    var old_skill;
    if (baseskill.enable_skill) {
        old_skill = me.skills[baseskill.enable_skill];
        if (!old_skill) return me.notify("技能错误，装备失败。");
        old_skill[base] = false;
        old_skill = SKILL.get(baseskill.enable_skill);
        if (old_skill) {
            old_skill.disenable(me, base, me.query_skill(baseskill.enable_skill));
            //me.notify('{type:"dialog",dialog:"skills",id:"' + base + '",enable:false}');
        }
        baseskill.enable_skill = null;

    } else {
        if (skill == "none") return;
    }
    if (WEAPON_SKILLS[base]) {

        me.remove_status("weapon", true);
    } else {
        me.remove_status(base, true);
    }
    if (skill && skill !== "none") {
        var sp_skill = me.skills[skill];
        var sp_skill_base = SKILL.get(skill);
        if (!sp_skill) {
            me.remove_status(base, true);
            me.init_skill();
            me.recount();
            return me.notify("你不会这个技能。");
        }

        if (!sp_skill_base || sp_skill_base.enable(me, base, me.query_skill(skill)) !== true)
            return false;
        baseskill.enable_skill = skill;
        sp_skill[base] = true;
        me.notify("你决定使用" + sp_skill_base.query_color_name(me) + "做为" + baseskill_base.color_name + "的特殊技能。");
        if (me.is_player)
            me.notify('{type:"dialog",dialog:"skills",id:"' + base + '",enable:"' + skill + '"}');
        else
            me.notify('{type:"dialog",dialog:"skills","from":"' + me.id + '",id:"' + base + '",enable:"' + skill + '"}');
    } else {
        baseskill.enable_skill = null;
        me.notify("你决定取消使用" + old_skill.query_color_name(me) + "做为" + baseskill_base.color_name + "的特殊技能。");
        if (me.is_player)
            me.notify('{type:"dialog",dialog:"skills",id:"' + base + '",enable:false}');
        else
            me.notify('{type:"dialog",dialog:"skills","from":"' + me.id + '",id:"' + base + '",enable:false}');
    }
    if (!no_sent) {
        me.init_skill();
        me.recount();
        me.notify_hp();
    }

}

const WEAPON_SKILLS = {
    "sword": 4,
    "blade": 5,
    "staff": 7, "club": 8, "whip": 9
};
}
