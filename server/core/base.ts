// ============================================================
// BASE — 所有游戏对象的根基类
// ============================================================

import { pathToFileURL } from 'url';

// ============================================================
// 内部类型
// ============================================================

/** 工厂函数（旧式 JS 风格，this 即为新对象） */
type FactoryFunc = (this: BASE, par?: string) => void;
/** 构造函数（ES class） */
type CtorFunc = new (par?: string) => BASE;

/**
 * 判断 function 是否为 class constructor。
 * isClass 被用于 class/factory 分支选择，其在 Module 阶段固定，通过 toString 判断即可。
 */
function isConstructor(fn: Function): fn is CtorFunc {
    return fn.toString().trim().startsWith('class');
}

/** 事件处理记录 */
interface EventRecord {
    func: (...args: any[]) => any;
    time: number;
}

/** 事件存储映射 */
type EventStore = Record<string, EventRecord[]>;

// ============================================================
// BASE 类
// ============================================================

export class BASE {

    // ============ 实例字段 ============

    /** 对象ID（由资源文件动态注入） */
    id?: string;
    /** 资源路径（由 static NEW 在实例化后设置） */
    path?: string;

    /** 事件存储 — add_event / fire_event 系统 */
    protected _events?: EventStore;

    constructor() {
        // 子类可覆写
    }

    // ============ 批量属性设置 ============

    /**
     * 批量设置属性 — 将键值对中的属性复制到当前对象
     * @param pars - 键值对（可选）
     */
    set(pars?: Partial<this> & Record<string, any>): void {
        if (!pars) return;
        for (const item in pars) {
            this[item] = pars[item];
        }
    }

    // ============ 生命周期 ============

    /**
     * create 方法由继承自 BASE 的类自己实现，当对象被从文件创建时调用
     * @param fname - 该对象文件的相对路径
     * @param ctor - 构造参数
     */
    create(fname: string, ctor?: string): void {
        return undefined;
    }

    // ============ 事件系统 ============

    /**
     * 注册事件 — 在 time 毫秒内用新的 func 替换旧的 fname 方法，超时后自动恢复。
     * 可用于临时覆盖方法的行为。
     * @param fname - 事件名（即要覆盖的方法名）
     * @param func - 替换的函数
     * @param time - 有效期（毫秒），不传则永久有效
     */
    add_event(fname: string, func: (this: this, ...args: any[]) => any, time?: number): void {
        if (!this[fname]) {
            this[fname] = this.fire_event.bind(this, fname);
        }
        if (!this._events) this._events = {};
        if (!this._events[fname]) this._events[fname] = [];
        this._events[fname].push({
            func: func,
            time: time ? (Date.now() + time) : Number.MAX_SAFE_INTEGER,
        });
    }

    /**
     * 移除事件
     * @param name - 事件名
     * @param func - 要移除的函数
     */
    remove_event(name: string, func: Function): void {
        if (!this._events) return;
        const evts = this._events[name];
        if (!evts) return;
        for (let i = 0; i < evts.length; i++) {
            if (evts[i].func === func) {
                evts.splice(i, 1);
                i--;
            }
        }

        if (!evts.length) {
            delete this._events[name];
            this[name] = null;
        }
    }

    /**
     * 触发事件
     * @param name - 事件名
     * @returns 返回 false 表示阻止后续执行
     */
    fire_event(name: string): boolean | undefined {
        if (!this._events) return;
        const evts = this._events[name];
        if (!evts) return;
        const dt = Date.now();
        for (let i = 0; i < evts.length; i++) {
            if (evts[i].time > dt) {
                if (!evts[i].func.call(this)) return false;
            } else {
                evts.splice(i, 1);
                i--;
            }
        }
        if (!evts.length) {
            delete this._events[name];
            this[name] = null;
        }
    }

    // ============ 工具方法 ============

    /**
     * 生成对象标识，前 8 位是毫秒级时间戳的 36 进制形式，后 4 位随机码，
     * 保证每毫秒生成的标识不会重复
     * @returns UID 字符串
     */
    create_uid(): string {
        const key = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const str: string[] = [];
        str.push(Date.now().toString(36));
        const length = key.length;
        for (let i = 0; i < 4; i++) {
            str.push(key[Math.floor(Math.random() * length)]);
        }
        return str.join('');
    }

    /**
     * 生成 0 到 num-1 之间的随机整数
     * @param num - 上限
     */
    random(num: number): number {
        return Math.floor(Math.random() * num);
    }

    /**
     * 延时调用 — 将回调绑定当前 this 后在指定毫秒后执行
     * @param func - 回调函数
     * @param time - 延时（毫秒）
     * @param arg1 - 参数 1
     * @param arg2 - 参数 2
     * @returns timeout ID
     */
    call_out<A1 = undefined, A2 = undefined>(
        func: (arg1?: A1, arg2?: A2) => void,
        time: number,
        arg1?: A1,
        arg2?: A2,
    ): ReturnType<typeof setTimeout> {
        return setTimeout(func.bind(this, arg1, arg2), time);
    }

