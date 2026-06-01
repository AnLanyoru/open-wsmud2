import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "木屋";
    desc = "这里是一间不大的木头屋子，但是麻雀虽小，五藏俱全，屋子中只是疏疏落落地摆着几件家具，所以也不显得怎么小。";
    exits = { "north": "xiaoyao/linjian2" };
}
