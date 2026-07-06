import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "gumu";
    name = "古墓派";
    desc = "古墓派身处终南山下活死人墓中，派中多为女子";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 3900;
    pot = 3900;
    is_diffi = true;
    is_multi = false;
    drops = [
        "book/bc#yunvxinjing",
        "book/bc#yinsuojinling",
        "eq/lv4/bingpoyinzhen",
        "eq/lv4/jinlingsuo",
        "book/bc#anranxiaohun",
        "book/bc#xuantiejianfa",
        "eq/lv5/panlongzan",
        "eq/lv5/longguhuan",
    ];
    room_path = "fb/official/gumu/";
    map = [];
}
