import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "丛林";
  exits = {
    south: "fb/binghuo/conglin1",
    north: "fb/binghuo/shishan",
  };
}
