import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "山路";
  exits = {
    west: "fb/hengshan2/hengyang",
    southeast: "fb/hengshan2/nantianmen",
  };
}
