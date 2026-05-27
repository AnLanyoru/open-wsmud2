/**
 * OBJ 普通物品基类
 */

/** @type {function} */
OBJ = function () {
    /** @type {string} 量词单位 */
    this.unit = "个";
    /** @type {string|null} 物品路径 */
    this.path = null;
    /** @type {number} */
    this.count = 1;
    /** @type {boolean} 是否可堆叠 */
    this.combined = true;
    /** @type {number} 品级 */
    this.grade = 0;
    /** @type {number} 物品类型 */
    this.otype = 0;
}

OBJ.inherits(ITEM);
/** @type {boolean} 是否可交易 */
OBJ.prototype.transable = false;

/**
 * 初始化回调
 * @param {CHARACTER} [me]
 */
OBJ.prototype.init = function (me) {
    this.on_init && this.on_init(me);
}

/**
 * 完整名称(含数量)
 * @returns {string}
 */
OBJ.prototype.long_name = function () {
    if (this.combined) return UTIL.to_c(this.count) + this.unit + this.color_name;
    return this.color_name;
}

/**
 * 带数量的单位名称
 * @param {number} [count]
 * @returns {string}
 */
OBJ.prototype.unit_name = function (count) {
    return UTIL.to_c(count || this.count) + this.unit + this.color_name;

}

/**
 * 物品JSON序列化
 * @returns {string}
 */
OBJ.prototype.item_to_json = function () {
    return `["${this.name}","${this.id}",${this.count},${this.grade},"${this.unit}",${parseInt(this.value / 10)},${this.is_equipment ? 1 : 0},${this.on_use ? 1 : 0},${this.on_study ? 1 : 0},${this.on_open ? 1 : 0},${this.combine_count > 0 ? this.combine_count : 0}]`;
}

/**
 * 查询操作命令
 * @param {USER} me
 * @returns {string} JSON
 */
OBJ.prototype.query_commands = function (me) {
    return this.query_desc(me);
}

/**
 * 查询描述JSON
 * @param {USER} me
 * @returns {string} JSON
 */
OBJ.prototype.query_desc = function (me) {
    if (this.json) return this.json;
    var obj = {};
    obj.type = "item";
    obj.id = this.id;
    obj.desc = this.get_desc(me);
    obj.commands = [];
    obj.commands.push({
        cmd: "get " + this.id,
        name: "捡起"
    });

    this.json = JSON.stringify(obj)
    return this.json;
}

/**
 * 获取描述文本
 * @returns {string}
 */
OBJ.prototype.get_desc = function () {
    return this.color_name + "\n" + this.desc;
}

/**
 * 拆分堆叠物品
 * @param {number} spcount - 拆分数量
 * @returns {OBJ} 拆分后的新物品(或this)
 */
OBJ.prototype.uncombine = function (spcount) {
    if (!spcount || spcount === this.count) return this;
    if (spcount < this.count) {
        var item = this.clone();
        item.count = spcount;
        this.count -= spcount;
        return item;
    }
}

/**
 * 克隆物品
 * @returns {OBJ}
 */
OBJ.prototype.clone = function () {
    var item = OBJ.CREATE(this.path);
    if (this.temp) {
        item.temp = Object.assign({}, this.temp);
    }
    return item;
}

/**
 * 合并临时属性(取最大值)
 * @param {Object<string, number>} target
 * @param {Object<string, number>} source
 * @returns {Object<string, number>}
 */
OBJ.prototype.combineTemp = function (target, source) {
    if (!source) return target;
    if (!target) return source;
    for (let key in source) {
        let val = source[key];
        if (val && typeof val === "number") {
            let thisVal = target[key];
            if (!thisVal) {
                target[key] = val;
            } else if (typeof thisVal === "number") {
                target[key] = thisVal > val ? thisVal : val;
            }
        }
    }
    return target;
}

/**
 * 合并堆叠物品
 * @param {OBJ} obj - 要合并的物品
 */
OBJ.prototype.combine = function (obj) {
    if (this.is(obj)) {
        if (obj.temp || this.temp) {
            this.temp = this.combineTemp(this.temp, obj.temp);
        }
        this.count += (obj.count || 0);
    }
}


/**
 * 克隆物品到目标容器
 * @param {string} otype - 物品路径
 * @param {ITEM} to - 目标容器
 * @param {number} [count=1] - 数量
 * @returns {OBJ|undefined}
 */
OBJ.clone_to = function (otype, to, count) {
    if (!otype || !to) return;
    var item = OBJ.CREATE(otype);
    if (!item) return;
    count = count || 1;
    if (item.is_money && to.money != undefined) {
        item.count = count;
        to.money += item.value * item.count;
        return item;
    }
    if (!to.items) to.items = [];
    if (item.combined) {
        for (var i = 0; i < to.items.length; i++) {
            if (to.items[i].is(item)) {
                to.items[i].count += count;
                return to.items[i];
            }
        }

        item.count = count;
        to.items.push(item);
    } else {
        to.items.push(item);
        for (var i = 0; i < count - 1; i++) {
            item = OBJ.CREATE(otype, 1);
            to.items.push(item);
        }
    }
    return item;
}

