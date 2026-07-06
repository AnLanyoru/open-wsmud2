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
    first = "fb/jingnian/山门";
    room_path = "fb/jingnian/";
    map = [
        {n: "山门", id: "fb/jingnian/山门", p: [0,0], exits: ["n","ne"]},
        {n: "石阶", id: "fb/jingnian/石阶", p: [0,-1]},
        {n: "殿门", id: "fb/jingnian/殿门", p: [0,-2], exits: ["s","n2"]},
        {n: "持国天王殿", id: "fb/jingnian/持国天王殿", p: [1,-3]},
        {n: "增长天王殿", id: "fb/jingnian/增长天王殿", p: [-1,-3]},
        {n: "广目天王殿", id: "fb/jingnian/广目天王殿", p: [-1,-5]},
        {n: "多闻天王殿", id: "fb/jingnian/多闻天王殿", p: [1,-5]},
        {n: "主殿", id: "fb/jingnian/主殿", p: [0,-4], exits: ["nw","ne","sw","se"]},
        {n: "钟楼", id: "fb/jingnian/钟楼", p: [-1,-7]},
        {n: "铜殿", id: "fb/jingnian/铜殿", p: [0,-8]},
        {n: "白石广场", id: "fb/jingnian/白石广场", p: [0,-6], exits: ["nw","s2","n2","e"]},
        {n: "山路", id: "fb/jingnian/山路", p: [1,-1]},
        {n: "山路", id: "fb/jingnian/山路1", p: [2,-2], exits: ["sw","ne"]},
        {n: "山路", id: "fb/jingnian/山路2", p: [3,-3]},
        {n: "崖底", id: "fb/jingnian/崖底", p: [3,-4], exits: ["s"]},
        {n: "后山", id: "fb/jingnian/后山", p: [1,-6]},
        {n: "铜殿内部", id: "fb/jingnian/铜殿内部", p: [0,-9], exits: ["s"]},
        {n: "长生门", id: "fb/jingnian/长生门", p: [0,-10]}
    ];
}
