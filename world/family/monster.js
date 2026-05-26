this.inherits(FAMILY);

this.id = "MONSTER";
this.name = "怪物";
this.call = function (player, isbad) {
    return isbad ? "畜生" : "大仙";

}
this.call_me = function (player, isbad) {

}