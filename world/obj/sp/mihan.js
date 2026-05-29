import { OBJ } from "../../../os/item/obj.js";
import { TASK } from "../../../os/task/task.js";

export default class extends OBJ {
    unit = "封";
    name = "蒙古密函";
    desc = "一封密函，火漆封口，似乎写的什么秘密的军事机密";
    value = 0;
    grade = 3;

    on_open(me) {
    var task = TASK.GET("xiangyang");
    if (!task) return me.notify_fail("你不知道里面写的什么东西。");
  return  me.notify_fail("你打开密函仔细读了一下，发现你不认识蒙古字，还是交给襄阳城的郭大侠看看吧。");
}
}

