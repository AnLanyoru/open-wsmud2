this.inherits(COMMAND);
this.command = "challenge";
this.allow_fight = false;
this.enter = function (player, index) {

    return WORLD.COMMANDS['biwu'].biwu_record(player);
}