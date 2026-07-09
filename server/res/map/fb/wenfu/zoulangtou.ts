import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "走廊尽头";
  exits = {
    southwest: "fb/wenfu/zoulang2",
    north: "fb/wenfu/tingzi",
    southeast: "fb/wenfu/zoulang3",
  };
}
