import { NPC } from "../../../../os/char/npc.js";

export default function() {
this.inherits(NPC);
this.set({
    name: "独臂神尼",
    desc: "这是一位白衣女尼，手握拂尘，目视前方。一只长袖空空如也，显是断了一臂，尽管如此，仍然掩不住她迷人的风采。",
    gender: 2,
    age: 37,
    per: 38,
    mp: 400,
    max_mp: 400,
    hp: 2500,
    max_hp: 2500,
    score: 10
});
this.set_objects([
    "eq/lv0/cloth", 1, 1,
    "eq/lv1/fuchen", 1, 1
]);
this.skill_map(
    ["dodge", 300],
    ["parry", 300],
    ["force", 300],
    ["unarmed", 300],
    ["whip", 300],
    ["shenxingbaibian", 300, "dodge"],
    ["qiufengfuchen", 300, "whip"]);
this.set_drop({
    obj: "money/silver",
    min: 10,
    max: 30
}, {
    obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian", "eq/lv1/fuchen"],
    odds: 8000
},
    {
        obj: ["book/bc#shenxingbaibian", "book/bc#qiufengfuchen"],
        odds: 5000
    });
this.on_checkskill = function (me) {
    if (me.query_temp("fb/tdh/dubi") == 2) {
        if (me.query_temp("fb/tdh/shenxing")) return me.notify_fail("独臂神尼说道：虽然不完整，也是秘籍，还请" + me.call() + "不要嫌弃。");

        me.notify("独臂神尼说道：这位" + me.call() + "，如果你想学的话，我这里有份神行百变的秘籍残页，你可以拿去参悟。");
        var obj = me.add_obj("book/bc#shenxingbaibian");
        me.set_temp("fb/tdh/shenxing", 1);
        if (obj) {
            me.notify("独臂神尼给了你" + obj.unit + obj.color_name + "。");
        }
        return false;
    }
    return me.query_temp("fb/tdh/dubi") == 1;
}
this.on_teach = function (me, sk) {
    if (sk != "shenxingbaibian") return me.notify_fail("独臂神尼说道：贫尼只能教你神行百变。");
    return true;
}
}
