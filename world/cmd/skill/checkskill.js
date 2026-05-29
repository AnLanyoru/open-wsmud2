import { COMMAND } from "../../../os/command.js";

export default function() {
    const WORLD = globalThis.WORLD; const SKILL = globalThis.SKILL;
this.inherits(COMMAND);
this.command = "checkskill";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.regex = /^(\w+)(?:\s(\w+))?$/;
const num_reg = /^\d+$/;
this.enter = function (player, skid, from) {
    var skill_base = SKILL.get(skid);
    if (!skill_base) {
        return player.send("没有这个技能。");
    }
    // if (skill_base.is_custom && !player.create_for(skid)) {
    //     return player.send('你只能查看公开的技能信息。');
    // }


    var target = player;
    if (from == "help" || num_reg.test(from)) {
        let lv = parseInt(from);
        return player.send(skill_base.query_desc(player, lv > 0 && lv < 3000 ? lv : 1000));
    } else if (from) {
        target = player.find_obj(from, player.environment);
        if (!target && player.user_level > 1) {
            target = WORLD.getUser(from);
        }
        if (!target) player.send("没有这个人。");
        if (player.user_level < 1 && !target.is(player.query_temp("master")) && target.master !== player.id) {
            if (!target.on_checkskill || !target.on_checkskill(player)) {
                return player.notify("你只能查看自己师父的技能。");
            }
        }
    }
    var obj = {};
    obj.type = "dialog";
    obj.dialog = "skills";
    if (skill_base.is_custom)
        obj.is_custom = 1;
    obj.id = skid;
    if (!target.skills) target.skills = {};
    obj.desc = skill_base.query_desc(target, target.query_skill(skid, 1000));
    return player.send(JSON.stringify(obj));
}
}
