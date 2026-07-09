import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "闭关室";
  exits = {
    south: "fb/piaomiao/xiaodao",
  };
}
