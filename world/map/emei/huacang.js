import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "华藏庵";
    desc = "这里是峨眉的藏经阁。虽然并不太大，但屋中摆放了许多的竹架，上面陈列着密密麻麻的各种书籍，在靠窗边有一张桌子，上面有一盏油灯，在灯旁好象是放了一本书，但当要拿它时，却发现拿了一个空。";
    exits = { "west": "emei/duguangtai" };
}
