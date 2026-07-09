import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "斋堂";
  exits = {
    south: "fb/hengshan/xilang",
  };
}
