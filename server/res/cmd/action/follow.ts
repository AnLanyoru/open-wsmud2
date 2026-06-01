import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";

export default class extends COMMAND {
    command = "follow";

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, objid) {
    if (me.is_player && !me.query_temp("admin")) return false;
    if (!objid) {
        return me.notify("你要跟随谁？");
    }
    if (objid == "none") {
        me.do_follow(null);

    } else {
        var obj = me.find_obj(objid, me.environment);
        if (!obj || !obj.is_living) {
            return me.notify("你要跟随谁？");
        }
        me.do_follow(obj);
    }

}
}
