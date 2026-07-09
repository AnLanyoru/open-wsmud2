import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "岩石路";
  exits = {
    west: "fb/binghuo/huoshanjiao",
    east: "fb/binghuo/yslu1",
  };
}
