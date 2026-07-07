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
    first = "fb/huashan_lunjian/tai";
    room_path = "fb/huashan_lunjian/";
    map = [
        {n: "论剑台", id: "fb/huashan_lunjian/tai", p: [0,0], exits: ["n","w","e","s"]},
        {n: "东峰", id: "fb/huashan_lunjian/dongfeng", p: [1,0]},
        {n: "西峰", id: "fb/huashan_lunjian/xifeng", p: [-1,0]},
        {n: "北峰", id: "fb/huashan_lunjian/beifeng", p: [0,-1]},
        {n: "南峰", id: "fb/huashan_lunjian/nanfeng", p: [0,1]},
        {n: "华山绝顶", id: "fb/huashan_lunjian/huashanjueding", p: [1,-1]}
    ];
}
