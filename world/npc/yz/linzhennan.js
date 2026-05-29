import { NPC } from "../../../os/char/npc.js";

export default class extends NPC {
    name = "林震南";
    desc = "他就是「福威镖局」的总镖头－－林震南。";
    title = "福威镖局当家的";
    gender = 1;
    age = 45;
    per = 34;
    mp = 3000;
    max_mp = 3000;
    hp = 3000;
    max_hp = 3000;

    constructor() {
        super();
        this.skill_map(
                ["unarmed", 150],
                ["dodge", 150],
                ["parry", 150]);
        this.add_action("biao", "运镖", function (me) {

            USERTASK.GET("yunbiao").on_start(me);
        });
        this.add_action("ksyb", "雇佣镖师", function (me) {

            USERTASK.GET("yunbiao").quick_start(me);
        });
    }
}

const USERTASK = globalThis.USERTASK;
