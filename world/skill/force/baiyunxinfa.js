import { SKILL } from "../../../os/skill/skill.js";

export default class extends SKILL {
    name = "白云心法";
    id = "baiyunxinfa";
    grade = 3;
    force_rad = 0.75;
    desc = "恒山派的内功心法。";
    can_enables = ["force"];
    learn_condition = {
    max_mp: 50000,
    skill: {
        force: 300
    }
};
    slots = [
    {
        prop: "byxf_gj",
        value: lv => 10,
        format: (val) => {
            return "白云诀额外增加10%攻击力";
        }
    },
    {
        prop: "byxf_fy",
        value: lv => 10,
        format: (val) => {
            return "白云诀额外增加10%防御力";
        }
    },
    {
        prop: "limit_mp",
        value: (lv, grade) => grade === 3 ? 60 * lv : 120 * lv,
        query_needs: function (grade) {

            return [{
                path: "book/wudao",
                count: grade === 3 ? 6 : 10
            }, {
                path: "book/bc#baiyunxinfa",
                count: 25
            }];
        },
        format: (val) => {
            return "内力上限：+" + val;
        }
    }
];
    pfm = {
    power:
    {
        name: "白云",
        distime: 60000,
        enable_skill: "force",
        mp: 20,
        release_time: 0,
        use_type: 2,
        use: function (me, target, lv) {
            var gj = 10 + parseInt(lv / 100);
            var time = 20000 + lv * 10;
            me.send_room("<hiw>$N微一凝神，运起白云心法，将全身潜能尽数提起，宛如被云雾所笼罩</hiw>", target);
            me.add_status({
                id: "force",
                name: "白云心法",
                desc: "增加你的防御，攻击",
                duration: time,
                prop: {
                    gj_per: gj + me.query_prop('byxf_gj'),
                    fy_per: gj + me.query_prop('byxf_fy'),
                },
                finish_msg: "$N的白云心法运行完毕，将内力收回丹田。",
            });

        },
        query_desc: function (me, lv) {
            var gj = 10 + parseInt(lv / 100);
            var time = 20000 + lv * 10;
            return "使用白云心法提升战力，增加你" + gj + "%的攻击，防御，持续" + (time / 1000) + "秒";
        }
    }
};

    query_enable_prop(lv) {
    return {
        force: {
            gj: parseInt(lv * 1.3) + 10,
            fy: parseInt(lv * 1.3) + 10,
            max_hp: lv * 10,
            limit_mp: lv * 100,
            desc: "唯一：将你内力的75%转化为气血"
        },
    };
}
}
