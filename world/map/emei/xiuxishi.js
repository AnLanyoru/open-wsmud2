import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "休息室"
this.desc = "这是间整洁的厢房，因门窗常闭着，光线很昏暗。房里别无他物，只有中间放着一张收拾得舒舒服服的大床，看着就让人想睡觉。";
this.exits = { "north": "emei/zoulang1" };
}
