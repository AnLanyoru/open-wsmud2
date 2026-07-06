import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "yihua";
    name = "移花宫";
    desc = "移花宫所处武林禁地绣玉谷是男人的禁地，也是一个百花齐放，宛若世外仙境的地方。从开派以来绣玉谷移花宫里都为漂亮女子。";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 3200;
    pot = 3200;
    is_diffi = true;
    is_multi = true;
    drops = [
        "book/bc#jueqingzhang",
        "eq/lv3/lianxingdebingyuzan",
        "eq/lv3/yaoyuedeshouzhuo",
        "eq/lv3/huawuquedeyupei",
        "book/bc#yifengjian",
        "drug/biyuxuelian",
        "eq/lv4/yihuagongzhuang",
        "eq/lv4/yihuagonglv",
        "book/bc#yihuajiemu",
        "book/bc#mingyugong",
        "eq/lv5/bixiezhaodanqing",
    ];
    room_path = "fb/official/yihua/";
    map = [];
}
