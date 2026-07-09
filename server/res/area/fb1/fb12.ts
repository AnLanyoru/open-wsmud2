import { AREA } from "../../../core/room/area.js";

export default class extends AREA {
  id = "wudu";
  name = "五毒教";
  desc =
    "自称是五仙教，别人称之为五毒教 驱使蛤蟆、蜘蛛、蝎子、毒蛇、蜈蚣五种毒物战斗，善用毒";
  score = 100;
  is_show = true;
  is_copy = true;
  is_lock = true;
  expend = 10;
  exp = 2100;
  pot = 2100;
  is_diffi = false;
  is_multi = true;
  drops = [
    "book/bc#wudushengong",
    "book/bc#wuduyanluobu",
    "book/bc#wudugoufa",
    "book/bc#qianzhuwandushou",
  ];
  first = "fb/wudu/damen";
  room_path = "fb/wudu/";
  map = [
    { n: "大门", id: "fb/wudu/damen", p: [0, 0] },
    { n: "练武场", id: "fb/wudu/lianwu", p: [1, 0], exits: ["w", "e", "s"] },
    { n: "南院", id: "fb/wudu/nanyuan", p: [1, 1], exits: ["w", "e", "s"] },
    { n: "大厅", id: "fb/wudu/dating", p: [2, 0] },
    { n: "厢房", id: "fb/wudu/xiangfang", p: [0, 1] },
    { n: "药室", id: "fb/wudu/yaoshi", p: [2, 1] },
    { n: "练毒室", id: "fb/wudu/liandu", p: [1, 2] },
    { n: "花园", id: "fb/wudu/huayuan", p: [3, 0], exits: ["w", "e", "n"] },
    { n: "花园", id: "fb/wudu/huayuan2", p: [3, -1] },
    { n: "花厅", id: "fb/wudu/huating", p: [4, 0] },
    { n: "腾蛟亭", id: "fb/wudu/huating2", p: [4, -1], exits: ["s", "w"] },
  ];
}
