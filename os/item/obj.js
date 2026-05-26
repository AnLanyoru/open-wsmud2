
OBJ = function () {
    this.unit = "个";
    this.path = null;
    this.count = 1;
    this.combined = true;
    this.grade = 0;
    this.otype = 0;
}

OBJ.inherits(ITEM);
OBJ.prototype.transable = false;
OBJ.prototype.init = function (me) {
    this.on_init && this.on_init(me);
}
OBJ.prototype.long_name = function () {
    if (this.combined) return UTIL.to_c(this.count) + this.unit + this.color_name;
    return this.color_name;
}
OBJ.prototype.unit_name = function (count) {
    return UTIL.to_c(count || this.count) + this.unit + this.color_name;

}
OBJ.prototype.item_to_json = function () {
    return `["${this.name}","${this.id}",${this.count},${this.grade},"${this.unit}",${parseInt(this.value / 10)},${this.is_equipment ? 1 : 0},${this.on_use ? 1 : 0},${this.on_study ? 1 : 0},${this.on_open ? 1 : 0},${this.combine_count > 0 ? this.combine_count : 0}]`;
}
OBJ.prototype.query_commands = function (me) {
    return this.query_desc(me);
}
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
OBJ.prototype.get_desc = function () {
    return this.color_name + "\n" + this.desc;
}
OBJ.prototype.uncombine = function (spcount) {
    if (!spcount || spcount === this.count) return this;
    if (spcount < this.count) {
        var item = this.clone();
        item.count = spcount;
        this.count -= spcount;
        return item;
    }
}
OBJ.prototype.clone = function () {
    var item = OBJ.CREATE(this.path);
    if (this.temp) {
        item.temp = Object.assign({}, this.temp);
    }
    return item;
}
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
OBJ.prototype.combine = function (obj) {
    if (this.is(obj)) {
        if (obj.temp || this.temp) {
            this.temp = this.combineTemp(this.temp, obj.temp);
        }
        this.count += (obj.count || 0);
    }
}


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
OBJ.prototype.save_db = function (str) {
    str.push('["', this.path, '","', this.id, '",', this.count);
    if (this.is_locked) {
        str.push(',1');
    }
    if (this.temp)
        str.push(",", this.format_temp(this.temp));
    str.push(']');

}
OBJ.prototype.load_db = function (data) {
    //path, id, count, temp or lock

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

OBJ.prototype.on_load = function (me) {
    this.on_reload && this.on_reload(me);
}

OBJ.prototype.on_clone = function () {

}
OBJ.CREATE = function (otype, count) {
    let base = WORLD.OBJ_STROE.get(otype);
    if (!base) {
        base = BASE.CREATE(__PATH.OBJ, otype);
        if (!base) throw new Error('没有物品' + otype + "的定义。");
        //这里会自己调用create方法存储到OBJ_STROE，记住了吗
    }

    // var item = BASE.CREATE(__PATH.OBJ, otype);
    // if (!item) return;
    let item = Object.create(base);
    item.create_id();
    item.on_clone();
    if (count > 1)
        item.count = count;
    return item;
}
var grade_color = ["wht", "hig", "hic", "hiy", "HIZ", "hio", "ord"];

OBJ.prototype.create = function (path, par) {
    if (par) this.path = path + par;
    this.create_id();
    this.on_create && this.on_create(path, par);
    var cc = grade_color[this.grade];
    this.color_name = "<" + cc + ">" + this.name + "</" + cc + ">";
    WORLD.OBJ_STROE.set(this.path, this);
}
OBJ.prototype.update = function (path, par) {
    this.create(path, par);
}



OBJ.prototype.query_grade_color = function () {
    return grade_color[this.grade];
}

OBJ.prototype.notify_action = function (me, isadd) {
    if (!this.on_use) return;
    if (!this.showAction) return;
    if (isadd)
        me.send("{type:'addAction',id:'" + this.id + "',name:'" + this.name + "',distime:" + (this.distime || 0) + "}");
    else
        me.send("{type:'removeAction',id:'" + this.id + "'}");
}

OBJ.prototype.query_temp = CHARACTER.prototype.query_temp;
OBJ.prototype.set_temp = CHARACTER.prototype.set_temp;
OBJ.prototype.remove_temp = CHARACTER.prototype.remove_temp;

OBJ.prototype.add_temp = CHARACTER.prototype.add_temp;
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
