import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "崖底";
  exits = {
    southwest: "fb/yinyang/hantan",
  };
}
