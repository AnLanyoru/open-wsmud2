import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "断魂崖";
  exits = {
    north: "fb/piaomiao/yan",
    south: "fb/piaomiao/shanjiao",
  };
}
