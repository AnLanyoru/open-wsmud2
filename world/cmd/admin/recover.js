this.inherits(COMMAND);
this.command = "recover";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.admin = true;
this.regex = /^(.+?)(?:\s(\w+))?$/;
this.allow_level = 2;
this.enter = function (me, userid, objid) {

}

this.clear = function (user) {

}


this.add_obj = function (me, obj, type, key) {

}
