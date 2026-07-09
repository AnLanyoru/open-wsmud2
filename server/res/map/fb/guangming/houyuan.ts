import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "后院";
  exits = {
    north: "fb/guangming/bexiang",
    south: "fb/guangming/xiaoting",
    west: "fb/guangming/xixiang",
  };
}
