import { NPC } from "../../../../os/char/npc.js";

export default class extends NPC {
    name = "龟公";
    desc = "一个满脸横肉的汉子，在丽春院日子久了，养的白白肥肥。";
    gender = 1;
    age = 25;
    per = 22;
    mp = 200;
    max_mp = 200;
    hp = 200;
    max_hp = 200;
    score = 10;

    constructor() {
        super();
        this.set_chat_msg([
            "龟公嘿嘿笑道：小娘皮，来了这里就乖乖地侍侯大爷们吧。",
            "龟公啐了一口，说道：想跑？跑到天涯海角都给你追回来！",
            "龟公恶狠狠的说：哼！你们这些小贱人，活该！"
        ]);
        this.skill_map(
            ["unarmed", 70],
            ["dodge", 70],
            ["parry", 70]);
        this.set_drop({
            obj: "money/silver",
            min: 2,
            max: 10
        }, {
            obj: ["eq/lv0/cloth", "eq/lv0/mugun"],
            odds: 6000
        }, {
            obj: ["eq/lv0/jd_cloth", "eq/lv0/jd_shoes"],
            odds: 6000
        });
    }

    on_leave(me, dir) {
    if (dir == "east" || dir == "west") {
        me.notify("龟公拦住你：这位" + me.call() + "，别着急，先来后到嘛，要不兄弟我另外给你物色个？");
        return false;
    }

}
}
