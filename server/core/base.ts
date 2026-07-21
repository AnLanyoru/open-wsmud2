// ============================================================
// BASE — 所有游戏对象的根基类
// ============================================================

import { pathToFileURL } from 'url';

// ============================================================
// 内部类型
// ============================================================

/** 资源对象最小契约 — NEW 实例化后设置 path 并调用 create */
interface ResourceObj {
    path?: string;

    create?(fname: string, ctor?: string): void;
    update?(fname: string, ctor?: string): void;
}

/** 资源类构造函数（ES class） */
type CtorFunc = new (par?: string) => ResourceObj;

/** 事件存储映射 — 纯函数数组，按优先级降序排列 */
export type EventStore = Record<string, ((...args: any[]) => any)[]>;

// ============================================================
// BASE 类
// ============================================================

export class BASE {
    // ============ 实例字段 ============

    /** 对象ID（由资源文件动态注入） */
    id?: string;
    /** 资源路径（由 static NEW 在实例化后设置） */
    path?: string;

    /** 事件存储 — add_event / fire_event 系统，纯函数数组 */
    protected _events?: EventStore;
    /** 定时 handler 的过期时间: 事件名 → (函数引用 → 过期时间戳) */
    protected _timed?: Map<string, Map<Function, number>>;
    /** handler 的优先级: 事件名 → (函数引用 → priority)，仅 add 时用于排序 */
    protected _priority?: Map<string, Map<Function, number>>;

    // ============ 批量属性设置 ============

