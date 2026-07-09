import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "锐金旗";
  exits = {
    south: "fb/guangming/qi_jumu",
    east: "fb/guangming/lianwu",
  };
}
