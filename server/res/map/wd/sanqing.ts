import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "三清殿";
    desc = "这里是凌霄宫的三清殿，是武当派会客的地点。供着元始天尊、太上道君和天上老君的神像，香案上香烟缭绕。靠墙放着几张太师椅，地上放着几个蒲团。";
    exits = { "south": "wd/guangchang" };
}
