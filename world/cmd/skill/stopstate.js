import { COMMAND } from "../../../os/command.js";

export default function() {
this.inherits(COMMAND);
this.command = "stopstate";
this.allow_busy = true;
this.allow_state = true;
this.enter = function (player) {
    if (player.state) {
        if (player.state.no_stop) return player.notify(player.state.no_stop);
    }
    player.set_state(null);
}
}
