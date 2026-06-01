import { OBJ } from "../../../core/item/obj.js";

export default class extends OBJ {
    unit = "碗";
    name = "米饭";
    value = 200;
    combined = true;
    desc = "一碗热气腾腾的白米饭，吃掉后每5秒恢复100点气血。";
    action_msg = "吃";
    distime = 60000;
    transable = true;
    recover_hp = 100;

    on_use(me) {
    me.send_room("$N吃下一" + this.unit + this.name + "。");
    me.add_status({
        id: "food",
        name: this.name,
        recover_hp: this.recover_hp,
        on_interval: function (me) {
            let hp = me.do_recover(this.recover_hp);
            if (hp > 0) me.notify('<hig>你恢复了' + hp + '气血。</hig>');
        },
        duration_count: 4,
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
    this.set([{
        name: "米饭",
        value: 100,
        recover_hp: 100,
        desc: "一碗热气腾腾的白米饭，吃掉后每5秒恢复100点气血。",
        unit: "碗"
    }, {
        name: "包子",
        value: 100,
        recover_hp: 100,
        desc: "一个热气腾腾的肉包子，吃掉后每5秒恢复100点气血。",
        unit: "个"
    }, {
        name: "鸡腿",
        value: 200,
        recover_hp: 200,
        desc: "一个香喷喷的鸡腿，吃掉后每5秒恢复200点气血。",
        unit: "个"
    }, {
        name: "面条",
        value: 200,
        recover_hp: 200,
        desc: "一碗热气腾腾的面条，吃掉后每5秒恢复200点气血。",
        unit: "碗"
    }, {
        name: "扬州炒饭",
        value: 500,
        recover_hp: 400,
        desc: "一碗香气腾腾的炒饭，吃掉后每5秒恢复400点气血。",
        unit: "碗"
    }
    ][lv]);
}
}
