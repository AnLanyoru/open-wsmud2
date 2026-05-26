this.inherits(NPC);
this.set({
    name: "蒙面大盗",
    desc: "他是来劫镖的江洋大盗",
    title: "蒙面大盗",
    gender: 2,
    age: 65,
    per: 33,
    str: 50,
    con: 50,
    dex: 50,
    int: 50,
    max_mp: 20000000,
    max_hp: 12000000,
    no_fight: true,
    pfm_rate: 1,
    no_refresh: true

});
this.on_kill = function (me) {


}
