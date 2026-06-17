import { COMMAND } from "../../../core/command.js";
import type { USER } from "../../../core/char/user.js";
import type { ITEM } from "../../../core/item.js";
import type { OBJ } from "../../../core/item/obj.js";

export default class extends COMMAND {
    command = "checkobj";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    regex = /^(\w+?)\s+from\s+(\w+)$/;

    /**
     * @param {CHARACTER} player - 执行命令的角色
     */
    enter(player: USER, objid: string, type: string) {
        var obj: ITEM | null = null;
        if (type == "item") {
            obj = player.find_obj(objid);
        } else if (type == "eq") {//装备和物品只能检查自己的
            if (player.equipment) {
                for (var i = 0; i < player.equipment.length; i++) {
                    let eq = player.equipment[i]
                    if (eq?.id == objid) {
                        obj = eq;
                        break;
                    }
                }
            }

        } else if (type == "store") {
            obj = player.find_obj_byid(player.stores, objid);
        } else {

            var target = player.find_obj(type, player.environment);
            if (!target) return player.notify("你要从谁那里看?");
            if (target.on_checkobj) {
                obj = target.on_checkobj(player, objid);
            } else if (target.check_npc() && target.sell_list) {
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
        if (obj.check_obj()) player.notify(query_obj_desc(player, obj, type));
    }
}

function query_obj_desc(player: USER, obj: OBJ, type: string) {
    var json = {
        type: "dialog",
        dialog: "pack",
        from: type,
        id: obj.id,
        desc: obj.get_desc(player),
        commands: obj.actions
            ? Object.keys(obj.actions)
                .filter(key => obj.actions![key].name)
                .map(key => ({ cmd: key, name: obj.actions![key].name }))
            : [],
    };
    return JSON.stringify(json);
}
