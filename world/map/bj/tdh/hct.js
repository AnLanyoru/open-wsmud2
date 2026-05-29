import { ROOM } from "../../../../os/room/room.js";

export default class extends ROOM {
    name = "回春堂药店";
    desc = "这是一家药铺，一股浓浓的药味让你几欲窒息，那是从药柜上的几百个小抽屉里散发出来的。一位老者在柜台后站着。看到你进来，药铺伙计警惕的看了你一眼。";
    exits = { "west": "bj/tdh/neishi" };

    constructor() {
        super();
        this.set_npc("bj/tdh/huoji","bj/tdh/xu");
    }
}
