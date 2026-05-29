import { OBJ } from "../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.set({
    unit: "颗",
    name: "仓库扩充石",
    desc: "使用后增加你的仓库容量+10",
    grade: 1,
    value: 0
});
this.on_use = function (me) {
    if (!me.is_player) return me.notify_fail("你不能使用" + this.name + "。");
    var size = 10;
    if (me.max_store_count + size > 400) return me.notify_fail("仓库最多只能扩充到400格。");
    me.max_store_count += size;
    me.notify('你的仓库容量扩充为' + me.max_store_count + "。");
    return true;
}
}
