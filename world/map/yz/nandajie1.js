import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "南大街";
    desc = "南大街乃是城里的繁华地段，一到晚上，一派灯红酒绿，尤为热闹。笑声、歌声、琴声、箫声，汇成一片送入了你的耳朵，你不禁心猿意马，很想就此停步享受一番。东边是一家店铺，墙上写着一个大大的“当”字。西边则是一片喧嚣，夹杂着“一五一十”的数钱声，原来那是方圆千里之内最大的一家赌场。";
    exits = {"east":"yz/dangpu","south":"yz/nandajie2","west":"yz/duchang","north":"yz/guangchang"};
}
