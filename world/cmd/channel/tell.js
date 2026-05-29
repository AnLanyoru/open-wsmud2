import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "tell";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    regex = /^(\w+)\s(.+)$/;

    enter(me, target, cont) {

}
}
