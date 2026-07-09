import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "大门";
  exits = {
    east: "fb/heimu/chengdedian",
  };
}
