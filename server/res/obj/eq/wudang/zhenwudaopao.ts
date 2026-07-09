import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
  name = "真武道袍";
  desc =
    "武当派镇派之袍，以天蚕丝织就，上绣太极两仪四象八卦，暗含天道循环之理。";
  unit = "件";
  eq_type = EQUIP_TYPE.CLOTH;

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
        this.prop = { fy: 120, int: 5 };
        this.desc = "武当道童的灰布袍，初入道门，太极始悟。";
        break;
      case 3:
        this.prop = { fy: 220, int: 15, zj: 100 };
        this.desc = "武当入室弟子的道袍，精良布料内蕴真气，护身于无形。";
        break;
      case 4:
        this.prop = { fy: 320, int: 30, con: 25, zj: 250 };
        this.desc = "武当执事的道袍，太极八卦暗藏经纬，以柔克刚。";
        this.group_name = "zhenwu4";
        break;
      case 5:
        this.prop = { fy: 480, zj: 390, zj_per: 10, int: 55, dazuo_per: 10 };
        this.desc =
          "武当长老的道袍，天蚕丝织就，上绣太极八卦，暗含天道循环之理。";
        this.group_name = "zhenwu5";
        break;
    }
    EQUIPMENT.prototype.on_create.apply(this);
  }

  group_prop(count: number) {
    if (this.grade == 4) {
      if (count == 3) return { int: 50 };
      if (count == 5) return { mz_per: 8, zj_per: 8 };
    } else if (this.grade == 5) {
      if (count == 3) return { int: 100 };
      if (count == 5) return { mz_per: 10, zj_per: 10 };
    }
  }
}
