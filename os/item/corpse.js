require("../item/obj.js");
CORPSE = function () {
    this.unit = "具";
    this.count = 1;
    this.no_alloc = false;
}
CORPSE.inherits(CONTAINER);
CORPSE.prototype.on_get = function (player) {
    return false;
}
CORPSE.prototype.init = function (player, iskeep) {
    this.create_id();
    this.fromid = player.id;
    this.name = player.name + "的尸体";
    this.color_name = "<wht>" + this.name + "</wht>";
    this.environment = player.environment;
    this.desc = "然而" + player.call3() + "已经死了，只剩下一具尸体静静地躺在这里。";
    this.items = player.query_drop();
    if (!iskeep) this.call_out(this.disappear, 60000);

}
CORPSE.prototype.query_items = function (player) {
    if (this.environment.is_fb() && player.team) {
        if (!this.no_drops) {
            this.no_drops = [];
            for (var i = 0; i < player.team.length; i++) {
                if (!this.environment.query_temp(player, player.team[i].id)) {
                    this.no_drops.push(player.team[i].id);
                }
            }
            this.on_getitem = this.check_get;
        }
    }
    return this.items;
}
CORPSE.prototype.clear_items = function (me, noget) {
    this.items.length = 0;
    if (noget && noget.length) this.items = noget;
}
CORPSE.prototype.check_get = function (player, item) {
    if (!this.no_drops) return true;
    if (this.no_drops.indexOf(player.id) == -1) return true;
    player.notify('你不可以拾取' + item.color_name + "。");
    return false;
}
CORPSE.prototype.disappear = function () {
    if (this.items) this.items.length = 0;
    if (this.environment) {
        this.environment.notify("一阵风吹去，" + this.name + "已经不见了。");
        this.environment.item_changed(this, false);
    }
}

CORPSE.prototype.query_desc = function (me) {
    if (this.json) return this.json;
    var obj = {};
    obj.type = "item";
    obj.desc = this.get_desc(me);
    obj.id = this.id;
    obj.commands = [];
    obj.commands.push({
        cmd: "get all from " + this.id,
        name: "全部拾取"
    });
    if (this.no_alloc) {
        return JSON.stringify(obj);
    }
    this.json = JSON.stringify(obj);
    return this.json;
}

