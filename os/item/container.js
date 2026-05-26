require("./obj.js");
CONTAINER = function () {
    this.count = 1;
    this.combined = false;
    
}
CONTAINER.inherits(OBJ);
CONTAINER.prototype.is_container = true;
CONTAINER.prototype.on_get = function () {
    return false;
}
CONTAINER.prototype.set_items = function () {
    for (var i = 0; i < arguments.length; i++) {
        var item = arguments[i];
        if (item) {
            if (typeof item == "string") {
                OBJ.clone_to(item, this);
            } else if (item.length) {
                OBJ.clone_to(item[0], this,item[1]);
            }
        }
    }
}
CONTAINER.prototype.query_items = function () {
    return this.items;
}
//这个单纯的字符串描述
CONTAINER.prototype.get_desc = function (me) {
    var str = [this.color_name, this.desc];
    var items = this.query_items(me);
    if (items && items.length) {
        str.push("它里面有：");
        for (var i = 0; i <items.length; i++) {
            var item = items[i];
            str.push("\t" + UTIL.to_c(item.count) + item.unit + item.color_name);
        }
    } else {
        str.push("它里面什么都没有。");
    }
    return str.join("\n");
}
CONTAINER.prototype.clear_items = function (me) {
    this.items.length = 0;
}
//这个提供给LOOK SELECT命令的
CONTAINER.prototype.query_desc = function (me) {
    if (this.json) return this.json;
    var obj = {};
    obj.type = "item";
    obj.id = this.id;
    obj.desc = this.get_desc(me);
    obj.commands = [];
    obj.commands.push({
        cmd: "get all from " + this.id,
        name: "全部拾取"
    });

    this.json = JSON.stringify(obj)
    return this.json;
}
CONTAINER.CREATE = function (name,desc,lv,odds) {
    var obj = OBJ.CREATE("sp/box#lv");
    obj.items = OBJ.create_by_odds(odds);
    obj.name = name;
    obj.desc = desc || obj.desc;
    obj.grade = lv;
    obj.create();
    return obj;
}