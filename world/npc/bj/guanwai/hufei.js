this.inherits(NPC);
this.set({
    name: "胡斐",
    desc: "他就是胡一刀之子胡斐，因其武功高强神出鬼没。在江湖上人送外号「雪山飞狐」。他身穿一件白色长衫，腰间别着一把看起来很旧的刀。 ",
    title: "雪山飞狐",
    gender: 1,
    age: 25,
    per: 26,
    mp: 9500,
    max_mp: 9500,
    hp: 13500,
    max_hp: 18500,
    prop: {
        gj: 600,
        mz: 800,
        ds: 800,
        fy: 900
    }
});
this.set_objects([
    "eq/lv0/cloth", 1, 1
], [
    "eq/lv0/dao", 1, 1
]);
this.skill_map(
    ["dodge", 400],
    ["parry", 400],
    ["force", 400],
    ["unarmed", 400],
    ["staff", 300],
    ["blade", 400],
    ["throwing", 400],
    ["sixiangbu", 400, "dodge"],
    ["hujiadaofa", 400, "blade"],
    ["lengyueshengong", 400, "force"],
    ["mantianxing", 400, "throwing"]);
this.set_drop({
    obj: "money/silver",
    min: 10,
    max: 30
}, {
    obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian"],
    odds: 8000
});
this.on_accept = function (me, obj, count) {
    if (!obj || !obj.path) return;
    if (obj.is("sp/bj/yanji")) {
        me.notify("\n<HIC>胡斐大喜道：狗贼！想不到你也有今天！！手起刀落，将阎基的头颅剁为两段。</hic>");
        me.notify("<HIC>胡斐说道：这位" + me.call() + "，如此大恩大德，在下实不知何以为报。</hic>");
        me.set_temp("fb/guanwai/hu", 1);
        return true;
    }
}
this.set_ask("阎基", function (me) {
    var obj = me.find_obj_bypath("sp/bj/yanji");
    if (obj) {
        me.notify("胡斐说道：阎基是我的杀父仇人，如果你把他杀掉，在下必有重谢。");
        me.send_commands("give " + this.id + " " + obj.id, "把阎基的头颅给胡斐");
    } else {
        me.notify("胡斐说道：阎基是我的杀父仇人。");
    }
});
this.set_ask("闯王宝刀", function (me) {

    if (me.query_temp("fb/guanwai/hu")) {
        me.notify("胡斐说道：这把宝刀是我家祖上当闯王护卫时候，闯王亲手赐予的，其中隐藏着关于闯王宝藏的秘密。");
    } else {
        me.notify("胡斐说道：这把宝刀是我家祖上当闯王护卫时候，被闯王亲手赐予的。");
    }
});
this.set_ask("胡家刀谱", function (me) {

    if (me.query_temp("fb/guanwai/hu") == 1) {
        me.notify("胡斐说道：既然" + me.call() + "有兴趣，这几份残篇就给你参悟吧。");
        var obj = me.add_obj("book/bc#hujiadaofa");
        if (obj) me.notify("胡斐给你一" + obj.unit + obj.color_name + "。");
        me.set_temp("fb/guanwai/hu", 2);
    } else {
        me.notify("胡斐说道：胡家刀法是我祖上飞天狐狸所创，可惜刀谱丢了几页。");
    }
});