import { COMMAND } from "../../../os/command.js";

export default function() {
this.inherits(COMMAND);
this.command = "wakuang";
this.enter = function (me, arg) {
    if (!me.equipment || !me.equipment[0]
        || !me.equipment[0].path.startsWith("sp/tool/chu")) {
        var chu = null;
        for (let item of me.items) {
            if (!item.is_equipment) continue;
            if (item.path.startsWith("sp/tool/chu")) {
                if (!chu || chu.grade < item.grade)
                    chu = item;
            }
        }

        if (!chu) return me.notify('你身上没有挖矿工具，去铁匠铺购买铁镐再去挖矿。');
        me.do_command("eq", chu.id);
    }
    if (arg === 'home') {
        me.do_command("goto", "home");
        me.do_command("go", "northeast");
        return me.do_command("wk");
    }
    me.do_command("jh", "fam 0 start");
    me.do_command("go", "west");
    me.do_command("go", "west");
    me.do_command("go", "west");
    me.do_command("go", "west");
    me.do_command("wa");
}
}
