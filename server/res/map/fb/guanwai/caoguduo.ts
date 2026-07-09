import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "谷草跺";
  exits = {
    northwest: "fb/guanwai/mantianxing",
    east: "fb/guanwai/baihe",
  };
}
