import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "树洞下"
this.desc = "这是老槐树底部，四周光线昏暗，人影晃晃，似乎有几个黑暗的洞口在你身边，通向四面八方。 一位老乞丐大咧咧地坐在正中的地上。";
this.exits = { "east": "gaibang/andao1", "up": "gaibang/shudong" };

////this.set_npc('gaibang/zuo');
}
