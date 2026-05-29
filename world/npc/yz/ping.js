import { NPC } from "../../../os/char/npc.js";

export default class extends NPC {
    name = "平一指";
    desc = "他就是医术高超的「杀人神医」平一指。可是他性格古怪，不是什么人都医的。";
    title = "药铺老板";
    gender = 1;
    age = 65;
    per = 22;
    mp = 1500;
    max_mp = 1500;
    hp = 1500;
    max_hp = 1500;

    constructor() {
        super();
        this.skill_map(
            ["lianyao", 3000]);
        this.add_action('tui', '退款', function (me) {
            var count = me.query_temp('learn/ping', 0);
            if (!count) return me.notify('平一指说道：你从没给老夫交过学费。');
            me.notify('平一指哼了一声。');
            me.remove_temp('learn/ping');
            me.add_exp(0, 0, count);
        });
    }

    on_checkskill(me) {
    if (!me.query_temp("learn/ping")) {
        me.notify_fail("平一指说道：老夫医一人，杀一人。杀一人，医一人，你要不要试试。");
        var lv = me.query_skill("lianyao", 0);

        let grade = SKILL.get('lianyao').query_grade(me);

        var money1 = (lv + lv + 10) * 1000 * (grade + 1) / 2;
        var money2 = (lv + lv + 100) * 10000 * (grade + 1) / 2;
        var money3 = (lv + lv + 1000) * 100000 * (grade + 1) / 2;
        let diff = me.query_prop('haoranqi');
        if (diff > 0) {
            money1 = parseInt(money1 - diff * money1 / 100);
            money2 = parseInt(money2 - diff * money2 / 100);
            money3 = parseInt(money3 - diff * money3 / 100);
        }


        me.send_commands("give " + this.id + " " + money1 + " money", UTIL.moneyToStr(money1) + "学习10级",
            "give " + this.id + " " + money2 + " money", UTIL.moneyToStr(money2) + "学习100级",
            "give " + this.id + " " + money3 + " money", UTIL.moneyToStr(money3) + "学习1000级");
        return false;
    }
    return true;
}
    on_accept(me, obj, count) {
    if (obj != "money") return false;
    me.add_temp("learn/ping", count);
    me.notify("平一指点了点头，说道：不错，你就跟我学学炼药吧。");
    return true;
}
    on_teach(me) {

    return this.on_checkskill(me);
}
    do_teach(me, skill, lv) {
    var money = me.query_temp("learn/ping");
    var exp = parseInt((me.int + me.query_prop("int")) * (100 + me.query_prop("study_per") + me.int) / 100) * 30;

    let grade = skill.query_grade(me);
    let diff = me.query_prop('haoranqi');
    while (exp >= 0) {
        lv = me.query_skill("lianyao", 0);
        var need_money = lv * 100 * (grade + 1);
        if (diff > 0) {
            need_money = parseInt(need_money * (1 - diff / 100));
        }
        if (money >= need_money) {
            money -= need_money;
            var needexp = skill.level_exp(lv, me);
            skill.add_exp(me, needexp);
            exp -= needexp;
            me.add_temp("learn/ping", -need_money);
        } else {
            me.notify("平一指点了点头，说道：嗯，今天就到这里，我要去给人医病了。");
            me.remove_temp("learn/ping");
            me.remove_temp("learn/lianyao");
            return false;
        }
    }
    return true;
}
}

const UTIL = globalThis.UTIL;
const SKILL = globalThis.SKILL;
