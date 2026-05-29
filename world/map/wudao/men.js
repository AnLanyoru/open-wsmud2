import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "入口";
    desc = "这里是武道塔的入口，旁边就是天下学武之人无限向往的武道之塔了，站在这里你可以完完整整感受到它庄严雄伟的气势，犹如一根擎天巨柱直入云霄。";
    exits = { "enter": "wudao/ta" };

    constructor() {
        super();
        this.set_npc("pub/wudao_men");
    }

    on_leave(me, dir) {
    if (dir === 'enter') {
        var level = me.query_temp("wd_level", 0);
        if (level >= 99) {
            me.moveto('wudao/ding');
            return false;
        }
    }
}
}
