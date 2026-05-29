import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "pk";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;

    enter(me) {
    var zc = WORLD.AREAS[6];

}
}

const WORLD = globalThis.WORLD;
