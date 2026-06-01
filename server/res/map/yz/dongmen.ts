import { ROOM } from "../../../core/room/room.js";

export default class extends ROOM {
    name = "东门";
    desc = "这是东城门，城门正上方刻着“东门”两个楷书大字，城墙上贴着几张官府告示(gaoshi)。官兵们警惕地注视着过往行人，你最好小心为妙。一条笔直的青石板大道向东西两边延伸。东边是郊外，隐约可见一片一望无际的树林，神秘莫测。西边是城里。北面有一片茂盛的青竹林。";
    exits = {"south":"yz/yaolin","west":"yz/dongdajie2"};
}
