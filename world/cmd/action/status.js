import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "status";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;
    regex = /^(\w+)(?:\s(\w+))?$/;

    enter(me, type, tid) {
    if (type) {
        var target = me;
        if (tid) {
            target = me.find_obj(tid, me.environment);
            if (!target) return;
        }

        if (!target.status) return me.send("没有这个状态。");

        var status = null;
        for (var i = 0; i < target.status.length; i++) {
            if (target.status[i].id == type) {
                status = target.status[i];
                break;
            }
        }
        if (!status) return me.send("没有这个状态。");
        var str = [];
        str.push(status.downside ? "<red>" : "<hig>");
        str.push(status.name);
        if (status.override == 1) {
            str.push(UTIL.to_c(status.count));
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

const UTIL = globalThis.UTIL;
