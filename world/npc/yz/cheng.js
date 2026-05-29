import { NPC } from "../../../os/char/npc.js";

export default class extends NPC {
    name = "程药发";
    desc = "他就是程药发，扬州现任知府。";
    title = "扬州知府";
    gender = 1;
    age = 45;
    per = 22;
    mp = 1500;
    max_mp = 1500;
    hp = 1500;
    max_hp = 1500;

    constructor() {
        super();
        this.set_objects(["eq/lv0/cloth",1,1]);
        this.add_action("ask1", "追捕", function (me) {

            USERTASK.RUN("yamen2", me);
        });
    }
}

const USERTASK = globalThis.USERTASK;
