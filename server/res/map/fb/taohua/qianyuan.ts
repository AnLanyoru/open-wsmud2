import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "前院";
  exits = {
    west: "fb/taohua/damen",
    east: "fb/taohua/dating",
  };
}
