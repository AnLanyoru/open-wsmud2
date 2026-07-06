import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "yanzi";
    name = "燕子坞";
    desc = "燕子坞是姑苏慕容家的大本营，据说那里的还施水阁收集了大量的武功";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 3300;
    pot = 3300;
    is_diffi = true;
    is_multi = false;
    drops = [
        "eq/lv4/azhudeyirongmianju",
        "book/bc#canhezhi",
        "book/bc#douzhuanxingyi",
    ];
    first = "fb/yanzi/anbian";
    room_path = "fb/yanzi/";
    map = [
        {n: "岸边", id: "fb/yanzi/anbian", p: [0,0]},
        {n: "花丛", id: "fb/yanzi/hc1", p: [1,0], exits: ["e","w"]},
        {n: "庄门", id: "fb/yanzi/zhuangmen", p: [2,0]},
        {n: "前院", id: "fb/yanzi/qianyuan", p: [3,0], exits: ["e","w","s"]},
        {n: "大厅", id: "fb/yanzi/dating", p: [4,0]},
        {n: "书房", id: "fb/yanzi/shufang", p: [5,0]},
        {n: "后厅", id: "fb/yanzi/houting", p: [4,-1], exits: ["s","e"]},
        {n: "内堂", id: "fb/yanzi/neitang", p: [5,-1]},
        {n: "还施水阁", id: "fb/yanzi/hssg", p: [4,-2]},
        {n: "小径", id: "fb/yanzi/xiaojing", p: [3,1]},
        {n: "听雨居", id: "fb/yanzi/tingyuju", p: [4,1], exits: ["w","s"]},
        {n: "后院", id: "fb/yanzi/houyuan", p: [4,2]},
        {n: "云锦楼", id: "fb/yanzi/yunjinlou", p: [4,3], exits: ["n","e"]},
        {n: "小厅", id: "fb/yanzi/xiaoting", p: [5,3]}
    ];
}
