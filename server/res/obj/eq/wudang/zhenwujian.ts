import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
  name = "真武剑";
  desc = "武当派镇派宝剑，剑身修长，剑柄刻有太极八卦图案，剑出如龙吟。";
  unit = "把";
  eq_type = EQUIP_TYPE.WEAPON;
  weapon_type = WEAPON_TYPE.SWORD;

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
        this.prop = { gj: 55, zj: 40 };
        this.desc = "武当道童的制式长剑，剑身轻盈，初窥太极剑意。";
        break;
      case 3:
        this.prop = { gj: 132, str: 25, zj: 120 };
        this.desc = "武当入室弟子的精钢剑，百炼而成，锋锐内敛。";
        break;
      case 4:
        this.prop = { gj: 290, str: 35, zj: 320, busy: 1000 };
        this.desc = "武当执事的佩剑，剑身隐现太极流光，如封似闭。";
        break;
      case 5:
        this.prop = { gj: 460, str: 55, zj: 500, zj_per: 10, busy: 3000 };
        this.desc = "武当长老的佩剑，剑身修长，剑柄刻太极八卦，剑出如龙吟。";
        break;
    }
    EQUIPMENT.prototype.on_create.apply(this);
  }
}
