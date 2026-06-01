import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "树洞下";
    desc = "这是老槐树底部，四周光线昏暗，人影晃晃，似乎有几个黑暗的洞口在你身边，通向四面八方。 一位老乞丐大咧咧地坐在正中的地上。";
    exits = { "east": "gaibang/andao1", "up": "gaibang/shudong" };
}
