import { COMMAND } from "../../../os/command.js";

export default function() {
    const WORLD = globalThis.WORLD;
this.inherits(COMMAND);
this.command = "pk";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.allow_faint = true;
this.enter = function (me) {
    var zc = WORLD.AREAS[6];

}
}
