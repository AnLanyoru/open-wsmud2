import { OBJ } from "../../../os/item/obj.js";

export default class extends OBJ {
    unit = "个";
    name = "工具自选礼包";
    desc = "使用后可选择任意一种工具";
    grade = 1;
    value = 100;

    on_create(path, par) {
    if (!par) return;
    par = par.substr(1);
    var lv = parseInt(par);
    if (!(lv > 0 && lv < 6)) return;
    this.grade = lv;
}
    on_use(me, par) {

    if (!par) {
        var str = ["{type:\"cmds\",items:["];
        var list = ["一把" + wrap_name('铁镐', this.grade), "一根"
            + wrap_name('钓鱼竿', this.grade), "一本" + wrap_name('药王神篇', this.grade)];
        for (var i = 0; i < list.length; i++) {
            str.push("{cmd:\"use " + this.id + " ");
            str.push(i + 1);
            str.push("\",name:\"");
            str.push(list[i]);
            str.push("\"},");
        }
        str.push("]}");
        me.notify("选择你想要的工具：");
        return me.notify_fail(str.join(""));
    }
    let path = ['sp/tool/chu#', 'sp/tool/diao#', 'sp/tool/yao#'][parseInt(par) - 1];
    if (!path)
        return me.notify_fail('选择错误，请重新选择。');
    let obj = me.add_obj(path + this.grade, 1);
    me.send('你获得了' + obj.unit_name(1) + "。");
    return true;
}
}

function wrap_name(text, grade) {

    const level_desc = ["wht", "hig", "hic", "hiy", "hiz", "hio", 'ord'];
    let tag = level_desc[grade];
    return `<${tag}>${text}</${tag}>`;
}
