import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "戒律院"
this.desc = "整个大殿门户紧闭，密不透风。即便是在白昼，也犹如黑夜一般，每隔几步的墙上，点燃着几枝牛油巨烛。下方摆着一排排烙铁、水牛皮鞭、穿孔竹板及狼牙棒等刑具。四周站满了手持兵刃的执法僧兵。";
this.exits = { "west": "shaolin/fangzhang" };
}
