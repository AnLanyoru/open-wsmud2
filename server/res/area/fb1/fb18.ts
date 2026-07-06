import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "yunmeng";
    name = "云梦沼泽";
    desc = "对很多江湖中人来说都不愿意踏足的地方，据说那里有无数猛兽巨鳄，到处充满着危险";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 2700;
    pot = 2700;
    is_diffi = false;
    is_multi = true;
    drops = [
        "res/eyupi",
        "res/huolongpi",
        "st/xuanjing",
        "st/st_blu",
        "st/st_red",
        "st/st_yel",
        "st/st_gre",
        "eq/lv3/huolongdao",
        "eq/lv3/huolongjian",
        "eq/lv3/huolongquan",
        "eq/lv3/huolongbian",
        "eq/lv3/huolonggun",
    ];
    first = "fb/yunmeng/森林";
    room_path = "fb/yunmeng/";
    map = [
        {n: "森林", id: "fb/yunmeng/森林", p: [0,0]},
        {n: "云梦沼泽", id: "fb/yunmeng/云梦沼泽", p: [1,0], exits: ["w","n"]},
        {n: "云梦沼泽", id: "fb/yunmeng/云梦沼泽1", p: [1,-1]},
        {n: "云梦沼泽", id: "fb/yunmeng/云梦沼泽2", p: [2,-1], exits: ["w","n"]},
        {n: "云梦沼泽", id: "fb/yunmeng/云梦沼泽3", p: [1,-2], exits: ["s"]},
        {n: "洪荒古泽", id: "fb/yunmeng/洪荒古泽", p: [1,-3]},
        {n: "洪荒古泽", id: "fb/yunmeng/洪荒古泽1", p: [1,-4], exits: ["s","n"]},
        {n: "洪荒古泽", id: "fb/yunmeng/洪荒古泽2", p: [1,-5]},
        {n: "洪荒古泽", id: "fb/yunmeng/洪荒古泽3", p: [1,-6], exits: ["s"]},
        {n: "围墙", id: "fb/yunmeng/围墙", p: [2,-2]},
        {n: "茅屋", id: "fb/yunmeng/茅屋", p: [3,-2], exits: ["2"]}
    ];
}
