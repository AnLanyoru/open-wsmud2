import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "移花阁";
  exits = {
    north: "fb/yihua/damen",
    south: "fb/yihua/changlang",
  };
}
