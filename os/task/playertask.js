require("../util/util");
USERTASK = function () {

}
USERTASK.inherits(BASE);

USERTASK.prototype.create = function (path) {
    WORLD.TASKS.push(this);
 
    this.on_create && this.on_create();
}
USERTASK.prototype.update = function (path) {
    this.on_create && this.on_create();
    for (var i = 0; i < WORLD.TASKS.length; i++) {
        if (WORLD.TASKS[i].path == path) {
            WORLD.TASKS[i] = this;
            return;
        }
    }
    WORLD.TASKS.push(this);
}
USERTASK.prototype.query_title = function () {
   
}
USERTASK.prototype.start = function () {

}
USERTASK.prototype.query_desc = function () {

}
USERTASK.prototype.query_state = function () {
    //0 不显示 1，进行中，2.可领取 3.已完成
}
USERTASK.RUN = function (id, player) {
    for (var i = 0; i < WORLD.TASKS.length; i++) {
        if (WORLD.TASKS[i].id == id) {
            return WORLD.TASKS[i].start(player);
        }
    }
    return false;
}
USERTASK.GET = function (id) {
    for (var i = 0; i < WORLD.TASKS.length; i++) {
        if (WORLD.TASKS[i].id == id) {
            return WORLD.TASKS[i];
        }
    }
}