import { ROOM } from "../../../core/room/room.js";
import { WORLD } from "../../../core/world.js";
import { OBJ } from "../../../core/item/obj.js";
import { UTIL } from "../../../core/util/util.js";
import { NPC } from "../../../core/char/npc.js";
import { USER } from "../../../core/char/user.js";
import { USERTASK } from "../../../core/task/playertask.js";
import { COMMAND } from "../../../core/command.js";
import type { CHARACTER } from "../../../core/char/character.js";
import { FAMILIES } from "../../../core/skill/family.js";

export default class MapRoom extends ROOM {
    name = "第一层";
    desc = "这里是武道塔的内部，塔身已经石迹斑驳，但是仍然耸立挺拔。四周都是坚固的石壁，不知道什么原因留下一些横七竖八的刀刻剑痕，你想细看却觉得眼睛被刺得发疼。";
    exits = { "up": "wudao/up", "out": "wudao/men" };
    max_item_count = 1;

    on_before_enter(me: CHARACTER) {
        var level = (me.query_temp("wd_level") || 0) as number + 1;
        var name = UTIL.to_c(level);
        this.name = "第" + name + "层";
        var npc: NPC | null = null;
        if (level > 99) return this.refresh();
        npc = NPC.CLONE("pub/wudao");
        npc.init_from(me, level);
        if (level >= 90) {
            me.clear_combat_prop();
            me.clear_status();
        }

        const room = this;
        npc.die = function (this: NPC, killer?: CHARACTER) {
            if (this.on_die && killer && this.on_die(killer) == false) {
                this.hp = 1;
                return false;
            }
            var lv = (me.query_temp("wd_level", 0) as number) + 1;
            if (lv >= 90) {
                this.hp = this.max_hp;
                this.mp = this.max_mp;
                var rmNpc = this.environment?.find_by_path("pub/wudao");
                if (rmNpc && 'destroy' in rmNpc) {
                    (rmNpc as unknown as { destroy: () => void }).destroy();
                }
                this.moveto('wudao/men');
                this.notify("<hir>你的挑战失败了。</hir>");
            } else {
                this.hp = 1;
                this.notify("<hir>你的挑战失败了。</hir>");
                var rmNpc = this.environment?.find_by_path("pub/wudao");
                if (rmNpc && 'end_fight' in rmNpc) {
                    (rmNpc as unknown as { end_fight: () => false; full: () => void }).end_fight();
                    (rmNpc as unknown as { end_fight: () => false; full: () => void }).full();
                }
            }
        };

        npc.environment = this;
        this.items.length = 0;
        this.items.push(npc);
        this.refresh();
    }
    on_enter(me: CHARACTER) {
        const room = this;
        me.die = function (this: CHARACTER, killer?: CHARACTER) {
            if (this.on_die && this.on_die(killer ?? me) == false) {
                this.hp = 1;
                return false;
            }
            var level = (me.query_temp("wd_level", 0) as number) + 1;
            if (level >= 90) {
                me.hp = me.max_hp;
                me.mp = me.max_mp;
                var rmNpc = room.environment?.find_by_path("pub/wudao");
                if (rmNpc && 'destroy' in rmNpc) {
                    (rmNpc as unknown as { destroy: () => void }).destroy();
                }
                me.moveto('wudao/men');
                me.notify("<hir>你的挑战失败了。</hir>");
            } else {
                me.hp = 1;
                me.notify("<hir>你的挑战失败了。</hir>");
                var rmNpc = room.environment?.find_by_path("pub/wudao");
                if (rmNpc && 'do_kill' in rmNpc) {
                    (rmNpc as unknown as { end_fight: () => false; full: () => void }).end_fight();
                    (rmNpc as unknown as { end_fight: () => false; full: () => void }).full();
                }
            }
        };
        let roomNpc = this.items[0];
        if (roomNpc && 'do_kill' in roomNpc && !roomNpc.is_player) {
            me.send(roomNpc.name + '：这位' + me.call() + "，请了。");
            roomNpc.do_kill(me);
        }
    }
    reward(me: CHARACTER, count: number) {
        if (count > 100) count = 100;
        var lv = 1000 + count * 100;
        me.add_exp(lv, lv);
        var items: { obj: string[]; odds?: number }[] = [];

        items.push({
            obj: ["book/bc#" + (FAMILIES.NONE as any).query_skill(this.random(Math.floor(count / 20)) + 1).id],
            odds: 2000
        });

        var created: any[] = OBJ.create_by_odds(items);
        for (var i = 0; i < created.length; i++) {
            var item = me.add_obj(created[i]);
            var cnt = created[i].count || 1;
            if (item) {
                me.send("你获得了" + UTIL.to_c(cnt) + item.unit + item.color_name + "。");
            }
        }
    }
    reward3(me: CHARACTER, count: number) {

        var items: { obj: string[]; count?: number }[] = [];
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

        var created: any[] = OBJ.create_by_odds(items);
        for (var i = 0; i < created.length; i++) {
            var item = me.add_obj(created[i]);
            var cnt = created[i].count || 1;
            if (item) {
                me.send("你获得了" + UTIL.to_c(cnt) + item.unit + item.color_name + "。");
            }
        }
    }
    on_leave(me: CHARACTER, dir: string) {
        var level = (me.query_temp("wd_level", 0) as number) + 1;
        if (me.query_temp('wudao_o')) level = 100;
        var roomNpc: CHARACTER | OBJ | NPC | undefined = this.find_by_path(level == 100 ? "pub/wudao_boss" : "pub/wudao");
        if (dir == "up") {
            if (roomNpc && 'name' in roomNpc) {
                return me.notify_fail(roomNpc.name + "对你说道：打败我，你就可以上去。");
            }
            if (this.items.length > 1) {
                let npcs: (CHARACTER | OBJ | NPC)[] = [];
                for (let item of this.items) {
                    if (!item.is_player) {
                        npcs.push(item);
                    }
                }
                for (let item of npcs) {
                    if ('do_kill' in item) {
                        item.destroy();
                    }
                }
            }
            if (level >= 100) {
                me.moveto('wudao/ding');
            } else {
                me.moveto('wudao/ta');
            }

            return false;
        } else {
            if (roomNpc) this.items.remove(roomNpc);
            me.die = USER.prototype.die;
        }
    }
}
