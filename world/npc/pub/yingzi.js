import { NPC } from "../../../os/char/npc.js";

export default function() {
this.inherits(NPC);
this.set({
    name: "衙役",
    desc: "",
    title: "",
    gender: 1,
    age: 25,
    per: 18,

    mp: 400,
    max_mp: 400,
    hp: 40000000,
    max_hp: 40000000,

});
}
