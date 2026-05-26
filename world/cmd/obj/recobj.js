this.inherits(COMMAND);
this.command = "recobj";
//this.regex = /^(\w+)?(?:\s(\w+))?(?:\s(\w+))?$/;
this.enter = function (me, objid) {

    return me.send('你没有可供恢复的道具和操作');

} 