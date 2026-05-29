import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "checkobj";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    regex = /^(\w+?)\s+from\s+(\w+)$/;

    /**
     * @param {CHARACTER} player - 执行命令的角色
     */
    enter(player, objid, type) {
    var obj = null;
    if (type == "item") {
        obj = player.find_obj(objid);
    } else if (type == "eq") {//装备和物品只能检查自己的
        if (player.equipment) {
            for (var i = 0; i < player.equipment.length; i++) {
                if (player.equipment[i]&&player.equipment[i].id == objid) {
                    obj = player.equipment[i];
                    break;
                }
            }
        }
        
    } else if (type == "store") {
        obj = player.find_obj_byid(player.stores, objid);

    } else if (type == "sj") {
        obj = player.find_obj_byid(player.books, objid);

    } else {
        
        var target = player.find_obj(type, player.environment);
        if (!target) return player.notify("你要从谁那里看?");
        if (target.on_checkobj) {
            obj = target.on_checkobj(player, objid);
        } else if (target.sell_list) {
            var selllist = target.sell_list;
            if (target.on_sell) {
                selllist = target.on_sell(player);
            }
            if (!selllist) {
                return player.notify(target.name + "不出售这个东西。");
            }
            obj = player.find_obj_byid(selllist, objid);
        } 
      
    }
    if (!obj) {
        return player.notify("你要看什么？");
    }
    player.notify(query_obj_desc(player,obj, type));
}
}

function query_obj_desc(player,obj, type) {
    var json = {};
    json.type = "dialog";
    json.dialog = "pack";
    json.from = type;
    json.id = obj.id;
    json.desc = obj.get_desc(player);
    if (obj.actions) {
        json.commands = [];
        for (var key in obj.actions) {
            if (obj.actions[key].name)
             json.commands.push({ cmd: key, name: obj.actions[key].name });
        }
    }
    return JSON.stringify(json);
}
