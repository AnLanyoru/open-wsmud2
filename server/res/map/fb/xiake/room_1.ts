import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "石室";
  exits = {
    west: "fb/xiake/hole",
  };
}
