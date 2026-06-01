import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "帮派驻地";
    desc = "你来到一座结构宏伟的建筑前，左右石坛上各插着一根两丈多高的旗杆，杆上青旗飘扬。右首旗子用金线绣着一头张牙舞爪的狮子，狮子上头有一只蝙蝠飞翔。左首旗子上写着几个烫金大字，银钩铁划，刚劲非凡。";
    exits = { "west": "yz/nandajie2", "east": "banghui/juyitang" };
    no_fight = true;

    on_leave(me, dir) {
    if (dir == "east") {
        me.notify("帮会管理员拦住你：这位" + me.call() + "，这里是帮派驻地，不是这个帮派的人不能进去哦。");
        return false;

    }
}
}
