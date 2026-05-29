import { NPC } from "../../../../os/char/npc.js";

export default class extends NPC {
    name = "庄允城";
    desc = "这是个饱读诗书，却手无搏鸡之力的书生。因编辑‘明史辑略’，被吴之荣告发，全家逮入京中。";
    gender = 1;
    age = 40;
    per = 33;
    mp = 100;
    max_mp = 100;
    hp = 10;
    max_hp = 100;

    constructor() {
        super();
        this.set_objects([
            "eq/lv0/cloth", 1, 1
        ]);
        this.set_chat_msg([
            "庄允城说道：只怪我当初好心，在书中夹了金叶送与他，谁想这狼心狗肺的家伙竟然就去告发了我。唉...",
            "庄允城说道：谁要把吴之荣抓到庄府就好了。",
            "庄允城叹了口气说道：谁要救了我，我一定把我知道的都告诉他。"
        ]);
        this.set_ask("明史辑略", function (me) {

            me.notify("庄允城叹了口气说道：谁能想到这本书惹来这么大的祸。");

        });
        this.set_ask("密室", function (me) {

            me.notify("庄允城说道：我曾见过鳌拜进密室，把书房的画卷移动一下就行了。");

        });
        this.set_ask("吴之荣", function (me) {

            me.notify("庄允城说道：只怪我当初好心，在书中夹了金叶送与他，谁想这狼心狗肺的家伙竟然就去告发了我。唉...");
            if (me.query_temp("fb/ao/wu")) {
                var obj = OBJ.create_by_odds([
                    {
                        obj: ["sp/bj/jing#5", "sp/bj/jing#6", "sp/bj/jing#7", "sp/bj/jing#8"]
                    }
                ])[0];
                me.remove_temp("fb/ao/wu");
                obj = me.add_obj(obj);
                if (obj) {
                    me.notify("顿了顿，庄允城对你说道：多谢这位" + me.call() + "替我报了大仇，这里有一本鳌拜不小心丢在这里的经书就送给你了。");
                    me.notify("庄允城给了你" + obj.unit_name(1) + "。");

                }
            } else {
                me.notify("顿了顿，庄允城叹了口气说道：替我把吴之荣这厮杀掉吧，我不行了。");
            }


        });
    }
}

const OBJ = globalThis.OBJ;
