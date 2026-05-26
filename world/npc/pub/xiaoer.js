this.inherits(NPC);
this.set({
    name: "店小二",
    desc: "这位店小二正笑咪咪地忙著，还不时拿起挂在脖子上的抹布擦脸。",
    gender: 1,
    age: 22,
    per: this.random(20) + 10,
    mp: 150,
    max_mp: 150,
    hp: 150,
    max_hp: 150
});
this.on_enter = function (me) {
    let kz = me.query_temp("kezhan");
    if (kz) {
        me.notify("小二一哈腰：这位客官请上楼歇息。");

        return me.send_commands('zhudian ' + this.id, '上楼', 'xufei ' + this.id, '续房',);
    }
    var str = "";
    switch (this.random(2)) {
        case 0:
            str = "店小二笑咪咪地说道：这位" + me.call()
                + "，要住店吗？请进请进。";
            break;
        case 1:
            str = "店小二用脖子上的毛巾抹了抹手，说道：这位" + me.call()
                + "，请进请进。小店还有几间上好的房间。";
            break;
    }
    me.notify(str);
}
this.add_action("zhudian", "住店", zhudian);


function zhudian(me, par) {
    var kd = me.query_temp("kezhan");
    if (kd) {
        me.moveto("kezhan/fang" + kd, me.name + "向客店二楼走去。");
    } else {
        me.notify("小二对你说道：这位" + me.call() + "，本店有多种房间提供：\n1. 人字号房每天10两白银，学习，打坐，练功效果增加10%\n2. 地字号房每天30两白银，学习，打坐，练功效果增加20%\n3. 天字号房间每天1两黄金，学习，打坐，练功效果增加50%");
        return me.send_commands("give " + this.id + " 1000 money", "人字号客房",
            "give " + this.id + " 3000 money", "<hic>地字号客房</hic>",
            "give " + this.id + " 10000 money", "<hiy>天字号客房</hiy>");

    }
}
this.on_accept = function (me, obj, count) {
    if (obj !== "money") return;
    if (me.money < 1000) {
        return me.notify("小二面无表情的说道：住店每天10两白银，不二价。");
    } else if (count === 1000) {
        me.set_temp("kezhan", 1, 1000 * 3600 * 24);
        me.send_message("小二一哈腰，说道：多谢您老，客官请楼上歇息。");
        me.moveto("kezhan/fang1", me.name + "向客店二楼走去。");
        return true;
    } else if (count === 3000) {
        me.set_temp("kezhan", 2, 1000 * 3600 * 24);
        me.send_message("小二一哈腰，说道：多谢您老，客官请楼上歇息。");
        me.moveto("kezhan/fang2", me.name + "向客店二楼走去。");
        return true;
    } else if (count === 10000) {
        me.set_temp("kezhan", 3, 1000 * 3600 * 24);
        me.send_message("小二一哈腰，说道：多谢您老，客官请楼上歇息。");
        me.moveto("kezhan/fang3", me.name + "向客店二楼走去。");
        return true;
    }
    return false;
}

this.add_action("xufei", null, function (me) {
    var kd = me.temp['kezhan'];
    if (!kd) return zhudian(me);
    let money = [0, 1000, 3000, 10000][kd.v];
    if (!(money > 0)) return me.send('你还没有住店。');
    if (me.money < money) return me.send('你身上的钱不够。');
    me.money -= money;
    kd.e += 3600000 * 24;
    let time = new Date(me.temp['kezhan'].e);
    let str = time.getFullYear() + "年" + (time.getMonth() + 1) + "月" + time.getDate() + "日" + time.getHours() + "时";
    me.send("小二一哈腰，说道：多谢您老，收您" + UTIL.moneyToStr(money) + "，续房一天。<cyn>(持续到" +
        str + ")</cyn>");
});


// this.add_action("dating", "打听消息", function (me) {
//     var count = me.query_temp('wsbs', 0);
//     if (count >= 5) return me.send('店小二说道：这位客官，小的听到的消息都告诉您老了。');
//     var num = me.query_temp('fbbs', 0);
//     if (num < 99) return me.send('店小二说道：这位客官，小的这两天也没听到什么消息。');
//     var fb = parseInt(num / 100);
//     var area = WORLD.AREAS[fb];
//     if (area && area.fb_index) {
//         me.send('店小二看了看四周：这位客官，小店人多口杂，虽然消息不少，但也不知道该不该讲呀。');
//         return me.send_commands("give " + this.id + " 20000 money", '给他几两金子');

//     }
//     return me.send('店小二说道：这位客官，小的这两天也没听到什么消息。');
// });