import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "般若台";
  exits = {
    west: "fb/tianlong/wuchang",
    east: "fb/tianlong/wujing",
    south: "fb/tianlong/munitang",
  };
}
