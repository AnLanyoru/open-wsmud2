import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "baituo";
    name = "白驼山";
    desc = "西毒欧阳锋的大本营，在西域大漠深处";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 2900;
    pot = 2900;
    is_diffi = false;
    is_multi = true;
    drops = [
        "book/bc#lingshezhangfa",
        "book/bc#chanchubufa",
        "book/bc#hamagong",
        "eq/lv4/lingshezhang",
    ];
    room_path = "fb/official/baituo/";
    map = [];
}
