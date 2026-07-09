import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "七星岩";
  exits = {
    south: "fb/yinyang/pingtai",
  };
}
