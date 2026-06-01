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

    // ============ 核心方法（由子类重写） ============

    /**
     * 命令入口方法，由子类实现具体逻辑
     * @param me - 执行角色（可为 null）
     * @param arg - 命令参数
     * @param _par2 - 额外参数（供 COMMAND.DO 使用）
     * @param _par3 - 额外参数（供 COMMAND.DO 使用）
     * @returns 返回 false 表示命令执行失败
     */
    enter(me: CHARACTER | null, arg?: unknown, _par2?: unknown, _par3?: unknown): boolean | void {
        return undefined;
    }

    // ============ 命令标识 ============

    /** 命令名（逗号分隔别名） */
    command!: string;
    /** 参数正则匹配模式 */
    regex: RegExp | null = null;
    /** 绑定到目标原型上的执行函数，由子类定义 exec() 方法提供 */
    exec?(...args: unknown[]): unknown;
    /** 地图 JSON 缓存（由 jh、dialog/map 等子类设置） */
    map_json?: any;
    /** JSON 缓存（供 emote_data 等使用） */
    json?: string;

    // ============ 权限控制 ============

    /** 允许在战斗时执行 */
    allow_fight: boolean = true;
    /** 允许在死亡时执行 */
    allow_die: boolean = false;
    /** 允许在昏迷时执行 */
    allow_faint: boolean = false;
    /** 允许在特殊状态时执行 */
    allow_state: boolean = false;
    /** 允许在忙碌时执行 */
    allow_busy: boolean = false;
    /** 所需权限等级（0=所有玩家, 6=管理员） */
    allow_level: number = 0;
    /** 允许在登录前执行 */
    allow_login: boolean = false;

    /**
     * 命令状态检查，可由子类通过 overrides 覆写允许标志
     */
    check_command(me: CHARACTER, overrides?: Partial<Pick<COMMAND, 'allow_die' | 'allow_faint' | 'allow_state' | 'allow_fight' | 'allow_busy'>>): boolean {
        const allow_die = overrides?.allow_die ?? this.allow_die;
        const allow_faint = overrides?.allow_faint ?? this.allow_faint;
        const allow_state = overrides?.allow_state ?? this.allow_state;
        const allow_fight = overrides?.allow_fight ?? this.allow_fight;
        const allow_busy = overrides?.allow_busy ?? this.allow_busy;

        if (me.hp <= 0 && !allow_die)
            return me.notify_fail("你现在是灵魂状态，不能那么做。");
        if (!allow_faint && me.is_faint) {
            me.send("你正在昏迷中！");
            return false;
        }
        if (!allow_state && me.state)
            return me.notify_fail("你正在" + me.state.title + "，没时间这么做。");
        if (!allow_fight && me.fight_type > 0)
            return me.notify_fail("你正在战斗，待会再说。");
        if (!allow_busy && me.is_busy)
            return me.notify_fail("你现在正忙。");
        return true;
    }

    /**
     * 将命令绑定到目标类的原型上，之后可通过 obj.do_commandname() 调用
     * @param item - 目标类构造函数
     * @param name - 命令名（默认使用 this.command）
     */
    for_item(item: Function, name?: string): void {
        if (this.exec) {
            name = name || this.command;
            (item.prototype as Record<string, any>)["do_" + name] = this.exec;
        }
    }

    /**
     * 命令创建回调，向 WORLD.COMMANDS 注册命令
     * @param fname - 命令文件名
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
     * 命令更新回调，重新注册到 WORLD.COMMANDS
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
     * 执行指定名称的命令
     * @param cmd - 命令名
     * @param par1 - 参数1
     * @param par2 - 额外参数
     * @param par3 - 额外参数
     */
    static DO(cmd: string, par1?: unknown, par2?: unknown, par3?: unknown): void {
        const cmdObj = WORLD.COMMANDS[cmd];
        if (cmdObj) {
            cmdObj.enter(null, par1, par2, par3);
        }
    }
}
