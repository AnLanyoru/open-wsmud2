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
    first = "fb/guanwai/damen";
    room_path = "fb/guanwai/";
    map = [
        {n: "大门坎子", id: "fb/guanwai/damen", p: [0,0]},
        {n: "松花江上", id: "fb/guanwai/jiang", p: [-1,0]},
        {n: "船厂", id: "fb/guanwai/chuanchang", p: [-2,0]},
        {n: "雪地", id: "fb/guanwai/xuedi", p: [-2,1]},
        {n: "荒地", id: "fb/guanwai/huangdi", p: [-3,1]},
        {n: "山神庙", id: "fb/guanwai/shanshenmiao", p: [-2,0]},
        {n: "二门坎子", id: "fb/guanwai/ermenkan", p: [1,-1], exits: ["sw","e"]},
        {n: "满天星", id: "fb/guanwai/mantianxing", p: [2,-1]},
        {n: "谷草跺", id: "fb/guanwai/caoguduo", p: [3,0], exits: ["nw","e"]},
        {n: "白河", id: "fb/guanwai/baihe", p: [4,0], exits: ["n","e"]},
        {n: "小屋", id: "fb/guanwai/xiaowu", p: [4,-1]},
        {n: "密林", id: "fb/guanwai/milin", p: [5,0]},
        {n: "密林", id: "fb/guanwai/milin2", p: [6,0], exits: ["w1d","s1d"]},
        {n: "密林", id: "fb/guanwai/milin3", p: [6,1]},
        {n: "黑风口", id: "fb/guanwai/heifengkou", p: [7,1], exits: ["w1d","e"]},
        {n: "小天池", id: "fb/guanwai/xiaotianchi", p: [8,1]},
        {n: "瀑布", id: "fb/guanwai/pubu", p: [9,1], exits: ["w1d","n"]},
        {n: "瀑布下", id: "fb/guanwai/pubuxia", p: [9,0]},
        {n: "大清龙脉", id: "fb/guanwai/daqinglongmai", p: [9,-1]}
    ];
}
