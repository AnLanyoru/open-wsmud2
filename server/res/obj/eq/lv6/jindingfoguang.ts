import { EQUIPMENT } from "../../../../core/item/equipment.js";
import { EQUIP_TYPE } from "../../../../core/const.js";
import type { PropMap } from "../../../../types/props.js";
import type { CHARACTER } from "../../../../core/char/character.js";

export default class extends EQUIPMENT {
    unit = "个";
    name = "金顶佛光";
    desc = "峨眉至宝，佛光护身";
    value = 5000000;
    grade = 6;
    eq_type = EQUIP_TYPE.HEAD;
    prop: PropMap = {
        fy: 780,
        con: 200,
        diff_sh_per: 10,
        distime_per: 10,
        diff_bj: 20,
        desc: "每5秒恢复5%的气血",
    };

    on_eq(me: CHARACTER): void {
        me.add_event("on_heart_beat", this.on_heart_beat_jing_ding)
    }

    on_uneq(me: CHARACTER): void {
        me.remove_event('on_heart_beat', this.on_heart_beat_jing_ding);
    }
    on_heart_beat_jing_ding(this: CHARACTER, dt: number): void {
        const hp = this.do_recover(parseInt(this.max_hp * 0.05));
        if (hp > 0) {
            this.send_room("<hiy>$N的周身阵阵佛光笼罩，看起来脸色好了很多</hiy>")
            this.notify('<hig>你恢复了' + hp + '点气血。</hig>')
        }
    }
}
