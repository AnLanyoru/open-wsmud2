import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "云梦沼泽";
  exits = {
    west: "fb/yunmeng/zhaoze2",
    north: "fb/yunmeng/weiqiang",
  };
}
