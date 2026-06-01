import { OBJ } from "../../../core/item/obj.js";
import { WORLD } from "../../../core/world.js";
import { UTIL } from "../../../core/util/util.js";
import { FAMILIES } from "../../../core/skill/family.js";
import { SKILL } from "../../../core/skill/skill.js";

export default class extends OBJ {
    unit = "张";
    name = "叛师符";
    desc = "使用后可以使脱离当前门派，门派学到的所有武功会遗忘，会返还你学习和练习技能消耗的潜能";
    grade = 5;
    value = 0;

    on_use(me) {
    if (!me.is_player) return me.notify_fail("你不能使用" + this.name + "。");
    if (me.query_temp('tuolicd')) return me.notify_fail("你刚脱离门派没多久，频繁的背叛师门会被武林中人所不齿的。");
    if (!me.family || me.family == FAMILIES.NONE)
        return me.notify_fail("你还没有门派，不需要叛师。");
    var list = [];
    var up_count = 0;
    for (var key in me.skills) {
        var skill = SKILL.get(key);
        if (skill.family === me.family) {
            let skitem = me.skills[key];
            if (skitem.ref)
                return me.notify_fail('请先取消' + skill.query_color_name(me) + '融合的绝招。');
            if (skitem.addin && skitem.addin.length)
                return me.notify_fail('请先取消' + skill.query_color_name(me) + '的技能进阶。');

            list.push(skill);
            if (skill.source_skill) {
                up_count += (skill.grade === 4 ? 50 : 100);
            }
        }
    }
    if (me.query_temp("tuoli")) {
        var sum = 0;
        for (var i = 0; i < list.length; i++) {
            var needpot = list[i].query_needexp(me.skills[list[i].id].level, me);
            if (me.remove_skill(list[i].id)) {
                if (needpot)
                    sum += needpot;
                me.notify('{type:"dialog",dialog:"skills",remove:"' + list[i].id + '"}');
            }
        }
        me.send_room("<hiy>$N义无反顾的拿出叛师符，嘴里念念有词...\n\n</hiy>");
        if (sum) {
            me.notify("<hig>你遗忘的武功转化为" + parseInt(sum) + "点潜能。</hig>");

            me.pot += parseInt(sum);
        }
        if (up_count > 0) {
            let obj = me.add_obj('book/up', up_count);
            me.notify("你获得了" + obj.unit_name(up_count) + "。");
        }

        me.add_status({
            id: "faint",
            is_faint: true,
            duration: 10000,
            name: "昏迷", downside: true,
            finish_msg: "<hiy>慢慢的$N又恢复了知觉...</hiy>\n",
            start_msg: "<hir>$N突然觉得一生所学忘了个精光，头痛难忍，惨叫一声昏了过去……</hir>\n"
        });
        let fam = me.family;
        me.family = FAMILIES.NONE;
        me.add_title("普通百姓", "family");
        me.remove_temp("master");

        //me.remove_temp("master");
        me.remove_temp("family");
        me.remove_temp("family_level");
        me.set_temp('tuolicd', 1, UTIL.diff_time());
        WORLD.DATA.reset_famtops(me, fam);


    } else {
        var str = ["<hiy>你使用这张符咒后将会脱离" + me.family.name + "，以下武功将会被遗忘："];
        str.push("</hiy>");
        if (list.length) {
            str.push("\n");
            for (var i = 0; i < list.length; i++) {
                str.push("\n");
                str.push(list[i].color_name);
            }
            str.push("");
        }
        str.push('\n脱离门派期间师门物资将停止发放。');
        if (up_count > 0) {
            str.push('\n退还' + up_count + '份<hiz>门派进阶残页</hiz>。');
        }

        me.notify(str.join(""));
        me.set_temp("tuoli", 1, 10000);
        me.send_commands("use " + this.id, "确定脱离门派");
        return false;
    }

}
}

