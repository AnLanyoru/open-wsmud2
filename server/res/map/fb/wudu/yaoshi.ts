import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "药室";
  exits = {
    west: "fb/wudu/nanyuan",
  };
}
