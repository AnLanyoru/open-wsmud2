import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
  name = "罗汉护腕";
  desc = "少林寺镇派护腕，以玄铁铸造，上刻降龙伏虎之形。";
  unit = "对";
  eq_type = EQUIP_TYPE.WRIST;

  on_create(path, par) {
    let lv = 5;
    if (par) {
      par = par.slice(1);
      lv = parseInt(par);
      if (!(lv >= 2 && lv <= 5)) return;
    }
    this.grade = lv;
    this.hole_count = Math.max(0, lv - 1);
    switch (lv) {
      case 2:
        this.prop = { fy: 50, str: 5 };
        this.desc = "少林沙弥的粗布护腕，初习拳棒，根基之始。";
        break;
      case 3:
        this.prop = { fy: 112, str: 15, max_hp: 1500 };
        this.desc = "少林武僧的兽皮护腕，臂沉力猛，降龙伏虎。";
        break;
      case 4:
        this.prop = { fy: 208, max_hp: 3500, con: 20, str: 25 };
        this.desc = "少林首座的精钢护腕，金刚怒目，力破千军。";
        this.group_name = "luohan4";
        break;
      case 5:
        this.prop = { fy: 305, mz: 185, str: 35, con: 30, hp_per: 5 };
        this.desc = "少林长老的护腕，玄铁铸就，上刻降龙伏虎之形。";
        this.group_name = "luohan5";
        break;
    }
    EQUIPMENT.prototype.on_create.apply(this);
  }

  group_prop(count: number) {
    if (this.grade == 4) {
      if (count == 3) return { hp_per: 5 };
      if (count == 5) return { fy_per: 8, diff_sh_per: 8 };
    } else if (this.grade == 5) {
      if (count == 3) return { hp_per: 10 };
      if (count == 5) return { fy_per: 10, diff_sh_per: 10 };
    }
  }
}
