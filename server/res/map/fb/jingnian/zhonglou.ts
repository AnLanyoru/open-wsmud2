import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "钟楼";
  exits = {
    southeast: "fb/jingnian/baishi",
  };
}
