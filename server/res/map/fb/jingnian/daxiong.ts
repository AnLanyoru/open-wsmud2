import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "主殿";
  exits = {
    northwest: "fb/jingnian/tianwang3",
    northeast: "fb/jingnian/tianwang4",
    southwest: "fb/jingnian/tianwang2",
    southeast: "fb/jingnian/tianwang1",
  };
}
