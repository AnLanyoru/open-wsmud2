import { SKILL } from "../../../core/skill/skill.js";

export default class extends SKILL {
    name = "神龙心法";
    id = "shenlongxinfa";
    grade = 2;
    force_rad = 0.7;
    desc = "神龙教的心法，诡异无比";
    can_enables = ["force"];
    learn_condition = {
    skill: {
        force: 200
    },
    max_mp: 2000
};
    slots = [
    {
        prop: 'slxf_fy',
        value: (lv) => lv,
        format: (val) => {
            return '不死神龙额外提升自身防御' + val + '点';
        },
    },
    {
        prop: 'slxf_hf',
        value: (lv) => 100 + parseInt(lv * lv / 100),

        format: (val) => {
            return '不死神龙恢复自身气血' + val;
        },
    },
];
    pfm_set = {
    power:
    {
        name: "不死神龙",
        distime: 30000,
        enable_skill: "force",
        mp: 20,
        release_time: 0,
        use: function (me, target, lv) {

            me.send_room("<HIR>$N双目赤红，纵声大呼：洪教主神通护佑，众弟子勇气百倍，以一当百，以百当万！</hir>");
            me.add_status({
                id: "force",
                name: "不死神龙",
                desc: "虔诚高呼洪教主万岁，获得教主庇护",
                prop: {
                    fy: lv + me.query_prop('slxf_fy')
                },
                duration: 10000 + lv * 10,
                finish_msg: "$N的不死神龙大法运行完毕，汗如泉涌，呼呼喘气。"
            });

            const is_hf = me.query_prop('slxf_hf');
            if (is_hf > 0) {
                const hp = me.do_recover(is_hf);
                if (hp > 0)
                    me.notify('你恢复了' + hp + '气血。');
            }
        },
        query_desc: function (me, lv) {
            var time = (10000 + lv * 10) / 1000;
            var gj = lv;
            return "呼唤洪教主的法力，增加自身防御" + time + "秒内，提升自身防御" + gj + "点。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        force: {
            max_hp: lv * 10,
            limit_mp: lv * 70,
            desc: "唯一：将你内力的70%转化为气血"
        }
    };
}
}
