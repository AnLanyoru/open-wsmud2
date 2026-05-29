import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "party";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    admin = true;
    regex = /^(\w+)(?:\s+(.+?))?(?:\s+(\w+))?$/;

    enter(me, cmd, par, par2) {

}
}
