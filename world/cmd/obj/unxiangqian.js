import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "unxiangqian";
    regex = /^(\w+)(?:\s+(\w+))?$/;

    enter(player, objid, par) {
    if (!objid) {
        var str = ["{type:\"cmds\",items:["];
        for (var i = 0; i < player.items.length; i++) {
            var item = player.items[i];
            if (!item.st_prop || !item.st_prop.length) {
                continue;
            }
            if (str.length > 1) str.push(",");

            str.push("{cmd:\"unxiangqian ");
            str.push(item.id);
            str.push("\",name:\"取消镶嵌");
            str.push(item.color_name);
            str.push("\"}");
        }
        if (str.length == 1) {
            return player.notify("铁匠瞄了你一眼说道：你身上没有镶嵌过宝石的装备。");
        }
        str.push("]}");
        player.notify("铁匠说道：你要拆掉哪个装备上的宝石？");
        return player.notify(str.join(""));
    }
    var obj = player.find_obj(objid);
    if (!obj) {
        return player.notify("你身上没有这件装备。");
    }
    if (!obj.st_prop || !obj.st_prop.length) return player.notify(obj.color_name + "没有镶嵌宝石。");
    if (par == "all") {
        let sum = 0;
        for (let item of obj.st_prop) {
            sum += MONEYS[item.grade];
        }
        if (!(sum > 0) || player.money < sum) return player.send('你身上的钱不够。');
        player.add_money(-sum);

        obj.hole_count += (obj.st_prop.length);
        for (let item of obj.st_prop) {
            let stone = player.add_obj(item.path);
            if (stone)
                player.send('你从' + obj.color_name + '上拆下来一块' + stone.color_name + "。");
        }
        obj.st_prop.length = 0;
        // player.send_room("铁匠拿着" + player.name + "的" + obj.color_name + "，三下五除二就把它上面镶嵌的宝石去掉了。");

        WORLD.STATS.updateWeapon(player, obj);
        return;
    }
    if (!par) {
        var str = ["{type:\"cmds\",items:["];
        var sum = 0;
        for (var i = 0; i < obj.st_prop.length; i++) {
            str.push("{cmd:\"unxiangqian " + obj.id + " ");

            str.push(obj.st_prop[i].id);
            str.push("\",name:\"", MONEYS_DESC[obj.st_prop[i].grade], "拆掉");
            str.push(obj.st_prop[i].name);
            sum += MONEYS[obj.st_prop[i].grade];
            str.push("\"},");
        }
        str.push("{cmd:\"unxiangqian ");
        str.push(obj.id);
        str.push(" all\",name:\"", UTIL.moneyToStr(sum), "全部拆掉");
        str.push("\"}");

        str.push("]}");
        player.send('铁匠：取消镶嵌后恢复装备的孔洞数量，宝石等级越高需要的手艺更精细。');
        return player.notify(str.join(""));
    } else {
        let st = null, index = 0;
        for (index = 0; index < obj.st_prop.length; index++) {
            let item = obj.st_prop[index];
            if (item.id === par) {
                st = item;
                break;
            }
        }
        if (!st) return player.notify(obj.color_name + "这个没有这个石头。");
        let money = MONEYS[st.grade];
        if (!(money > 0) || player.money < money) return player.send('你身上的钱不够。');
        player.add_money(-money);
        obj.st_prop.splice(index, 1);
        obj.hole_count += 1;
        // player.send_room("铁匠拿着" + player.name + "的" + obj.color_name + "，三下五除二就把它上面镶嵌的" + st.name + "去掉了。");

        WORLD.STATS.updateWeapon(player, obj);
        let stone = player.add_obj(st.path);
        if (stone) player.send('你从' + obj.color_name + '上拆下来一块' + stone.color_name + "。");
        else player.send('你什么都没拆下来');
    }



}
}

const WORLD = globalThis.WORLD;
const UTIL = globalThis.UTIL;
const MONEYS = [10, 100, 1000, 5000, 10000, 100000, 1000000];
const MONEYS_DESC = [null,
    "1两<wht>白银</wht>", "10两<wht>白银</wht>", "50两<wht>白银</wht>",
    "1两<hiy>黄金</hiy>", "10两<hiy>黄金</hiy>", "100两<hiy>黄金</hiy>"];
