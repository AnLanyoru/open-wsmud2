import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "大字岭";
  desc =
    "大字岭是入恒山必由之路。石壁上镌有 【恒宗】 二字，高可两丈，笔力遒劲，气势雄浑。";
  exits = {
    north: "fb/hengshan/hufengkou",
  };
}
