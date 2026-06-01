import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "玉女峰小径";
    desc = "这里是玉女峰后山的一条小径。路边长满了翠竹，每当微风拂过，竹叶便沙沙作响，显得分外的幽静。";
    exits = { "northdown": "huashan/shanlu", "southup": "huashan/siguoya" };
}
