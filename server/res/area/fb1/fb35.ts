import { AREA } from "../../../core/room/area.js";

export default class extends AREA {
  id = "yinyang";
  name = "阴阳谷";
  desc =
    "绝情谷底的一处神秘所在，一半是万年玄冰，冰冷刺骨，一半是不灭地火，焚金裂石";
  score = 100;
  is_show = true;
  is_copy = true;
  is_lock = true;
  expend = 10;
  exp = 4400;
  pot = 4400;
  is_diffi = false;
  is_multi = true;
  drops = [
    "st/xuanjing",
    "st/st_sc#1",
    "st/st_sc#3",
    "st/st_sc#5",
    "st/st_sc#7",
    "eq/lv5/yinyanghuan",
    "book/bc#yinyangjiuzhuan",
  ];
  first = "fb/yinyang/ya";
  room_path = "fb/yinyang/";
  map = [
    { n: "断肠崖", id: "fb/yinyang/ya", p: [1, 2] },
    { n: "崖底", id: "fb/yinyang/yandi", p: [1, 4] },
    { n: "碧水寒潭", id: "fb/yinyang/hantan", p: [0, 5], exits: ["ne", "e"] },
    { n: "幽谷", id: "fb/yinyang/yougu", p: [1, 5] },
    { n: "玄冰洞", id: "fb/yinyang/shandong", p: [1, 6] },
    { n: "七星岩", id: "fb/yinyang/shandong2", p: [2, 5] },
    { n: "熔石窟", id: "fb/yinyang/shandong3", p: [1, 7], exits: ["s2"] },
    { n: "石台", id: "fb/yinyang/pingtai", p: [2, 6], exits: ["n", "w"] },
    { n: "熔岩炼狱", id: "fb/yinyang/rongyan", p: [2, 7] },
    { n: "阴阳谷", id: "fb/yinyang/yyg", p: [1, 9] },
  ];
}
