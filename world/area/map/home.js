import { AREA } from "../../../os/room/area.js";

export default class extends AREA {
    name = "住房";
    room_path = "home/";
    id = "home";
    is_copy = true;
    not_fb = true;
    map = [{ n: "卧室", id: "home/danjian", p: [0, 0] },
{ n: "卧室", id: "home/woshi", p: [4, 0] },
{ n: "院子", id: "home/yuanzi", p: [4, 1], exits: ["w", "e", "n"] },
{ n: "练功房", id: "home/liangong", p: [3, 1] },
{ n: "炼药房", id: "home/lianyao", p: [5, 1] },
{ n: "小花园", id: "home/huayuan", p: [5, 0] }
];

    query_owner(me) {
    return me.id;
}
}
