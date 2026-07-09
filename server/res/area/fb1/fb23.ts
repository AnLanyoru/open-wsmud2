import { AREA } from "../../../core/room/area.js";

export default class extends AREA {
  id = "yihua";
  name = "移花宫";
  desc =
    "移花宫所处武林禁地绣玉谷是男人的禁地，也是一个百花齐放，宛若世外仙境的地方。从开派以来绣玉谷移花宫里都为漂亮女子。";
  score = 100;
  is_show = true;
  is_copy = true;
  is_lock = true;
  expend = 10;
  exp = 3200;
  pot = 3200;
  is_diffi = true;
  is_multi = true;
  drops = [
    "book/bc#jueqingzhang",
    "eq/lv3/lianxingdebingyuzan",
    "eq/lv3/yaoyuedeshouzhuo",
    "eq/lv3/huawuquedeyupei",
    "book/bc#yifengjian",
    "drug/biyuxuelian",
    "eq/lv4/yihuagongzhuang",
    "eq/lv4/yihuagonglv",
    "book/bc#yihuajiemu",
    "book/bc#mingyugong",
    "eq/lv5/bixiezhaodanqing",
  ];
  first = "fb/yihua/shandao";
  room_path = "fb/yihua/";
  map = [
    { n: "山道", id: "fb/yihua/shandao", p: [0, 0] },
    { n: "花径", id: "fb/yihua/yihua0", p: [0, 1], exits: ["s", "n"] },
    { n: "花径", id: "fb/yihua/yihua1", p: [0, 2] },
    { n: "大门", id: "fb/yihua/damen", p: [0, 3], exits: ["s", "n"] },
    { n: "移花阁", id: "fb/yihua/yihuage", p: [0, 4] },
    { n: "桂花廊", id: "fb/yihua/changlang", p: [0, 5], exits: ["s", "n"] },
    { n: "玫瑰廊", id: "fb/yihua/changlang1", p: [0, 6], exits: ["sw", "se"] },
    { n: "邀月宫", id: "fb/yihua/yaoyue", p: [-1, 7] },
    { n: "涟星宫", id: "fb/yihua/lianxing", p: [1, 7] },
    { n: "卧室", id: "fb/yihua/woshi", p: [0, 8], exits: ["nw", "ne"] },
    { n: "暗道", id: "fb/yihua/midao", p: [0, 9] },
    { n: "密室", id: "fb/yihua/midao2", p: [-1, 9] },
    { n: "小径", id: "fb/yihua/xiaojing", p: [-2, 9], exits: ["w", "e"] },
    { n: "莲花池", id: "fb/yihua/lianhuachi", p: [-3, 9] },
  ];
}
