/**
 * 定义当对象从文件生成时的基类，
 * 当文件内部调用this.inherit(父类名)后，将真正继承父类的原型和实例属性。
 * 但是文件内部不能修改this.prototype，修改将会作用到父类上面。
 * 可以用this.XXX扩展属性和方法
 */

import vm from 'vm';
import fs from 'fs';

export class BASE {
    static __initInstance(obj) {
        // BASE has no instance properties to initialize
    }

    constructor() {
        BASE.__initInstance(this);
    }

    /**
     * 批量设置属性 — 将键值对中的属性复制到当前对象
     * @param {Partial<this> & {[key: string]: any}} [pars] - 键值对（可选）
     */
    set(pars) {
        if (!pars) return;
        for (let item in pars) {
            this[item] = pars[item];
        }
    }

    /**
     * 动态继承 — 将当前对象原型链指向父类，并调用父类的 __initInstance（类）或构造函数（旧式函数）初始化实例属性
     *
     * 调用后 this 将获得父类原型上的所有方法和属性。
     * @template {{__initInstance?: Function, prototype: object, apply: Function}} T
     * @param {T} ctor - 父类构造函数（ES6 class 或旧式 function）
     * @returns {asserts this is T['prototype']}
     */
    inherits(ctor) {
        this.__proto__ = ctor.prototype;
        if (ctor.__initInstance) {
            ctor.__initInstance(this);
        } else {
            ctor.apply(this);
        }
    }

    /**
     * create方法由继承自base类的类自己实现，当对象被从文件创建时候调用
     * @param {string} fname - 该对象的文件的相对路径
     * @param {string} [ctor] - 构造参数
     */
    create(fname, ctor) {
    }

    /**
     * 在time毫秒内用新的func替换旧的fname方法，超时后自动恢复。可用于临时覆盖方法的行为。
     * @param {string} fname - 事件名（即要覆盖的方法名）
     * @param {(this: this, ...args: any[]) => any} func - 替换的函数
     * @param {number} [time] - 有效期(毫秒)，不传则永久有效
     */
    add_event(fname, func, time) {
        if (!this[fname])
            this[fname] = this.fire_event.bind(this, fname);
        if (!this._events) this._events = {};
        if (!this._events[fname]) this._events[fname] = [];
        this._events[fname].push({
            func: func,
            time: time ? (Date.now() + time) : Number.MAX_SAFE_INTEGER
        });
    }

    /**
     * 移除事件
     * @param {string} name - 事件名
     * @param {function} func - 要移除的函数
     */
    remove_event(name, func) {
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
            this._events[name] = null;
            this[name] = null;
        }
    }

    /**
     * 触发事件
     * @param {string} name - 事件名
     * @returns {boolean|undefined} 返回false表示阻止后续执行
     */
    fire_event(name) {
        if (!this._events) return;
        const evts = this._events[name];
        if (!evts) return;
        const dt = Date.now();
        for (let i = 0; i < evts.length; i++) {
            if (evts[i].time > dt) {
                if (evts[i].func.call(this) == false) return false;
            } else {
                evts.splice(i, 1);
                i--;
            }
        }
        if (!evts.length) {
            this._events[name] = null;
            this[name] = null;
        }
    }

    /**
     * 生成对象标识，前8位是毫秒级时间戳的36进制形式，后4位随机码，
     * 最起码保证每毫秒生成的标识不会重复
     * @returns {string} UID字符串
     */
    create_uid() {
        const key = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const str = [];
        str.push(Date.now().toString(36));
        const length = key.length;
        for (let i = 0; i < 4; i++) {
            str.push(key[Math.floor(Math.random() * length)]);
        }
        return str.join("");
    }

    /**
     * 生成0到num-1之间的随机整数
     * @param {number} num - 上限
     * @returns {number}
     */
    random(num) {
        return Math.floor(Math.random() * num);
    }

    /**
     * 延时调用 — 将回调绑定当前 this 后在指定毫秒后执行
     * @template A1, A2
     * @param {(arg1?: A1, arg2?: A2) => void} func - 回调函数
     * @param {number} time - 延时(毫秒)
     * @param {A1} [arg1] - 参数1
     * @param {A2} [arg2] - 参数2
     * @returns {number} timeout ID
     */
    call_out(func, time, arg1, arg2) {
        return setTimeout(func.bind(this, arg1, arg2), time);
    }

    /**
     * 间隔调用 — 按指定间隔重复调用回调，count 次后或回调返回 false 时终止
     * @param {(index: number) => boolean | void} func - 回调（传入调用次数序号，返回 false 可提前终止）
     * @param {number} time - 间隔(毫秒)
     * @param {number} count - 总调用次数
     * @param {() => void} [end_func] - 结束回调
     * @returns {number} interval handler
     */
    call_interval(func, time, count, end_func) {
        count--;
        let index = 0;
        if (func(index++) === false || count === 0) {
            return end_func && end_func();
        }
        let handler = 0;
        handler = setInterval(function () {

            count--;
            if (func(index++) === false || count === 0) {
                clearInterval(handler);
                end_func && end_func();
            }
        }, time);
        return handler;
    }

    // Static members

    /** @type {Object<string, function>} 已加载资源缓存: 路径 -> 编译后的函数 */
    static ITEMS = {};

    /** @type {RegExp} 文件路径解析: 路径/#参数 */
    static PATH_REG = /^(\w+(?:\/\w+)*)(#\w+)?$/;

    /**
     * 根据文件路径new一个对象
     * @param {string} path - 基础路径(如 __PATH.OBJ)
     * @param {string} fname - 文件名(可能带 #参数)
     * @returns {BASE|undefined}
     */
    static CREATE(path, fname) {

        const ary = BASE.PATH_REG.exec(fname);
        if (!ary) {
            return console.error("path %s is incorrect:", path + fname);
        }
        fname = ary[1];
        const paras = ary[2];
        const fkey = path + fname;
        let func = BASE.ITEMS[fkey];
        if (func) {
            return BASE.NEW(fname, func, paras);
        }
        const filepath = fkey + ".js";
        try {
            const script = fs.readFileSync(filepath);
            func = vm.compileFunction(script.toString(), [],
                { filename: filepath });

            BASE.ITEMS[fkey] = func;
            return BASE.NEW(fname, func, paras);
        } catch (e) {
            console.error("create %s%s error:", filepath, e, e.stack);
        }
    }

    /**
     * @param {string} fname
     */
    static CLONE(fname) {
    }

    /**
     * 实例化对象
     * @param {string} fname - 文件名
     * @param {function} func - 编译后的构造函数
     * @param {string} [par] - 构造参数
     * @returns {BASE}
     */
    static NEW(fname, func, par) {
        const obj = new BASE();
        func.apply(obj);
        obj.path = fname;
        obj.create(fname, par);
        return obj;
    }

    /**
     * 热更新资源文件
     * @param {string} path - 基础路径
     * @param {string} fname - 文件名
     */
    static UPDATE(path, fname) {
        let ary = BASE.PATH_REG.exec(fname);
        if (!ary) {
            throw "path " + fname + " is incorrect:";
        }
        fname = ary[1];
        const fkey = path + fname;
        const data = fs.readFileSync(fkey + ".js");
        const func = new Function(data);
        BASE.ITEMS[fkey] = func;
        const obj = new BASE();
        func.apply(obj);
        obj.path = fname;
        obj.update && obj.update(fname, ary[2]);
    }
}
globalThis.BASE = BASE;
