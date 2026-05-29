import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "skgroup";
    allow_fight = false;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, par) {
    let index = parseInt(par);
    if (!(index >= 0 && index < 3)) return;
    let cur_index = this.cur_eqs(me);
    if (cur_index < 0) return me.send('装备错误。');
    let eqs = me.sk_groups[index];
    if (!eqs) return me.send('当前正在装备该技能组。');
    me.sk_groups[index] = null;
    this.save_eqgroup(me, cur_index);
    const enable_command = WORLD.COMMANDS.enable.enter;
    for (let i = 0; i < SK_TYPES.length; i++) {
        let sk_type = SK_TYPES[i];
        let skill = me.skills[sk_type];
        if (!skill) continue;
        let enable_skill = eqs[i];
        if (!enable_skill && !skill.enable_skill) continue;
        if (enable_skill && skill.enable_skill === enable_skill) continue;
        enable_command(me, sk_type, enable_skill, true);
    }

    me.send(`{type:"dialog",dialog:"skills",sk_group:${index}}`);
    me.init_skill();
    me.recount();
    me.notify_hp();

}
    enable_one(me, base, skill) {

}
    cur_eqs(me) {
    for (let i = 0; i < me.sk_groups.length; i++) {
        if (!me.sk_groups[i])
            return i;
    }
    return -1;
}
    save_eqgroup(me, index) {
    let eqs = [];
    for (let sk of SK_TYPES) {
        let skill = me.skills[sk];
        if (skill && skill.enable_skill) {
            eqs.push(skill.enable_skill);
        } else {
            eqs.push("");
        }
    }
    me.sk_groups[index] = eqs;
}
}

const WORLD = globalThis.WORLD;
const SK_TYPES = [
    "force", "unarmed", "dodge", "parry", "sword",
    "blade", "throwing", "staff", "club", "whip"
];
