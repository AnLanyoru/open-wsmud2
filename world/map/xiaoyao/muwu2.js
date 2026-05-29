import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "木屋";
    desc = "这是一间不是很大的木头屋子，这里看起来象个药室，室中摆放着各种不同的配药的用具和一些已经配好了的药。";
    exits = { "south": "xiaoyao/linjian1" };
}
