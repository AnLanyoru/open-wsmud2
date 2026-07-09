import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "无常阁";
  exits = {
    north: "fb/tianlong/wuwo",
    east: "fb/tianlong/banruo",
  };
}
