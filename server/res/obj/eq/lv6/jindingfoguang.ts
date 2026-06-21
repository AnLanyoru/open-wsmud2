import {EQUIPMENT} from "../../../../core/item/equipment.js";
import {EQUIP_TYPE} from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";
import type { CHARACTER } from "../../../../core/char/character.js";

export default class extends EQUIPMENT {
    unit = "个";
    name = "金顶佛光";
    desc = "峨眉至宝，佛光护身";
    value = 5000000;
    grade = 6;
    eq_type = EQUIP_TYPE.JEWELS;
    prop: PropMap = {
        fy: 780,
        con: 200,
        diff_sh_per: 10,
        distime_per: 10,
        diff_bj: 20,
        desc: "每5秒恢复5%的气血",
    };

    on_eq(me: CHARACTER): void {
        me.add_status({
            id: "jindingfoguang",
            name: this.name,
            desc: "佛光护身，每5秒恢复5%的气血",
            duration: 5000,
            on_interval: function (me: CHARACTER) {
                const hp = me.do_recover(Math.floor(me.max_hp * 0.05));
                if (hp > 0) me.notify('<hig>佛光笼罩，你恢复了' + hp + '点气血。</hig>');
            },
        });
        me.on_heart_beat
    }

    on_uneq(me: CHARACTER): void {
        me.remove_status('jindingfoguang', true);
    }
}
