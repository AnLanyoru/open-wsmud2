import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "user";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_level = 3;

    enter(me, arg) {

}
}

const num_reg = /\d+/;
