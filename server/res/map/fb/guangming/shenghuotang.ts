import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "圣火堂";
  exits = {
    south: "fb/guangming/juyiting",
    west: "fb/guangming/xiaoting",
  };
}
