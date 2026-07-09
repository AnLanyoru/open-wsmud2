import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "大厅";
  exits = {
    west: "fb/taohua/qianyuan",
    north: "fb/taohua/woshi",
    east: "fb/taohua/shufang",
  };
}
