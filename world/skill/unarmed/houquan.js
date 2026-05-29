import { SKILL } from "../../../os/skill/skill.js";

export default class extends SKILL {
    name = "猴拳";
    id = "houquan";
    grade = 1;
    attack_actions = [
    "$N单腿微曲，忽的向前扑出，一式「仙猴摘桃」，二爪直出，抓向$n的双眼",
    "$N左手虚晃，一式「灵猴攀枝」，右手直击，反扣$n的肩井大穴",
    "$N忽然缩成一团，使一式「八方幻影」，双掌无形无定，一爪抓向$n的胸口",
    "$N猛吸一口气，一弯腰，使一式「水中揽月」，双爪疾扣向$n的小腹",
    "$N猛的向上高高跃起，一式「落地摘星」，居高临下，一爪罩向$n的头骨"
];
    desc = "拳术中象形拳的一种，因模仿猴子的各种动作而得名。";
    can_enables = ["unarmed"];
    learn_condition = {
    max_mp: 500,
    skill: {
        unarmed: 50
    }
};
    slots = [
    {
        prop: 'hq_sh',
        value: (lv) => 10 + Math.floor(lv / 50),
        format: (val) => {
            return '寸劲附加攻击力增加' + val + "%";
        },
    },
    {
        prop: 'hq_rt',
        value: (lv) => 1000,
        format: (val) => {
            return '寸劲的释放时间减少1秒';
        },
    }
];
    pfm = {
    chan:
    {
        name: "寸劲",
        distime: 7000,
        enable_skill: "unarmed",
        releasetime_key: "hq_rt",
        mp: 20,
        use: function (me, target, lv) {
            var gj = me.gj + lv + 100;
            gj = gj + me.query_prop('hq_sh') * me.gj / 100;
            me.do_attack({
                target: target,
                gj: gj,
                mz: me.mz,
                attck_msg: "<hiy>$N默运内力，积蓄力量，企图在攻击的瞬间以内力震伤$n</hiy>"
            });
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var gj = lv + 100;
            return "在近距离攻击即将完成的瞬间，突然爆发，造成基本攻击附加" + gj + "的伤害。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        unarmed: {
            gj: lv * 1 + 5
        }
    };
}
}
