import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "songshan";
    name = "嵩山";
    desc = "中岳嵩山，也是五岳剑派嵩山派的所在地";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 2600;
    pot = 2600;
    is_diffi = false;
    is_multi = false;
    drops = [
        "book/bc#dasongyangshenzhang",
        "book/bc#songshanjianfa",
        "eq/lv3/wuyuelingqi",
        "eq/lv3/mengzhupifeng",
        "book/bc#hanbingzhenqi",
    ];
    room_path = "fb/official/songshan/";
    map = [];
}
