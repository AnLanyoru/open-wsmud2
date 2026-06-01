import { SKILL } from "../../../core/skill/skill.js";

export default class extends SKILL {
    name = "秋风拂尘";
    id = "qiufengfuchen";
    grade = 1;
    attack_actions = [
    "$N端坐不动，一招<HIC>「秋风拂叶」</HIC>，手中$w带着一股劲风，击向$n的脸颊",
    "$N单臂一挥，一招<HIW>「玉带围腰」</HIW>，手中$w直绕向$n的身后",
    "$N身形一转，一招<HIB>「流云断川」</HIB>，手中$w如矫龙般腾空一卷，猛地向$n劈头打下",
    "$N力贯尘梢，一招<HIG>「春风化雨」</HIG>，手中$w舞出满天幻影，排山倒海般扫向$n全身",
    "$N忽的向前一跃，一招<HIY>「野马分鬃」</HIY>，手中$w分击$n左右",
    "$N慢步上前，一招<GRN>「竹影扫阶」</GRN>，手中$w缓缓罩向$n前胸"

];
    desc = "古墓派李莫愁扬名天下的武功。";
    can_enables = ["whip"];
    learn_condition = {
    max_mp: 100,
    skill: {
        whip: 100
    }
};
    slots = [
    {
        prop: 'qffc_ml',
        value: (lv) => 1000,
        format: (val) => {
            return '缠字诀忙乱时间增加1秒';
        },
    },
    {
        prop: 'qffc_mz',
        value: (lv) => 20,
        format: (val) => {
            return '缠字诀命中判定下限增加20%';
        },
    },
];
    pfm = {
    chan:
    {
        name: "缠字诀",
        distime: 30000,
        enable_skill: "whip",
        mp: 20,
        use: function (me, target, lv) {
            var time = Math.round(lv * 100 / 5);
            if (time < 2000) time == 2000;
            else if (time > 10000) time = 10000;
            time += me.query_prop('qffc_ml');
            var msg = "<hic>$N使出秋风尘法「缠」字诀，拂尘连挥企图把$n的全身缠住。</hic>";
            let mz = me.mz + me.mz * me.query_prop('qffc_mz') / 100;

            if (me.random(mz) > target.ds / 2) {
                msg += "结果$p被$P攻了个措手不及!\n";
                target.add_status({
                    id: "busy",
                    is_busy: true,
                    duration: time,
                    name: "忙乱",
                    downside: true
                }, me);
            } else {
                msg += "可是$p看破了$P的企图，并没有上当。\n";
            }
            me.send_room(msg, target);
        },
        query_desc: function (me, lv) {
            var time = Math.round(lv / 50);
            if (time < 2) time == 2;
            else if (time > 10) time = 10;
            return "如秋风扫叶般，快速挥动佛尘牵制敌人，使敌人" + time + "秒内处于忙乱状态。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        whip: {
            gj: parseInt(lv * 1 + 10),
            mz: lv
        }
    };
}
}
