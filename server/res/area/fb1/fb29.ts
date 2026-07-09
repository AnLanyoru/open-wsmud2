import { AREA } from "../../../core/room/area.js";

export default class extends AREA {
  id = "xuedao";
  name = "血刀门";
  desc =
    "大雪山里面的一个门派，门内全部人都使用弯刀因刀上有条血红色弯条所以叫「血刀」。";
  score = 100;
  is_show = true;
  is_copy = true;
  is_lock = true;
  expend = 10;
  exp = 3800;
  pot = 3800;
  is_diffi = false;
  is_multi = true;
  drops = [
    "book/bc#shenkongxing",
    "book/bc#shenzhaojing",
    "book/bc#xuehaimogong",
    "book/bc#xuedao",
    "eq/lv5/xiedao",
    "eq/lv5/longxiedoupeng",
  ];
  first = "fb/xuedao/shankou";
  room_path = "fb/xuedao/";
  map = [
    { n: "山口", id: "fb/xuedao/shankou", p: [0, 0] },
    { n: "山谷", id: "fb/xuedao/shangu", p: [0, 1], exits: ["n", "e1d", "s"] },
    { n: "山洞", id: "fb/xuedao/shandong", p: [1, 1] },
    { n: "忘忧谷", id: "fb/xuedao/wangyou", p: [0, 2] },
    { n: "洞口", id: "fb/xuedao/dongkou", p: [1, 2], exits: ["w1d", "e"] },
    { n: "山洞", id: "fb/xuedao/xuedao", p: [2, 2] },
  ];
}
