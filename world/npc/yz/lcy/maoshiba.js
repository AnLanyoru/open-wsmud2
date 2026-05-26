this.inherits(NPC);
this.set({
    name: "茅十八",
    desc: "他虬髯如乱草，满脸血污，好象曾受过很重的伤，可以看得见他左腿上血迹未干。但他双目炯炯，却又有着说不出的威风。",
    title: "朝廷逃犯",
    gender: 1,
    age: 42,
    per: 20,
    mp: 2000,
    max_mp: 2000,
    hp: 1700,
    max_hp: 2000,
    str: 30,
    score: 45

});
this.set_chat_msg([
    "茅十八说道: 他奶奶的，我就不信鳌拜有这等厉害,我正要上北京去斗他一斗。",
    "茅十八叹道: 用我这五虎断门刀法对付盐枭可是绰绰有余,只不知对付鳌拜行不行。",
    "茅十八说道: 他奶奶的，谁帮我杀了史松，兄弟我谢谢你了！",
    "茅十八说道: 老听人说，那鳌拜是满洲第一武士，他妈的,还有人说他是天下第一勇士，我可不服气，要上北京去跟他比划比划。",
    "茅十八朗声说道：江湖有言：“为人不识陈近南，就称英雄也枉然。”"
]);

this.skill_map(
    ["unarmed", 150],
    ["dodge", 150],
    ["parry", 150],
    ["blade", 150], ["wuhuduanmendao", 150, "blade"]);
this.set_objects(
    ["eq/lv0/duanyi", 1, 1],
    ["eq/lv1/dandao", 1, 1]
);
this.add_action("gei1", "给黑龙鞭", function (me) {
    var obj = me.find_obj_bypath("eq/lv2/hl_bian");
    if (!obj) return me.notify("你身上没有黑龙鞭。");
    me.notify("茅十八对你说道：这位" + me.call() + "，我这里有本五虎断门刀秘籍，如果你把史松的黑龙鞭给我，就送与你了。");

    me.send_commands("give " + this.id + " " + obj.id, "给他");
});
this.on_accept = function (me, obj, count) {
    if (!obj.is("eq/lv2/hl_bian")) return false;
    me.notify("茅十八哈哈大笑道：史松这个狗贼，也有这般下场！", true);
    var obj = me.add_obj("book/book#wuhuduanmendao");
    if (obj) {
        me.notify("茅十八对你抱拳道：这位" + me.call() + "，多谢， 兄弟我命案在身就不多耽搁了，后会有期。");
        me.notify("茅十八给了你一本" + obj.color_name + "。");
        me.notify("茅十八急匆匆的走了。");
        this.destroy();
    }
    me.add_fbscore(50);
    return true;
}
this.set_drop({
    obj: "money/silver",
    min: 2,
    max: 10
}, {
    obj: ["eq/lv0/cloth", "eq/lv0/dao"],
    odds: 6000
}, {
    obj: ["eq/lv0/duanyi", "eq/lv0/duanyi", "book/book#blade", "eq/lv1/lm_shoes", "eq/lv1/lm_shou", "eq/lv1/lm_jian"],
    odds: 4000
}, {
    obj: ["book/bc#wuhuduanmendao", "eq/lv1/dandao"],
    odds: 4000
});

this.on_die = function (me) {
    var item = this.environment.find_by_path("yz/lcy/shisong");
    if (item) {
        this.call_out(getAllFromMe, 100, item, this.environment.items);
    }
}
function getAllFromMe(shi, items) {
    shi.send_message("史松啐了一口：天地会反贼，人人得而诛之！");
    for (var i = 0; i < items.length; i++) {
        if (items[i].fromid == this.id) {
            var objs = items[i].items;
            if (objs) {
                for (var j = 0; j < objs.length; j++) {
                    shi.send_message("史松从" + items[i].color_name + "里拿出了" + objs[j].unit_name() + "。");
                }
            }
            objs.length = 0;
            break;
        }
    }
}