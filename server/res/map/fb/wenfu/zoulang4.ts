import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "走廊";
  exits = {
    north: "fb/wenfu/zoulang3",
    southwest: "fb/wenfu/dating",
    east: "fb/wenfu/wen5",
  };
}
