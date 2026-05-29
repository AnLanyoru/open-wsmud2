import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "镇岳宫";
    desc = "这里是华山的镇岳宫，也是华山派的大门，这里地势略为平坦，林木繁茂，苍松插天，溪水环绕，甚是清雅。有几个华山派的弟子在这里守着。";
    exits = {
    "eastup": "huashan/canglong", "westup": "huashan/shanlu"
};
}
