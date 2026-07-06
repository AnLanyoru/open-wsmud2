import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "yinyang";
    name = "阴阳谷";
    desc = "绝情谷底的一处神秘所在，一半是万年玄冰，冰冷刺骨，一半是不灭地火，焚金裂石";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 4400;
    pot = 4400;
    is_diffi = false;
    is_multi = true;
    drops = [
        "st/xuanjing",
        "st/st_sc",
        "st/st_s2",
        "st/st_sc",
        "st/st_sc",
        "eq/lv5/yinyanghuan",
        "book/bc#yinyangjiuzhuan",
    ];
    room_path = "fb/official/yinyang/";
    map = [];
}
