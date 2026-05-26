this.inherits(NPC);
this.set({
    name: "道觉禅师",
    desc: "他是一位身材高大的中年僧人，两臂粗壮，膀阔腰圆。他手持兵刃，身穿一袭灰布镶边袈裟，似乎有一身武艺。",
    title: "少林寺第三十九代弟子",
    gender: 1,
    age: 40,
    per: 26,
    mp: 400,
    hp: 1500,
    score: 10,
    family: FAMILIES.SHAOLIN,
    family_level: 5,
    level: 2,
    max_mp:127400,
    max_hp: 191500,
    prop: {
        gj: 2000,
        mz: 2000,
        ds: 2000
    }
});
this.set_objects([
    "eq/lv0/cloth", 1, 1
], [
        "eq/lv0/mugun", 1, 1
    ]);
this.skill_map(
    ["dodge", 300],
    ["parry", 300],
    ["force", 300],
    ["unarmed", 300],
    ["sword", 300],
    ["club", 300],
    ["literate", 300],
    ["weituogun", 300, "club"],
    ["hunyuanyiqi", 300, "force"],
    ["damojian", 300, "sword"],
    ["shaolinshenfa", 300, "dodge"],
    ["fuhuquan", 300, "unarmed"]);
this.on_master = function (me) {
    if (me.gender == 2) return me.notify_fail("道觉禅师说道：阿弥陀佛，少林寺不收女弟子。");
    if (me.query_skill("hunyuanyiqi", 0) < 100) return me.notify_fail("道觉禅师说道：你的混元一气掌握程度还不够，需要多加练习。");
    return true;
}