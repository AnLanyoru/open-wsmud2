import { AREA } from "../../../core/room/area.js";

export default class extends AREA {
  id = "taishan";
  name = "泰山";
  desc = "泰山派的所在地";
  score = 100;
  is_show = true;
  is_copy = true;
  is_lock = true;
  expend = 10;
  exp = 2500;
  pot = 2500;
  is_diffi = false;
  is_multi = false;
  drops = [
    "eq/lv3/taishandengshanxue",
    "eq/lv3/panshihufu",
    "book/bc#taishanquanfa",
    "book/bc#taishanjianfa",
    "book/bc#panshishengong",
  ];
  first = "fb/taishan/daizong";
  room_path = "fb/taishan/";
  map = [
    { n: "岱宗坊", id: "fb/taishan/daizong", p: [0, 0], exits: ["n"] },
    { n: "一天门", id: "fb/taishan/yitian", p: [0, -1] },
    { n: "二天门", id: "fb/taishan/ertian", p: [0, -2], exits: ["s", "n1d"] },
    { n: "十八盘", id: "fb/taishan/shiba1", p: [0, -3] },
    { n: "龙门", id: "fb/taishan/longmen", p: [0, -4], exits: ["s1d", "n1d"] },
    { n: "十八盘", id: "fb/taishan/shiba2", p: [0, -5] },
    {
      n: "升仙坊",
      id: "fb/taishan/shengxian",
      p: [0, -6],
      exits: ["s1d", "n1d"],
    },
    { n: "十八盘", id: "fb/taishan/shiba3", p: [0, -7] },
    { n: "南天门", id: "fb/taishan/nantian", p: [0, -8], exits: ["s1d", "n"] },
    { n: "玉皇顶", id: "fb/taishan/yuhuang", p: [0, -9] },
  ];
}
