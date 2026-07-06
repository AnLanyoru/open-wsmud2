import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "hengshan2";
    name = "衡山";
    desc = "衡山派的所在地";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 2400;
    pot = 2400;
    is_diffi = false;
    is_multi = false;
    drops = [
        "eq/lv2/hs_qin",
        "eq/lv3/quyangdeqinhuan",
        "eq/lv3/liuzhengfengdejianchoupao",
        "book/bc#chuanyunzong",
        "book/bc#liuyunzhang",
        "book/bc#zhenyuejue",
        "book/bc#hengshanwushenjian",
    ];
    room_path = "fb/official/hengshan2/";
    map = [];
}
