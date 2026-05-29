import { TASK } from "../../os/task/task.js";

export default function() {
    const WORLD = globalThis.WORLD; const OBJ = globalThis.OBJ; const UTIL = globalThis.UTIL; const FAMILIES = globalThis.FAMILIES;
this.inherits(TASK);
this.id = "goods";
this.handler = null;
this.customer = {};
this.startup = function (oldtask) {

    if (oldtask) {
        this.customer = oldtask.customer;
    }
    this.handler = this.call_out(this.refresh_goods, UTIL.diff_time(12));//12点刷新一次
}
this.refresh_goods = function () {
    this.handler = null;
    for (var i = 0; i < WORLD.USERS.length; i++) {
        WORLD.USERS[i].send('{type:"msg",ch:"chat",content:"近日新到一批宝石，秘籍，丹药，不知哪位江湖朋友需要。",lv:0,name:"唐楠"}');
    }

    this.customer = {};

    var fam = [FAMILIES.GAIBANG, FAMILIES.WUDANG, FAMILIES.HUASHAN, FAMILIES.XIAOYAO, FAMILIES.EMEI, FAMILIES.SHASHOU, FAMILIES.SHAOLIN, FAMILIES.NONE];
    for (var i = 0; i < fam.length; i++) {
        fam[i].customer = {};
        fam[i].send('{type:"msg",ch:"fam",content:"本门新调拨一批物资，有需要的师弟师妹们请速来兑换。",uid:0,name:"后勤管理员",fam:"' + fam[i].name + '"}');
    }

    this.startup();
}
this.query_goods = function (me) {
    if (this.customer[me.id]) return this.customer[me.id];
    var ref_count = me.query_temp("ref_count", 0);
    var list = [];
    list.push(OBJ.CREATE("st/xuanjing", this.random(100) + 2));

    var st = ["st/st_red", "st/st_gre", "st/st_blu", "st/st_yel"];
    let max_count = 8;
    var counts = [3, 3, 2, 1, 1, 1, 1];

    for (var i = 0; i < 2; i++) {
        var g = this.random(me.level + 1);
        if (g > 4) g = 4;
        list.push(OBJ.CREATE(st.random() + "#" + g, this.random(counts[g]) + 1));
    }
    max_count -= 2;
    if (me.random(3) === 1) {
        st = ["drug/exp", "drug/pot"];
        for (var i = 0; i < 2; i++) {
            var g = this.random(1 + me.random(me.level));
            if (g > 4) g = 4;
            list.push(OBJ.CREATE(st.random() + "#" + g, this.random(ref_count) + 1));
        }
        max_count -= 2;
    }
    if (me.random(3) === 1) {
        st = ["res/cao", "res/yu"];
        for (var i = 0; i < 2; i++) {
            var g = this.random((me.level + 1) * 3);
            list.push(OBJ.CREATE(st.random() + "#" + g, this.random(counts[g] ?? 1) + 1));
        }
        max_count -= 2;
    }
    if (me.random(3) === 1) {
        let level = this.random(me.level);
        let index = this.random(25);
        list.push(OBJ.CREATE("drug/yf#" + ((index * 5) + level), 1));
        max_count -= 1;
    }
    if (me.random(this.ref_count) > 4) {
        let level = this.random(me.level);
        if (level > 3) level = 3;
        let index = this.random(25);
        list.push(OBJ.CREATE("drug/yf2#" + ((index * 5) + level), 1));
        max_count -= 1;
    }
    if (max_count > 0) {
        max_count = Math.min(3, max_count);
        for (let i = 0; i < max_count; i++) {
            let level = this.random(me.level) + 1;
            if (level > 6) level = 6;
            else if (level < 1) level = 1;
            let sk = FAMILIES.NONE.query_skill(level);
            list.push(OBJ.CREATE("book/bc#" + sk.id, 1 + (level < 5 ? me.random(3) : 0)));
        }
    }
    this.customer[me.id] = list;
    return list;
}
this.set_goods = function (me, list) {
    this.customer[me.id] = list;
}


this.stop = function () {
    if (this.handler) clearTimeout(this.handler);
}
}
