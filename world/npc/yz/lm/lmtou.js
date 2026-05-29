import { NPC } from "../../../../os/char/npc.js";

export default function() {
this.inherits(NPC);
this.set({
    name: "流氓头",
    desc: "流氓巷里的流氓小头目。",
    gender: 1,
    age: 25,
    per: 20,
    mp: 500,
    max_mp: 500,
    hp: 500,
    max_hp: 500,
    score: 20
});
this.skill_map(
    ["sword", 80],
    ["dodge", 80],
    ["parry", 80]);
this.set_objects(
    ["eq/lv1/lm_cloth", 1, 1],
    ["eq/lv1/lm_jian", 1, 1]
);
this.set_drop({
    obj: "money/silver",
    min: 2,
    max: 10
}, {
    obj: ["eq/lv0/cloth", "eq/lv0/jian"],
    odds: 6000
}, {
    obj: ["eq/lv1/lm_head", "eq/lv1/lm_cloth", "eq/lv1/lm_shoes", "eq/lv1/lm_shou", "eq/lv1/lm_jian", "eq/lv1/lm_gun"],
    odds: 3000
});

this.on_kill = function (me) {
    if (this.call_lm) return;
    this.call_lm = true;
    this.send_message("流氓头叫道：哪里来王八蛋来这里撒野");
    NPC.CREATE("yz/lm/liumang", this.environment, function (bing) {
        bing.do_kill(me);
    }, 2);
}
}
