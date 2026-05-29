import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "zigong";

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, arg) {
    if (me.gender == 2) return me.notify("你要割什么？");
    if (me.gender == 3) return me.notify("你都没有了还要割什么？");
    var list = [];
    for (var key in me.skills) {
        var skill = SKILL.get(key);
        if (skill.learn_condition) {
            if (skill.learn_condition.gender &&
                skill.learn_condition.gender != 3) {
                list.push(skill);
            }
        }
    }

    if (arg=="ok") {
        var weap = me.query_weapon_type();
        if (weap == WEAPON_TYPE.NONE) return me.notify("好歹准备个好用的工具吧？");
        for (var i = 0; i < list.length; i++) {
            if (me.remove_skill(list[i].id)) {
                me.notify('{type:"dialog",dialog:"skills",remove:"' + list[i].id + '"}');
            }
        }
        me.send_room("<hic>$N一咬牙，褪下下衣，伸出" + me.weapon_name() + "插到$P两腿之间，飞速一剜，……\n\n</hic>");
        me.add_status({
            id: "faint",
            is_faint: true,
            duration: 10000,
            name: "昏迷", downside: true,
            finish_msg: "<hiy>慢慢的$N又恢复了知觉...</hiy>\n",
            start_msg: "<hir>$N顿时惨叫一声昏了过去……</hir>\n"
        });
        me.gender = 3;
    } else {

        var str = ["<hir>你可想好了，割了可就没了！</hir>"];
        if (list.length) {
            str.push("\n<hir>以下武功将会被遗忘：");
            for (var i = 0; i < list.length; i++) {
                str.push("\n");
                str.push(list[i].color_name);
            }
            str.push("</hir>");
        }
        me.send(str.join(""));
        me.send_commands("zigong ok","确认不要了");
    }

}
}

const SKILL = globalThis.SKILL;
const WEAPON_TYPE = globalThis.WEAPON_TYPE;
