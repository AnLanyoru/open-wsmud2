import { MONSTER } from "../../../../os/char/monster.js";

export default function() {
this.inherits(MONSTER);
this.set({
    name: "毒蛇",
    desc: "一只昂首挺胸，吐着信子的毒蛇正盯着你。",
    gender: 1,
    mp: 50,
    max_mp: 50,
    hp: 50,
    max_hp: 50,
    score: 5,
    dex: 10,
    str: 10
});
this.skill_map(
    ["bite", 2]);
//drop path,min,max,per
this.set_drop({
    obj: "res/pimao1",
    min: 1,
    max: 4
});
this.on_enter = function (me) {
    this.do_kill(me);
}
this.on_enter = function (me) {
    if (me.is_player && !me.query_temp('langpi')) {
        this.do_kill(me);
    } else {
        me.notify(this.name + "朝你吐了吐信子。");
    }
}
}
