import { SKILL } from "../../../core/skill/skill.js";

export default class extends SKILL {
    name = "流云掌";
    id = "liuyunzhang";
    grade = 2;
    attack_actions = [
    "$N使一招「天马行空」，右掌一翻，向$n的$l拍去",
    "$N使一招「探手截流」，右手斜出，劈向$n的$l",
    "$N双手带风，一式「风吹云散」，掌力浑厚，击向$n的$l",
    "$N双手微抬，左右齐出，一招「云深雾锁」，已将$n$l笼罩",
    "$N双掌翻腾，掌风凌厉，一式「云雾缭绕」，飘然不定，击向$n$l",
    "$N双掌拍出，一式「顺流逆流」，掌法一快一慢，向$n的$l打去",
    "$N快步向前，身法陡快，一招「行云流水」，掌风已到$n$l",
    "$N双掌下垂，似是无力，但又猛然加快，似攻非攻，一式「流水无情」使出，双掌已到$n$l"
];
    desc = "流云掌法的绝招，乃是以快速的身法及掌法连出虚招将对手困住";
    can_enables = ["unarmed"];
    learn_condition = {
    max_mp: 500,
    skill: {
        unarmed: 50
    }
};
    slots = [
    {
        prop: 'lyz_sh',
        value: (lv) => 10,
        count: 2,
        format: (val) => {
            return '排山倒海附加的伤害增加10%';
        }
    },
    {
        prop: 'lyz_gs',
        value: (lv) => 10,
        format: (val) => {
            return '排云附加的攻速提高10%';
        }
    },
];
    pfm_set = {
    chan:
    {
        name: "排山倒海",
        distime: 18000,
        enable_skill: "unarmed",
        mp: 20,
        use: function (me, target, lv) {
            var gj = 200 + parseInt(lv / 10) + me.query_prop('lyz_sh');

            if (me.do_attack({
                target: target,
                gj: me.gj * gj / 100,
                mz: me.mz,
                no_weapon: true,
                attck_msg: "<hiy>$N运转真气，将内力注于掌风之中，双掌猛然拍向$n，气势宏大，犹如排山倒海。</hiy>"
            })) {
                me.add_status({
                    id: "unarmed",
                    name: "排云",
                    desc: "增加你的攻速",
                    duration: 8000 + lv * 2,
                    prop: {
                        gjsd_per: 25 + me.query_prop('lyz_gs')
                    }
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var gj = 200 + parseInt(lv / 10);
            return "将体内雄浑的内力运于掌风，攻向敌人，对敌人造成" + gj
                + "%的伤害，命中后提高自己的攻击速度25%。";
        }
    }
};

    query_enable_prop(lv) {
    return {
        unarmed: {
            gj: parseInt(lv * 1.2) + 5,
            gjsd: 200,
            mz: parseInt(lv * 1.3) + 5
        }
    };
}
}
