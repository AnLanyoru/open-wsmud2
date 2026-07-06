import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "wenfu";
    name = "温府";
    desc = "石梁派温家，一家六兄弟全都阴险毒辣无比，使用毒计得到了金蛇郎君的宝藏";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 2000;
    pot = 2000;
    is_diffi = false;
    is_multi = false;
    drops = [
        "eq/lv1/jinshezhui",
        "eq/lv2/js_ring",
        "eq/lv2/js_pifeng",
        "eq/lv2/js_nang",
        "book/bc#baguaquan",
        "book/bc#baguagun",
        "book/bc#jinshejianfa",
        "book/bc#jinshezhang",
        "book/bc#jinsheyoushenbu",
        "eq/lv3/baguagun",
        "eq/lv3/jinshejian",
    ];
    first = "fb/wenfu/damen";
    room_path = "fb/wenfu/";
    map = [
        {n: "大门", id: "fb/wenfu/damen", p: [0,2]},
        {n: "大院", id: "fb/wenfu/dayuan", p: [0,1]},
        {n: "大厅", id: "fb/wenfu/dating", p: [0,0], exits: ["s","nw","ne"]},
        {n: "走廊", id: "fb/wenfu/zoulang1", p: [-1,-1], exits: ["n"]},
        {n: "走廊", id: "fb/wenfu/zoulang2", p: [-1,-2]},
        {n: "走廊尽头", id: "fb/wenfu/zoulangtou", p: [0,-3], exits: ["sw","n","se"]},
        {n: "走廊", id: "fb/wenfu/zoulang3", p: [1,-2]},
        {n: "走廊", id: "fb/wenfu/zoulang4", p: [1,-1], exits: ["n"]},
        {n: "亭子", id: "fb/wenfu/tingzi", p: [0,-4]},
        {n: "小院", id: "fb/wenfu/xiaoyuan", p: [0,-5]},
        {n: "小楼", id: "fb/wenfu/xiaolou", p: [0,-6], exits: ["s"]},
        {n: "侧房", id: "fb/wenfu/wen2", p: [-2,-1], exits: ["e"]},
        {n: "侧房", id: "fb/wenfu/wen3", p: [-2,-2], exits: ["e"]},
        {n: "侧房", id: "fb/wenfu/wen4", p: [2,-2], exits: ["w"]},
        {n: "侧房", id: "fb/wenfu/wen5", p: [2,-1], exits: ["w"]}
    ];
}
