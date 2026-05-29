import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "speed";
    allow_busy = true;
    allow_state = true;
    allow_level = 6;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, arg) {
        const ms = parseInt(arg);
        if (!(ms >= 100)) {
            return me.send(`当前心跳间隔: ${WORLD.heartbeat_interval}ms，用法: speed <毫秒数，最小100>`);
        }
        WORLD.heartbeat_interval = ms;
        clearInterval(WORLD.heart_beat_service);
        WORLD.heart_beat_service = setInterval(WORLD.heart_beat, ms);
        me.send(`心跳间隔已修改为 ${ms}ms`);
    }
}

const WORLD = globalThis.WORLD;
