import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "青草坪"
this.desc = "这里是树林中的一片比较大的空地，名曰：青草坪。因为处于密林之中所以这里平时很少有人来，但是不知道为什么，这里却经常有人迹出现。";
this.exits = { "west": "xiaoyao/linjian3", "east": "xiaoyao/linjian", "north": "xiaoyao/linjian1", "south": "xiaoyao/linjian2", "down": "xiaoyao/shishi" };
}
