import { OBJ } from "../../../os/item/obj.js";

export default class extends OBJ {
    name = "工具包";
    desc = "里面有一套黄色工具，几个橙色鱼饵，指南";
    unit = "个";
    value = 0;
    grade = 5;

    on_open(me) {
    let index = me.add_temp('gjx1', 1);
    let result = [];
    if (index === 1) {
        result.push(
            {
                obj: "sp/tool/yao#4"
            });

        result.push(
            {
                obj: "sp/tool/chu#3"
            });

        result.push(
            {
                obj: "sp/tool/diao#3"
            });
    } else if (index === 2) {
        result.push(
            {
                obj: "sp/tool/chu#4"
            });
        result.push(
            {
                obj: "sp/tool/yao#3"
            });

        result.push(
            {
                obj: "sp/tool/diao#3"
            });
    } else if (index === 3) {
        result.push(
            {
                obj: "sp/tool/diao#4"
            });
        result.push(
            {
                obj: "sp/tool/chu#3"
            });

        result.push(
            {
                obj: "sp/tool/yao#3"
            });
        me.remove_temp('gjx1');
    }
    result.push({
        obj: "sp/tool/er#5", min: 5, max: 6
    });
    result.push(
        {
            obj: "sp/tool/exp#5", min: 1, max: 3
        });

    return OBJ.create_by_odds(result);
}
}
