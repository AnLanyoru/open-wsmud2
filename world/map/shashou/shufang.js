import { ROOM } from "../../../os/room/room.js";

export default function() {
this.inherits(ROOM);
this.name = "书房";
this.desc = "这里是杀手楼主起居的地方，房间不大，只靠窗摆着一张书案，案边一个书架，上面摆满了书，其中不少书看上去古意盎然，显然年代已久，不像是杀手楼主居住的地方，更像是一间书房";
this.exits = {
    "east": "shashou/jinlou"
};
//this.set_npc('shashou/wu');
}
