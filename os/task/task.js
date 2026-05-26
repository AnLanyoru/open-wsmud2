
TASK = function () {

}
TASK.inherits(BASE);
TASK.prototype.create = function () {
    WORLD.SYSTEMTASKS.push(this);
    this.startup();
}
TASK.GET = function (id) {
    for (var i = 0; i < WORLD.SYSTEMTASKS.length; i++) {
        if (WORLD.SYSTEMTASKS[i].id == id) {
            return WORLD.SYSTEMTASKS[i];
        }
    }
}
TASK.prototype.update = function (path) {
    var oldtask = null;
    for (var i = 0; i < WORLD.SYSTEMTASKS.length; i++) {
        if (WORLD.SYSTEMTASKS[i].path == path) {
            WORLD.SYSTEMTASKS[i].stop();
            oldtask = WORLD.SYSTEMTASKS[i];
            WORLD.SYSTEMTASKS[i] = this;
        }
    }
    if (!oldtask) {
        WORLD.SYSTEMTASKS.push(this);
    }
    this.startup(oldtask);
}
TASK.prototype.startup = function () {

}
TASK.prototype.stop = function () {

}