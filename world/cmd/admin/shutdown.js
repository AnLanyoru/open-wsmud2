import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";
import { WORLD } from "../../../os/world.js";

export default class extends COMMAND {
    command = "shutdown";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_level = 6;
    handler = 0;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, arg) {
    if (arg == "stop") {
        if (this.handler) {
            clearInterval(this.handler);
            WORLD.sendAll("<hic>服务器停止维护，谢谢大家支持。</hic>");
        }
        return;
    }
    WORLD.sendAll("<hir>服务器将要关闭维护，各位玩家请处理好自己的游戏状态。</hir>");

    this.handler = this.call_interval(function (count) {
        WORLD.sendAll("<red>还有" + (100 - count * 10) + "秒后服务器将关闭维护，请处理好自己的游戏状态。</red>");

    }, 10000, 10, function () {
        WORLD.sendAll("<red>服务器关闭。</red>");

        WORLD.close();
        // WORLD.LISTENER.tcpServer._events.connection = null;
    });
}
}

