import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";

export default class extends COMMAND {
    command = "spfm";
    allow_die = true;
    allow_faint = true;
    allow_state = true;
    allow_busy = true;
    regex = /(\w+)(?:\s+(\w+))?/;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, arg1, arg2) {
    if (!arg1) return;
    let func = this['set_' + arg1];
    if (func) {
        func.call(this, me, arg2);
    }
}
    set_qkyz(me, arg) {
    if (!arg || (!(arg > 0))) {
        me.remove_temp('qkyz_m');
        return me.send('<cyn>你将乾坤一掷更改为使用内力，不消耗铜板。</cyn>');
    }
    if (arg > 100000) arg = 100000;
    me.set_temp('qkyz_m', arg);

    me.send('<cyn>你的乾坤一掷每次使用将消耗' + arg + '个铜板。</cyn>');
}
}
