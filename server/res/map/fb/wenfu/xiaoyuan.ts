import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "小院";
  exits = {
    north: "fb/wenfu/xiaolou",
  };
}
