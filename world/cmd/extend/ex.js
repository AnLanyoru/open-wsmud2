import { COMMAND } from "../../../os/command.js";

export default function() {
this.inherits(COMMAND);
this.command = "ex";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.admin = true;
this.enter = function (me, type) {
    return false;
}

this.append_sklf = function (env) {

}

this.on_enter_fb = function (me, env) {

}
}
