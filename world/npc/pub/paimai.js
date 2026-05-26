this.inherits(NPC);
this.set({
    name: "拍卖师",
    desc: "他是藏宝阁里负责拍卖的拍卖师",
    gender: 1,
    age: 74,
    per: 12,
    mp: 400,
    max_mp: 400,
    hp: 400,
    max_hp: 400,

});
this.set_objects(["eq/lv0/cloth", 1, 1]);

this.set_chat_msg([
    "拍卖师说道：我这里可都是从当铺千挑万选出来的稀有好货，包括一些江湖中已经绝版的珍藏。",
    "拍卖师说道：当有人送来拍卖品时，立即开始拍卖。"
]);
this.add_action("spm", "拍卖物品", function (me, par) {
    WORLD.COMMANDS['pm'].enter(me, 'list');
});
