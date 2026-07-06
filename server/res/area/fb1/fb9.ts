import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "shenlong";
    name = "神龙教";
    desc = "北京城东出海不远出的神龙岛是神龙教大本营。这里蛇虫出没，提前准备点蛇药比较好。";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 1800;
    pot = 1800;
    is_diffi = false;
    is_multi = true;
    drops = [
        "book/bc#shenlongxinfa",
        "book/bc#yixingbufa",
        "book/bc#shedaoqigong",
        "book/bc#shenlongjian",
        "book/bc#huagumianzhang",
        "eq/lv2/sl_cloth",
        "eq/lv2/sl_tou",
        "eq/lv2/sl_shoes",
        "eq/lv2/sl_shou",
        "eq/lv2/sl_yao",
        "eq/lv2/sl_zhang",
        "eq/lv2/sl_ling",
    ];
    first = "bj/shenlong/haitan";
    room_path = "bj/shenlong/";
    map = [
        {n: "海滩", id: "bj/shenlong/haitan", p: [-1,3]},
        {n: "灌木林", id: "bj/shenlong/lin1", p: [-1,2], exits: ["s"]},
        {n: "灌木林", id: "bj/shenlong/lin2", p: [-1,1]},
        {n: "空地", id: "bj/shenlong/kongdi", p: [-1,0], exits: ["e","n"]},
        {n: "大道", id: "bj/shenlong/dadao", p: [0,0]},
        {n: "小屋", id: "bj/shenlong/xiaowu", p: [-1,-1]},
        {n: "练武场", id: "bj/shenlong/wuchang", p: [1,0], exits: ["w","n"]},
        {n: "山道", id: "bj/shenlong/dadao2", p: [1,-1]},
        {n: "大门", id: "bj/shenlong/damen", p: [1,-2], exits: ["n","s"]},
        {n: "大厅", id: "bj/shenlong/dating", p: [1,-3]}
    ];
}
