import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE, WEAPON_TYPE } from "../../../../core/const.js";

export default class extends EQUIPMENT {
  name = "君子剑";
  desc = "华山派镇派宝剑，剑身通体青碧，如君子之德温润而锋锐内敛。";
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
        this.prop = { gj: 55, mz: 35 };
        this.desc = "华山弟子的青钢剑，剑身修长，初窥剑道。";
        break;
      case 3:
        this.prop = { gj: 132, str: 25, mz: 120 };
        this.desc = "华山入室弟子的佩剑，锋锐灵动，剑气初成。";
        break;
      case 4:
        this.prop = { gj: 300, add_sh_per: 3, str: 35, mz: 320 };
        this.desc = "华山护法的佩剑，剑出如虹，破空裂风。";
        break;
      case 5:
        this.prop = { gj: 490, str: 55, mz: 500, mz_per: 10, add_sh_per: 6 };
        this.desc = "华山长老的佩剑，剑身青碧，如君子之德，温润而锋锐内敛。";
        break;
    }
    EQUIPMENT.prototype.on_create.apply(this);
  }
}
