import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "刘府大厅";
  exits = {
    east: "fb/hengshan2/dongxiangfang",
    south: "fb/hengshan2/liufudayuan",
    west: "fb/hengshan2/xixiangfang",
  };
}
