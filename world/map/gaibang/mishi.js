import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "破庙密室"
this.desc = "这是丐帮重要密道之一。由此上往，可直达破庙。四周光线昏暗，似乎有几个黑暗的洞口在你身边。脚下地上扔满了垃圾，踩上去悉悉索索地响。 ";
this.exits = { "west": "gaibang/andao2", "up": "gaibang/pomiao", "east": "gaibang/andao3" };

////this.set_npc("pub/dadizi#GAIBANG");
}
