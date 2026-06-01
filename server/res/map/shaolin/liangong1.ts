import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "东侧殿";
    desc = "房间四周悬挂着达摩祖师、观音大士的画像，以及一些寺内元老的字画。地下散乱地放着许多蒲团，木鱼等。看来此处是本派弟子打坐修行之所。几位年轻僧人正肃容入定，看来已颇得禅宗三昧。";
    exits = { "west": "shaolin/shanmen" };

    constructor() {
        super();
        this.set_npc('pub/tongren');
    }
}
