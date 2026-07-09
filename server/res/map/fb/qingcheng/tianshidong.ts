import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "天师洞";
  exits = {
    north: "fb/qingcheng/gulongqiao",
  };
}
