import { COMMAND } from '../../../core/command.js';
import { CHARACTER } from '../../../core/char/character.js';
import { WORLD } from '../../../core/world.js';
import { NPC } from '../../../core/char/npc.js';
import { BASE } from '../../../core/base.js';
import { TASK } from '../../../core/task/task.js';

export default class UpdateCmd extends COMMAND {
    command = 'update';
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_level = 6;

    /** 延迟更新定时器句柄 */
    update_hander?: ReturnType<typeof setTimeout>;
    /** 延迟更新时间 */
    update_time?: Date;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me: CHARACTER | null, arg?: string) {
        if (!arg) return this.notify(me, '路径不合理');
        if (arg === 'room') {
            return this.update_room(me);
        } else if (arg === 'npc') {
            return this.update_npc(me, undefined);
        }
        this.do_update(me, arg)
            .then(() => {
                this.notify(me, arg + '已更新。');
            })
            .catch((e: any) => {
                console.log(e);
                this.notify(me, 'error:' + e);
            });
    }

    /**
     * 执行热更新，返回Promise
     * @param {CHARACTER | null} me
     * @param {string} arg
     * @returns {Promise<void>}
     */
    do_update(me: CHARACTER | null, arg: string): Promise<void> {
        arg = arg.replace(/\\/g, '/').replace(/^([^/\s]+)\s+/, '$1/');
        if (arg.startsWith('doc/')) return Promise.reject(new Error('不支持更新文档资源'));
        var index = arg.indexOf('/');
        if (index == -1) {
            return Promise.reject(new Error('路径不合理'));
        }
        const resource = arg.slice(0, index);
        var path = __PATH.WORLD + arg.slice(0, index + 1);
        var fname = arg.slice(index + 1);
        const match = BASE.PATH_REG.exec(fname);
        if (!match) {
            return Promise.reject(new Error('路径不合理'));
        }
        const resourcePath = match[1];
        return BASE.UPDATE(path, fname).then(() => {
            // 一个资源文件可通过 #参数生成多个模板。构造函数更新后，旧变体仍然
            // 继承旧类原型，必须按源文件路径一起失效，再预热本次请求的模板。
            if (resource === 'obj') {
                this.clear_variants(WORLD.OBJ_STORE, resourcePath);
            } else if (resource === 'npc') {
                this.clear_variants(WORLD.NPC_STORE, resourcePath);
            }
            BASE.CREATE(path, fname, true);
        });
    }

    /** 清除同一资源文件生成的基础模板及全部 #变体模板。 */
    clear_variants<T>(store: Map<string, T>, resourcePath: string): void {
        const variantPrefix = resourcePath + '#';
        for (const key of store.keys()) {
            if (key === resourcePath || key.startsWith(variantPrefix)) {
                store.delete(key);
            }
        }
    }

    notify(me: CHARACTER | null, msg: string): void {
        if (me) {
            me.notify(msg);
        } else {
            console.log(msg);
        }
    }

    update_npc(me: CHARACTER | null, path?: string) {
        if (!path) return;
        this.do_update(me, 'npc/' + path)
            .then(() => {
                if (me && me.environment) {
                    let npc = me.environment.find_obj_bypath(path!);
                    if (npc) {
                        npc.destroy();
                        NPC.CREATE(path!, me.environment);
                    }
                }
            })
            .catch((e: any) => {
                console.log(e);
                this.notify(me, 'error:' + e);
            });
    }

    update_obj(me: CHARACTER | null, path: string) {
        this.do_update(me, 'obj/' + path)
            .catch((e: any) => {
                console.log(e);
                this.notify(me, 'error:' + e);
            });
    }

    update_room(me?: CHARACTER | null) {}

    clear_update(): void {
        if (this.update_hander) clearTimeout(this.update_hander);
        this.update_time = undefined;
        console.log('clear timeout');
    }

    wait_update(me: CHARACTER, upd_time?: Date | string) {
        if (!upd_time) return me.send('没有设置更新时间');
        if (typeof upd_time === 'string') {
            upd_time = new Date(upd_time);
        }
        let time = upd_time.getTime() - Date.now();
        if (!(time > 10000)) return me.send('更新时间不能小于当前时间');
        this.update_hander = this.call_out(this.on_update, time);
        this.update_time = upd_time;
        this.format_time(me, this.update_time);
    }

    format_time(me: CHARACTER, time: Date): void {
        let str: string[] = ['已设置', time.toLocaleString(), '更新，在'];
        let remaining = time.getTime() - Date.now();
        if (remaining > 3600000) {
            str.push(String(Math.floor(remaining / 3600000)), '小时');
            remaining = remaining % 3600000;
        }
        if (remaining > 60000) {
            str.push(String(Math.floor(remaining / 60000)), '分钟');
            remaining = remaining % 60000;
        }
        remaining = Math.floor(remaining / 1000);
        str.push(String(remaining), '秒后');
        me.send(str.join(''));
    }

    on_update(): void {
        this.update_hander = undefined;
        this.update_time = undefined;
    }

    wait(me: CHARACTER): void {
        let task = TASK.GET('time');
        let updtime = new Date(2026, 1, 15, 12);
        let time = updtime.getTime() - Date.now();
        if (task && task.run2) {
            task.handler = task.call_out(task.run2, Math.max(time, 0));
        }
        this.format_time(me, updtime);
    }
}

const __PATH: Record<string, string> = globalThis.__PATH;
const old_update_cmd = WORLD.COMMANDS.get('update') as UpdateCmd;
if (old_update_cmd && old_update_cmd.clear_update) {
    old_update_cmd.clear_update();
}
