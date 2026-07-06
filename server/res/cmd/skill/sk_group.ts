import {COMMAND} from "../../../core/command.js";
import {CHARACTER} from "../../../core/char/character.js";
import type { USER } from "../../../core/char/user.js";
import {WORLD} from "../../../core/world.js";

export default class extends COMMAND {
    command = "skgroup";
    allow_fight = false;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me: USER, par: string) {
        let index = parseInt(par);
        if (!(index >= 0 && index < 3)) return;
        let cur_index = this.cur_eqs(me);
        if (cur_index < 0) return me.send('装备错误。');
        let eqs = me.sk_groups[index];
        if (!eqs) return me.send('当前正在装备该技能组。');
        me.sk_groups[index] = null;
        this.save_eqgroup(me, cur_index);
        for (let i = 0; i < SK_TYPES.length; i++) {
            this.enable_one(me, SK_TYPES[i], eqs[i]);
        }

        me.send(`{type:"dialog",dialog:"skills",sk_group:${index}}`);
        me.init_skill();
        me.recount();
        me.notify_hp();

    }

    enable_one(me: USER, base: string, skill: string) {
        let baseskill = me.skills.get(base);
        if (!baseskill) return;
        if (!skill && !baseskill.enable_skill) return;
        if (skill && baseskill.enable_skill === skill) return;
        const enable_command = WORLD.COMMANDS.get("enable")!.enter;
        enable_command(me, base, skill || 'none', 'true');
    }

    cur_eqs(me: USER) {
        if (!me.sk_groups || me.sk_groups.length === 0) {
            me.sk_groups = [null, [], []];
            return 0;
        }
        for (let i = 0; i < me.sk_groups.length; i++) {
            if (me.sk_groups[i] == null)
                return i;
        }
        return -1;
    }

    save_eqgroup(me, index) {
        let eqs: string[] = [];
        for (let sk of SK_TYPES) {
            let skill = me.skills.get(sk);
            if (skill && skill.enable_skill) {
                eqs.push(skill.enable_skill);
            } else {
                eqs.push("");
            }
        }
        me.sk_groups[index] = eqs;
    }
}

const SK_TYPES = [
    "force", "unarmed", "dodge", "parry", "sword",
    "blade", "throwing", "staff", "club", "whip"
];
