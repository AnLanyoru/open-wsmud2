import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "大厅";
    desc = "走进杀手楼迎面是一个宽阔的大堂，这里看上去好像没几个人，但你却觉得好像被无处不在的视线注视着。正中一块匾额，上书：替天刑法";
    exits = {
    "up": "shashou/ange1", "south": "shashou/damen"
};
}
