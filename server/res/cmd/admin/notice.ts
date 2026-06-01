import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { WORLD } from "../../../core/world.js";

export default class extends COMMAND {
    command = "notice";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_level = 6;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, arg) {
    var nt = {
        content: arg,
        time: Date.now()
    };
    MESSAGE.NOTICES.push(nt);
    var item = {
        type: "dialog", dialog: "message", message: {
            time: nt.time,
            content: nt.content,
            id: "notice",
            name: "系统公告"
        }
    };
    var str = JSON.stringify(item);
    WORLD.sendAll(str);
}
    updatelast(me) {
    MESSAGE.NOTICES[MESSAGE.NOTICES.length - 1].content = `
   古大陆妖族营地在每周快速完成后，仍可以继续手动击杀，直到每周上限。
   降低营地1刷新速度10秒，其他营地暂时关闭
    `;
    me.send(MESSAGE.NOTICES[MESSAGE.NOTICES.length - 1].content);
}
}

const MESSAGE = WORLD.MESSAGE;
