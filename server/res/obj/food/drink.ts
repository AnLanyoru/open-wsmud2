import type { CHARACTER } from "../../../core/char/character.js";
import {OBJ} from "../../../core/item/obj.js";

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

    on_use(me: CHARACTER) {
        me.send_room(`$N仰头灌下一${this.unit}${this.name}。`);
        me.add_status({
            id: "drink",
            name: this.name,
            desc: this.desc,
            recover_mp: this.recover_mp,
            on_interval: function (me) {
                if (me.mp < me.max_mp) {
                    me.add_mp(this.recover_mp!);
                    me.send('<blu>你恢复了' + this.recover_mp + '内力。</blu>');
                }
            },
            duration_count: 10,
            duration: 5000
        });

    }

    on_create(path: string, par: string) {
        if (!par) {
            this.path = path + "#0";
            return;
        }
        par = par.slice(1);
        var lv = parseInt(par);
        if (!(lv > 0 && lv < 5)) return;

        switch (lv) {
            case 1:
                this.name = "花雕酒";
                this.value = 400;
                this.recover_mp = 200;
                this.desc = "一壶醉仙楼产的花雕酒，喝掉后每5秒恢复200点内力。";
                this.unit = "壶";
                break;
            case 2:
                this.name = "女儿红";
                this.value = 1000;
                this.recover_mp = 400;
                this.desc = "醉仙楼特酿女儿红，每5秒回复400点内力";
                this.unit = "壶";
                break;
            case 3:
                this.name = "醉仙酿";
                this.value = 10000;
                this.recover_mp = 1000;
                this.desc = "醉仙楼的招牌，据说连神仙喝了都会醉倒，每5秒回复1000点内力";
                this.unit = "壶";
                this.grade = 1;
                break;
            case 4:
                this.name = "醉八仙";
                this.value = 20000;
                this.recover_mp = 5000;
                this.desc = "蓬莱酒楼的招牌，据说连神仙喝了都会醉倒，每5秒回复5000点内力";
                this.unit = "壶";
                this.grade = 2;
                break;
            default:
                return;
        }
    }
}
