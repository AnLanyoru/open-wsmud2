import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "第一层";
    desc = "这里是武道塔的内部，塔身已经石迹斑驳，但是仍然耸立挺拔。四周都是坚固的石壁，不知道什么原因留下一些横七竖八的刀刻剑痕，你想细看却觉得眼睛被刺得发疼。";
    exits = { "up": "wudao/up", "out": "wudao/men" };
    max_item_count = 1;

    on_before_enter(me) {
    var level = (me.query_temp("wd_level") || 0) + 1;
    var name = UTIL.to_c(level);
    this.name = "第" + name + "层";
    var npc = null;
    if (level > 99) return this.refresh();
    // if (level == 100 || me.query_temp('wudao_o')) {
    //     npc = NPC.CLONE( "pub/wudao_boss");

    //     npc.die = this.on_die_boss;
    //     this.name = "第" + name + "层";
    //     npc.init_from(me);
    // } else {
    npc = NPC.CLONE("pub/wudao");
    npc.init_from(me, level);
    if (level >= 90) {
        me.clear_combat_prop();
        me.clear_status();
    }

    npc.die = this.on_die2;
    // }

    npc.environment = this;
    this.items.length = 0;
    this.items.push(npc);
    this.refresh();
    //this.item_changed(npc, true);
}
    on_enter(me) {
    me.die = this.on_die1;
    let npc = this.items[0];
    if (npc && !npc.is_player) {
        me.send(npc.name + '：这位' + me.call() + "，请了。");
        // me.clear_status();
        npc.do_kill(me);
    }
}
    on_die1(me) {
    if (this.on_die && this.on_die(me) == false) {
        this.hp = 1;
        return false;
    }
    var level = this.query_temp("wd_level", 0) + 1;
    if (level >= 90) {
        this.hp = this.max_hp;
        this.mp = this.max_mp;
        var npc = this.environment.find_by_path("pub/wudao");
        npc && npc.destroy();
        this.moveto('wudao/men');
        this.notify("<hir>你的挑战失败了。</hir>");
    } else {
        this.hp = 1;
        this.notify("<hir>你的挑战失败了。</hir>");
        var npc = this.environment.find_by_path("pub/wudao");
        if (npc) {
            npc.end_fight();
            npc.full();
        }
    }
}
    on_die_boss(me) {
    me.notify("<hig>恭喜你战胜了" + this.name + "。</hig>");
    this.on_reward(me);
    const count = me.query_temp('wd_s', 0) + 99;
    const max = WORLD.DATA.query_temp("wudao_max", 0);
    if (count > max) {
        WORLD.DATA.set_temp("wudao_max", count);
        WORLD.DATA.set_temp("wudao_max_user", me.name);
        COMMAND.DO("rumor", "听说" + me.name + "战胜了" + this.name + "。");
        me.environment.parent.notify_update();
    }
    me.environment.item_changed(this, false, this.name + "离开了。");
}
    on_die2(me) {
    me.notify("<hig>恭喜你战胜了武道塔守护者，你现在可以进入下一层。</hig>");

    USERTASK.GET('wudao').on_finish(me);
    const count = me.add_temp("wd_level", 1);
    me.notify("<hic>你挑战的最高纪录更新到" + count + "层。</hic>");
    const max = WORLD.DATA.query_temp("wudao_max", 0);
    if (count > max) {
        WORLD.DATA.set_temp("wudao_max", count);
        WORLD.DATA.set_temp("wudao_max_user", me.name);
        COMMAND.DO("rumor", "听说" + me.name + "战胜了武道塔" + UTIL.to_c(count) + "层的守护者。");

        me.environment.parent.notify_update();
        if (count > 60) {
            let speed = me.add_temp('wd_lim', 1, 120000);
            if (speed >= 3) {
                me.is_busy = 1000;
            }
        }
    }
    me.environment.item_changed(this, false, this.name + "离开了。");
    me.environment.reward(me, count);

    if (count === 1) {
        me.set_temp('wd_tm', Math.floor(Date.now() / 100000));
        me.send('\n<hic>你首次战胜了武道塔守护者，守门人视你为武道新星，每天可从任务栏领取奖励。</hic>');
    }

}
    reward(me, count) {
    if (count > 100) count = 100;
    var lv = 1000 + count * 100;
    me.add_exp(lv, lv);
    var items = [];

    items.push({
        obj: ["book/bc#" + FAMILIES.NONE.query_skill(this.random(count / 20) + 1).id],
        odds: 2000
    });

    items = OBJ.create_by_odds(items);
    for (var i = 0; i < items.length; i++) {
        var item = me.add_obj(items[i]);
        count = items[i].count || 1;
        if (item) {
            me.send("你获得了" + UTIL.to_c(count) + item.unit + item.color_name + "。");
        }
    }
}
    reward3(me, count) {

    var items = [];
    if (count > 100) count = 100;

    var lv = 10000 + count * 1000;
    me.add_exp(lv, lv);

    items.push({
        obj: ["st/xuanjing"],
        count: 10
    });
    items.push({
        obj: ["st/st_gre#2", "st/st_red#2", "st/st_yel#2", "st/st_blu#2"]
    });

    items = OBJ.create_by_odds(items);
    for (var i = 0; i < items.length; i++) {
        var item = me.add_obj(items[i]);
        count = items[i].count || 1;
        if (item) {
            me.send("你获得了" + UTIL.to_c(count) + item.unit + item.color_name + "。");
        }
    }
}
    on_leave(me, dir) {
    var level = me.query_temp("wd_level", 0) + 1;
    if (me.query_temp('wudao_o')) level = 100;
    var npc = this.find_by_path(level == 100 ? "pub/wudao_boss" : "pub/wudao");
    if (dir == "up") {
        if (npc) {
            // if (level < 100) {
            return me.notify_fail(npc.name + "对你说道：打败我，你就可以上去。");
            // }

            // var ws = me.query_temp('wudao_s', 0);
            // var wd = me.query_temp('wd', 0);
            // if (!ws || !wd) return me.notify_fail(npc.name + "对你说道：打败我，你就可以上去。");

            // if ((wd - ws > 0))
            //     return me.notify_fail(npc.name + "对你说道：打败我，你就可以上去。");
            // else {
            //     me.moveto('wudao/ding');
            //     me.notify_fail(npc.name + "对你说道：你可以上去。");
            //     return false;
            // }
        }
        if (this.items.length > 1) {
            let npcs = [];
            for (let item of this.items) {
                if (!item.is_player) {
                    npcs.push(item);
                }
            }
            for (let item of npcs) {
                item.destroy();
            }
        }
        // if (level === 100) {
        //     return me.notify_fail('暂未开放。');
        // }
        if (level >= 100) {
            me.moveto('wudao/ding');
        } else {
            me.moveto('wudao/ta');
        }

        return false;
    } else {
        if (npc) this.items.remove(npc);
        me.die = USER.prototype.die;
    }
}
}

const WORLD = globalThis.WORLD;
const OBJ = globalThis.OBJ;
const UTIL = globalThis.UTIL;
const FAMILIES = globalThis.FAMILIES;
const NPC = globalThis.NPC;
const USER = globalThis.USER;
const USERTASK = globalThis.USERTASK;
const COMMAND = globalThis.COMMAND;
