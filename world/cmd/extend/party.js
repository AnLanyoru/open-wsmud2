import { COMMAND } from "../../../os/command.js";

export default function() {
this.inherits(COMMAND);
this.command = "party";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.admin = true;
this.regex = /^(\w+)(?:\s+(.+?))?(?:\s+(\w+))?$/;
this.enter = function (me, cmd, par, par2) {

}
}
