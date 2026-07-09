import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "悬崖";
  exits = {
    south: "fb/heimu/up2",
  };
}
