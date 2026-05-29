import { FAMILY } from "../../os/skill/family.js";

export default class extends FAMILY {
    id = "MONSTER";
    name = "怪物";

    call(player, isbad) {
    return isbad ? "畜生" : "大仙";

}
    call_me(player, isbad) {

}
}

const MONSTER = globalThis.MONSTER;
