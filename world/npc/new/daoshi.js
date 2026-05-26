this.inherits(NPC);
this.set({
    name: "<hic>指引者</hic>",
    desc: "她是一位漂亮的女性，脸上笑眯眯的",
    title: "<hig>新手导师</hig>",
    gender: 2,
    age: 20,
    per: 41,
    mp: 1500,
    max_mp: 1500,
    hp: 1500,
    max_hp: 1500,
});
this.set_objects([
    "sp/new/qicai", 1, 1
]);




this.query_commands_json = function (player, isyb) {

    var json = {};
    json.type = "item";
    json.desc = this.desc;
    json.id = this.id;
    json.commands = [];
    json.commands.push({
        cmd: "look " + this.id,
        name: "查看"
    });

    if (this.actions) {
        for (var cmd in this.actions) {
            if (!this.actions[cmd].name) continue;
            json.commands.push({
                cmd: cmd + " " + this.id,
                name: this.actions[cmd].name
            });
        }
    }
    return JSON.stringify(json);
}