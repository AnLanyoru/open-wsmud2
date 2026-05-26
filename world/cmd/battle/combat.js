this.inherits(COMMAND);
this.command = "combat";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.enter = function (me, type) {
    if (type=="end") {
        me.combat_info = false;
    } else {
        me.combat_info = true;
       
        //me.notify(me.query_status());
        me.notify(me.query_pfms());
        //if (me.is_fighting()) {
        //    var target = me.enemy[0];
        //    if (target)
        //        me.notify(target.query_status());
        //}
    }
}


//USER.prototype.query_pfms = function () {
//    if (this.pfm_json) return this.pfm_json;
//    var obj = {};
//    obj.type = "perform";
//    obj.distime = this.gjsd;
//    obj.items = [];
//    var skills = this.skills;
//    if (skills) {
//        var bases = ["unarmed", "force", "dodge", "parry"];
//        var weapon = this.query_weapon_type();
//        if (weapon != WEAPON_TYPE.NONE) bases.push(weapon);
//        for (var i = 0; i < bases.length; i++) {
//            var base_skill = skills[bases[i]];
//            if (base_skill) {
//                var sp_skill = SKILL.get(base_skill.enable || bases[i]);
//                if (sp_skill && sp_skill.pfm) {
//                    for (var p in sp_skill.pfm) {
//                        var pfmitem = sp_skill.pfm[p];
//                        obj.items.push({
//                            name: pfmitem.name,
//                            distime: pfmitem.distime || 1,
//                            id: bases[i] + "." + p
//                        });
//                    }
//                }
//            }
//        }
//    }
//    this.pfm_json = JSON.stringify(obj)
//    return this.pfm_json;
//}