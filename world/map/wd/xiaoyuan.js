import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "后山小院";
    desc = "这是后山的一座小院，布置简简单单，除了一床、一桌、一椅、一蒲团，再也没有别的什物。比较引人注目的是墙上挂着一把剑。这里就是武当开山祖师张三丰的练功所在。因为这里是张三丰常住的地方，人们把这里叫做金殿。";
    exits = { "south": "wd/xiaolu2" };
}
