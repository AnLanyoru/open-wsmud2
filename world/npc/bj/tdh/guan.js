import { NPC } from "../../../../os/char/npc.js";

export default class extends NPC {
    name = "关安基";
    desc = "只见他长长的胡子飘在胸前，模样甚是威严。因此人称关夫子。";
    title = "关夫子";
    gender = 1;
    age = 35;
    per = 26;
    mp = 400;
    max_mp = 400;
    hp = 1000;
    max_hp = 1000;
    score = 10;

    constructor() {
        super();
        this.set_objects([
            "eq/lv0/cloth", 1, 1
        ]);
        this.skill_map(
            ["dodge", 200],
            ["parry", 200],
            ["force", 200],
            ["unarmed", 200],
            ["houquan", 200, "unarmed"],
            ["yunlongshenfa", 200, "dodge"],
            ["yunlongxinfa", 200, "force"]);
        this.set_drop({
            obj: "money/silver",
            min: 10,
            max: 20
        }, {
            obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian"],
            odds: 8000
        });
        this.set_chat_msg([
            "关安基忽然说：唉，我的脾气不大好，大家可要小心了。",
            "关安基忽然说：本堂的香主谁来当，还轮不到我说话。"
        ]);
    }
}
