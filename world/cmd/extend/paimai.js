this.inherits(COMMAND);
this.command = "pm";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.admin = true;
this.regex = /^(\w+)(?:\s(\w+))?(?:\s(\w+))?$/;

this.enter = function (me, type, par, par2) {
    return me.send('未开放');
}
