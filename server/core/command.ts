/**
 * 所有命令的基类，
 * 自动加载所有定义在 __COMMAND 文件夹下的命令文件
 */
import { BASE } from './base.js';
import { WORLD } from './world.js';
import type { CHARACTER } from './char/character.js';

export class COMMAND extends BASE {

    /** 比武记录（由 world/cmd/extend/biwu.js 注入） */
    biwu_record?: Record<string, any>;
    /** 进入副本回调（由 world/cmd/extend/ex.js 注入） */
    on_enter_fb?(me: CHARACTER | null, env: any): void;
    /** 清理邮件（由 checkorg 命令注入） */
    cmd_clearmail?(): void;
    /** 清理商店（由 checkorg 命令注入） */
    cmd_clearstore?(): void;
    /** 积分奖励（由 reward 命令注入） */
    score_reward?(i: number): Record<string, unknown>;
    /** 排行榜奖励（由 reward 命令注入） */
    top_reward?(i: number): Record<string, unknown>;
    /** 更新玩家排行榜（由 biwu 命令注入） */
    updatePlayerStats?(player: Record<string, any>, sc: number, fam?: string): void;
    /** 检查排行（由 biwu 命令注入） */
    checkStats?(player: Record<string, any>): void;
    /** 获取当前技能组索引（由 sk_group 命令注入） */
    cur_eqs?(me: CHARACTER): number;
    /** 清除延迟更新（由 update 命令注入） */
    clear_update?(): void;
    /** 锻造命令属性（由 duanzao 命令注入） */
    PROPS?: Record<string, unknown>;
    /** 锻造材料需求计算（由 duanzao 命令注入） */
    sum_needs?(prop: unknown, level: number): number;
    /** 默认锻造属性（由 duanzao 命令注入） */
    DEFAULT_PROPS?: Record<string | number, string | null>;

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
    enter(me: CHARACTER | null, arg?: unknown, _par2?: unknown, _par3?: unknown): boolean | void {
        return undefined;
    }

    // ============ Command identity ============

    /** Command name (comma-separated aliases) */
    command!: string;
    /** Parameter regex pattern */
    regex: RegExp | null = null;
    /** Bound exec function (on target prototype) — subclasses define exec() as method */
    exec?(...args: unknown[]): unknown;
    /** Map JSON cache (set by subclasses e.g. jh, dialog/map) */
    map_json?: any;
    /** JSON cache (used by emote_data etc.) */
    json?: string;

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
            (item.prototype as Record<string, any>)["do_" + name] = this.exec;
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
            cmdObj.enter(null, par1, par2, par3);
        }
    }
}
