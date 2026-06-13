import { NPC } from "../../../../core/char/npc.js";
import type {USER} from "../../../../core/char/user";

export default class extends NPC {
    name = "平四";
    desc = "他是胡家忠心耿耿的仆役。";
    title = "胡家仆佣";
    gender = 1;
    age = 45;
    per = 26;
    mp = 1400;
    max_mp = 4400;
    hp = 5500;
    max_hp = 5500;

    constructor() {
        super();
        this.set_objects([
            "eq/lv0/cloth", 1, 1
        ], [
            "eq/lv0/dao", 1, 1
        ]);
        this.skill_map(
            ["dodge", 300],
            ["parry", 300],
            ["force", 300],
            ["unarmed", 300],
            ["blade", 300],
            ["sixiangbu", 300, "dodge"],
            ["hujiadaofa", 300, "blade"],
            ["lengyueshengong", 300, "force"]);
        this.set_drop({
            obj: "money/silver",
            min: 10,
            max: 20
        }, {
            obj: ["eq/lv0/cloth", "eq/lv0/dao", "eq/lv0/jian"],
            odds: 8000
        }, {
            obj: ["book/bc#hujiadaofa", "book/bc#sixiangbu", "book/bc#lengyueshengong"],
            odds: 3000
        });
        this.set_chat_msg([
            "平四低声说道：少爷就在小茅屋里，只是仇家未除，不能随便惊动。",
            "平四叹道：阎基这贼害苦了胡家，若有他的下落，还请告知我家少爷。"
        ]);
        this.set_ask("胡斐", function (me) {
            me.set_temp("fb/guanwai/pingsi", 1);
            me.notify("平四打量你片刻，低声说道：既是江湖同道，就往北去小茅屋见我家少爷吧。");
        });
        this.set_ask("阎基", function (me) {
            me.set_temp("fb/guanwai/pingsi", 1);
            me.notify("平四咬牙说道：阎基躲在关外一带，你若能拿到他的头颅，少爷必有重谢。");
        });
    }
    on_leave(me: USER, dir: string) {
        if (dir == "north" && !me.query_temp("fb/guanwai/pingsi")) {
            me.notify("平四拦住你恭敬地说道：" + me.call() + "，我家少爷正在屋中，不知你有什么事情？");
            me.send_commands("ask " + this.id + " about 胡斐", "询问胡斐",
                "ask " + this.id + " about 阎基", "询问阎基");
            return false;
        }
    }
}
