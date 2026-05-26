this.inherits(COMMAND);
this.command = "state";
this.allow_busy = true;
this.allow_state = true;
this.enter = function (me, type) {
    if (!me.state) return me.send('你没有在忙。');
    if (type === 'stop') {
        if (me.state) {
            if (me.state.no_stop) return me.notify(me.state.no_stop);
        }
        me.set_state(null);
    } else {
        if (me.state.on_check) {
            return me.state.on_check(me);
        }
        return me.send('你正在' + me.state.title + "。");

    }

}
