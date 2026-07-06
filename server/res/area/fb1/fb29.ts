import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "xuedao";
    name = "血刀门";
    desc = "大雪山里面的一个门派，门内全部人都使用弯刀因刀上有条血红色弯条所以叫「血刀」。";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 3800;
    pot = 3800;
    is_diffi = false;
    is_multi = true;
    drops = [
        "book/bc#shenkongxing",
        "book/bc#shenzhaojing",
        "book/bc#xuehaimogong",
        "book/bc#xuedao",
        "eq/lv5/xiedao",
        "eq/lv5/longxiedoupeng",
    ];
    room_path = "fb/official/xuedao/";
    map = [];
}
