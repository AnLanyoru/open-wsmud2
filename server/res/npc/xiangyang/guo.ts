import { ItemCommandsJson } from "../../../core/char/follower.js";
import { NPC } from "../../../core/char/npc.js";
import { TASK } from "../../../core/task/task.js";
import { WORLD } from "../../../core/world.js";
import { UTIL } from "../../../core/util/util.js";
import type XiangYangTask from "../../task/xy_task.js";
import type { USER } from "../../../core/char/user.js";

export default class extends NPC {
  name = "郭靖";
  desc = '被尊为"天下第一侠士",率领群雄守护着南宋襄阳城的前线边境';
  title = "<hio>北侠</hio>";
  gender = 1;
  age = 45;
  per = 27;
  max_mp = 9000000;
  max_hp = 9000000;
  level = 3;
  pfm_rate = 1;
  no_fight = true;
  prop = {
    gj: 20000,
    fy: 20000,
    mz: 20000,
    zj: 20000,
    ds: 30000,
    diff_sh: 10000,
  };

  constructor() {
    super();
    this.skill_map(
      ["dodge", 3000],
      ["parry", 3000],
      ["force", 3000],
      ["unarmed", 3000],
      ["club", 3000],
      ["dagoubang", 3000, "club"],
      ["yijinjing", 3000, "force"],
      ["xianglongzhang", 3000, ["unarmed", "parry"]],
      ["zhutianbu", 3000, "dodge"],
    );

    // 报名守城
    this.add_action("xy_bm", "报名守城", function (this: NPC, me: USER) {
      const task = TASK.GET("xiangyang") as XiangYangTask | undefined;
      if (!task) return me.notify_fail("襄阳任务未加载。");
      task.bm(me);
    });

    // 军功兑换 — 1点军功兑换100两白银
    this.add_action("xy_jgdh", "军功兑换", function (this: NPC, me: USER) {
      const jg = Number(me.query_temp("jg", 0)) || 0;
      if (jg <= 0) return me.notify("你没有可兑换的军功。");
      let num = 1;
      me.add_temp("jg", -num);
      me.add_money(10000 * num);
      me.notify(
        "<hiy>你兑换了" +
          num +
          "点军功，获得" +
          num +
          "两黄金。剩余军功：" +
          (jg - 1) +
          "。</hiy>",
      );
    });

    // 捐献军饷 — 3两黄金兑换1点军功，补到本周上限
    this.add_action("xy_jx", "捐献军饷", function (this: NPC, me: USER) {
      const task = TASK.GET("xiangyang") as XiangYangTask | undefined;
      const max = task?.jg_limit(me) ?? 0;
      if (!(max > 0)) return me.notify("你还是先历练历练再来捐献军饷吧。");
      const current = me.query_temp("jg_week", 0);
      if (current >= max)
        return me.notify("你本周的军功已经达到上限，无需再捐。");
      let least_num = max - current;
      let rate = 3 * least_num; // 3 gold = 300 silver
      let need_money = rate * 10000;
      if (me.money < need_money)
        return me.notify(
          `你没有足够的黄金，获得${least_num}点军功需要捐献${rate}两黄金。`,
        );

      me.add_money(-need_money);
      const newWeek = me.add_temp("jg_week", least_num, UTIL.diff_week_time());
      const newJg = me.add_temp("jg", least_num);
      me.notify(
        "<hiy>你捐献了" +
          rate +
          "两黄金，获得" +
          least_num +
          "点军功。本周已获得" +
          newWeek +
          "/" +
          max +
          "点军功。当前" +
          newJg +
          "点</hiy>",
      );
    });
  }

  on_kill(me: USER) {
    return false;
  }

  query_commands(player: USER) {
    const status = WORLD.DATA.query_temp<number>("xy_status", 0);
    const commands: { cmd: string; name: string }[] = [
      { cmd: "look " + this.id, name: "查看" },
    ];

    if (status === 1) {
      // 战时：报名守城
      commands.push({ cmd: "xy_bm " + this.id, name: "报名守城" });
    } else {
      // 空闲时：军功兑换，捐献军饷
      commands.push({ cmd: "xy_jgdh " + this.id, name: "军功兑换" });
      commands.push({ cmd: "xy_jx " + this.id, name: "捐献军饷" });
    }

    const json: ItemCommandsJson = {
      type: "item",
      desc: this.desc,
      id: this.id,
      commands: commands,
    };

    this.json = JSON.stringify(json);
    return this.json;
  }
}
