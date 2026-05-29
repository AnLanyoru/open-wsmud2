import { NPC } from "../../../../os/char/npc.js";

export default class extends NPC {
    name = "庄夫人";
    desc = "只见她约莫二十六七年纪,全身缟素,不施脂粉,脸色苍白";
    title = "庄家三少奶奶";
    gender = 2;
    age = 26;
    per = 32;
    mp = 400;
    max_mp = 400;
    hp = 1500;
    max_hp = 1500;

    constructor() {
        super();
        this.set_objects([
            "eq/lv0/cloth", 1, 1
        ], [
            "eq/lv0/dao", 1, 1
        ]);
        this.skill_map(
            ["dodge", 150],
            ["parry", 150],
            ["force", 150],
            ["unarmed", 150],
            ["sword", 150],
            ["huashanjianfa", 150, "sword"],
            ["shenxingbaibian", 150, "dodge"]);
        this.set_drop({
            obj: "money/silver",
            min: 10,
            max: 20
        }, {
            obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian", "eq/lv0/tiezhang"],
            odds: 8000
        }, {
            obj: ["book/bc#shenxingbaibian", "book/bc#huashanjianfa", "book/bc#shenlongjian"],
            odds: 3000
        });
        this.set_ask("吴之荣", function (me) {
            if (me.query_temp("fb/zhuang/shuang")) return me.notify("庄夫人说道：多谢恩公代妾身手刃了次贼。");
            me.notify("庄夫人说道：这个狗贼害的我家破人亡，我一定要手刃了这个奸贼。");
            var obj = me.find_obj_bypath("sp/bj/wu");
            if (obj)
                me.send_commands("give " + this.id + " 1 " + obj.id, "给她吴之荣的头颅");
        });
    }

    on_accept(me, obj, count) {
    if (!obj || !obj.path || me.query_temp("fb/zhuang/shuang")) return;
    if (obj.is("sp/bj/wu")) {
        me.notify("庄夫人看着吴之荣的头颅，或许是想到了已经阴阳两隔的家人，清丽的脸上有几分愤怒，更多的是悲伤。\n半晌后庄夫人擦了擦眼角对你说道：这位" +
            me.call() + "，如此大恩大德,妾身实不知何以为报。");
        if (me.per + me.query_prop("per") > 36) {
            me.notify("庄夫人拉着双儿对你说道：这小丫头跟随妾身多年,做事也还妥当，就送与恩公代为照料。");
            me.set_temp("fb/zhuang/shuang", 1);
        } else {
            me.notify("庄夫人看了你一会，对你说道：这本书是救妾身这群人的恩公给我的，今日就送与恩公。");
            var obj = me.add_obj("book/bc#huashanjianfa");
            if (obj) {
                me.notify("庄夫人给了你" + obj.unit_name(1) + "。");
            }
        }
        return true;
    }
}
}
