import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "林间小屋"
this.desc = "你走进了一间小屋。四周墙壁都由青竹篾编成，窗外是一望无际的竹林。屋里的桌椅、床铺均为竹制。但一阵扑鼻而来的狗肉香味，却显得与这清雅的气纷格格不入。 ";
this.exits = { "down": "gaibang/andao4" };
////this.set_npc('gaibang/hongqigong');
}
