import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "challenge";
    allow_fight = false;

    enter(player, index) {

    return WORLD.COMMANDS['biwu'].biwu_record(player);
}
}

const WORLD = globalThis.WORLD;
