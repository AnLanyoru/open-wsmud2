import { AREA } from "../../../core/room/area.js";

export default class extends AREA {
  id = "zhanshen";
  name = "战神殿";
  desc =
    "一处神秘的宫殿，据说入口会随着时间而变动，里面隐藏着武道极致的奥秘，得之更能触及天地之秘。";
  score = 100;
  is_show = true;
  is_copy = true;
  is_lock = true;
  expend = 10;
  exp = 4500;
  pot = 4500;
  is_diffi = true;
  is_multi = false;
  drops = [
    "eq/lv5/molongzhanjia",
    "eq/lv5/jinbiguguan",
    "eq/lv5/mufengyuxue",
    "eq/lv5/huonidoupeng",
    "st/shenqisuipian",
    "book/bc#zhanshentulu",
  ];
  room_path = "fb/official/zhanshen/";
  map = [];
}
