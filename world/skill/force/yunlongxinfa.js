import { SKILL } from "../../../os/skill/skill.js";

export default class extends SKILL {
    name = "云龙心法";
    id = "yunlongxinfa";
    grade = 1;
    force_rad = 0.55;
    desc = "天地会的内功心法，入会便能修炼";
    can_enables = ["force"];
    learn_condition = {
    skill: {
        force: 50
    }
};
    slots = [
    {
        prop: 'ylxf_mz',
        value: (lv) => lv > 1500 ? 4510 + lv - 1500 :
            10 + Math.floor(lv * lv / 500),
        count: 3,
        format: (val) => {
            return '云龙决额外提升自身命中' + val + '点';
        },
    },
    {
        prop: 'ylxf_gj',
        value: (lv) => lv > 1500 ? 4510 + lv - 1500 :
            10 + Math.floor(lv * lv / 500),
        count: 3,
        format: (val) => {
            return '云龙决额外提升自身攻击' + val + '点';
        },
    },
];
    pfm = {
    power:
    {
        name: "云龙决",
        distime: 30000,
        enable_skill: "force",
        mp: 20,
        release_time: 0,
        use_type: 2,
        use: function (me, target, lv) {

            me.send_room("<hir>$N长吸一口气，运起云龙神功已将全身潜力尽数提起！</hir>");
            const prop = {
                gj: lv,
            };
            const is_mz = me.query_prop('ylxf_mz');
            const is_gj = me.query_prop('ylxf_gj');

            if (is_mz > 0) {
                prop.mz = is_mz;
            }

            if (is_gj > 0) {
                prop.gj += is_gj;
            }

            me.add_status({
                id: "force",
                name: "云龙决",
                desc: "运用云龙心法，提升自身战斗力",
                prop: prop,
                duration: 10000 + lv * 10,
                finish_msg: "$N的云龙神功运行完毕，将内力收回丹田。"
            });
        },
        query_desc: function (me, lv) {
            var time = (10000 + lv * 10) / 1000;
            var gj = lv;
            return "提升全身潜力，在" + time + "秒内，提升自身攻击力" + gj + "点。";
        }
    }
};

    on_learn(me) {
    if (me.query_skill("force", 1) < 30)
        return me.notify_fail("你的基础内功级别不够，无法学习云龙心法。");
    return true;
}
    query_enable_prop(lv) {
    return {
        force: {
            gj: lv,
            limit_mp: lv * 10,
            desc: "唯一：将你内力的55%转化为气血"
        }
    };
}
}
