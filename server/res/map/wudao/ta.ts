import { ROOM } from "../../../core/room/room.js";
import { WORLD } from "../../../core/world.js";
import { UTIL } from "../../../core/util/util.js";
import { NPC } from "../../../core/char/npc.js";
import { USER } from "../../../core/char/user.js";
import { COMMAND } from "../../../core/command.js";
import { USERTASK } from "../../../core/task/playertask.js";
import { OBJ } from "../../../core/item/obj.js";
import { FAMILIES } from "../../../core/skill/family.js";
import type { CHARACTER } from "../../../core/char/character.js";

export default class extends ROOM {
  name = "第一层";
  desc =
    "这里是武道塔的内部，塔身已经石迹斑驳，但是仍然耸立挺拔。四周都是坚固的石壁，不知道什么原因留下一些横七竖八的刀刻剑痕，你想细看却觉得眼睛被刺得发疼。";
  exits = { up: "wudao/up", out: "wudao/men" };
  max_item_count = 1;

  on_before_enter(me: CHARACTER) {
    const level = me.query_temp("wd_level", 0) + 1;
    const name = UTIL.to_c(level);
    this.name = "第" + name + "层";
    if (level > 99) return this.refresh();

    const npc = NPC.CLONE("pub/wudao") as NPC;
    npc.init_from(me, level);
    if (level >= 90) {
      me.clear_combat_prop();
      me.clear_status();
    }

    const room = this;
    npc.die = function (this: NPC, killer?: CHARACTER) {
      if (!killer) return;
      killer.notify(
        "<hig>恭喜你战胜了武道塔守护者，你现在可以进入下一层。</hig>",
      );

      const task = USERTASK.GET("wudao");
      task?.on_finish?.(killer);
      const count = killer.add_temp("wd_level", 1);
      killer.notify("<hic>你挑战的最高纪录更新到" + count + "层。</hic>");
      const max = WORLD.DATA.query_temp("wudao_max", 0);
      if (count > max) {
        WORLD.DATA.set_temp("wudao_max", count);
        WORLD.DATA.set_temp("wudao_max_user", killer.name);
        COMMAND.DO(
          "rumor",
          "听说" +
            killer.name +
            "战胜了武道塔" +
            UTIL.to_c(count) +
            "层的守护者。",
        );

        if (killer.environment && killer.environment.parent) {
          killer.environment.parent.notify_update();
        }
        if (count > 60) {
          const speed = killer.add_temp("wd_lim", 1, 120000);
          if (speed >= 3) {
            killer.is_busy = 1000;
            killer.call_out(() => {
              killer.is_busy = 0;
            }, 1000);
          }
        }
      }
      if (killer.environment) {
        killer.environment.item_changed(this, false, this.name + "离开了。");
        room.reward(killer, count);
      }

      if (count === 1) {
        killer.set_temp("wd_tm", Math.floor(Date.now() / 100000));
        killer.send(
          "\n<hic>你首次战胜了武道塔守护者，守门人视你为武道新星，每天可从任务栏领取奖励。</hic>",
        );
      }
    };

    npc.environment = this;
    this.items.length = 0;
    this.items.push(npc);
    this.refresh();
  }

  on_enter(me: CHARACTER) {
    me.die = function (this: CHARACTER, killer?: CHARACTER) {
      if (this.on_die && killer && this.on_die(killer) == false) {
        this.hp = 1;
        return false;
      }
      const level = this.query_temp("wd_level", 0) + 1;
      if (level >= 90) {
        this.hp = this.max_hp;
        this.mp = this.max_mp;
        const rm_npc = this.environment!.find_by_path("pub/wudao") as
          NPC | undefined;
        rm_npc && rm_npc.destroy();
        this.moveto("wudao/men");
        this.notify("<hir>你的挑战失败了。</hir>");
      } else {
        this.hp = 1;
        this.notify("<hir>你的挑战失败了。</hir>");
        const rm_npc = this.environment!.find_by_path("pub/wudao") as
          NPC | undefined;
        if (rm_npc) {
          rm_npc.end_fight();
          rm_npc.full();
        }
      }
    };
    const npc = this.items[0] as NPC;
    if (npc && !npc.is_player) {
      me.send(npc.name + "：这位" + me.call() + "，请了。");
      me.do_kill(npc);
    }
  }

  reward(me: CHARACTER, count: number) {
    if (count > 100) count = 100;
    const lv = 1000 + count * 100;
    me.add_exp(lv, lv);
    let items: any[] = [];

    items.push({
      obj: [
        "book/bc#" + FAMILIES.NONE.query_skill(this.random(count / 20) + 1)!.id,
      ],
      odds: 2000,
    });

    items = OBJ.create_by_odds(items);
    for (let i = 0; i < items.length; i++) {
      const item = me.add_obj(items[i]);
      const cnt = items[i].count || 1;
      if (item) {
        me.send(
          "你获得了" + UTIL.to_c(cnt) + item.unit + item.color_name + "。",
        );
      }
    }
  }

  reward3(me: CHARACTER, count: number) {
    let items: any[] = [];
    if (count > 100) count = 100;

    const lv = 10000 + count * 1000;
    me.add_exp(lv, lv);

    items.push({
      obj: ["st/xuanjing"],
      count: 10,
    });
    items.push({
      obj: ["st/st_gre#2", "st/st_red#2", "st/st_yel#2", "st/st_blu#2"],
    });

    items = OBJ.create_by_odds(items);
    for (let i = 0; i < items.length; i++) {
      const item = me.add_obj(items[i]);
      const cnt = items[i].count || 1;
      if (item) {
        me.send(
          "你获得了" + UTIL.to_c(cnt) + item.unit + item.color_name + "。",
        );
      }
    }
  }

  on_leave(me: CHARACTER, dir: string) {
    let level = me.query_temp("wd_level", 0) + 1;
    if (me.query_temp("wudao_o")) level = 100;
    const npc = this.find_by_path(
      level == 100 ? "pub/wudao_boss" : "pub/wudao",
    ) as NPC | undefined;
    if (dir == "up") {
      if (npc) {
        return me.notify_fail(npc.name + "对你说道：打败我，你就可以上去。");
      }
      if (this.items.length > 1) {
        const npcs: CHARACTER[] = [];
        for (const item of this.items) {
          if (!item.check_player() && item.check_character()) {
            npcs.push(item);
          }
        }
        for (const item of npcs) {
          item.destroy();
        }
      }
      if (level >= 100) {
        me.moveto("wudao/ding");
      } else {
        me.moveto("wudao/ta");
      }

      return false;
    } else {
      if (npc) this.items.remove(npc);
      me.die = USER.prototype.die;
    }
  }
}
