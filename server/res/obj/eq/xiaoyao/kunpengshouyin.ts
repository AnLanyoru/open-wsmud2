import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
  name = "鲲鹏手印";
  desc = "逍遥派镇派手印，戴于掌间如鲲鹏展翼，力可擎天。";
  unit = "对";
  eq_type = EQUIP_TYPE.WEAPON;
  weapon_type = WEAPON_TYPE.NONE;

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
        this.prop = { gj: 55, str: 10 };
        this.desc = "逍遥弟子的铁手印，轻巧灵动，初试锋芒。";
        break;
      case 3:
        this.prop = { gj: 132, str: 25, mz: 120 };
        this.desc = "逍遥入室弟子的玄铁手印，刚柔相济，攻守兼备。";
        break;
      case 4:
        this.prop = { gj: 367, str: 35, mz: 320, gjsd_per: 5 };
        this.desc = "逍遥护法的手印，出手如鲲鹏展翼，遮天蔽日。";
        break;
      case 5:
        this.prop = {
          gj: 458,
          str: 55,
          mz: 500,
          gjsd_per: 10,
          releasetime: 1500,
        };
        this.desc = "逍遥长老的手印，戴于掌间如鲲鹏展翼，力可擎天。";
        break;
    }
    EQUIPMENT.prototype.on_create.apply(this);
  }
}
