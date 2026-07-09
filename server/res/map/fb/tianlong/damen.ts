import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "大门";
  desc =
    "你来到了天龙寺大门前，只见气势恢弘的两个大门柱上刻有一付对联，红漆覆字，颇有点拨众生之意。抬头上望，门楣上一块黑木大匾，上题“崇圣寺”三个大字，笔意苍松。此乃正式寺名，但大理百姓叫惯了，都称之为“天龙寺”。";
  exits = {
    south: "fb/tianlong/talin",
  };
}
