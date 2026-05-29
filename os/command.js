/**
 * 所有命令的基类，
 * 自动加载所有定义在__COMMAND文件夹下的命令文件
 */
import { BASE } from "./base.js";
import { WORLD } from "./world.js";

export class COMMAND extends BASE {

    static __initInstance(obj) {
        // 所有默认值已迁移至class field声明
    }

    constructor() {
        super();
        COMMAND.__initInstance(this);
    }

    // ============ 核心方法(由子类重写) ============

    /**
     * 命令入口方法(由子类定义具体逻辑)
     * @param {CHARACTER|null} me - 执行命令的角色(可能为null)
     * @param {string} [arg] - 命令参数
     * @param {*} [_par2] - 额外参数(COMMAND.DO使用)
     * @param {*} [_par3] - 额外参数(COMMAND.DO使用)
     * @returns {boolean|void} 返回false表示命令执行失败
     */
    enter(me, arg, _par2, _par3) {
    }

    // ============ 命令标识 ============

    /** @type {string} 命令名(逗号分隔多个别名) */
    command;
    /** @type {RegExp|null} 参数正则表达式 */
    regex = null;
    /** @type {Function|null} 命令执行函数(绑定到目标prototype) */
    exec = null;

    // ============ 权限控制 ============

    /** @type {boolean} 是否允许战斗中执行 */
    allow_fight = true;
    /** @type {boolean} 是否允许死亡时执行 */
    allow_die = false;
    /** @type {boolean} 是否允许昏迷时执行 */
    allow_faint = false;
    /** @type {boolean} 是否允许在状态中执行 */
    allow_state = false;
    /** @type {boolean} 是否允许忙乱时执行 */
    allow_busy = false;
    /** @type {number} 所需权限等级 0=所有人 6=管理员 */
    allow_level = 0;
    /** @type {boolean} 是否允许未登录时执行 */
    allow_login = false;

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
