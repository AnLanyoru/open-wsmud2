import { FAMILY } from "../../os/skill/family.js";

export default function() {
    const MONSTER = globalThis.MONSTER;
this.inherits(FAMILY);

this.id = "MONSTER";
this.name = "怪物";
this.call = function (player, isbad) {
    return isbad ? "畜生" : "大仙";

}
this.call_me = function (player, isbad) {

}
}
