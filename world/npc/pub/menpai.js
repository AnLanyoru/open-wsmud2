import { NPC } from "../../../os/char/npc.js";

export default function() {
this.inherits(NPC);
this.set({
    name: "门派弟子",
    desc: "门派弟子",
    title: "",
    gender: 1,
    age: 25,
    per: 18,
    mp: 400,
    max_mp: 400,
    hp: 400,
    max_hp: 400,
    no_refresh: true,
    is_drop: false
});
this.init_from = function (fam, level) {

}
}
