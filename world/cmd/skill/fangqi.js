import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "fangqi";
    allow_fight = false;
    regex = /^(\w+)(?:\s+(\w+))?$/;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, skillid, sid) {
    if (!me.skills) return me.notify("你还不会任何技能。");
    var skill = me.skills[skillid];
    if (!skill) return me.notify("你还不会这个技能。");
    var skill_base = SKILL.get(skillid);
    if (!skill_base) return me.notify("没有这个技能。");
    if (skill_base.grade < 1 || skill_base.type === SKILL_TYPES.KNOWLEDGE) {
        return me.notify("基础和知识技能不能遗忘。");
    }
    if (!sid) {
        if (skill.ref) {
            return me.notify("你需要先取消融合才可以遗忘技能。");
        }
        if (skill.addin && skill.addin.length > 0) {
            return me.notify("你需要先取消进阶才可以遗忘技能。");
        }
    }

    let up_count = 0;
    if (skill_base.source_skill) {
        up_count += (skill_base.grade === 4 ? 50 : 100);
    }
    var level = skill.level;


    var exp = (100 + level) * (level - 100) / 2 * (skill_base.query_grade(me) + 1) * 5;

    if (skill_base.type !== SKILL_TYPES.KNOWLEDGE) {
        if (!sid) {
            let str = "。";
            if (up_count > 0) {
                str = "，直接遗忘会退还" + up_count + "份<hiz>门派进阶残页</hiz>。";
            }
            let befroe = me.master ? "dc " + me.id + " " : "";
            me.send("是否确认重置" + skill_base.query_color_name(me) + "？100级后的潜能全部返还" + str);
            return me.send_commands(befroe + 'fangqi ' + skillid + " ok", '直接遗忘',
                befroe + 'fangqi ' + skillid + " 100", "重置到100级",
                befroe + 'fangqi ' + skillid + " 3000", "重置到3000级");
        } else if (sid !== 'ok') {

            let reset_level = parseInt(sid);
            if (!(reset_level >= 100)) return me.notify('输入等级错误。');


            return this.reset_skill(me, skill, skill_base, reset_level);
        }
    }
    exp = parseInt(exp);

    if (me.remove_skill(skillid)) {
        me.notify('{type:"dialog",dialog:"skills","from":"' + me.id + '",remove:"' + skillid + '"}');

        if (level > 100 && skill_base.type !== SKILL_TYPES.KNOWLEDGE) {

            me.pot += exp;
            me.notify("<hic>你遗忘的技能" + skill_base.query_color_name(me) + "转化为" + exp + "点潜能。</hic>");

        } else {
            me.notify("<hic>你已遗忘技能" + skill_base.query_color_name(me) + "。</hic>");
            exp = 0;
        }
        if (up_count > 0) {
            let obj = me.add_obj('book/up', up_count);
            me.send('你获得' + obj.unit_name(up_count) + "。")
        }
        if (me.master) return;
        WORLD.add_recover_obj(me, {
            id: skillid,
            name: skill_base.color_name,
            up_count: up_count,
            addin: skill.addin,
            level: level,
            pot: exp
        }, 3);
    }
}
    reset_skill(me, skill, skill_base, level) {
    if (skill_base.type === SKILL_TYPES.KNOWLEDGE) return me.notify_fail('知识类技能无法重置。');
    if (skill.level <= level) return me.notify("你的" + skill_base.query_color_name(me) + "不用重置等级。");
    let exp = (100 + skill.level) * (skill.level - 100) / 2 * (skill_base.query_grade(me) + 1) * 5;
    if (level > 100) {
        exp -= (100 + level) * (level - 100) / 2 * (skill_base.query_grade(me) + 1) * 5;
    }

    me.pot += exp;
    let curr_level = me.query_skill(skill_base.id, 0);
    me.notify("<hic>你的" + skill_base.query_color_name(me)
        + "重置为" + level + "级，返回" + exp + "点潜能。</hic>");

    // console.log(curr_level);
    me.add_score(-skill_base.query_score(curr_level, me));
    skill_base.release_prop(me, curr_level);



    skill.level = level;
    skill.exp = 0;
    curr_level = me.query_skill(skill_base.id, 0);
    // console.log(curr_level);
    me.add_score(skill_base.query_score(curr_level, me));

    skill_base.attach_prop(me, curr_level);
    me.recount();

    var str = ['{type:"dialog",dialog:"skills",item:'];
    skill_base.item_to_json(str, skill, me);
    str.push("}");
    me.notify(str.join(""));
    return true;
}
}

const WORLD = globalThis.WORLD;
const SKILL = globalThis.SKILL;
const SKILL_TYPES = globalThis.SKILL_TYPES;
