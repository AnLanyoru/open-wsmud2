import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "pm";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    admin = true;
    regex = /^(\w+)(?:\s(\w+))?(?:\s(\w+))?$/;

    enter(me, type, par, par2) {
    return me.send('未开放');
}
}
