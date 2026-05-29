import { SKILL } from "../../../os/skill/skill.js";

export default class extends SKILL {
    name = "磐石神功";
    id = "panshishengong";
    grade = 3;
    force_rad = 0.75;
    desc = "泰山派的内功心法";
    can_enables = ["force"];
    learn_condition = {
    skill: {
        force: 400
    }
};
    slots = [

    {
        prop: "pssg_fy",
        value: lv => 20,
        format: (val) => {
            return "磐石决额外增加20%伤害减免";
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
                path: "book/bc#panshishengong",
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
        name: "磐石决",
        distime: 60000,
        enable_skill: "force",
        mp: 20,
        release_time: 0,
        use_type: 2,
        use: function (me, target, lv) {
            let par = {
                fy_per: 100
            };
            let fy = me.query_prop('pssg_fy');
            if (fy > 0) par.diff_sh_per = fy;
            me.send_room("<hiy>$N大喝一声，全身劲气涌动，仿若磐石护体，坚不可摧！</hiy>\n");
            me.add_status({
                id: "force",
                name: "磐石",
                desc: "提高你的防御力",
                prop: par,
                duration: 5000 + lv * 10
            });
        },
        query_desc: function (me, lv) {
            var time = Math.floor((5000 + lv * 10) / 1000);
            if (time > 60) time = 60;
            return "在" + time + "秒内，提升自身防御100%。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        force: {
            fy: parseInt(lv * 1.7) + 20,
            max_hp: lv * 8 + 100,
            con: parseInt(lv / 7) + 2,
            limit_mp: lv * 100,
            desc: "唯一：将你内力的75%转化为气血"
        }
    };
}
}
