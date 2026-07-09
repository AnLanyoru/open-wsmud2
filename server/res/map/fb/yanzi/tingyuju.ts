import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "听雨居";
  exits = {
    west: "fb/yanzi/xiaojing",
    south: "fb/yanzi/houyuan",
  };
}
