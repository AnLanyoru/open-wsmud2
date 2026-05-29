import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "ex";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    admin = true;

    enter(me, type) {
    return false;
}
    append_sklf(env) {

}
    on_enter_fb(me, env) {

}
}
