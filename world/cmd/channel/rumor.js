this.inherits(COMMAND);
this.command = "rumor";
this.allow_busy = true;
this.allow_state = true;
this.enter = function (me, msg) {
    if (me) return;
    //if (!msg) {
    //    return;
    //}
    //msg = UTIL.htmlEncode(msg);
    var msg = JSON.stringify({ type: "msg", ch: "rumor", content: msg});

    WORLD.sendAll(msg);
}