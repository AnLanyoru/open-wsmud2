import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "花径";
  exits = {
    north: "fb/yihua/yihua0",
    south: "fb/yihua/damen",
  };
}
