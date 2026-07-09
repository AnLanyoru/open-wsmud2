import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "丛林";
  exits = {
    south: "fb/binghuo/haibian",
    north: "fb/binghuo/conglin2",
  };
}
