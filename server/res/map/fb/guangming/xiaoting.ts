import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "小厅";
  exits = {
    east: "fb/guangming/shenghuotang",
    north: "fb/guangming/houyuan",
  };
}
