import { COMMAND } from "../../../os/command.js";

export default function() {
this.inherits(COMMAND);
this.command = "tell";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.regex = /^(\w+)\s(.+)$/;
this.enter = function (me, target, cont) {

}
}
