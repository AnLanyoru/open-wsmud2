import { AREA } from "../../../os/room/area.js";

export default class extends AREA {
    id = "ao";
    name = "鳌拜府";
    desc = "满洲第一勇士鳌拜的府邸";
    score = 100;
    is_show = true;
    first = "bj/ao/damen";
    is_copy = true;
    expend = 10;
    exp = 5000;
    pot = 4000;
    is_multi = false;
    room_path = "bj/ao/";
    ss_title = "大内总管";
    map = [
  { n: "大门", id: "bj/ao/caizhu", p: [2, 0], exits: ["w"] },
  { n: "大院", id: "bj/ao/dayuan", p: [1, 0], exits: ["w"] },
  { n: "后院", id: "bj/ao/houyuan", p: [0, 0], exits: ["w", "n", "s1d"] },
  { n: "书房", id: "bj/ao/dongxiang", p: [0, -1] },
  { n: "卧室", id: "bj/ao/xixiang", p: [-1, 0] },
  { n: "牢房", id: "bj/ao", p: [0, 1] },
  { n: "牢房", id: "bj/ao", p: [0, -2] }
];
    drops = [
  "eq/lv2/ao_jia", "eq/lv2/ao_bishou", "book/bc#hunyuanyiqi", "book/bc#feiyanzoubi", "book/bc#fuhuquan",
  "book/bc#juemengun", "sp/bj/laofangkey", "sp/bj/jing"
];
}