/**
 * 物品存档序列化
 * @param {string[]} str - 输出数组
 */
OBJ.prototype.save_db = function (str) {
    str.push('["', this.path, '","', this.id, '",', this.count);
    if (this.is_locked) {
        str.push(',1');
    }
    if (this.temp)
        str.push(",", this.format_temp(this.temp));
    str.push(']');

}

/**
 * 从数据库记录恢复物品
 * @param {Array<*>} data - [path, id, count, ...]
 */
OBJ.prototype.load_db = function (data) {

    this.id = data[1];
    if (data[2] > 1) this.count = data[2];
    if (data[3]) {
        if (data[3] === 1) {
            this.is_locked = true;
        } else if (typeof data[3] === 'object') {
            this.temp = data[3];
            return;
        }
    }
    if (data[4]) this.temp = data[4];
}

/**
 * 物品加载后回调
 * @param {CHARACTER} me
 */
OBJ.prototype.on_load = function (me) {
    this.on_reload && this.on_reload(me);
}

/** 克隆后回调 */
OBJ.prototype.on_clone = function () {

}

/**
 * 创建物品实例
 * @param {string} otype - 物品路径
 * @param {number} [count] - 数量
 * @returns {OBJ}
 */
OBJ.CREATE = function (otype, count) {
    let base = WORLD.OBJ_STROE.get(otype);
    if (!base) {
        base = BASE.CREATE(__PATH.OBJ, otype);
        if (!base) throw new Error('没有物品' + otype + "的定义。");
    }

    let item = Object.create(base);
    item.create_id();
    item.on_clone();
    if (count > 1)
        item.count = count;
    return item;
}

/** @type {string[]} 品级颜色 */
var grade_color = ["wht", "hig", "hic", "hiy", "HIZ", "hio", "ord"];

/**
 * 物品创建回调
 * @param {string} path
 * @param {string} [par] - 参数
 */
OBJ.prototype.create = function (path, par) {
    if (par) this.path = path + par;
    this.create_id();
    this.on_create && this.on_create(path, par);
    var cc = grade_color[this.grade];
    this.color_name = "<" + cc + ">" + this.name + "</" + cc + ">";
    WORLD.OBJ_STROE.set(this.path, this);
}

/**
 * 物品更新回调
 * @param {string} path
 * @param {string} [par]
 */
OBJ.prototype.update = function (path, par) {
    this.create(path, par);
}



/**
 * 查询品级颜色
 * @returns {string}
 */
OBJ.prototype.query_grade_color = function () {
    return grade_color[this.grade];
}

/**
 * 通知客户端物品动作按钮变更
 * @param {USER} me
 * @param {boolean} isadd
 */
OBJ.prototype.notify_action = function (me, isadd) {
    if (!this.on_use) return;
    if (!this.showAction) return;
    if (isadd)
        me.send("{type:'addAction',id:'" + this.id + "',name:'" + this.name + "',distime:" + (this.distime || 0) + "}");
    else
        me.send("{type:'removeAction',id:'" + this.id + "'}");
}

/** @type {function} 临时数据(复用CHARACTER) */
OBJ.prototype.query_temp = CHARACTER.prototype.query_temp;
/** @type {function} */
OBJ.prototype.set_temp = CHARACTER.prototype.set_temp;
/** @type {function} */
OBJ.prototype.remove_temp = CHARACTER.prototype.remove_temp;
/** @type {function} */
OBJ.prototype.add_temp = CHARACTER.prototype.add_temp;

/**
 * 根据概率列表创建物品
 * @param {Array<{odds: number, obj: string, fall_obj: string, count: number, min: number, max: number}>} args - 掉落定义
 * @returns {OBJ[]}
 */
OBJ.create_by_odds = function (args) {
    var items = [];
    if (!args) return items;
    let drop = null, per = null,
        obj = null;
    for (var i = 0; i < args.length; i++) {
        drop = args[i];
        if (!drop) continue;

        per = Math.random() * 10000;
        obj = (drop.odds || 10000) > per ? drop.obj : drop.fall_obj;
        if (obj) {
            if (drop.min_count) hit_count = 0;
            var count = drop.count || 1;
            if (drop.min && drop.max) {
                count = Math.floor(Math.random() * (drop.max - drop.min + 1)) + drop.min;
            }
            if (count > 0) {
                if (obj instanceof Array) obj = obj.random();
                items.push(OBJ.CREATE(obj, count));
            }
        }
    }
    return items;
}
