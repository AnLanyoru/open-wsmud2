import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "jinglian";
    regex = /^(\w+)(?:\s(\w+))?$/;

    /**
     * @param {CHARACTER} player - 执行命令的角色
     */
    enter(player, objid, isok) {
    var obj = player.find_obj(objid);
    if (!obj) {
        return player.notify("你要精炼什么装备？");
    }
    if (!obj.is_equipment || obj.no_jinglian) return player.notify("这个东西没办法精炼。");
    if (!obj.grade) return player.notify(obj.color_name + "品质太低了，承受不住再多的力量。");
    if (obj.level >= 12) return player.notify(obj.color_name + "已经到了极限，无法再承受更多的力量。");

    var item = {
        path: obj.grade == 6 ? "st/yuanjing" : "st/xuanjing",
        color_name: obj.grade == 6 ? "<hio>元晶</hio>" : "<hiw>玄晶</hiw>", count: 0
    };

    for (var i = 0; i < player.items.length; i++) {
        if (player.items[i].is(item.path)) {
            item = player.items[i];
            break;
        }
    }
    var lv = obj.level + 1;

    var need_count = obj.grade < 6 ? Math.pow(2, lv) * obj.grade : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12][lv - 1];
    var full_count = 0;

    if (obj.grade < 6) {
        full_count = (Math.pow(2, 12 + 1) - 2) * obj.grade;
        if (obj.level > 0) {
            full_count -= (Math.pow(2, obj.level + 1) - 2) * obj.grade;
        }
    } else {
        full_count = (1 + 12) * 12 / 2;
        if (obj.level > 0) {
            full_count -= (1 + obj.level) * obj.level / 2;
        }
    }
    //绿8190  橙5*8190
    if (isok) {
        let isfull = isok === 'full';
        if (isfull) need_count = full_count;
        if (item.count < need_count) {
            return player.notify("你的" + item.color_name + "数量不够精炼。");
        }
        item = player.remove_obj(item, need_count);
        if (!item) player.notify("你的" + item.color_name + "数量不够精炼。");

        player.send_room("<hiw>$N用内力把" + item.color_name + "炼化，小心翼翼的引入" + obj.color_name + "。</hiw>");
        if (isfull) {
            player.send_room("<ora>$N的" + obj.color_name + "古井无波，空中却一瞬间电闪雷鸣，似有神兵出世，轰鸣声中你好似听到有阵阵龙吟自" + obj.color_name + "中传出！</ora>");
            obj.level_up(12);
        } else {
            if (obj.level < 5) {
                player.send_room("<yel>$N的" + obj.color_name + "发出一阵耀眼的光芒，看上去似乎变强了！</yel>");
            } else if (obj.level < 9) {
                player.send_room("<yel>$N的" + obj.color_name + "发出一阵璀璨的光芒，看上去似乎更加强大了！</yel>");
            } else if (obj.level < 12) {
                player.send_room("<mag>$N的" + obj.color_name + "爆出一阵炽热的光芒，周身似乎有雷光环绕，连绵不绝！</mag>");
            } else {
                player.send_room("<ora>$N的" + obj.color_name + "古井无波，空中却一瞬间电闪雷鸣，似有神兵出世，轰鸣声中你好似听到有阵阵龙吟自" + obj.color_name + "中传出！</ora>");

            }
            obj.level_up(obj.level + 1);
        }

        // lv = obj.level + 1;
        // need_count = Math.pow(2, lv) * obj.grade;
        player.items_changed(obj);
        return WORLD.STATS.updateWeapon(player, obj);
    }
    var str = ['{type:"dialog",dialog:"pack",jldesc:\"',
        obj.color_name, "<br/>精炼", query_level_color(lv), " 需要以下物品：<br/>"];
    str.push(item.color_name, ' ');
    if (item.count < need_count) {
        str.push("<red>");
    }
    str.push(item.count, '/', need_count);
    if (item.count < need_count) {
        str.push("</red>");
    }
    str.push("<br/>精炼", query_level_color(12), " 需要以下物品：<br/>");

    str.push(item.color_name, ' ');
    if (item.count < full_count) {
        str.push("<red>");
    }
    str.push(item.count, '/', full_count);
    if (item.count < need_count) {
        str.push("</red>");
    }

    str.push('",id:"');
    str.push(obj.id);
    str.push('"}');
    player.notify(str.join(""));

}
}

const WORLD = globalThis.WORLD;
function query_level_color(lv) {
    if (!lv) return "";
    var jlcolor = ["", "hig", "hig", "hic", "hic", "hiy", "hiy", "HIZ", "HIZ", "hio", "hio", "ord", "ord"];
    var cc = jlcolor[lv];
    return "<" + cc + ">＋" + lv + " </" + cc + ">";
}
