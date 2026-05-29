import { OBJ } from "../../../os/item/obj.js";

export default class extends OBJ {
    unit = "壶";
    name = "米酒";
    value = 200;
    combined = true;
    desc = "一壶醉仙楼的米酒，喝掉后每5秒恢复100点内力。";
    action_msg = "喝";
    distime = 60000;
    recover_mp = 100;
    transable = true;

    on_use(me) {
    me.send_room("$N仰头灌下一" + this.unit + this.name + "。");
    me.add_status({
        id: "drink",
        name: this.name,
        desc: this.desc,
        recover_mp: this.recover_mp,
        on_interval: function (me) {
            if (me.mp < me.max_mp) {
                me.add_mp(this.recover_mp);
                me.send('<blu>你恢复了' + this.recover_mp + '内力。</blu>');
            }
        },
        duration_count: 10,
        duration: 5000
    });

}
    on_create(path, par) {
    if (!par) {
        this.path = path + "#0";
        return;
    }
    par = par.substr(1);
    var lv = parseInt(par);
    if (!(lv > 0 && lv < 5)) return;
    this.set(OBJS[lv]);
}
}

const OBJS = [{
    name: "米酒",
    value: 200,
    recover_mp: 100,
    desc: "一壶醉仙楼的米酒，喝掉后每5秒恢复100点内力。",
    unit: "壶"
}, {
    name: "花雕酒",
    value: 400,
    recover_mp: 200,
    desc: "一壶醉仙楼产的花雕酒，喝掉后每5秒恢复200点内力。",
    unit: "壶"
}, {
    name: "女儿红",
    value: 1000,
    recover_mp: 400,
    desc: "醉仙楼特酿女儿红，每5秒回复400点内力",
    unit: "壶"
}, {
    name: "醉仙酿",
    value: 10000,
    recover_mp: 1000,
    desc: "醉仙楼的招牌，据说连神仙喝了都会醉倒，每5秒回复1000点内力",
    unit: "壶",
    grade: 1
}, {
    name: "醉八仙",
    value: 20000,
    recover_mp: 5000,
    desc: "蓬莱酒楼的招牌，据说连神仙喝了都会醉倒，每5秒回复5000点内力",
    unit: "壶",
    grade: 2
}];
