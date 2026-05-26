this.inherits(NPC);
this.set({
    name: "擂台比武报名",
    desc: "他是负责比武大赛报名的",
    gender: 1,
    age: 35,
    per: this.random(20) + 10,
    mp: 1500,
    max_mp: 1500,
    hp: 1500,
    max_hp: 1500
});
this.set_objects([
    "eq/lv1/junfu", 1, 1
]);


this.query_commands = function (player) {
    if (this.json) return this.json;
    var json = {};
    json.type = "item";
    json.desc = this.desc;
    json.id = this.id;
    json.commands = [];

    json.commands.push({
        cmd: "askbiwu " + this.id,
        name: "挑战"
    });
    json.commands.push({
        cmd: "askbiwu1 " + this.id,
        name: "更新我的比武状态"
    });
    this.json = JSON.stringify(json);
    return this.json;
}
this.add_action("askbiwu", "挑战", function (me) {
    me.send('从高手榜单选择你要挑战的高手。');
});

this.add_action("askbiwu1", "观战", function (me) {

    WORLD.COMMANDS['biwu'].enter(me, 'watch');
});

