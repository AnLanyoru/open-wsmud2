import { NPC } from "../../../core/char/npc.js";
import { WORLD } from "../../../core/world.js";
import { FAMILIES, FAMILY } from "../../../core/skill/family.js";
import type { SkillItem } from "../../../core/skill/skill.js";
import type ShouXiCommand from "../../cmd/comm/sx.js";
import type { USER } from "../../../core/char/user.js";

export default class extends NPC {
  name = "大师兄";
  desc = "他就是你们门派的首席大弟子";
  title = "<hig>首席弟子</hig>";
  gender = 1;
  age = 25;
  per = 18;
  mp = 400;
  max_mp = 400;
  hp = 400;
  max_hp = 400;

  constructor() {
    super();
    this.add_action("ask2", "请安", this.greeting);
    this.add_action("manage", "设置", this.manage);
  }

  on_create(path: string, par?: string) {
    if (!par) return;
    this.family = FAMILIES[par.slice(1)];
    this.init_from(this.family);
    if (this.family == FAMILIES.EMEI) {
      this.gender = 2;
    }
    var user = WORLD.getUser(WORLD.DATA.query_temp(this.family.id + "_top"));
    this.family.init_dadizi(this, user);
    if (!user) this.family.is_init_first = false;
  }

  on_clone() {}

  on_kill(me: USER) {
    return me.notify_fail(
      this.name + "说道：" + this.callme() + "只接受比试。",
    );
  }

  init_from(fam: FAMILY) {
    this.set_objects(["eq/lv0/cloth", 1, 1], ["eq/lv0/jian", 1, 1]);

    var ary: SkillItem[] = [];
    for (var i = 0; i < fam.npc_skills.length; i++) {
      ary.push([fam.npc_skills[i][0], 200, fam.npc_skills[i][2]]);
    }
    this.skill_map.apply(this, ary);

    this.max_mp = this.mp = 10000;
    delete this.on_heart_beat;
    delete this.on_damage;
    this.hp = this.max_hp = 10000;
    this.init();
    this.recount();
  }

  on_fight_over(me: USER, issuc: boolean) {
    if (issuc) {
      me.notify(this.name + "对你嘿嘿嘿的笑了几声。");
    } else {
      me.notify(this.name + "对你嘿嘿嘿的笑了几声。");
    }
  }

  greeting(me: USER) {
    let sx_cmd = WORLD.COMMANDS.get("sx") as ShouXiCommand;
    sx_cmd.do_greet(me);
  }

  manage(me: USER) {
    let sx_cmd = WORLD.COMMANDS.get("sx") as ShouXiCommand;
    sx_cmd.do_manage(me);
  }
}
