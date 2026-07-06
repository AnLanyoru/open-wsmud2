import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "huashan_lunjian";
    name = "华山论剑";
    desc = "五年一度的华山论剑";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 4000;
    pot = 4000;
    is_diffi = false;
    is_multi = false;
    drops = [
        "book/bc#duanjiajianfa",
        "book/bc#kumushengong",
        "book/bc#tiannanbu",
        "book/bc#jinyangong",
        "book/bc#quanzhenjianfa",
        "book/bc#chanchubufa",
        "book/bc#anyingfuxiang",
        "book/bc#biboshengong",
        "book/bc#luoyingshenjian",
        "book/bc#hamagong",
        "book/bc#lingshezhangfa",
        "book/bc#tanzhishengong",
        "book/bc#yiyangzhi",
        "eq/lv4/lingshezhang",
        "eq/lv4/yuxiao",
        "eq/lv4/yuzhuzhang",
        "book/bc#jiuyinshengong",
        "eq/lv5/tianlongpan",
    ];
    room_path = "fb/official/huashan_lunjian/";
    map = [];
}
