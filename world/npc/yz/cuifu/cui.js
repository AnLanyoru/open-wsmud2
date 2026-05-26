this.inherits(NPC);
this.set({
    name: "崔员外",
    desc: "崔府的主人，满脸肥肉，据说他鱼肉乡里，坏事做尽",
    title: "财主",
    gender: 1,
    age: 55,
    per: 15,
    mp: 500,
    max_mp: 500,
    hp: 500,
    max_hp: 500,
    score:30
});
this.set_objects(
    ["eq/lv0/cloth", 1, 1]
);
this.skill_map(
        ["unarmed",30],
        ["dodge", 30],
        ["sword", 30],
        ["blade", 30],
        ["parry", 30]);
this.set_drop({
    obj: "money/silver",
    min: 10,
    max: 20
}, {
   obj: ["eq/lv0/cloth", "eq/lv0/jian"],
    odds: 5000
}, {
    obj: "eq/lv1/gold_ring",
    odds: 1000
});

this.on_enter = function (target) {
    if (target.is("yz/cuifu/yahuan")) {
        this.send_room("<hir>崔员外对丫鬟叫道：小娘皮，竟然想跑？</hir>");
        this.do_kill(target);

    } else {
        target.notify("崔员外扯着嗓子喊道：管家，管家，有人闯进来了。");
    }

}