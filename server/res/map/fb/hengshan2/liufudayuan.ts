import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "刘府大院";
  exits = {
    south: "fb/hengshan2/liufumen",
    north: "fb/hengshan2/liufudating",
  };
}
