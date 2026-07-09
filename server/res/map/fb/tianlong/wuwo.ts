import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "无我阁";
  exits = {
    northeast: "fb/tianlong/ta",
    south: "fb/tianlong/wuchang",
  };
}
