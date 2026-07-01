import {COMMAND} from "../../../core/command.js";
import {CHARACTER} from "../../../core/char/character.js";
import type { USER } from "../../../core/char/user.js";
import {UTIL} from "../../../core/util/util.js";

export default class extends COMMAND {
    command = "status";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;
    regex = /^(\w+)(?:\s(\w+))?$/;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me: USER, type: string, tid: string) {
        if (type) {
            let target: CHARACTER = me;
            if (tid) {
                const target_obj = me.find_obj(tid, me.environment);
                if (!target_obj || !target_obj.check_character()) return;
                target = target_obj;
            }

            if (!target.status) return me.send("没有这个状态。");

            const status = target.status.find(s => s.id == type);
            if (!status) return me.send("没有这个状态。");
            const str: string[] = [];
            str.push(status.downside ? "<red>" : "<hig>");
            str.push(status.name);
            if (status.override == 1) {
                str.push(UTIL.to_c(status.count ?? 0));
                str.push("层");
            }

            str.push(status.downside ? "</red>\n" : "</hig>\n");
            if (status.desc) {
                str.push(status.desc);
                str.push("\n");
            }
            str.push(status.downside ? "<red>" : "<hig>");
            str.push(UTIL.prop_toString(status.prop, "\n", status.count));
            str.push(status.downside ? "</red>\n" : "</hig>\n");
            me.send(str.join(""));
        }
    }
}

