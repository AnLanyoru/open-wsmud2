import { OBJ } from "../../../os/item/obj.js";

export default function() {
this.inherits(OBJ);
this.set({
    unit: "张",
    name: "技能重置卡",
    desc: "把你的某项特殊技能完全重置，返回所有潜能",
    grade: 4,
    value: 0
});

this.on_use = function (me) {
    if (!me.is_player) return me.notify_fail("你不能使用" + this.name + "。");

    me.send('请从技能列表选择遗忘技能，然后选择使用重置卡，将会重置你的某项技能。');
    return false;
}
}
