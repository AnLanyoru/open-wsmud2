/**
 * 热补丁入口 — WORLD.STATS 排行榜统计方法
 * ============================================================
 * 此文件由 BASE.PRELOAD 在 os/ 模块全部加载后执行，可安全使用静态 ES import。
 *
 * load_tops/loadTopUser 在此实现，避免 os/world.js 直接 import obj.js/npc.js:
 *   world.js → OBJ → world.js
 *   world.js → NPC → character.js → OBJ → world.js
 *
 * 热补丁示例:
 *   const STATS = WORLD.STATS;
 *   STATS.load_tops = function (tops, defname, key) { /* ... * / };
 */
import { WORLD } from "../../core/world.js";
import { NPC } from "../../core/char/npc.js";
import { OBJ } from "../../core/item/obj.js";

const STATS = WORLD.STATS;

STATS.load_tops = function (tops, defname = '武林高手', key = "") {
    tops = tops ?? new Array(10).fill({ path: "pub/gaoshou1" });
    const ary = [];
    for (let i = 0; i < tops.length; i++) {
        let item = tops[i];
        let npc;
        npc = NPC.CLONE("pub/gaoshou1");
        npc.name = defname;
        if (item.userid) {
            this.loadTopUser(item, npc);
        } else {
            npc.score = 10 - i;
        }
        npc.top_index = i + 1;
        npc.id = "top_" + key + "_" + i;
        ary.push(npc);
    }
    return ary;
};

STATS.loadTopUser = function (data, npc) {
    npc.title = data.title;
    npc.name = data.name;
    for (let i = 0; i < COPY_PROPS.length; i++) {
        npc[COPY_PROPS[i]] = data[COPY_PROPS[i]];
    }
    npc.skills = data.skills;
    if (data.eq) {
        npc.equipment = [];
        for (let i = 0; i < data.eq.length; i++) {
            let item = data.eq[i];
            if (!item) continue;
            let obj = OBJ.CREATE(item[0]);
            if (!obj) continue;
            obj.load_db(item);
            npc.equipment[i] = obj;
        }
    }
    npc.userid = data.userid;
    npc.temp = data.temp;
    npc.clear_prop();
    npc.init();
    npc.recount();
};

