import { COMMAND } from "../../../os/command.js";

export default function() {
this.inherits(COMMAND);
this.command = "eqgroup";
this.allow_fight = false;
this.enter = function (me, par) {
    let index = parseInt(par);
    if (!(index >= 0 && index < 3)) return;

    this.save_eqgroup(me);

    let eqs = me.eq_groups[index];
    if (!eqs) eqs = new Array(me.equipment.length);
    for (let i = 0; i < me.equipment.length; i++) {
        let eq = me.equipment[i];
        if (!eq) continue;
        me.unequip(eq);
        if (!eq.is_shortcut)
            eq.notify_action(me, false);
    }
    for (let i = 0; i < me.equipment.length; i++) {
        if (!eqs[i]) continue;
        let obj = me.find_obj(eqs[i]);
        if (!obj || !obj.is_equipment) continue;
        if (me.equip(obj) !== false && obj.on_use) {
            obj.notify_action(me, true);
        }
    }
    me.eq_group = index;
    me.send(`{type:"dialog",dialog:"pack",eq_group:${index}}`);
}

this.save_eqgroup = function (me) {
    let eqs = me.eq_groups[me.eq_group];
    if (!eqs) {
        eqs = new Array(me.equipment.length);
        me.eq_groups[me.eq_group] = eqs;
    }
    for (let i = 0; i < me.equipment.length; i++) {
        let eq = me.equipment[i];
        eqs[i] = eq ? eq.id : null;
    }
}
}
