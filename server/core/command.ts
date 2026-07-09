/**
 * 所有命令的基类，
 * 自动加载所有定义在 __COMMAND 文件夹下的命令文件
 */
import { BASE } from './base.js';
import { MessageEntry, WORLD } from './world.js';
import type { CHARACTER } from './char/character.js';
import type { OBJ } from './item/obj.js';
import type { CommandAccess } from '../types/base.js';
import type { USER } from './char/user.js';

export class COMMAND extends BASE {
    // ============ 核心方法（由子类重写） ============

    /**
     * 命令入口方法，由子类实现具体逻辑
     * @param me - 执行角色（可为 null）
     * @param arg - 命令参数
     * @returns 返回 false 表示命令执行失败
     */
    enter(me: CHARACTER, ...arg: any[]): any {
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

    /** 拆分动作 */
    split_book(player: CHARACTER, book: OBJ): void {}

    /**
     * 命令状态检查，可由子类通过 overrides 覆写允许标志
     */
    check_command(me: CHARACTER, overrides?: Partial<COMMAND>): boolean {
        const allow_die = overrides?.allow_die ?? this.allow_die;
        const allow_faint = overrides?.allow_faint ?? this.allow_faint;
        const allow_state = overrides?.allow_state ?? this.allow_state;
        const allow_fight = overrides?.allow_fight ?? this.allow_fight;
        const allow_busy = overrides?.allow_busy ?? this.allow_busy;

        if (me.hp <= 0 && !allow_die) return me.notify_fail('你现在是灵魂状态，不能那么做。');
        if (!allow_faint && me.is_faint) {
            me.send('你正在昏迷中！');
            return false;
        }
        if (!allow_state && me.state)
            return me.notify_fail('你正在' + me.state.title + '，没时间这么做。');
        if (!allow_fight && me.fight_type > 0) return me.notify_fail('你正在战斗，待会再说。');
        if (!allow_busy && me.is_busy) return me.notify_fail('你现在正忙。');
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
            item.prototype['do_' + name] = this.exec;
        }
    }

    /**
     * 命令创建回调，向 WORLD.COMMANDS 注册命令
     * @param fname - 命令文件名
     */
    create(fname: string): void {
        if (this.command) {
            const command_names = this.command.split(',');
            for (let i = 0; i < command_names.length; i++) {
                if (WORLD.COMMANDS.get(command_names[i])) console.error('command %s 重复', fname);
                WORLD.COMMANDS.set(command_names[i], this);
            }
        } else {
            console.error('command %s not have command name', fname);
        }
    }

    /**
     * 命令更新回调，重新注册到 WORLD.COMMANDS
     */
    update(): void {
        if (this.command) {
            const command_names = this.command.split(',');
            for (let i = 0; i < command_names.length; i++) {
                WORLD.COMMANDS.set(command_names[i], this);
            }
        } else {
            console.error('command not have command name');
        }
    }

    /**
     * 执行指定名称的命令
     * @param cmd - 命令名
     * @param args - 参数列表
     */
    static DO(cmd: string, ...args: (string | Partial<MessageEntry>)[]): void {
        const cmdObj = WORLD.COMMANDS.get(cmd);
        if (cmdObj) {
            //@ts-expect-error
            cmdObj.enter(null, ...args);
        }
    }
}
