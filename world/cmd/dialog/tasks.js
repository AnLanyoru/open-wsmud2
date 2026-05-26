
this.inherits(COMMAND);
this.command = "tasks";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.allow_faint = true;
this.enter = function (me, arg) {
    var obj = {};
    obj.type = "dialog";
    obj.dialog = "tasks";
    obj.items = [];
    for (var i = 0; i < WORLD.TASKS.length; i++) {
        var task = WORLD.TASKS[i];
        var state=task.query_state(me);
        if (!state) continue;
        obj.items.push({
            id:task.id,
            title: task.query_title(me),
            desc: task.query_desc(me),
            state: state,
        });
    }
    me.notify( JSON.stringify(obj));
}
