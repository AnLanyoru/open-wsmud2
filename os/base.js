/*

定义当对象从文件生成时的基类，
当文件内部调用this.inherit(父类名)后，将真正继承父类的原型和实例属性。
但是文件内部不能修改this.prototype，修改将会作用到父类上面。
可以用this.XXX扩展属性和方法
*/

BASE = function () {

}

BASE.prototype.set = function (pars) {
    if (!pars) return;
    for (var item in pars) {
        this[item] = pars[item];
    }
}
/*
该方法使用直接赋值方式继承父对象的所有原型方法，
如果子对象对原型修改，将会改变父对象的原型。
所以该方法只能获取父对象的原型不能修改它，

实际上是作为new的另外一种方式，通过apply获取实例属性，通过__proto__获取父类原型

*/
BASE.prototype.inherits = function (ctor) {
    this.__proto__ = ctor.prototype;
    ctor.apply(this);
}
/*
create方法由继承自base类的类自己实现，当对象被从文件创建时候调用
参数fname=该对象的文件的相对路径,ctor=构造方法
*/
BASE.prototype.create = function (fname, ctor) {
}
BASE.prototype.add_event = function (fname, func, time) {
    ///在time秒内用新的func替换旧的fname方法
    if (!this[fname])
        this[fname] = this.fire_event.bind(this, fname);
    if (!this._events) this._events = {};
    if (!this._events[fname]) this._events[fname] = [];
    this._events[fname].push({
        func: func,
        time: time ? (Date.now() + time) : Number.MAX_SAFE_INTEGER
    });
    //var old_func = this[fname];
    //this[fname] = func;
    //if (time) this.call_out(() =>  this[fname] = old_func, time);
    //return old_func;
}
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
/*
生成对象标识，前8位是毫秒级时间戳的36进制形式，后4位随机码，
最起码保证每毫秒生成的标识不会重复
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
BASE.prototype.random = function (num) {
    return Math.floor(Math.random() * num);
}
BASE.prototype.call_out = function (func, time, arg1, arg2) {
    return setTimeout(func.bind(this, arg1, arg2), time);
}
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
//根据文件路径new一个对象
BASE.ITEMS = {};
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
BASE.CLONE = function (fname) {
}
BASE.PATH_REG = /^(\w+(?:\/\w+)*)(#\w+)?$/;
BASE.NEW = function (fname, func, par) {
    var obj = new BASE();
    func.apply(obj);
    obj.path = fname;
    obj.create(fname, par);
    return obj;
}

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
