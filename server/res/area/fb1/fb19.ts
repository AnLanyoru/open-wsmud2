import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "taohua";
    name = "桃花岛";
    desc = "此处名为桃花岛，乃是天下“五绝”之一“东邪”黄药师的隐居之所。";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 2800;
    pot = 2800;
    is_diffi = true;
    is_multi = false;
    drops = [
        "book/bc#jinyangong",
        "book/bc#biboshengong",
        "book/bc#anyingfuxiang",
        "book/bc#luoyingshenjian",
        "book/bc#tanzhishengong",
        "book/bc#kongmingquan",
        "eq/lv4/yuxiao",
        "eq/lv4/ruanweijia",
    ];
    room_path = "fb/official/taohua/";
    map = [];
}
