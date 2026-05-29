import { MONSTER } from "../../../../os/char/monster.js";

export default function() {
this.inherits(MONSTER);
this.set({
    name: "大狼狗",
    desc: "一只昂首挺胸，吐着长舌头的大狼狗。像是财主家里养的宠物。",
    gender: 1,
    mp: 100,
    max_mp: 100,
    hp: 100,
    max_hp: 100,
    score: 5
});
this.skill_map(
    ["bite", 20]);
//drop path,min,max,per
this.set_drop({
    obj: "res/pimao1",
    min: 1,
    max: 4
});
this.on_enter = function (me) {
    this.do_kill(me);
}
}
