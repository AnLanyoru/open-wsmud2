import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "大厅";
  exits = {
    south: "fb/heimu/bh_lang",
  };
}
