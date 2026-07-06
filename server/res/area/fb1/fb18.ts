import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "yunmeng";
    name = "云梦沼泽";
    desc = "对很多江湖中人来说都不愿意踏足的地方，据说那里有无数猛兽巨鳄，到处充满着危险";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 2700;
    pot = 2700;
    is_diffi = false;
    is_multi = true;
    drops = [
        "res/eyupi",
        "res/huolongpi",
        "st/xuanjing",
        "st/st_blu",
        "st/st_red",
        "st/st_yel",
        "st/st_gre",
        "eq/lv3/huolongdao",
        "eq/lv3/huolongjian",
        "eq/lv3/huolongquan",
        "eq/lv3/huolongbian",
        "eq/lv3/huolonggun",
    ];
    room_path = "fb/official/yunmeng/";
    map = [];
}
