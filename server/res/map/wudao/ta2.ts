import { ROOM } from "../../../core/room/room.js";
import { WORLD } from "../../../core/world.js";
import { UTIL } from "../../../core/util/util.js";
import { NPC } from "../../../core/char/npc.js";
import { USER } from "../../../core/char/user.js";
import { COMMAND } from "../../../core/command.js";
import type { CHARACTER } from "../../../core/char/character.js";
import type { OBJ } from "../../../core/item/obj.js";

export default class extends ROOM {
    name = "武道塔";
    desc = "这里是武道塔的内部，塔身已经石迹斑驳，但是仍然耸立挺拔。四周都是坚固的石壁，不知道什么原因留下一些横七竖八的刀刻剑痕，你想细看却觉得眼睛被刺得发疼。";
    exits = { "up": "wudao/up", "out": "wudao/ding" };
    max_item_count = 1;

    on_before_enter(me: CHARACTER) {
        var level = (me.query_temp("wd_level", 0) as number) + 1 - 100;
        this.name = "上" + UTIL.to_c(level) + "层";
        if (level > 5) return;
        var npc = NPC.CLONE("pub/wudao_boss");

        const room = this;
        npc.die = function (this: NPC, killer?: CHARACTER) {
            if (!killer) return;
            killer.notify("<hig>恭喜你战胜了" + this.name + "。</hig>");
            let count = me.query_temp('wd_level', 0) as number;
            if (count > 105) {
                return;
            }
            count = me.add_temp('wd_level', 1) as number;

            room.on_reward(me, count);
            const max = WORLD.DATA.query_temp("wudao_max", 0) as number;
            if (count > max) {
                WORLD.DATA.set_temp("wudao_max", count);
                WORLD.DATA.set_temp("wudao_max_user", me.name);
                COMMAND.DO("rumor", "听说" + me.name + "战胜了" + this.name + "。");
                if (me.environment && me.environment.parent) {
                    me.environment.parent.notify_update();
                }
            }
            if (me.environment) {
                me.environment.item_changed(this, false, this.name + "离开了。");
            }
        };
        npc.init_from(me, level);

        npc.environment = this;
        this.items.length = 0;
        this.items.push(npc);
        this.refresh();
    }
    on_enter(me: CHARACTER) {
        const room = this;
        me.die = function (this: CHARACTER, killer?: CHARACTER) {
            if (this.on_die && killer && this.on_die(killer) == false) {
                this.hp = 1;
                return false;
            }
            this.hp = this.max_hp;
            this.mp = this.max_mp;
            var rm_npc = this.environment?.find_by_path("pub/wudao");
            if (rm_npc && 'destroy' in rm_npc) {
                (rm_npc as unknown as { destroy: () => void }).destroy();
            }
            this.moveto('wudao/ding');
            this.notify("<hir>你的挑战失败了。</hir>");
        };
        let npc = this.items[0];
        if (npc && !npc.is_player) {
            if ('do_kill' in npc) {
                me.do_kill(npc);
            }
            if ('on_kill' in npc && typeof npc.on_kill === 'function') {
                npc.on_kill(me);
            }
        }
    }
    on_reward(me: CHARACTER, lv: number) {

    }
    on_leave(me: CHARACTER, dir: string) {

        var npc: CHARACTER | OBJ | NPC | undefined = this.find_by_path("pub/wudao_boss");
        if (dir == "up") {
            if (npc) {
                return me.notify_fail(npc.name + "对你说道：打败我，你就可以上去。");
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
            if (me.query_temp('wd_level', 0) as number >= 105) {
                return me.notify_fail('暂未开放。');
            }
            me.moveto('wudao/ta2');

            return false;
        } else {
            if (npc) this.items.remove(npc);
            me.die = USER.prototype.die;
        }
    }
}
