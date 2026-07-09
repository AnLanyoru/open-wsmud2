import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "穿廊门";
  exits = {
    south: "fb/qingcheng/songfeng",
  };
}
