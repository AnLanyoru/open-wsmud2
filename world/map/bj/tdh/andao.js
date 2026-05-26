

this.inherits(ROOM);
this.name = "暗道";
this.desc = "地道里一片漆黑，呼呼的风声从四面八方传来。你什么也看不见，只能在地道里瞎摸乱撞。西面似乎隐隐约约有人说话，但只一会儿又没声了。你使劲地摇了摇头，很怀疑这到底是不是幻觉。好象你已经迷路了。";

this.exits = { "west": "bj/tdh/andao", "south": "bj/tdh/andao", "north": "bj/tdh/andao", "east": "bj/tdh/andao" };
this.on_enter = function (me) {
    me.notify("你什么也看不见，只能在地道里瞎摸乱撞，好象你已经迷路了。");
}
this.on_leave = function (me, dir) {
    if (dir == 'west') {
        var count = me.add_temp("fb/tdh/andao", 1);
        if (count > 3) {
            me.moveto("bj/tdh/andao2", me.name + "向西方离去。", me.name + "走了过来。");
            return false;
        }
    } else {
        me.set_temp("fb/tdh/andao", 0);
    }

}