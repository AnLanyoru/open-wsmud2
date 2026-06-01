import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";

export default class extends COMMAND {
    command = "state";
    allow_busy = true;
    allow_state = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, type) {
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
}
