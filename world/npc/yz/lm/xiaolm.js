import { NPC } from "../../../../os/char/npc.js";

export default function() {
this.inherits(NPC);
this.set({
    name: "小流氓",
    desc: "他是流氓巷里的小流氓，整天无所事事，吊儿郎当",
    gender: 1,
    age: 18,
    per: 20,
    str: 30,
    con: 20,
    dex: 15,
    int:15,
    mp: 100,
    max_mp: 100,
    hp: 200,
    max_hp: 200,
    score: 5
});
this.set_objects(
    ["eq/lv0/cloth", 1, 1]
);
this.skill_map(
    ["unarmed", 30],
    ["sword", 30],
    ["dodge", 30],
    ["parry", 30]);
this.set_drop({
    obj: "money/coin",
    min: 10,
    max: 20
}, {
        obj: ["eq/lv0/cloth", "eq/lv0/shoes", "eq/lv0/jin"],
        odds: 8000
    },{
        obj: "sp/npc#liumang",
        odds: 40
    });

this.on_kill = function (me) {
    this.each_item(item=> {
        if (item!=this&& item.path == this.path) {
            this.send_room("$N喊道：兄弟们有人搞事，并肩子上！");
            item.do_kill(me);
        }
    }, this.environment);
}
//this.on_die = function (me) {
//    if (!me) {
//        return;
//    }
//    if (me.can_follow(this)) {
//        me.notify("小流氓抓着你腿，痛哭流涕哭喊到：大人饶命啊，小的上有老下有小，只要大人放小的一马，小的一定鞍前马后追随大人你！");
//        me.send_commands("ok " + this.id, "答应他", "no " + this.id, "不要");
//        this.end_fight();
//        return false;
//    }
//}
//this.add_action("ok", null, function (me) {
//    if (me.add_follower(this)) {
//        me.notify("你想了一下觉得有个小弟使唤也不错，便点头到：好吧，我就收下你当小弟，以后就看你表现！");
//        me.notify("<him>你获得了小流氓的追随，你可以去你的住所找他。</him>");
//        this.destroy();
//    }

//});
//this.add_action("no", null, function (me) {
//    me.notify("你大怒道：一个小流氓也想跟着我。手起刀落，小流氓就躺在地上了！");
//    this.die(me);
//});
}
