import { COMMAND } from "../../../os/command.js";

export default function() {
this.inherits(COMMAND);
this.command = "lianyao";
this.regex = /^(\w+)?(?:\s(-?\d+))?$/;

this.enter = function (player, arg, id) {

}
}
