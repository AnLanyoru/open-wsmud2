import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "xiake";
    name = "侠客岛";
    desc = "一处神秘的小岛，因为神秘的石壁武功而名声大震。据说里面存有各大门派失传的武功。";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 4100;
    pot = 4100;
    is_diffi = false;
    is_multi = true;
    drops = [
        "book/bc#xuanxubu",
        "book/bc#taixuangong",
        "eq/lv5/tianlongzhurixue",
        "eq/lv5/nilinshouhuan",
    ];
    room_path = "fb/official/xiake/";
    map = [];
}
