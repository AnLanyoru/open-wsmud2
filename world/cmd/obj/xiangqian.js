import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "xiangqian";
    regex = /^(\w+)(?:\s(\w+))?$/;

    enter(player, objid, st) {
    var obj = player.find_obj(objid);
    if (!obj) {
        return player.notify("你要镶嵌什么装备？");
    }
    if (!obj.is_equipment) return player.notify("这个东西没办法镶嵌。");
    if (!obj.hole_count) return player.notify(obj.color_name + "没有能供镶嵌的孔。");

    if (st) {
        var stone = player.find_obj(st);
        if (!stone)
            return player.notify("你身上没有这种宝石。");
        stone = player.remove_obj(stone, 1);
        if (stone) {

            if (obj.push_stone(stone) == false)
                return player.notify("你镶嵌失败了。");
            player.send_room("$N拿出一" + stone.unit + stone.color_name + "，小心翼翼的往" + obj.color_name + "上镶去。");
            if (stone.grade < obj.grade) {
                player.send_room("<hig>只听得咔嚓一声，" + stone.color_name + "已嵌入" + obj.color_name + "中！</hig>");
            } else {
                player.send_room("<hig>只听得咔嚓一声，" + stone.color_name + "已嵌入" + obj.color_name + "中，一眼看去仿若浑然一体！</hig>");
            }
            WORLD.STATS.updateWeapon(player, obj);
        }
        return;
    }
    var items = [];
    for (var i = 0; i < player.items.length; i++) {
        if (player.items[i].is_stone) {
            items.push(player.items[i]);
        }
    }
    if (!items.length) return player.notify("你身上没有可以镶嵌的宝石。");
    var str = ['{type:"dialog",dialog:"pack",xqdesc:\"',
        obj.color_name, "\",id:\"", obj.id, "\",stones:["];
    for (var i = 0; i < items.length; i++) {
        if (i > 0) str.push(",");
        str.push("{name:\"");
        str.push(items[i].name);
        str.push("\",id:\"");
        str.push(items[i].id);
        str.push("\"}");
    }
    str.push(']}');
    player.notify(str.join(""));

}
}

const WORLD = globalThis.WORLD;
