import { TASK } from "../../core/task/task.js";
import { WORLD } from "../../core/world.js";
import { OBJ } from "../../core/item/obj.js";
import type { CHARACTER } from "../../core/char/character.js";
import { UTIL } from "../../core/util/util.js";
import { FAMILIES } from "../../core/skill/family.js";

export default class extends TASK {
    id = "goods";
    customer: Record<string, OBJ[] | null> = {};

    startup(oldtask?: TASK) {

    if (oldtask && oldtask.customer) {
        this.customer = oldtask.customer;
    }
    this.handler = this.call_out(this.refresh_goods, UTIL.diff_time(12));//12点刷新一次
}
    refresh_goods() {
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

    this.startup(undefined);
}
    /**
     * 查询/生成玩家货物列表（带缓存）
     */
    query_goods(me: CHARACTER): OBJ[] | undefined {
    var cached = this.customer[me.id];
    if (cached) return cached;
    var ref_count = me.query_temp("ref_count", 0) ?? 0;
    var list: OBJ[] = [];
    list.push(OBJ.CREATE("st/xuanjing", this.random(100) + 2));

    var st = ["st/st_red", "st/st_gre", "st/st_blu", "st/st_yel"];
    let max_count = 8;
    var counts = [3, 3, 2, 1, 1, 1, 1];

    for (var i = 0; i < 2; i++) {
        var g = this.random(me.level + 1);
        if (g > 4) g = 4;
        list.push(OBJ.CREATE(st.random() + "#" + g, this.random(counts[g] ?? 1) + 1));
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
    if (max_count > 0) {
        max_count = Math.min(3, max_count);
        for (let i = 0; i < max_count; i++) {
            let level = this.random(me.level) + 1;
            if (level > 6) level = 6;
            else if (level < 1) level = 1;
            let sk = FAMILIES.NONE.query_skill(level);
            list.push(OBJ.CREATE("book/bc#" + sk!.id, 1 + (level < 5 ? me.random(3) : 0)));
        }
    }
    this.customer[me.id] = list;
    return list;
}
    /**
     * 设置/清除玩家货物列表
     */
    set_goods(me: CHARACTER, list: OBJ[] | null) {
    this.customer[me.id] = list;
}
    stop() {
    if (this.handler) clearTimeout(this.handler);
}
}

