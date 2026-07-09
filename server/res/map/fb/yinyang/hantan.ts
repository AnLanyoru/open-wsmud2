import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "碧水寒潭";
  exits = {
    northeast: "fb/yinyang/yandi",
    east: "fb/yinyang/yougu",
  };
}
