import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "平台";
    desc = "这里是杀手楼四楼外面的平台，虽然仅有四层，但这座小楼却是极高，视野宽阔，你可以看到远处的群山以及直入云霄的武道塔";
    exits = {
    "enter": "shashou/jinlou"
};
}
