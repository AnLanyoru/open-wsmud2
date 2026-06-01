import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";

export default class extends SKILL {
    name = "混天气功";
    id = "huntianqigong";
    grade = 3;
    force_rad = 0.7;
    desc = "丐帮的高级心法";
    family = FAMILIES.GAIBANG;
    can_enables = ["force"];
    learn_condition = {
    skill: {
        force: 250
    }
};
    pfm = {
    power:
    {
        name: "混元天罡",
        distime: 60000,
        enable_skill: "force",
        mp: 20,
        release_time: 0,
        use_type: 2,
        use: function (me, target, lv) {

            var time = 25000 + lv;
            if (time > 30000) time = 30000;
            var gj = 600 + lv * 2;
            me.send_room("<HIy>$N使出混天气功绝学「混元天罡」，大喝一声，全身真气鼓动，看似坚不可摧。</HIy>");
            me.add_status({
                id: "force",
                name: "天罡",
                desc: "增加防御和攻击",
                prop: {
                    fy: gj,
                    gj: gj
                },
                duration: time
            });
        },
        query_desc: function (me, lv) {
            var time = (25000 + lv) / 1000;
            if (time > 30) time = 30;
            var gj = 600 + lv * 2;
            return time + "秒内，提升自身，攻击防御" + gj + "。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        force: {
            gj: parseInt(lv * 1.2) + 10,
            con: parseInt(lv / 6) + 4,
            limit_mp: lv * 102,
            desc: "唯一：将你内力的70%转化为气血"
        }
    };
}
}

