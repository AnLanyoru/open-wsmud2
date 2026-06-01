import { NPC } from "../../../core/char/npc.js";

export default class extends NPC {
    name = "程灵素";
    desc = "她相貌似乎已有十六七岁，身形却如是个十四五岁的幼女，一双眼睛黑如点漆，朗似秋水";
    title = "<hic>药王</hic>";
    gender = 2;
    age = 16;
    per = 36;
    str = 15;
    con = 30;
    dex = 15;
    int = 40;
    mp = 100;
    exp = 5000000;
    pot = 5000000;
    max_mp = 100;
    hp = 100;
    max_hp = 100;
    level = 3;
    max_item_count = 20;

    constructor() {
        super();
        this.skill_map(
            ["lianyao", 3000]);
    }

    on_master_enter(me) {
    if (this.random(3) == 1) {
        me.notify("程灵素看你进来，对你羞赧一笑，苍白的小脸上笑容如春花初绽，竟似越看越美。");
    }
}
}
