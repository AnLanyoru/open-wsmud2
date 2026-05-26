this.inherits(COMMAND);
this.command = "spfm";
this.allow_die = true;
this.allow_faint = true;
this.allow_state = true;
this.allow_busy = true;
this.regex = /(\w+)(?:\s+(\w+))?/;
this.enter = function (me, arg1, arg2) {
    if (!arg1) return;
    let func = this['set_' + arg1];
    if (func) {
        func.call(this, me, arg2);
    }
}
this.set_qkyz = function (me, arg) {
    if (!arg || (!(arg > 0))) {
        me.remove_temp('qkyz_m');
        return me.send('<cyn>你将乾坤一掷更改为使用内力，不消耗铜板。</cyn>');
    }
    if (arg > 100000) arg = 100000;
    me.set_temp('qkyz_m', arg);

    me.send('<cyn>你的乾坤一掷每次使用将消耗' + arg + '个铜板。</cyn>');
}
