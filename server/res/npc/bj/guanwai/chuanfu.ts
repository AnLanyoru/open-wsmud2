import { NPC } from "../../../../core/char/npc.js";

export default class extends NPC {
    name = "船夫";
    desc = "这是一个松花江上的船夫。饱经风霜的脸上透出东北人的豪爽。";
    gender = 1;
    age = 45;
    per = 26;
    mp = 400;
    max_mp = 400;
    hp = 500;
    max_hp = 500;

    constructor() {
        super();
        this.set_objects([
            "eq/lv0/cloth", 1, 1
        ]);
        this.set_drop({
            obj: "sp/tool/diao#1",
            odds:500    
        }, {
                obj: "sp/tool/diao#2",
                odds: 50
            });
        this.set_chat_msg([
            "船夫搓着手说道：江上风急，要过江就交一两黄金。",
            "船夫抬头望了望天色，说道：再晚些风雪更大，船就不好走了。",
            "船夫说道：往西过了江，就是船厂，再往南便是一片雪地。"
        ]);
        this.set_ask("过江", function (me) {
            me.notify("船夫说道：坐船到江对面一两黄金，风雪再大也给你送过去。");
            me.send_commands("give " + this.id + " 10000 money", "交钱坐船");
        });
        this.set_ask("船厂", function (me) {
            me.notify("船夫说道：江对岸有个旧船厂，过了船厂就是白茫茫的雪地，进山的人都要小心。");
        });
    }

    on_leave(me, dir) {
    if (dir == "east" || dir == "west") {
        me.notify("船夫对你说道：江面化冻了，没船可不行。");
        me.send_commands("ask " + this.id + " about 过江", "询问过江",
            "ask " + this.id + " about 船厂", "询问船厂");
        me.set_temp("fb/guanwai/jiang", dir);
        return false;
    } 
}
    on_accept(me, obj, count) {
    if (obj == "money" && count == 10000) {
        if (me.moveto("bj/guanwai/jiang") != false) {
            me.send_room("船夫带着$N上了船，船夫辨着水势掌舵，一声「起锚」船就张帆离岸了......");
            return true;
        }
    }
}
}
