import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "峻极禅院";
  exits = {
    north: "fb/songshan/zhongmen",
  };
}
