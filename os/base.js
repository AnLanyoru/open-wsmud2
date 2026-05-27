/**
 * 定义当对象从文件生成时的基类，
 * 当文件内部调用this.inherit(父类名)后，将真正继承父类的原型和实例属性。
 * 但是文件内部不能修改this.prototype，修改将会作用到父类上面。
 * 可以用this.XXX扩展属性和方法
 */

/** @type {function} */
BASE = function () {

}

/**
 * 批量设置属性
 * @param {Object<string, *>} [pars] - 键值对
 */
BASE.prototype.set = function (pars) {
    if (!pars) return;
    for (var item in pars) {
        this[item] = pars[item];
    }
}

/**
 * 该方法使用直接赋值方式继承父对象的所有原型方法，
 * 如果子对象对原型修改，将会改变父对象的原型。
 * 所以该方法只能获取父对象的原型不能修改它，
 * 实际上是作为new的另外一种方式，通过apply获取实例属性，通过__proto__获取父类原型
 * @param {function} ctor - 父类构造函数
 */
BASE.prototype.inherits = function (ctor) {
    this.__proto__ = ctor.prototype;
    ctor.apply(this);
}

/**
 * create方法由继承自base类的类自己实现，当对象被从文件创建时候调用
 * @param {string} fname - 该对象的文件的相对路径
 * @param {string} [ctor] - 构造参数
 */
BASE.prototype.create = function (fname, ctor) {
}

/**
 * 在time毫秒内用新的func替换旧的fname方法
 * @param {string} fname - 事件名
 * @param {function} func - 替换的函数
 * @param {number} [time] - 有效期(毫秒)
 */
BASE.prototype.add_event = function (fname, func, time) {
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
BASE.prototype.remove_event = function (name, func) {
    if (!this._events) return;
    var evts = this._events[name];
    if (!evts) return;
    for (var i = 0; i < evts.length; i++) {
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
BASE.prototype.fire_event = function (name) {
    if (!this._events) return;
    var evts = this._events[name];
    if (!evts) return;
    var dt = Date.now();
    for (var i = 0; i < evts.length; i++) {
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
var key = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
BASE.prototype.create_uid = function () {
    var str = [];
    str.push(Date.now().toString(36));
    var length = key.length;
    for (var i = 0; i < 4; i++) {
        str.push(key[Math.floor(Math.random() * length)]);
    }
    return str.join("");
}

/**
 * 生成0到num-1之间的随机整数
 * @param {number} num - 上限
 * @returns {number}
 */
BASE.prototype.random = function (num) {
    return Math.floor(Math.random() * num);
}

/**
 * 延时调用
 * @param {function} func - 回调函数
 * @param {number} time - 延时(毫秒)
 * @param {*} [arg1] - 参数1
 * @param {*} [arg2] - 参数2
 * @returns {number} timeout ID
 */
BASE.prototype.call_out = function (func, time, arg1, arg2) {
    return setTimeout(func.bind(this, arg1, arg2), time);
}

/**
 * 间隔调用
 * @param {function} func - 回调函数，返回false可提前终止
 * @param {number} time - 间隔(毫秒)
 * @param {number} count - 总调用次数
 * @param {function} [end_func] - 结束回调
 * @returns {number} interval handler
 */
BASE.prototype.call_interval = function (func, time, count, end_func) {
    count--;
    var index = 0;
    if (func(index++) === false || count === 0) {
        return end_func && end_func();
    }
    var handler = 0;
    handler = setInterval(function () {

        count--;
        if (func(index++) === false || count === 0) {
            clearInterval(handler);
            end_func && end_func();
        }
    }, time);
    return handler;
}


const vm = require('vm');
const fs = require("fs");

/**
 * 已加载资源缓存: 路径 -> 编译后的函数
 * @type {Object<string, function>}
 */
BASE.ITEMS = {};

/**
 * 根据文件路径new一个对象
 * @param {string} path - 基础路径(如 __PATH.OBJ)
 * @param {string} fname - 文件名(可能带 #参数)
 * @returns {BASE|undefined}
 */
BASE.CREATE = function (path, fname) {

    var ary = BASE.PATH_REG.exec(fname);
    if (!ary) {
        return console.error("path %s is incorrect:", path + fname);
    }
    fname = ary[1];
    var paras = ary[2];
    var fkey = path + fname;
    var func = BASE.ITEMS[fkey];
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
BASE.CLONE = function (fname) {
}

/** @type {RegExp} 文件路径解析: 路径/#参数 */
BASE.PATH_REG = /^(\w+(?:\/\w+)*)(#\w+)?$/;

/**
 * 实例化对象
 * @param {string} fname - 文件名
 * @param {function} func - 编译后的构造函数
 * @param {string} [par] - 构造参数
 * @returns {BASE}
 */
BASE.NEW = function (fname, func, par) {
    var obj = new BASE();
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
BASE.UPDATE = function (path, fname) {
    var ary = BASE.PATH_REG.exec(fname);
    if (!ary) {
        throw "path " + fname + " is incorrect:";
    }
    fname = ary[1];
    var fkey = path + fname;
    var data = fs.readFileSync(fkey + ".js");
    var func = new Function(data);
    BASE.ITEMS[fkey] = func;
    var obj = new BASE();
    func.apply(obj);
    obj.path = fname;
    obj.update && obj.update(fname, ary[2]);
}
