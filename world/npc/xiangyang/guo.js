this.inherits(NPC);
this.set({
    name: "郭靖",
    desc: "被尊为“天下第一侠士”,率领群雄守护着南宋襄阳城的前线边境",
    title: "<hio>北侠</hio>",
    gender: 1,
    age: 45,
    per: 27,
    max_mp: 9000000,
    max_hp: 9000000,
    level: 3,
    pfm_rate: 1,
    no_fight: true,
    prop: {
        gj: 20000,
        fy: 20000,
        mz: 20000,
        zj: 20000,
        ds: 30000,
        diff_sh: 10000
    }
});
this.on_kill = function (me) {
    return false;
}
this.skill_map(
    ["dodge", 3000],
    ["parry", 3000],
    ["force", 3000],
    ["unarmed", 3000],
    ["club", 3000],
    ["dagoubang", 3000, "club"],
    ["yijinjing", 3000, "force"],
    ["xianglongzhang", 3000, ["unarmed", "parry"]],
    ["zhutianbu", 3000, "dodge"]);


this.query_commands = function (player) {

    var json = {};
    json.type = "item";
    json.desc = this.desc;
    json.id = this.id;
    json.commands = [];
    json.commands.push({
        cmd: "look " + this.id,
        name: "查看"
    });

    this.json = JSON.stringify(json)
    return this.json;
}
