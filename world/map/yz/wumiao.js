this.inherits(ROOM);
this.name = "武庙"
this.desc = "这里是岳王庙的正殿，内有岳飞像，像上方悬挂岳飞手书“还我河山”的横匾。殿两侧壁上嵌着“精忠报国”四个大字。武人到此，都放下武器，毕恭毕敬地上香礼拜。旁边似乎有一道侧门。";
this.exits = { "east": "yz/beidajie2" };
this.no_fight = true;
this.is_heartbeat = true;
this.on_heart_beat = function () {
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (item.hp) {
            item.add_hp(parseInt(item.max_hp / 10));
            item.add_mp(parseInt(item.max_mp / 10));
        }
    }
}

this.add_action("shangxiang", "上香", function (me) {
    var dt = new Date();

    if (dt.getMonth() !== 3 || dt.getDate() !== 5) return me.notify("今天不是清明节，不用来上香。");
    if (me.query_temp('qm_hd', 0) >= 3) return me.notify("你已经上完香了。");
    var id = WORLD.DATA.query_temp("new_die");
    if (!id) return me.notify("最近没人变成孤魂野鬼，再等等。");
    let fh_user = WORLD.getUser(id);
    if (!fh_user) return me.notify("最近没人变成孤魂野鬼，再等等。");

    var type = WORLD.DATA.query_temp("new_die_type");
    var name = fh_user.name;

    var cmds = ["<mag>今天风很大，阳光正好，" + name + "走的很安详，嘴角含笑。$N深深的鞠了一躬。</mag>",
    "<blu>$N走上前去感叹道：" + name + "生前也是个体面人，还是上一炷香再走吧。</blu>",
    "<yel>有人的活着他已经死了，而" + name + "虽然不在了，却仍然活在武庙中。</yel>",
    "<CYN>一个人的生命应当如" + name + "这样度过：当他回首往事的时候不会因副本中断而感到悔恨,也不会因回到武庙而感到羞愧!</CYN>"].random();
    if (me.level >= 1) {
        if (type === 1) {
            let count = WORLD.DATA.add_temp('qmhd1', 1, 3600000 * 24 * 5);
            if (me.random(count) > 100) {
                WORLD.DATA.remove_temp('qmhd1');
                fh_user.add_title("再来一次的", "qmhd");
                fh_user.send("<hig>你获得了称号【再来一次的】。</hig>");
            }

        } else if (type === 2) {
            let count = WORLD.DATA.add_temp('qmhd2', 1, 3600000 * 24 * 5);
            if (me.random(count) > 100) {
                WORLD.DATA.remove_temp('qmhd2');
                fh_user.add_title("武庙常客", "qmhd");
                fh_user.send("<hig>你获得了称号【武庙常客】。</hig>");
            }
        }
    }


    //me.send("<yel>你点上一炷香深深的鞠了一躬：愿英雄常在，愿逝者永存</yel>");
    me.send_room(cmds);
    var count = me.add_temp("qm_hd", 1, 3600000 * 24 * 3);
    if (count == 1) {
        var obj = me.add_obj("cash/tianshifu", 10);
        if (obj) {
            me.notify("你获得了" + obj.unit_name(10) + "。");
        }
    } else if (count == 2) {
        var obj = me.add_obj("cash/jing#4");
        if (obj) {
            me.notify("你获得了" + obj.unit_name(1) + "。");
        }
    } else {
        me.add_exp(0, 0, 990000);
    }
});