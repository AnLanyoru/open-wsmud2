import { NPC } from "../../../core/char/npc.js";
import { WORLD } from "../../../core/world.js";
import { TASK } from "../../../core/task/task.js";
import type XiangYangTask from "../../task/xy_task.js";
import type { USER } from "../../../core/char/user.js";
import { SkillsMap } from "../../../core/char/skills_map.js";

export default class extends NPC {
  name = "蒙古密探";
  desc = "鬼鬼祟祟的，一看就有问题";
  gender = 1;
  age = 25;
  per = 17;
  max_mp = 160000;
  max_hp = 160000;
  no_refresh = true;

  constructor() {
    super();
    this.skill_map(
      ["dodge", 300],
      ["parry", 300],
      ["force", 300],
      ["unarmed", 300],
      ["club", 300],
      ["mengguqiangfa", 300, ["club", "parry"]],
      ["mengguxinfa", 300, "force"],
      ["dashouyin", 300, "unarmed"],
      ["feiyanzoubi", 300, "dodge"],
    );
  }

  on_die(killer: USER) {
    if (WORLD.DATA.query_temp("xy_status")) {
      this.call_out(this.relive, 600000);
      return;
    }
    var task = TASK.GET("xiangyang") as XiangYangTask | undefined;
    if (!task || task.is_start) {
      this.call_out(this.relive, 600000);
      return;
    }
    task.on_mihan();
    this.call_out(this.relive, 3600000);
  }

  relive() {
    var task = TASK.GET("xiangyang") as XiangYangTask | undefined;
    if (!task || task.is_start) {
      this.call_out(this.relive, 60000);
      return;
    }

    var obj = NPC.CLONE(this.path);
    var rm = task.xy_area.rooms.random();
    obj.moveto(rm);
    // this.do_command('chat', rm.name);
    this.die_room = undefined;
    this.equipment = [];
    this.items = null;
    this.skills = new SkillsMap();
  }
}