    /**
     * 间隔调用 — 按指定间隔重复调用回调，count 次后或回调返回 false 时终止
     * @param func - 回调（传入调用次数序号，返回 false 可提前终止）
     * @param time - 间隔（毫秒）
     * @param count - 总调用次数
     * @param end_func - 结束回调
     * @returns interval handler
     */
    call_interval(
        func: (index: number) => boolean | void,
        time: number,
        count: number,
        end_func?: () => void,
    ): ReturnType<typeof setInterval> | undefined {
        count--;
        let index = 0;
        if (func(index++) === false || count === 0) {
            end_func && end_func();
            return undefined;
        }
        const handler = setInterval(() => {
            count--;
            if (func(index++) === false || count === 0) {
                clearInterval(handler);
                end_func && end_func();
            }
        }, time);
        return handler;
    }

    // ============================================================
    // 静态成员 — 资源加载和对象工厂
    // ============================================================

    /** 已加载资源缓存: 路径 -> 构造函数或工厂函数 */
    static ITEMS: Record<string, CtorFunc | FactoryFunc> = {};

    /** 文件路径解析正则: 路径/#参数 */
    static PATH_REG: RegExp = /^(\w+(?:\/\w+)*)(#\w+)?$/;

    /**
     * 预加载一个资源文件（async），存入缓存供后续同步 CREATE 使用
     * @param fkey - 缓存键
     * @param filepath - 文件路径
     */
    static async PRELOAD(fkey: string, filepath: string): Promise<void> {
        try {
            const mod = await import(pathToFileURL(filepath).href);
            const func = mod.default;
            if (typeof func === 'function') {
                BASE.ITEMS[fkey] = func as CtorFunc | FactoryFunc;
            } else {
                // extends/ files: side-effects ran on import
                BASE.ITEMS[fkey] = function (this: BASE) { /* stub */ } as FactoryFunc;
            }
        } catch (e) {
            console.error('preload %s error:', filepath, e, (e as Error).stack);
        }
    }

    /**
     * 同步创建对象（需先通过 PRELOAD 预加载）
     * @param path - 基础路径（如 __PATH.OBJ）
     * @param fname - 文件名（可能带 #参数）
     * @returns 新创建的对象
     */
    static CREATE(path: string, fname: string): BASE | undefined {
        const ary = BASE.PATH_REG.exec(fname);
        if (!ary) {
            console.error('path %s is incorrect:', path + fname);
            return undefined;
        }
        fname = ary[1];
        const paras = ary[2];
        const fkey = path + fname;
        let func = BASE.ITEMS[fkey];
        if (func) {
            return BASE.NEW(fname, func, paras);
        }

        // For files with # parameters, try the base path
        if (fname.includes('/')) {
            const baseKey = path + fname.substring(0, fname.lastIndexOf('/'));
            func = BASE.ITEMS[baseKey];
            if (func) {
                return BASE.NEW(fname, func, paras);
            }
        }

        throw new Error(
            `resource not preloaded: ${fkey} — 启动时必须先执行 PRELOAD`,
        );
    }

    /**
     * 实例化对象
     * @param fname - 文件名
     * @param func - class 构造函数或工厂函数
     * @param par - 构造参数
     * @returns 新创建的对象
     */
    static NEW(fname: string, func: CtorFunc | FactoryFunc, par?: string): BASE {
        const obj: BASE = isConstructor(func)
            ? new func(par)
            : (() => {
                  const o = new BASE();
                  func.apply(o);
                  return o;
              })();
        obj.path = fname;
        if (obj.create) obj.create(fname, par);
        return obj;
    }

    /**
     * 克隆对象的桩方法 — 子类覆写
     * @param fname - 文件名（可选）
     */
    static CLONE(fname?: string): void {
        // 由子类实现具体克隆逻辑
    }

    /**
     * 热更新资源文件
     * @param path - 基础路径
     * @param fname - 文件名
     */
    static async UPDATE(path: string, fname: string): Promise<void> {
        const ary = BASE.PATH_REG.exec(fname);
        if (!ary) {
            throw new Error('path ' + fname + ' is incorrect:');
        }
        fname = ary[1];
        const fkey = path + fname;
        const filepath = fkey + '.js';
        try {
            const mod = await import(
                pathToFileURL(filepath).href + '?update=' + Date.now()
            );
            const func = (mod as { default?: Function }).default;
            if (typeof func === 'function') {
                BASE.ITEMS[fkey] = func;
            } else {
                BASE.ITEMS[fkey] = function () { /* stub */ };
            }
        } catch (e) {
            console.error('update %s error:', filepath, e, (e as Error).stack);
            throw e;
        }
    }
}
