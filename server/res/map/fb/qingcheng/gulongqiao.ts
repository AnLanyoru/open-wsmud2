import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "古龙桥";
  exits = {
    south: "fb/qingcheng/tianshidong",
    north: "fb/qingcheng/sanwan",
  };
}
