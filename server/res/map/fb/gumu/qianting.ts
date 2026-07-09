import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "前厅";
  exits = {
    west: "fb/gumu/gumukou",
    east: "fb/gumu/houtang",
  };
}
