import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "cihang";
    name = "慈航静斋";
    desc = "传说中的武林圣地之一，门下传人多为女子，武功以剑诀为主，神秘莫测。";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 4300;
    pot = 4300;
    is_diffi = true;
    is_multi = false;
    drops = [
        "book/bc#bianjianfa",
        "book/bc#lingxibu",
        "eq/lv5/feiyijian",
        "eq/lv5/bianhua",
        "book/bc#cihangjiandian",
    ];
    first = "fb/cihang/shanmen";
    room_path = "fb/cihang/";
    map = [
        {n: "帝塔峰", id: "fb/cihang/shanmen", p: [0,0]},
        {n: "山门", id: "fb/cihang/shanyao", p: [0,1], exits: ["s","n"]},
        {n: "七重门", id: "fb/cihang/qichongmen", p: [0,2]},
        {n: "广场", id: "fb/cihang/guangchang", p: [0,3], exits: ["s","n","w","e"]},
        {n: "慈航殿", id: "fb/cihang/zhudian", p: [0,4]},
        {n: "碎石小路", id: "fb/cihang/xiaolu2", p: [-1,3]},
        {n: "赏雨亭", id: "fb/cihang/shangyu", p: [-2,3], exits: ["e"]},
        {n: "碎石小路", id: "fb/cihang/xiaolu1", p: [1,3]},
        {n: "听雨亭", id: "fb/cihang/tingyu", p: [2,3], exits: ["s","w"]},
        {n: "典藏塔", id: "fb/cihang/diancangta", p: [2,4]},
        {n: "碎石小路", id: "fb/cihang/xiaolu3", p: [1,4], exits: ["s2","n"]},
        {n: "茶园", id: "fb/cihang/chayuan", p: [1,6]},
        {n: "石窟", id: "fb/cihang/shiku", p: [1,7], exits: ["n"]},
        {n: "死关", id: "fb/cihang/siguan", p: [2,7]},
        {n: "拦江岛", id: "fb/cihang/lanjiang", p: [-2,7]}
    ];
}
