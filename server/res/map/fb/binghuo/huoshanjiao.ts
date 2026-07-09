import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "火山脚下";
  exits = {
    east: "fb/binghuo/yslu2",
    west: "fb/binghuo/huoshan1",
  };
}
