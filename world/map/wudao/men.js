this.inherits(ROOM);
this.name = "入口"
this.desc = "这里是武道塔的入口，旁边就是天下学武之人无限向往的武道之塔了，站在这里你可以完完整整感受到它庄严雄伟的气势，犹如一根擎天巨柱直入云霄。";
this.exits = { "enter": "wudao/ta" };
//this.no_fight = true;
this.set_npc("pub/wudao_men");
//this.on_enter = function (me) {
//    if (me.level == 4 && me.query_temp("wd")==1) {
//        var npc = this.items[0];
//        if (npc.is("pub/wudao_men")) {
//            me.notify("守门人深深地看了你一眼...");
//        }
//    }
//}



this.on_leave = function (me, dir) {
    if (dir === 'enter') {
        var level = me.query_temp("wd_level", 0);
        if (level >= 99) {
            me.moveto('wudao/ding');
            return false;
        }
    }
}
