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
    }

    on_leave(me, dir) {
    if (dir == "east" || dir == "west") {
        me.notify("船夫对你说道：坐船到江对面1两黄金。");
        me.set_temp("fb/guanwai/jiang", dir);
        me.send_commands("give " + this.id + " 10000 money", "交钱坐船");
        return false;
    } 
}
    on_accept(me, obj, count) {
    if (obj == "money" && count == 10000) {
        if (me.moveto("bj/guanwai/jiang") != false) {
            me.send_room("船夫和$N上了船，一声「起锚」船就张帆离岸了......");
            return true;
        }
    }
}
}
