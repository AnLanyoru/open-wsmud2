import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "山路";
  exits = {
    southwest: "fb/jingnian/shanlu",
    northeast: "fb/jingnian/shanlu_2",
  };
}
