import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "茶园";
  exits = {
    south: "fb/cihang/shiku",
  };
}
