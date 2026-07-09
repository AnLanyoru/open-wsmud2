import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "刘府大门";
  exits = {
    south: "fb/hengshan2/jiedao",
    north: "fb/hengshan2/liufudayuan",
  };
}
