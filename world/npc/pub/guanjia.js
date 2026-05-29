import { NPC } from "../../../os/char/npc.js";

export default function() {
    const WORLD = globalThis.WORLD;
this.inherits(NPC);
this.set({
    name: "管家",
    desc: "他就是负责扬州私人住宅租售的管家，也负责替人看家",
    gender: 1,
    age: 44,
    per: this.random(20) + 10,
    mp: 400,
    max_mp: 400,
    hp: 400,
    max_hp: 400,

});
this.set_objects(["eq/lv0/cloth", 1, 1]);
this.on_enter = function (me) {
    if (me.query_temp("home")) {
        me.notify("管家对你热情的说道：您来啦，快请进。");
    } else {
        me.notify("管家招呼道：这位" + me.call() + "，需要房子吗，练功，学习都会提高效率哦。");
    }
}
this.set_chat_msg([
    "管家骄傲的说道：本管家经手的住宅没有一百也有八十了，客官你大可放心。",
    "管家说道：这里不但有适合住家的小别院，也有富丽堂皇的大宅，客官您要不要来看看。",
    "管家说道：这里之前据说是位财主的家，方圆几里都是他家的产业！"
]);
this.add_action("qianyue", "签约", function (me, par) {
    if (!WORLD.is_server(me)) {
        return me.notify("管家拦住你：这位" + me.call() + "，这里是私人住宅区，你不能进去。");
    }
    var home = me.query_temp("home");

    if (home) {
        me.notify("管家对你说道：这位" + me.call() + "，您已经购买房屋了，可以直接进去，如果要升级住宅只需要再给我1800两黄金就可以了。");
        if (home == 1) {
            return me.send_commands("give " + this.id + " 18000000 money", "<hic>我要换成豪华型住宅</hic>");
        }
    } else {
        me.notify("管家对你说道：这位" + me.call() + "，这里有多种房屋户型提供：\n1. 精致型住宅，单人私密空间，只有一个单间附带练功房功能，价格100两黄金\n2. 豪华型住宅，包含别院，练功房，卧房，价格1888两黄金");
        return me.send_commands("give " + this.id + " 1000000 money",
            "精致型住宅", "give " + this.id + " 18880000 money", "<hic>豪华型住宅</hic>");

    }
});

this.on_accept = function (me, obj, count) {
    if (obj !== 'money') return false;
    let home = me.query_temp('home', 0);
    if (home === 2) return me.notify_fail("管家的说道：你已经购买住宅了。");
    if (home) {
        if (count !== 18000000)
            return me.notify("管家的说道：豪华型住宅需要1800两黄金。");
        me.set_temp("home", 2);
        me.send_room("$n拿出一纸契约，给$N看了官府颁印的契尾，麻利的按好指印：多谢您老，以后这栋房子就是您的啦。", this);

        me.clear_home(false);
    } else {
        if (count === 1000000) {
            me.set_temp("home", 1);
            me.send_room("$n拿出一纸契约，给$N看了官府颁印的契尾，麻利的按好指印：多谢您老，以后这栋房子就是您的啦。", this);

        } else if (count === 18880000) {
            me.send_room("$n拿出一纸契约，给$N看了官府颁印的契尾，麻利的按好指印：多谢您老，以后这栋房子就是您的啦。", this);

            me.set_temp("home", 2);
        } else {
            return me.notify("管家的说道：" + me.call() + "，你是要购买100两黄金的房子吗?");
        }
    }
    return true;
}
this.on_leave = function (me, dir) {
    if (dir == "enter") {
        if (!WORLD.is_server(me)) {
            return me.notify_fail("管家拦住你：这位" + me.call() + "，这里是私人住宅区，你不能进去。");
        }
        var home = me.query_temp("home");
        if (!home) {
            me.notify("管家拦住你：这位" + me.call() + "，这里是私人住宅区，你不能进去。");
            return false;
        } else {
            me.go_home();
            return false;
        }

    }
}
}
