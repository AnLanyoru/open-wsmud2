this.inherits(COMMAND);
this.command = "status";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.allow_faint = true;
this.regex = /^(\w+)(?:\s(\w+))?$/;
this.enter = function (me, type, tid) {
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