import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "聚义堂"
this.desc = "这里是你的帮会的主厅，正对面一张虎头座椅，那是你们帮主的平日里发号施令的地方，上方一块匾额，上书：聚义堂，字迹苍松，威风凛凛。";
this.exits = { "west": "banghui/yuanzi", "north": "banghui/cangku" };
}
