import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "clearwait";

    enter(player, arg, par) {
    player.wait_input = null;
}
}
