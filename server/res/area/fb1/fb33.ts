import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "jingnian";
    name = "净念禅宗";
    desc = "传说中的武林圣地之一，罕有传人行走江湖，专注於天人之道的研究。";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 4200;
    pot = 4200;
    is_diffi = true;
    is_multi = false;
    drops = [
        "book/bc#wunianchangong",
        "book/bc#fumozhang",
        "book/bc#rulaishenzhang",
        "eq/lv5/xiedisheli",
        "eq/lv5/jingangfumozhang",
        "book/bc#changshengjue",
    ];
    room_path = "fb/official/jingnian/";
    map = [];
}
