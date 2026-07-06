import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "tianlong";
    name = "天龙寺";
    desc = "大理段家的皇家寺院，据说有一门神奇的武功六脉神剑，以指为剑，命中极高，更可隔空点穴，制敌于数米之外";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 3700;
    pot = 3700;
    is_diffi = true;
    is_multi = false;
    drops = [
        "book/bc#tiannanbu",
        "book/bc#duanjiajianfa",
        "book/bc#kumushengong",
        "book/bc#liumaishenjian",
        "eq/lv5/longgusheli",
    ];
    room_path = "fb/official/tianlong/";
    map = [];
}
