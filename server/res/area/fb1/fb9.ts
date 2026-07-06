import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "shenlong";
    name = "神龙教";
    desc = "北京城东出海不远出的神龙岛是神龙教大本营。这里蛇虫出没，提前准备点蛇药比较好。";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 1800;
    pot = 1800;
    is_diffi = false;
    is_multi = true;
    drops = [
        "book/bc#shenlongxinfa",
        "book/bc#yixingbufa",
        "book/bc#shedaoqigong",
        "book/bc#shenlongjian",
        "book/bc#huagumianzhang",
        "eq/lv2/sl_cloth",
        "eq/lv2/sl_tou",
        "eq/lv2/sl_shoes",
        "eq/lv2/sl_shou",
        "eq/lv2/sl_yao",
        "eq/lv2/sl_zhang",
        "eq/lv2/sl_ling",
    ];
    room_path = "fb/official/shenlong/";
    map = [];
}
