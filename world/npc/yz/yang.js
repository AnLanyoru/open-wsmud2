import { NPC } from "../../../os/char/npc.js";

export default class extends NPC {
    name = "杨永福";
    desc = "杨老板是土生土长的扬州人，做了几十年的小买卖。";
    title = "杂货铺老板";
    gender = 1;
    age = 45;
    per = 22;
    mp = 1500;
    max_mp = 1500;
    hp = 1500;
    max_hp = 1500;

    constructor() {
        super();
        this.set_goods("eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/mugun", "eq/lv0/jin", "eq/lv0/shoes", "eq/lv0/ring", "eq/lv0/zan", "eq/lv0/whip", "sp/tool/diao#0", "sp/tool/er#0");
    }
}
