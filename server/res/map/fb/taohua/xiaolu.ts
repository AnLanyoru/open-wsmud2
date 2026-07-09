import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "小路";
  exits = {
    south: "fb/taohua/shijianting",
    north: "fb/taohua/taolinchukou",
  };
}
