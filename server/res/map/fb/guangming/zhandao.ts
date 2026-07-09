import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "栈道";
  exits = {
    west: "fb/guangming/shanlu",
    south: "fb/guangming/shanmen",
  };
}
