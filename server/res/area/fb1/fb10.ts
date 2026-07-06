import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "guanwai";
    name = "关外";
    desc = "出了山海关，靠近长白山的地方，这里有很多关于闯王宝藏，大清龙脉的传说";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 1900;
    pot = 1900;
    is_diffi = false;
    is_multi = false;
    drops = [
        "book/bc#lengyueshengong",
        "drug/xiongdan",
        "book/bc#hujiadaofa",
        "book/bc#sixiangbu",
        "eq/lv3/chuangwangbaodao",
    ];
    first = "fb/guanwai/大门坎子";
    room_path = "fb/guanwai/";
    map = [
        {n: "大门坎子", id: "fb/guanwai/大门坎子", p: [0,0]},
        {n: "松花江上", id: "fb/guanwai/松花江上", p: [-1,0]},
        {n: "船厂", id: "fb/guanwai/船厂", p: [-2,0]},
        {n: "雪地", id: "fb/guanwai/雪地", p: [-2,1]},
        {n: "荒地", id: "fb/guanwai/荒地", p: [-3,1]},
        {n: "山神庙", id: "fb/guanwai/山神庙", p: [-2,0]},
        {n: "二门坎子", id: "fb/guanwai/二门坎子", p: [1,-1], exits: ["sw","e"]},
        {n: "满天星", id: "fb/guanwai/满天星", p: [2,-1]},
        {n: "谷草跺", id: "fb/guanwai/谷草跺", p: [3,0], exits: ["nw","e"]},
        {n: "白河", id: "fb/guanwai/白河", p: [4,0], exits: ["n","e"]},
        {n: "小屋", id: "fb/guanwai/小屋", p: [4,-1]},
        {n: "密林", id: "fb/guanwai/密林", p: [5,0]},
        {n: "密林", id: "fb/guanwai/密林1", p: [6,0], exits: ["w1d","s1d"]},
        {n: "密林", id: "fb/guanwai/密林2", p: [6,1]},
        {n: "黑风口", id: "fb/guanwai/黑风口", p: [7,1], exits: ["w1d","e"]},
        {n: "小天池", id: "fb/guanwai/小天池", p: [8,1]},
        {n: "瀑布", id: "fb/guanwai/瀑布", p: [9,1], exits: ["w1d","n"]},
        {n: "瀑布下", id: "fb/guanwai/瀑布下", p: [9,0]},
        {n: "大清龙脉", id: "fb/guanwai/大清龙脉", p: [9,-1]}
    ];
}
