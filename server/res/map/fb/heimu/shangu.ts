import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "山谷";
  desc =
    "这里是一处山谷，上面种植着草坪。南下是『日月神教』的青龙堂。北面是白虎堂，东面是个树林，据说『日月神教』总部就在那里面。";
  exits = {
    north: "fb/heimu/bh_tang",
    south: "fb/heimu/ql_tang",
    east: "fb/heimu/shulin",
  };
}
