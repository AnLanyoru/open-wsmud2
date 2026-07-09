import { AREA } from "../../../core/room/area.js";

export default class extends AREA {
  id = "piaomiao";
  name = "缥缈峰";
  desc = "缥缈峰灵鹫宫是威震天下的天山童姥所在地";
  score = 100;
  is_show = true;
  is_copy = true;
  is_lock = true;
  expend = 10;
  exp = 3500;
  pot = 3500;
  is_diffi = true;
  is_multi = false;
  drops = [
    "book/bc#shenjianjue",
    "book/bc#tianyuqijian",
    "drug/age",
    "book/bc#bahuanggong",
    "eq/lv5/tianlongyizhu",
  ];
  first = "fb/piaomiao/shanjiao";
  room_path = "fb/piaomiao/";
  map = [
    { n: "山脚", id: "fb/piaomiao/shanjiao", p: [0, 0] },
    { n: "断魂崖", id: "fb/piaomiao/ya", p: [0, -1], exits: ["n", "s"] },
    { n: "失足岩", id: "fb/piaomiao/yan", p: [0, -2] },
    { n: "百丈涧", id: "fb/piaomiao/jian", p: [0, -3], exits: ["n", "s"] },
    { n: "仙愁门", id: "fb/piaomiao/xianchou", p: [0, -4] },
    { n: "青石大道", id: "fb/piaomiao/dadao", p: [0, -5], exits: ["n", "s"] },
    { n: "独尊厅大门", id: "fb/piaomiao/damen", p: [0, -6] },
    { n: "独尊厅", id: "fb/piaomiao/dating", p: [0, -7] },
    {
      n: "长廊",
      id: "fb/piaomiao/changlang",
      p: [0, -8],
      exits: ["n", "s", "e", "w"],
    },
    { n: "花园", id: "fb/piaomiao/huayuan", p: [0, -9], exits: ["w", "e"] },
    { n: "戏凤阁", id: "fb/piaomiao/liangong", p: [-1, -8] },
    { n: "蓼风轩", id: "fb/piaomiao/wuqi", p: [1, -8] },
    { n: "憩凤阁", id: "fb/piaomiao/woshi", p: [-1, -9] },
    { n: "藕香榭", id: "fb/piaomiao/chufang", p: [1, -9] },
    { n: "小路", id: "fb/piaomiao/xiaodao", p: [0, -10], exits: ["n", "s"] },
    { n: "闭关室", id: "fb/piaomiao/biguan", p: [0, -11] },
  ];
}
