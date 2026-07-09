import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "殿门";
  exits = {
    south: "fb/jingnian/shijie",
  };
}
