import {AREA} from "../../../core/room/area.js";

export default class extends AREA {
    id = "qingcheng";
    name = "青城山";
    desc = "青城派的所在地";
    score = 100;
    is_show = true;
    is_copy = true;
    is_lock = true;
    expend = 10;
    exp = 2300;
    pot = 2300;
    is_diffi = false;
    is_multi = false;
    drops = [
        "book/bc#tagexing",
        "book/bc#cuixinzhang",
        "book/bc#songfengjianfa",
    ];
    first = "fb/qingcheng/shanlu";
    room_path = "fb/qingcheng/";
    map = [
        {n: "山路", id: "fb/qingcheng/shanlu", p: [0,0]},
        {n: "天师洞", id: "fb/qingcheng/tianshidong", p: [-1,0], exits: ["e1d","n"]},
        {n: "古龙桥", id: "fb/qingcheng/gulongqiao", p: [-1,-1]},
        {n: "三弯九倒", id: "fb/qingcheng/sanwan", p: [-1,-2], exits: ["e1d","s"]},
        {n: "上清宫", id: "fb/qingcheng/shangqing", p: [0,-2]},
        {n: "松风观", id: "fb/qingcheng/songfeng", p: [0,-3], exits: ["s","n"]},
        {n: "穿廊门", id: "fb/qingcheng/zhongmen", p: [0,-4]},
        {n: "走廊", id: "fb/qingcheng/zoulang", p: [0,-5]},
        {n: "练武场", id: "fb/qingcheng/caochang", p: [0,-6], exits: ["s","e","n"]},
        {n: "上清殿", id: "fb/qingcheng/zhudian", p: [0,-7]},
        {n: "花园", id: "fb/qingcheng/huayuan", p: [1,-6]},
        {n: "卧室", id: "fb/qingcheng/woshi", p: [1,-7], exits: ["s"]}
    ];
}
