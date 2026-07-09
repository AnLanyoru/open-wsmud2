import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "花园";
  exits = {
    south: "fb/baituo/menlang",
    north: "fb/baituo/dating",
  };
}
