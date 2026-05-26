this.inherits(ROOM);
this.name = "后院"
this.desc = "这里是财主后院，各种古玩琳琅满目，商周青铜、汉瓦当、唐三彩……，应有尽有，只要拥有一件，就够你吃一辈子了。崔员外正坐在琉璃榻上，慢幽幽地喝着参汤。东侧有一扇<cmd cmd='look men'>门(men)</cmd>。";
this.exits = { "south": "yz/cuifu/dayuan", "west": "yz/cuifu/xixiang" };
this.set_npc("yz/cuifu/cui");
this.set_item("men", "门", "这扇门似乎通向一间密室。", [[
    "open", "打开", function (me) {
        if (this.query_exits("east"))
            return me.notify("这扇门已经是打开的。");
        var obj = me.find_obj_bypath("sp/yz/yaoshi");
        if (!obj)
            return me.notify("你不会撬锁。");

        this.add_exit("east", "yz/cuifu/dongxiang");
        me.remove_obj(obj,1);
        me.send_room("$N用一把钥匙打开了秘门，可是钥匙却断了。");
      }
]]);
this.on_leave = function (me, dir) {
    if (dir == "west") {
        var obj = this.find_obj_bypath("yz/cuifu/cui");
        if (obj) {
            me.notify("崔员外挡住了你。");
            return false;
        }
    }
}