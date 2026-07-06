import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "guanwai";
    name = "关外";
    desc = "出了山海关，靠近长白山的地方，这里有很多关于闯王宝藏，大清龙脉的传说";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 1900;
    pot = 1900;
    is_diffi = false;
    is_multi = false;
    drops = [
        "book/bc#lengyueshengong",
        "drug/xiongdan",
        "book/bc#hujiadaofa",
        "book/bc#sixiangbu",
        "eq/lv3/chuangwangbaodao",
    ];
    room_path = "fb/official/guanwai/";
    map = [];
}
