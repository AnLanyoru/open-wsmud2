/**
 * 所有命令的基类，
 * 自动加载所有定义在__COMMAND文件夹下的命令文件
 */
import { BASE } from "./base.js";
import { WORLD } from "./world.js";

export class COMMAND extends BASE {

    static __initInstance(obj) {
        obj.allow_fight = true;
        obj.allow_level = 0;
    }

    constructor() {
        super();
        COMMAND.__initInstance(this);
    }

    /**
     * 将命令绑定到某些对象上，调用方式: obj.do_commandname()
     * @param {function} item - 目标类构造函数
     * @param {string} [name] - 命令名，默认使用this.command
     */
    for_item(item, name) {
        if (this.exec) {
            name = name || this.command;
            item.prototype["do_" + name] = this.exec;
        }
    }

    /**
     * 命令创建回调，注册到WORLD.COMMANDS
     * @param {string} fname - 命令文件名
     */
    create(fname) {
        if (this.command) {
            const str = this.command.split(',');
            for (let i = 0; i < str.length; i++) {
                if (WORLD.COMMANDS[str[i]]) console.error("command %s 重复", fname);
                WORLD.COMMANDS[str[i]] = this;
            }
        } else {
            console.error("command %s not have command name", fname);
        }
    }

    /**
     * 命令更新回调
     */
    update() {
        if (this.command) {
            const str = this.command.split(',');
            for (let i = 0; i < str.length; i++) {
                WORLD.COMMANDS[str[i]] = this;
            }
        } else {
            console.error("command %s not have command name", fname);
        }
    }

    /**
     * 执行指定命令
     * @param {string} cmd - 命令名
     * @param {*} [par1]
     * @param {*} [par2]
     * @param {*} [par3]
     */
    static DO(cmd, par1, par2, par3) {
        const cmdObj = WORLD.COMMANDS[cmd];
        if (cmdObj) {
            cmdObj.enter(null, par1, par2, par3);
        }
    }
}
globalThis.COMMAND = COMMAND;
