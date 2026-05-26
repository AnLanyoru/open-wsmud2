this.inherits(NPC);
this.set({
    name: "逃犯",
    desc: "他是衙门正在追捕的逃犯",
    title: "<red>衙门逃犯</red>",
    gender: 1,
    age: 25,
    per: 18,
    mp: 400,
    max_mp: 400,
    hp: 400,
    max_hp: 400,
    no_refresh: true,
    no_fight: true

});

this.init_from = function (player, grade = 0, level = 0) {

    this.con = this.dex = this.int = this.str = 30;
    this.gender = this.random(2) + 1;

    this.desc = (this.gender == 2 ? "她" : "他") + "是" + player.name + "正在追捕的逃犯";

    this.name = UTIL.random_name(this.gender);

    this.hp = this.max_hp = 1200;
    this.pfm_rate = 1;
    this.mp = this.max_mp = this.max_hp;
    this.init();
    this.recount();

}
