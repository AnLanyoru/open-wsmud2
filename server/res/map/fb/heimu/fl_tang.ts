import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "风雷堂";
  exits = {
    south: "fb/heimu/shulin",
    north: "fb/heimu/fl_lang",
  };
}
