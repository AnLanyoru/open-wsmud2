import {ROOM} from "../../../../core/room/room.js";

export default class extends ROOM {
    name = "大门坎子";
    desc = "这里是沿江向东的古道，多为进山采参的参客所走，因此也称“参路”。前面一座小山截断去路，因其行似门坎，且为东去采参的第一道屏障，故被称为大门坎子。西面是宽阔的松花江。松花江在冬春时结冰可通行，夏秋化冻你只好找船家帮忙了。";
    exits = {
        "northeast": "fb/guanwai/ermenkan",
    };
}
