/**
 * 所有命令的基类，
 * 自动加载所有定义在 __COMMAND 文件夹下的命令文件
 */
import { BASE } from './base.js';
import { WORLD } from './world.js';
import type { CHARACTER } from './char/character.js';

export class COMMAND extends BASE {

    constructor() {
        super();
    }

    // ============ Core method (overridden by subclasses) ============

    /**
     * Command entry method — defined by subclass logic.
     * @param me - executing character (may be null)
     * @param arg - command argument
     * @param _par2 - extra param (COMMAND.DO usage)
     * @param _par3 - extra param (COMMAND.DO usage)
     * @returns false indicates command failure
     */
    enter(me: CHARACTER | null, arg?: string, _par2?: unknown, _par3?: unknown): boolean | void {
        return undefined;
    }

    // ============ Command identity ============

    /** Command name (comma-separated aliases) */
    command!: string;
    /** Parameter regex pattern */
    regex: RegExp | null = null;
    /** Bound exec function (on target prototype) */
    exec: Function | null = null;

    // ============ Permission control ============

    /** Allow execution during combat */
    allow_fight: boolean = true;
    /** Allow execution while dead */
    allow_die: boolean = false;
    /** Allow execution while unconscious */
    allow_faint: boolean = false;
    /** Allow execution while in special state */
    allow_state: boolean = false;
    /** Allow execution while busy */
    allow_busy: boolean = false;
    /** Required privilege level (0=all, 6=admin) */
    allow_level: number = 0;
    /** Allow execution before login */
    allow_login: boolean = false;

    /**
     * Bind command to target class prototypes.
     * Usage: obj.do_commandname()
     * @param item - target class constructor
     * @param name - command name (defaults to this.command)
     */
    for_item(item: Function, name?: string): void {
        if (this.exec) {
            name = name || this.command;
            (item.prototype as Record<string, unknown>)["do_" + name] = this.exec;
        }
    }

    /**
     * Command creation callback — registers to WORLD.COMMANDS.
     * @param fname - command file name
     */
    create(fname: string): void {
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
     * Command update callback
     */
    update(): void {
        if (this.command) {
            const str = this.command.split(',');
            for (let i = 0; i < str.length; i++) {
                WORLD.COMMANDS[str[i]] = this;
            }
        } else {
            console.error("command not have command name");
        }
    }

    /**
     * Execute a named command.
     * @param cmd - command name
     * @param par1 - arg
     * @param par2 - extra
     * @param par3 - extra
     */
    static DO(cmd: string, par1?: unknown, par2?: unknown, par3?: unknown): void {
        const cmdObj = WORLD.COMMANDS[cmd];
        if (cmdObj) {
            cmdObj.enter(null, par1 as string | undefined, par2, par3);
        }
    }
}
