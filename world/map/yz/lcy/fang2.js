this.inherits(ROOM);
this.name = "东厢"
this.desc = "这是丽春院二楼东面的一间卧房，里面满是女儿家的胭脂味，最里面一张大床挂着晕红的帐幔，床斜对面有一座玳瑁彩贝镶嵌的<cmd cmd='look tai'>梳妆台</cmd>，甚是华美无朋，绚丽夺目。";
this.exits = { "east": "yz/lcy/erlou" };
this.set_npc("yz/lcy/shisong");
this.set_item("tai", "梳妆台", "一座绚丽夺目的梳妆台。", [
    ["tui", "推", function (me) {

        if (this.query_exits("enter"))
            return me.notify("梳妆台已经被你推到一边了。");
        me.send_room("$N试着推了推梳妆台，发现可以推动，$P再一使力，把梳妆台推到一边，后面露出一个黑乎乎的入口。");
        var npc = this.find_by_path("yz/lcy/shisong");

        this.add_exit("enter", "yz/lcy/mishi");
        if (npc) {
            me.notify("史松哈哈大笑道：反贼原来躲到这里来了，" + me.call() + "，干的不错，拿去买酒！");
            me.money += 10000;
            me.notify("史松丢给你10两银子。");
            npc.do_command("go", "enter");
        }
    }]
]);