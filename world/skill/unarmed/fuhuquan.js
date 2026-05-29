import { SKILL } from "../../../os/skill/skill.js";

export default function() {
    const FAMILIES = globalThis.FAMILIES;
this.inherits(SKILL);
this.name = "伏虎拳";
this.id = "fuhuquan";
this.grade = 1;

this.is_public=true;
this.family = FAMILIES.SHAOLIN;
this.attack_actions = [
    "$N并举双拳，使出一招「灌顶」，当头砸向$n的$l",
    "$N使出一招「解苦」，身形一低，左手护顶，右手一拳击向$n的裆部",
    "$N使出一招「颦眉」，左拳虚击$n的前胸，一错身，右拳横扫$n的太阳穴 ",
    "$N神形怪异，使一招「嗔恚」，双拳上下击向$n的$l",
    "$N使出一招「静寂」，双拳交错，缓缓击出，劲气直指$n的$l ",
    "$N微微一笑，使出一式「妙音」，双拳前后击出，直取$n的左胸 ",
    "$N使出一招「明心」，全身疾转，双拳横扫$n的$l",
    "$N飞身一跃，使出一招「制胜」，一拳猛击$n咽喉"
];
this.desc = "少林七十二绝技之一，拳法威猛，非臂力高强不可练习";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["unarmed"];
this.learn_condition = {
    max_mp: 500,
    skill: {
        unarmed: 50
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: lv * 1 + 10,
            max_hp: lv + 100
        }
    };
}
this.pfm = {
    zhen:
    {
        name: "罗汉伏虎",
        distime: 10000,
        enable_skill: "unarmed",
        mp: 20,
        use: function (me, target, lv) {

            var t = parseInt(me.str * 5 + lv / 30);
            me.do_attack({
                target: target,
                gj: me.gj * t / 100,
                attack_msg: "<hiw>$N步成弓形，大喝一声施出绝招「<hig>伏虎式</hig>」，一拳猛地击向$n。</hiw>",
                mz: me.mz,
                no_weapon: true
            });
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var t = parseInt(me.str * 5 + lv / 20);
            return "使出全身力气迅猛一击造成"+t+"%攻击力的伤害，先天臂力越高，造成的伤害越大，";
        }
    }
};
}
