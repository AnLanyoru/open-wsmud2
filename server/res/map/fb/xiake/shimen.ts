import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "石门";
  desc =
    "这里已是甬道尽头，面前一道厚重的石门。门上刻着三个斗大的古篆：「侠客行」。年深日久，那笔划的凹下之处都积满了青苔，越发显得沧桑，你心中的敬意油然而生。";
  exits = {
    west: "fb/xiake/shibi",
  };
}
