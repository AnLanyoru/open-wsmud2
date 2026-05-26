this.inherits(NPC);
this.set({
    name: "澄净",
    desc: "他是一位须发花白的老僧，身穿一袭金边黑布袈裟。他身材瘦高，太阳穴高高鼓起，似乎身怀绝世武功。",
    title: "少林寺第三十七代弟子",
    gender: 1,
    age: 60,
    per: 26,
    mp: 400,
    hp: 1500,
    score: 10,
    family: FAMILIES.SHAOLIN,
    family_level: 3,
    level: 2,
    max_mp: 727400,
    max_hp: 791500,
    prop: {
        gj: 8000,
        mz: 8000,
        ds: 8000
    }
});
this.set_objects([
    "eq/lv0/cloth", 1, 1
]);
this.skill_map(
    ["dodge", 800],
    ["parry", 800],
    ["force", 800],
    ["unarmed", 800],
    ["sword", 800],
    ["club", 800],
    ["blade", 800],
    ["literate", 800],
    ["jingangquan", 800, "parry"],
    ["yijinjing", 800, "force"],
    ["weituogun", 800, "club"],
    ["ranmudao", 800, "blade"],
    ["shaolinshenfa", 800, "dodge"],
    ["yizhichan", 800, "unarmed"]);
this.on_master = function (me) {
    if (me.gender == 2) return me.notify_fail("澄净说道：阿弥陀佛，少林寺不收女弟子。");
    if (me.query_skill("ranmudao", 0) >= 500 || me.query_skill("ranmudao2", 0) >= 500) {
        if (me.query_skill("yizhichan", 0) >= 500 || me.query_skill("yizhichan2", 0) >= 500) {
            return true;
        }
    }
    if (me.query_skill("ranmudao", 0) < 500 && me.query_skill("ranmudao2", 0) < 500) return me.notify_fail("澄净说道：你的燃木刀掌握程度还不够，需要多加练习。");
    if (me.query_skill("yizhichan", 0) < 500 && me.query_skill("yizhichan2", 0) < 500) return me.notify_fail("澄净说道：你的一指禅掌握程度还不够，需要多加练习。");
    return false;
}