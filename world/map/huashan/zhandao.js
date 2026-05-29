import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "长空栈道";
    desc = "栈道以铁斜插，上覆青石板，宽不足八寸。上乃绝壁，下亦绝壁。挽索登其上，只听山风呼啸，林涛怒吼。远处偶传一两声禽鸣兽嘶，更使人毛骨悚然。踏上悬空的栈道，紧攀铁索，屏息静气，缓步挪动，才能过去。";
    exits = { "eastdown": "huashan/hole" ,"westup": "huashan/luoyan"};
}
