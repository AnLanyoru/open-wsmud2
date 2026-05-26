
this.inherits(COMMAND);
this.command = "clearwait";
this.enter = function (player, arg, par) {
    player.wait_input = null;
}
