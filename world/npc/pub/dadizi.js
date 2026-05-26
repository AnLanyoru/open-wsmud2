this.inherits(NPC);
this.set({
    name: "大师兄",
    desc: "他就是你们门派的首席大弟子",
    title: "<hig>首席弟子</hig>",
    gender: 1,
    age: 25,
    per: 18,
    mp: 400,
    max_mp: 400,
    hp: 400,
    max_hp: 400
});
this.on_create = function (path, par) {
    if (!par) return;
    this.family = FAMILIES[par.substr(1)];
    this.init_from(this.family);
    if (this.family == FAMILIES.EMEI) {
        this.gender = 2;
    }
    var user = WORLD.getUser(WORLD.DATA.query_temp(this.family.id + "_top"));
    this.family.init_dadizi(this, user);
    if (!user) this.family.is_init_first = false;
}
this.on_clone = function () {

}
this.on_kill = function (me) {
    return me.notify_fail(this.name + '说道：' + this.callme() + "只接受比试。");
}
this.init_from = function (fam) {

    this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);

    var ary = [];
    for (var i = 0; i < fam.npc_skills.length; i++) {
        ary.push([
            fam.npc_skills[i][0],
            200,
            fam.npc_skills[i][2]
        ]);
    }
    this.skill_map.apply(this, ary);

    this.max_mp = this.mp = 10000;
    this.on_heart_beat = null;
    this.on_damage = null;
    this.hp = this.max_hp = 10000;
    this.init();
    this.recount();
}
this.on_fight_over = function (me, issuc) {
    if (issuc) {
        me.notify(this.name + "对你嘿嘿嘿的笑了几声。");
    } else {
        me.notify(this.name + "对你嘿嘿嘿的笑了几声。");
    }
}

this.greeting = function (me) {
    WORLD.COMMANDS.sx.do_greet(me, this);
}


this.manage = function (me) {
    WORLD.COMMANDS.sx.do_manage(me);
}

this.add_action("ask2", "请安", this.greeting);
this.add_action('manage', '设置', this.manage);

