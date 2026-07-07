import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "星宿海";
    desc = "这里是星宿海的尽头。因为附近有野羊出没，所以星宿派弟子常常在此烤羊肉串吃。当打不到野羊时，他们就抢山下牧人的羊。";
    exits = {
        "northeast": "fb/xingxiu/xxh5",
        "northwest": "fb/xingxiu/xxh4",
    };
}
