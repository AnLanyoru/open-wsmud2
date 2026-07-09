import { AREA } from "../../../core/room/area.js";

export default class extends AREA {
  id = "xingxiu";
  name = "星宿海";
  desc =
    "星宿派大本营，星宿老仙丁春秋的地盘，门下弟子大都喜欢拍马逢迎，又无恶不作";
  score = 100;
  is_show = true;
  is_copy = true;
  is_lock = true;
  expend = 10;
  exp = 3000;
  pot = 3000;
  is_diffi = false;
  is_multi = false;
  drops = [
    "book/bc#zhaixinggong",
    "book/bc#feixingshu",
    "eq/lv3/bilinzhen",
    "book/bc#sanyinzhua",
    "book/bc#huagongdafa",
    "eq/lv4/shenmuwangding",
  ];
  first = "fb/xingxiu/xxh6";
  room_path = "fb/xingxiu/";
  map = [
    { n: "星宿海", id: "fb/xingxiu/xxh6", p: [0, 0] },
    { n: "星宿海", id: "fb/xingxiu/xxh5", p: [1, -1], exits: ["n", "sw"] },
    { n: "星宿海", id: "fb/xingxiu/xxh4", p: [-1, -1], exits: ["n", "se"] },
    { n: "星宿海", id: "fb/xingxiu/xxh3", p: [1, -2] },
    { n: "星宿海", id: "fb/xingxiu/xxh2", p: [-1, -2] },
    {
      n: "星宿海",
      id: "fb/xingxiu/xxh1",
      p: [0, -3],
      exits: ["sw", "se", "n"],
    },
    { n: "日月洞", id: "fb/xingxiu/riyuedong", p: [0, -4] },
  ];
}
