import { SKILL } from "../../../core/skill/skill.js";

export default class extends SKILL {
    name = "四象步法";
    id = "sixiangbu";
    grade = 2;
    dodge_actions = [
    "只见$n一招「少阴步」，身体向上笔直地纵起丈余，躲过了$N这一招。",
    "$n一个「乾兑步」，向后纵出数丈之远，避开了$N的凌厉攻势。",
    "$n使出「离震步」，向一旁飘然纵出，轻轻着地。",
    "但是$n身形飘忽，使出「少阳步」，轻轻一纵，早已避开。",
    "$n身随意转「太阴步」，倏地往一旁挪开了三尺，避过了这一招。",
    "可是$n侧身一让，一个「巽坎步」，$N这一招扑了个空。",
];
    desc = "关外胡家的轻功身法，胡斐就是凭借这个步法闯出个雪山飞狐的名号";
    can_enables = ["dodge"];
    learn_condition = {
    max_mp: 1000,
    dex1: 20,
    skill: {
        dodge: 200
    }
};
    slots = [
    {
        prop: 'sxbf_gjsd',
        value: (lv) => 10,
        count: 2,
        format: (val) => {
            return '四象步法攻击速度增加10%';
        },
    },
    {
        prop: 'sxbf_ds',
        value: (lv) => 10,
        format: (val) => {
            return '四象步法躲闪增加10%';
        },
    },
];
    pfm_set = {
    chan:
    {
        name: "飞天狐狸",
        distime: 40000,
        enable_skill: "dodge",
        mp: 20,
        release_time: 0,
        use: function (me, target, lv) {

            var dex = 20 + Math.min(parseInt(lv / 500), 10);
            me.send_room("<hiy>$N足尖轻点地面，凌空跃起，身形顿时变得飘忽不定，难以捉摸。</hiy>", target);
            me.add_status({
                id: "dodge",
                name: "飞天",
                desc: "四象步法之飞天狐狸，增加你的躲闪和攻速",
                finish_msg: "$N的飞天狐狸运功完毕，将内力收回丹田。",
                duration: Math.min(8000 + lv * 2, 20000),
                prop: {
                    ds_per: dex + me.query_prop('sxbf_ds'),
                    gjsd_per: dex + me.query_prop('sxbf_gjsd')
                }
            });
        },
        query_desc: function (me, lv) {
            var t = (8000 + lv * 2) / 1000;
            if (t > 20) t = 20;
            var dex = 20 + Math.min(parseInt(lv / 500), 10);
            return "" + t + "秒内增加你" + dex + "%躲闪，攻击速度提高" + dex + "%";
        }
    }
};

    query_enable_prop(lv) {
    return {
        dodge: {
            ds: lv + 10
        }
    };
}
}
