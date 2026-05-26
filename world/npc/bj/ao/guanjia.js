this.inherits(NPC);
this.set({
    name: "女管家",
    desc: "她是鳌拜府上的管家，精明干练",
    gender: 2,
    age: 44,
    per: 34,
    mp: 100,
    max_mp: 100,
    hp: 400,
    max_hp: 400,
    score: 10
});
this.set_objects([
    "eq/lv0/cloth", 1, 1
]);
this.skill_map(
    ["dodge", 100],
    ["parry", 100],
    ["force", 100],
    ["unarmed", 100]);

this.on_kill = function (me) {
    this.send_room("$N喊道：还愣着干嘛，快给我上！", me);
    this.each_item(item => {
        if ( item.path == "bj/ao/jiading") {
            item.do_kill(me);
        }
    }, this.environment);
}
this.on_leave = function (me, dir) {
    if (dir == "south" || dir == "north")
        return me.notify_fail("女官家挡住了你。");
}