    /**
     * 批量设置属性 — 将键值对中的可枚举自有属性复制到当前对象
     * @param pars - 键值对（可选）
     */
    set(pars?: Partial<this>): void {
        if (pars) Object.assign(this, pars);
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
     * @param priority - 优先级，数值越小越先执行，不传则排在最后
     */
    add_event(
        fname: string,
        func: (this: this, ...args: any[]) => any,
        time?: number,
        priority?: number,
    ): void {
        if (!this[fname]) {
            const self: BASE = this;
            (this as any)[fname] = function (this: BASE) {
                return self.fire_event(fname, arguments as unknown as any[]);
            } as any;
        }
        if (!this._events) this._events = {};
        if (!this._events[fname]) this._events[fname] = [];

        const funcs = this._events[fname];

        // 重复添加：告警，移除旧位置，未重新指定的元数据予以清理
        const dupIdx = funcs.indexOf(func);
        if (dupIdx !== -1) {
            console.warn('add_event: %s 重复添加 handler — %s', fname, func.name || func);
            funcs.splice(dupIdx, 1);
            if (!time) this._timed?.get(fname)?.delete(func);
            if (priority === undefined) this._priority?.get(fname)?.delete(func);
        }

        // 更新过期时间
        if (time) {
            if (!this._timed) this._timed = new Map();
            let timedMap = this._timed.get(fname);
            if (!timedMap) {
                timedMap = new Map();
                this._timed.set(fname, timedMap);
            }
            timedMap.set(func, Date.now() + time);
        }

        // 按优先级升序插入，无优先级排在末尾
        if (priority !== undefined) {
            if (!this._priority) this._priority = new Map();
            let priMap = this._priority.get(fname);
            if (!priMap) {
                priMap = new Map();
                this._priority.set(fname, priMap);
            }
            priMap.set(func, priority);

            let insertIdx = funcs.length;
            for (let i = 0; i < funcs.length; i++) {
                const ep = priMap.get(funcs[i]);
                if (ep === undefined || ep > priority) {
                    insertIdx = i;
                    break;
                }
            }
            funcs.splice(insertIdx, 0, func);
        } else {
            funcs.push(func);
        }
    }

    /**
     * 移除事件
     * @param name - 事件名
     * @param func - 要移除的函数
     */
    remove_event(name: string, func: Function): void {
        if (!this._events) return;
        const funcs = this._events[name];
        if (!funcs) return;

        for (let i = 0; i < funcs.length; i++) {
            if (funcs[i] === func) {
                funcs.splice(i, 1);
                i--;
            }
        }

        // 清理元数据
        this._timed?.get(name)?.delete(func);
        this._priority?.get(name)?.delete(func);

        if (!funcs.length) {
            delete this._events[name];
            delete this[name];
            this._timed?.delete(name);
            this._priority?.delete(name);
        }
    }

    /**
     * 触发事件
     * @param name - 事件名
     * @param args - 实参数组（或 arguments 对象）
     * @returns 返回 false 表示阻止后续执行
     */
    fire_event(name: string, args: any[]): boolean | undefined {
        if (!this._events) return;
        const funcs = this._events[name];
        if (!funcs) return;

        const timedMap = this._timed?.get(name);
        const hasTimed = timedMap && timedMap.size > 0;
        const dt = hasTimed ? Date.now() : 0;
        const priMap = this._priority?.get(name);

        let w = 0;
        let stopped = false;
        for (let i = 0; i < funcs.length; i++) {
            const f = funcs[i];
            // 检查过期
            if (hasTimed) {
                const expiry = timedMap!.get(f);
                if (expiry !== undefined && expiry <= dt) {
                    timedMap!.delete(f);
                    priMap?.delete(f);
                    continue;
                }
            }
            if (!stopped) {
                stopped = f.apply(this, args) === false;
            }
            funcs[w++] = f;
        }
        funcs.length = w;

        if (!w) {
            delete this._events[name];
            delete this[name];
            this._timed?.delete(name);
            this._priority?.delete(name);
        }
        return stopped ? false : undefined;
    }

    /**
     * 深拷贝事件数据并重建桩函数 — Object.create 克隆后调用，使实例脱离原型链独立运作。
     * 若原型无事件数据则跳过（零开销）。
     */
    protected _isolate_events(): void {
        if (this._events) {
            const eventsCopy: EventStore = {};
            for (const key of Object.keys(this._events)) {
                eventsCopy[key] = [...this._events[key]];
            }
            this._events = eventsCopy;
            for (const fname of Object.keys(eventsCopy)) {
                const self: BASE = this;
                (this as any)[fname] = function (this: BASE) {
                    return self.fire_event(fname, arguments as unknown as any[]);
                } as any;
            }
        }
        if (this._timed) {
            const copy = new Map<string, Map<Function, number>>();
            for (const [name, m] of this._timed) {
                copy.set(name, new Map(m));
            }
            this._timed = copy;
        }
        if (this._priority) {
            const copy = new Map<string, Map<Function, number>>();
            for (const [name, m] of this._priority) {
                copy.set(name, new Map(m));
            }
            this._priority = copy;
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

    // ============ 临时数据存储 ============

    /** 临时数据值存储 */
    _temp_values: Map<string, any> = new Map();
    /** 临时数据过期时间存储 */
    _temp_expiry: Map<string, number> = new Map();

    /** 临时数据兼容访问器（序列化/clone 用，非热路径） */
    get temp(): Record<string, any> {
        const obj: Record<string, any> = {};
        const expiry = this._temp_expiry;
        for (const [k, v] of this._temp_values) {
            const e = expiry.get(k);
            obj[k] = e !== undefined ? { v, e } : v;
        }
        return obj;
    }

    set temp(data: Record<string, any> | null | undefined) {
        this._temp_values.clear();
        this._temp_expiry.clear();
        if (!data) return;
        for (const key of Object.keys(data)) {
            const val = data[key];
            if (val === null || val === undefined) continue;
            if (typeof val === 'object' && 'e' in val && 'v' in val) {
                this._temp_values.set(key, val.v);
                this._temp_expiry.set(key, val.e);
            } else {
                this._temp_values.set(key, val);
            }
        }
    }

    query_temp<T = unknown>(name: string, def?: T): T {
        if (def === undefined) def = 0 as T;
        const val = this._temp_values.get(name);
        if (val === undefined) return def;
        const expiry = this._temp_expiry.get(name);
        if (expiry === undefined) return val as T;
        if (Date.now() <= expiry) return val as T;
        this._temp_values.delete(name);
        this._temp_expiry.delete(name);
        return def;
    }

    set_temp(name: string, value: unknown, time?: number): void {
        this._temp_values.set(name, value);
        if (time) {
            this._temp_expiry.set(name, Date.now() + time);
        } else {
            this._temp_expiry.delete(name);
        }
    }

    remove_temp(name: string): void {
        this._temp_values.delete(name);
        this._temp_expiry.delete(name);
    }

    add_temp(name: string, value: number, time?: number): number {
        const oldVal = this._temp_values.get(name);
        const oldExpiry = this._temp_expiry.get(name);
        const now = Date.now();
        const baseVal =
            typeof oldVal === 'number' && !oldExpiry
                ? oldVal
                : oldExpiry && oldExpiry > now
                  ? oldVal
                  : 0;
        const v = value + baseVal;
        if (time) {
            const newExpiry = now + time;
            // 旧条目未过期且旧时间更长 → 保留旧时间，防止缩短
            const finalExpiry =
                oldExpiry && oldExpiry > now && oldExpiry > newExpiry ? oldExpiry : newExpiry;
            this._temp_values.set(name, v);
            this._temp_expiry.set(name, finalExpiry);
        } else {
            this.set_temp(name, v);
        }
        return v;
    }

    query_temp_expiry(name: string): number | undefined {
        return this._temp_expiry.get(name);
    }

    add_temp_expiry(name: string, add_ms: number): boolean {
        const cur = this._temp_expiry.get(name);
        if (cur === undefined) return false;
        this._temp_expiry.set(name, cur + add_ms);
        return true;
    }

    /** 浅拷贝 temp 到目标对象 */
    copy_temp_to(target: BASE): void {
        target._temp_values = new Map(this._temp_values);
        target._temp_expiry = new Map(this._temp_expiry);
    }

    /** 是否有临时数据 */
    has_temp(): boolean {
        return this._temp_values.size > 0;
    }

    /**
     * 遍历所有 temp 条目
     * @param fn — 回调(key, value, expiry)，返回 false 可提前终止
     */
    forEach_temp(
        fn: (key: string, value: any, expiry: number | undefined) => boolean | void,
    ): void {
        const expiry = this._temp_expiry;
        for (const [k, v] of this._temp_values) {
            if (fn(k, v, expiry.get(k)) === false) break;
        }
    }

    // ============================================================
    // 静态成员 — 资源加载和对象工厂
    // ============================================================

    /** 已加载资源缓存: 路径 -> 构造函数 */
    static ITEMS: Record<string, CtorFunc> = {};

    /** 文件路径解析正则: 路径/#参数 */
    static PATH_REG: RegExp = /^(\w+(?:\/\w+)*)(#\w+)?$/;

    /**
     * 加载 extends 补丁文件 — 仅执行其副作用，不产生对象实例。
     * extends 文件通过顶层代码直接覆盖原型方法，无需存入 ITEMS。
     */
    static async RUN_EXTENDS(filepath: string): Promise<void> {
        await import(pathToFileURL(filepath).href);
    }

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
                BASE.ITEMS[fkey] = func as CtorFunc;
            } else {
                // extends/ files: side-effects ran on import, stub for CREATE compatibility
                BASE.ITEMS[fkey] = class {} as CtorFunc;
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
    static CREATE(path: string, fname: string, update: boolean = false): ResourceObj | undefined {
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
            return BASE.NEW(fname, func, paras, update);
        }

        // For files with # parameters, try the base path
        if (fname.includes('/')) {
            const baseKey = path + fname.substring(0, fname.lastIndexOf('/'));
            func = BASE.ITEMS[baseKey];
            if (func) {
                return BASE.NEW(fname, func, paras, update);
            }
        }

        throw new Error(`resource not preloaded: ${fkey} — 启动时必须先执行 PRELOAD`);
    }

    /**
     * 实例化对象
     * @param fname - 文件名
     * @param func - class 构造函数或工厂函数
     * @param par - 构造参数
     * @returns 新创建的对象
     */
    static NEW(
        fname: string,
        func: CtorFunc,
        par?: string,
        update: boolean = false,
    ): ResourceObj {
        const obj = new func(par);
        obj.path = fname;
        if (update && obj.update) {
            obj.update(fname, par);
        } else {
            obj.create?.(fname, par);
        }
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
            const mod = await import(pathToFileURL(filepath).href + '?update=' + Date.now());
            const func = (mod as { default?: Function }).default;
            if (typeof func === 'function') {
                BASE.ITEMS[fkey] = func as CtorFunc;
            } else {
                BASE.ITEMS[fkey] = class {} as CtorFunc;
            }
        } catch (e) {
            console.error('update %s error:', filepath, e, (e as Error).stack);
            throw e;
        }
    }
}
