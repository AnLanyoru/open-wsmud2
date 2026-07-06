import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "xingxiu";
    name = "星宿海";
    desc = "星宿派大本营，星宿老仙丁春秋的地盘，门下弟子大都喜欢拍马逢迎，又无恶不作";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 3000;
    pot = 3000;
    is_diffi = false;
    is_multi = false;
    drops = [
        "book/bc#zhaixinggong",
        "book/bc#feixingshu",
        "eq/lv3/bilinzhen",
        "book/bc#sanyinzhua",
        "book/bc#huagongdafa",
        "eq/lv4/shenmuwangding",
    ];
    room_path = "fb/official/xingxiu/";
    map = [];
}
