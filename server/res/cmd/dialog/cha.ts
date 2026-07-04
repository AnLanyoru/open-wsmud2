import {COMMAND} from "../../../core/command.js";
import {CHARACTER} from "../../../core/char/character.js";
import type { USER } from "../../../core/char/user.js";
import {WORLD} from "../../../core/world.js";
import {SKILL} from "../../../core/skill/skill.js";
import type sk_group from "../skill/sk_group.js";

export default class extends COMMAND {
    command = "cha,skills";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me: USER, arg: string) {
        var target: CHARACTER = me;
        var isfollower = false;
        if (arg) {
            if (arg == "none") return me.notify('{"type":"dialog","dialog":"skills","limit":' + me.skill_limit() + "}");

            let other_target = me.find_obj(arg, me.environment);
            if (!other_target && me.user_level > 1) {
                other_target = WORLD.getUser(arg);
            }
            if (!other_target || !other_target.check_character()) {
                return me.notify("这里没有这个人。");
            }
            if (target.master == me.id) {
                isfollower = true;
            } else {
                if (target.on_checkskill) {
                    if (target.on_checkskill(me) == false) return;
                } else {
                    if (me.user_level < 4 && !target.is(me.query_temp("master")))
                        return me.notify("你只能查看自己师父的技能。");
                }
            }
            target = other_target
        }
        this.render_skill(me, target, isfollower);
    }

    render_skill(me: USER, target: CHARACTER, isfollower: boolean) {
        var skills = target.skills;
        var str: string[] = ['{"type":"dialog","dialog":"'];
        str.push(me === target ? 'skills' : 'master');
        str.push('","items":[');
        var skill_count = 0;
        if (skills) {
            for (const [skid, skillData] of skills) {
                var skill_base = SKILL.get(skid);
                if (!skill_base) continue;
                if (skill_count > 0) str.push(",");
                skill_base.item_to_json(str, skillData, target);
                skill_count++;

            }
        }
        str.push('],title:"');
        str.push(target == me ? "你" : target.name);
        str.push(skill_count > 0 ? "共学会" + skill_count + "项技能" : "没有学会任何技能");
        str.push('"');
        str.push(',limit:');
        if (isfollower)
            str.push(String(target.skill_limit()));
        else
            str.push(String(me.skill_limit()));
        str.push(',pot:');
        str.push(String(me.pot));
        if (target !== me) {
            str.push(isfollower ? ",follower:\"" : ',master:\"');
            str.push(target.id);
            str.push("\"");
            if (isfollower) {
                str.push(',target:\"');
                str.push(target.name);
                str.push("\"");
            }
        } else {
            const skgroup_cmd = WORLD.COMMANDS.get("skgroup") as sk_group
            str.push(',sk_group:', String(skgroup_cmd.cur_eqs(me) ?? 0));
        }

        str.push("}");
        me.send(str.join(""));
    }
}

