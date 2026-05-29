import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "deleterole";
    allow_login = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, pars) {
    if (!pars) return;
    var olduser = WORLD.getUser(pars);
    if (olduser) {
        return me.notify("{type:\"deleterole\",result:0,message:\"登陆中的角色不允许删除\"}");
    }
    WORLD.DB.deleteRole(me.userid, pars).then(x => {
        if (x) {
            me.notify("{type:\"deleterole\",result:1,id:\"" + pars + "\"}");
            var user = WORLD.getUser(pars);
            if (user) {
                if (user.environment) user.environment.item_changed(user, false);
                WORLD.USERS.remove(user);
            }
        } else {
            me.notify("{type:\"deleterole\",result:0}");
        }
    }).catch(err => {
        me.notify("{type:\"deleterole\",result:0}");
    });
}
}

const WORLD = globalThis.WORLD;
