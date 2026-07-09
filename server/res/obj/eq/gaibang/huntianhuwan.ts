import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
  name = "混天护腕";
  desc = "丐帮镇派护腕，粗犷中暗藏锋芒，一拳一脚皆有千钧之力。";
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
        this.prop = { fy: 50, mz: 15 };
        this.desc = "丐帮正式弟子的护腕，粗布裹铁。";
        break;
      case 3:
        this.prop = { fy: 112, mz: 25, gj: 20 };
        this.desc = "丐帮精英弟子的皮护腕，出手狠辣。";
        break;
      case 4:
        this.prop = { fy: 208, mz: 75, gj: 70, max_hp: 3500 };
        this.desc = "丐帮长老的玄铁护腕，一拳碎石。";
        this.group_name = "huntian4";
        break;
      case 5:
        this.prop = { fy: 305, mz: 145, gj: 150, str: 23, max_hp: 7500 };
        this.desc = "丐帮镇派护腕，粗犷中暗藏锋芒，一拳一脚皆有千钧之力。";
        this.group_name = "huntian5";
        break;
    }
    EQUIPMENT.prototype.on_create.apply(this);
  }

  group_prop(count: number) {
    if (this.grade == 4) {
      if (count == 3) return { str: 50 };
      if (count == 5) return { con: 50, diff_sh_per: 8 };
    } else if (this.grade == 5) {
      if (count == 3) return { str: 100 };
      if (count == 5) return { con: 100, diff_sh_per: 10 };
    }
  }
}
