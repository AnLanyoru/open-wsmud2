import { NPC } from "../../../core/char/npc.js";

export default class extends NPC {
    name = "店小二";
    desc = "这位店小二正笑咪咪地忙著，还不时拿起挂在脖子上的抹布擦脸。";
    gender = 1;
    age = 22;
    per = this.random(20) + 10;
    mp = 150;
    max_mp = 150;
    hp = 150;
    max_hp = 150;

    constructor() {
        super();
        this.set_goods("food/food#0", "food/food#1", "food/food#2", "food/food#3", "food/food#4", "food/drink#0", "food/drink#1", "food/drink#2", "food/drink#3");
    }

    on_enter(me) {
    var str = "";
    switch (this.random(2)) {
        case 0:
            str = "店小二笑咪咪地说道：这位" + me.call()
                + "，进来喝杯茶，歇歇腿吧。";
            break;
        case 1:
            str = "店小二用脖子上的毛巾抹了抹手，说道：这位" + me.call()
                + "，请进请进。";
            break;
    }
    me.notify(str);
}
    on_leave(me, dir) {

}
}
