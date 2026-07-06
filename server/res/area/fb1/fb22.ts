import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "binghuo";
    name = "冰火岛";
    desc = "一处无人小岛，因为一半冰山一半火山所以叫做冰火岛，据说金毛狮王谢逊就流落到这里。";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 3100;
    pot = 3100;
    is_diffi = true;
    is_multi = true;
    drops = [
        "st/xuanjing",
        "st/st_blu",
        "st/st_red",
        "st/st_yel",
        "st/st_gre",
        "st/st_red",
        "book/bc#qingfushenfa",
        "st/st_blu",
        "st/st_yel",
        "st/st_gre",
        "drug/huoyan",
        "book/bc#qishangquan",
        "eq/lv4/lihuozhu",
        "eq/lv5/tulongdao",
    ];
    room_path = "fb/official/binghuo/";
    map = [];
}
