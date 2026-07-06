import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "piaomiao";
    name = "缥缈峰";
    desc = "缥缈峰灵鹫宫是威震天下的天山童姥所在地";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 3500;
    pot = 3500;
    is_diffi = true;
    is_multi = false;
    drops = [
        "book/bc#shenjianjue",
        "book/bc#tianyuqijian",
        "drug/age",
        "book/bc#bahuanggong",
        "eq/lv5/tianlongyizhu",
    ];
    room_path = "fb/official/piaomiao/";
    map = [];
}
