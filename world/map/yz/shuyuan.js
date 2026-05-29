import { ROOM } from "../../../os/room/room.js";

export default class extends ROOM {
    name = "书院";
    desc = "这里是书院的讲堂，窗明几净，一尘不染。一位庄重严肃的老者坐在太师椅上讲学，那就是当今大儒朱先生了。在他的两侧坐满了求学的学生。一张古意盎然的书案放在朱先生的前面，案上摆着几本翻开了的线装书籍。朱先生的身后是一个书架(shujia)讲堂内多历代楹联石刻，足见书院历史的悠久。值得一提的是嵌在讲堂前左壁的学规(xuegui)。书院老夫子刚奉了圣旨颁发学位，就在门口树着书院新立的学位公告板(board)。";
    exits = { "south": "yz/dongdajie1" };
    no_fight = true;

    constructor() {
        super();
        this.set_item("xuegui", "学规","日讲经书三起，日看纲目数页。\n通晓时务物理，参读古文诗赋。\n读书必须过笔，会课按时蚤完。\n夜读仍戒晏起，疑误定要力争。\n");
        this.set_item("shujia", "书架", "一个一尘不染的书架。");
        this.set_item("board", "公告板", "本书院奉圣上恩旨自即日起封授学位");
        this.set_npc("yz/zhu");
    }

    on_leave(me, dir) {
    if (dir == "north" )
        return me.notify_fail("那是朱熹的私人寝室！！");
}
}
