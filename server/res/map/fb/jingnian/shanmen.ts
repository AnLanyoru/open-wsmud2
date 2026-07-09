import { ROOM } from "../../../../core/room/room.js";

export default class extends ROOM {
  name = "山门";
  desc =
    "这是禅院的山门处，前面是一道长长的石阶，一眼望不到头，山门口放着一尊巨石，上面刻着：佛门静地，唯度有缘。 ";
  exits = {
    north: "fb/jingnian/shijie",
    northeast: "fb/jingnian/shanlu",
  };
}
