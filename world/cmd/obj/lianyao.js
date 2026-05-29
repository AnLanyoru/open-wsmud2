import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "lianyao";
    regex = /^(\w+)?(?:\s(-?\d+))?$/;

    enter(player, arg, id) {

}
}
