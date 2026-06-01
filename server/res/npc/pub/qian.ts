import { NPC } from "../../../core/char/npc.js";

export default class extends NPC {
    name = "钱眼开";
    desc = "他就是钱庄的老板钱眼开，人称铁公鸡";
    title = "钱庄老板";
    gender = 1;
    age = 34;
    per = this.random(20) + 10;
    mp = 400;
    max_mp = 400;
    hp = 400;
    max_hp = 400;

    constructor() {
        super();
        this.set_chat_msg([
            "钱眼开骄傲的说道：本银号已经有上百年的历史，分店遍布天下各地。",
        	"钱眼开说道：昨天我亲自看到一个杀手帮的人来取钱，看来杀手帮重出江湖了。",
        	"钱眼开笑着说道：杀手帮重出江湖对本银号来说，真是求之不的呀！。",
        	"钱眼开笑着说道：当年雾中楼在本银号存的钱可以说是最多的了。",
        	"钱眼开笑着说道：在本店存钱无利息，存物不收手续费，客官你看着办吧。"
        ]);
    }
}
