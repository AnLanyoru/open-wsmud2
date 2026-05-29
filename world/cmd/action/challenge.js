import { COMMAND } from "../../../os/command.js";

export default function() {
    const WORLD = globalThis.WORLD;
this.inherits(COMMAND);
this.command = "challenge";
this.allow_fight = false;
this.enter = function (player, index) {

    return WORLD.COMMANDS['biwu'].biwu_record(player);
}
}
