import { OBJ } from "../../../../os/item/obj.js";

export default function() {
    const NPC = globalThis.NPC; const TASK = globalThis.TASK;
this.inherits(OBJ);
this.set({
    unit: "块",
    name: "召唤令",
    desc: "使用后可召唤出一个首领级NPC",
    value: 10000,
    grade:3
});
this.on_use= function (me) {
    var task = TASK.GET("boss");
    if (!task) return me.notify_fail("现在不能召唤。");
    if (me.environment.is_copy()) return me.notify_fail("副本和家中不可以召唤。");
    if (me.environment.no_fight) return me.notify_fail("这里没办法战斗，你召唤出来干嘛。");
    var boss = task.create_boss();
    me.environment.item_changed(boss, true, "<hiw>" + boss.name + "突然出现一片烟雾中。</hiw>");
    this.call_out(this.on_disappear, 1800000,boss);
}
this.on_disappear = function (boss) {
    if (boss.environment) {
        boss.destroy(boss.name+"走了。");
    }
}
}
