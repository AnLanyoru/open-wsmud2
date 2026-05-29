import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "大门";
    desc = "这里是神秘的杀手楼总部，一座隐蔽的小楼隐藏在云雾之中，小楼看上去不大，却如一柄出鞘的利剑让你不寒而栗，门口站着两个守卫谨慎的打量着你。";
    exits = {
    "north": "shashou/datang"
};
}
