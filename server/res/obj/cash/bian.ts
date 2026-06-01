import { OBJ } from "../../../core/item/obj.js";
import { SKILL } from "../../../core/skill/skill.js";
import { CHARACTER } from "../../../core/char/character.js";

export default class extends OBJ {
    unit = "颗";
    name = "变性丹";
    desc = "使用后可以使男性变为女性，女性变为男性，无性变为男性，不满足条件的武功将被移除";
    grade = 5;
    value = 0;

    on_use(me: CHARACTER): boolean | void {

    if (!me.is_player) return me.notify_fail("你不能使用" + this.name + "。");
    var gender = me.gender == 1 ? 2 : 1;
    var list: SKILL[] = [];
    for (var key in me.skills) {
        var skill = SKILL.get(key);
        if (skill && skill.learn_condition) {
            if (skill.learn_condition.gender &&
                skill.learn_condition.gender != gender) {
                if (me.skills[key].ref)
                    return me.notify_fail('请先取消' + skill.query_color_name(me) + '融合的技能。');

                if (me.skills[key].addin && me.skills[key].addin.length)
                    return me.notify_fail('请先取消' + skill.query_color_name(me) + '的技能进阶。');

                list.push(skill);
            }
        }
    }
    if (me.query_temp("bianxing")) {
        var sum = 0;
        for (var i = 0; i < list.length; i++) {
            var needpot = list[i].query_needexp(me.skills![list[i].id].level, me);
            if (me.remove_skill(list[i].id)) {
                if (needpot)
                    sum += needpot;
                me.notify('{type:"dialog",dialog:"skills",remove:"' + list[i].id + '"}');
            }
        }
        me.send_room("<hiy>$N一咬牙，仰头吞下一颗变性丹……\n\n</hiy>");
        if (sum) {
            me.notify("<hig>你遗忘的武功转化为" + sum + "点潜能。</hig>");
            me.pot += sum;
        }
        me.add_status({
            id: "faint",
            is_faint: true,
            duration: 10000,
            name: "昏迷", downside: true,
            finish_msg: "<hiy>慢慢的$N又恢复了知觉...</hiy>\n",
            start_msg: "<hir>$N顿时全身经脉逆行，疼痛难忍，惨叫一声昏了过去……</hir>\n"
        });
        me.gender = gender;
    } else {
        var str = ["<hiy>你吞下这颗丹药后将变成："];
        str.push(["男性", "女性"][gender - 1]);
        str.push("</hiy>");
        if (list.length) {
            str.push("\n<hir>以下武功将会被遗忘：");
            for (var i = 0; i < list.length; i++) {
                str.push("\n");
                str.push(list[i].color_name);
            }
            str.push("</hir>");
        }
        me.notify(str.join(""));
        me.set_temp("bianxing", 1, 10000);
        me.send_commands("use " + this.id, "确定要吃");
        return false;
    }

}
}
