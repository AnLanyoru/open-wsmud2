this.inherits(COMMAND);
this.command = "shortcut";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.allow_faint = true;
this.enter = function (player, arg) {
    if (!arg) return;
    var obj = player.find_obj(arg);
    if (!obj) {
        return player.notify("你身上没有这个东西。");
    }

    if (obj.is_equipment) {
        if (obj.eq_type != EQUIP_TYPE.WEAPON) return player.notify("你目前只能设置武器的快捷操作。");
    } else if (!obj.on_use){
        return player.notify("这个道具不可以设置快捷操作。");
    }
    if (obj.is_shortcut) {
        obj.is_shortcut = false;
        player.notify("你取消了" + obj.color_name + "的快速设置。");
        player.send("{type:'removeAction',id:'" + obj.id + "'}");
    } else {
        obj.is_shortcut = true;
        player.notify("你设置了" + obj.color_name + "的快速使用。");

        player.send("{type:'addAction',id:'" + obj.id + "',name:'" + obj.name + "'}");
       
    }
}