import { SKILL } from "../../../core/skill/skill.js";
import { FAMILIES } from "../../../core/skill/family.js";

export default class extends SKILL {
    name = "太极神功";
    id = "taijishengong";
    can_enables = ["force"];
    family = FAMILIES.WUDANG;
    grade = 3;
    force_rad = 0.8;
    learn_condition = {
    max_mp: 500,
    skill: {
        force: 300
    }
};
    pfm = {
    tu:
    {
        name: "真武除邪",
        distime: 60000,
        enable_skill: "force",
        mp: 20,
        use_type: 2,
        release_time: 0,
        use: function (me, target, lv) {
            me.send_room("<hiy>$N闭目凝神，心如点转，双手抱环划破虚空，周身灵气如指引般汇聚在$P周身，一阴一阳仿若真灵护体。</hiy>");

            var diff = 30 + parseInt(lv / 300);
            var time = lv * 10 + 20000;
            if (time > 30000) time = 30000;
            me.add_status({
                id: "force",
                name: "真武除邪",
                desc: "太极神功之真武除邪增加你的气血，招架和伤害减免",
                duration: time,
                prop: {
                    diff_sh_per2: diff,
                    zj_per: diff,
                    max_hp: lv * 10
                }, on_expire: function (p) {
                    if (p.hp > p.max_hp) {
                        p.hp = p.max_hp;
                        p.notify_hp();
                    }

                }
            });
            me.hp += lv * 10;
            me.notify_hp();
        },
        query_desc: function (me, lv) {
            var diff = 30 + parseInt(lv /300);
            var qx = lv * 10;
            var time = lv * 10 + 20000;
            if (time > 30000) time = 30000;
            return "将太极真气运转周身，"+(time/1000)+"秒内增加你" + qx + "气血,招架增加" + diff + "%,受到的伤害减少" + diff + "%";
        }
    }
};

    query_enable_prop(lv) {
    return {
        force: {
            max_hp: lv * 10,
            limit_mp:  lv *104,
            desc: "唯一：将你内力的80%转化为气血"
        }
    };
}
}

