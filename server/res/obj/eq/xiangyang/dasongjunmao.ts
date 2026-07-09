import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
  name = "大宋军帽";
  desc = "大宋禁军的制式军帽，红缨铁盔，攻防兼备。";
  unit = "顶";
  eq_type = EQUIP_TYPE.HEAD;

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
        this.prop = { fy: 76, con: 6 };
        this.desc = "大宋厢军的布帽，勉强挡风。";
        break;
      case 3:
        this.prop = { fy: 150, con: 12, gj: 65 };
        this.desc = "大宋边军的皮盔，轻便护首。";
        break;
      case 4:
        this.prop = { fy: 290, gj: 128, con: 21, releasetime_per: 5 };
        this.desc = "大宋精锐步兵的铁盔，护首周全。";
        break;
      case 5:
        this.prop = { gj: 228, fy: 356, ds: 420, con: 35, releasetime_per: 10 };
        this.desc = "大宋禁军的制式军帽，红缨铁盔，攻防兼备。";
        break;
    }
    EQUIPMENT.prototype.on_create.apply(this);
  }
}
