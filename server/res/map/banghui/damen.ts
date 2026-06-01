import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "大门";
    desc = "这里是你帮派的大门，左右石坛上各插着一根两丈多高的旗杆，杆上青旗飘扬。右首旗子用金线绣着一头张牙舞爪的狮子，狮子上头有一只蝙蝠飞翔。左首旗子上写着几个烫金大字，银钩铁划，刚劲非凡。";
    exits = { "west": "yz/banghui", "east": "banghui/yuanzi" };
    no_fight = true;
}
