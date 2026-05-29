import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "stopstate";
    allow_busy = true;
    allow_state = true;

    enter(player) {
    if (player.state) {
        if (player.state.no_stop) return player.notify(player.state.no_stop);
    }
    player.set_state(null);
}
}
