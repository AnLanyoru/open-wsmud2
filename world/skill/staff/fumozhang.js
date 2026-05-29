import { SKILL } from "../../../os/skill/skill.js";
import { WEAPON_TYPE } from "../../../os/const.js";

export default class extends SKILL {
    name = "伏魔杖";
    id = "fumozhang";
    grade = 5;
    attack_actions = [
    "$N使一招「<YEL>黄牛转角</YEL>」，手中$w自下而上，沉猛无比地向$n的小腹挑去",
    "$N快步跨出，一招「<RED>野马追风</RED>」，左手平托$w，右掌猛推杖端，顶向$n的胸口",
    "$N高举$w，一招「<BLK>猛虎跳涧</BLK>」，全身跃起，手中$w搂头盖顶地向$n击去。",
    "$N一招「<HIY>狮子摇头</HIY>」，双手持杖如橹，对准$n猛地一搅，如同平地刮起一阵旋风",
    "$N全身滚倒，$w盘地横飞，突出一招「<HIC>大蟒翻身</HIC>」，杖影把$n裹了起来",
    "$N双手和十，躬身一招「<GRN>胡僧托钵</GRN>」，$w自肘弯飞出，拦腰向$n撞去",
    "$N一招「<RED>慈</red><YEL>航</yel><MAG>普<BLU>渡</blu>」，$w如飞龙般自掌中跃出，直向$n的胸口穿入"
];
    desc = "净念禅宗的杖法";
    learn_condition = {
    max_mp: 300,
    skill: {
        staff: 900,
    }
};
    can_enables = ["staff"];
    pfm = {
    fumo:
    {
        name: "罗汉伏魔",
        distime: 20000,
        enable_skill: "staff",
        weapon_type: WEAPON_TYPE.STAFF,
        mp: 20,
        use: function (me, target, lv) {
            me.send_room("<hiy>$N大喝一声，手中$W杖端化出无数个圆圈，凝滞沉重，劈头盖脸向$n砸去</hiy>\n", target);

            var count = target.query_status("fmz");
            if (!count) count = 1;
            if (count > 15) count = 15;

            if (me.do_attack({
                target: target,
                gj: me.gj + me.gj * 0.8 * count,
                mz: me.mz
            })) {

                me.end_attack(target);
                if (count > 5) {

                }
            }
            target.remove_status("fmz", true);
        },
        query_desc: function (me, lv) {

            return "罗汉伏魔，每层BUFF增加80%伤害";
        }
    }
};

    query_enable_prop(lv) {
    return {
        staff: {
            gj: parseInt(lv * 1.8) + 10,
            mz: parseInt(lv * 1.8) + 10,
            str: parseInt(lv / 3) + 10,
            con: parseInt(lv / 3) + 10,
            desc: "当你命中敌人后会降低敌人战斗属性1%,可叠加"
        }
    };
}
    on_attack_over(me, target, par) {
    if (!par.is_dodge && !par.is_parry) {
        var lv = me.query_skill("fumozhang", 0);
        lv = 5 + parseInt(lv / 100);
        target.add_status({
            id: "fmz",
            name: "伏魔",
            desc: "减少战斗属性",
            duration: 6000,
            downside: true,
            count: 1,
            prop: {
                gj_per: -1,
                mz_per: -1,
                ds_per: -1,
                zj_per: -1,
                fy_per: -1
            },
            override: 1,
            max_count: lv
        });
    }

}
}

