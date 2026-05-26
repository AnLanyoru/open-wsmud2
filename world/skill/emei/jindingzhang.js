this.inherits(SKILL);
this.name = "金顶绵掌";
this.id = "jindingzhang";
this.grade = 1;

this.family = FAMILIES.EMEI;
this.attack_actions = [
    "$N身形微晃，一招「三阳开泰」，掌起风生，$n只觉得一股暖气袭向$l",
    "$N双手变幻，五指轻弹，一招「五气呈祥」，力分五路，招罩十方，抓向$n的$l",
    "$N左手前引，右手倏出，抢在头里，一招「罡风推云」，疾抓向$n的$l",
    "$N左手圈转，轻拂$n的左手，反向推出，一招「逆流捧沙」，猛地击向$n的下巴",
    "$N舌绽春雷，一声娇喝，在$n一愣间，右手一招「雷洞霹雳」，直捣$n的$l",
    "$N双手平举握拳，一招「金顶佛光」施出，掌影重重，难辨虚实，掌风已经袭面",
    "$N一幅宝像庄严，使出「梵心降魔」，掌势如虹，绕着$n漂移不定",
    "$N双臂疾舞，化为点点掌影，一招「法尊八荒」铺天盖地袭向$n全身各处大穴"
];
this.desc = "峨眉派拳脚功夫，掌风阴柔，犹如长江大河，汹涌不绝";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["unarmed", "parry"];
this.learn_condition = {
    max_mp: 500,
    skill: {
        unarmed: 50
    }
};
this.query_enable_prop = function (lv) {
    return {
        unarmed: {
            gj: lv + 20,
            mz:lv

        }, parry: {
            zj: parseInt(lv * 1.2) + 10,
            max_hp: lv*3

        }
    };
}
this.pfm = {
    po:
    {
        name: "佛光普照",
        distime: 6000,
        enable_skill: "unarmed",
        weapon_type: WEAPON_TYPE.UNARMED,
        mp: 20,
        use: function (me, target, lv) {
            var sh = me.gj + (100 + lv * parseInt((lv / 500) + 1));
            me.do_attack({
                target: target,
                gj: sh,
                attack_msg: "<HIY>$N娇喝一声，一招“佛光普照”平淡无奇的朝$n拍去，可内力却如排山倒海一般袭来，使$n挡无可挡，避无可避。</HIY>",
                no_dodge: true,
                parry_msg: "<hic>可是$p奋力招架，硬生生的挡开了$P这一招。</hic>"
            });
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var sh = (100 + lv * parseInt((lv / 500) + 1));
            return "平淡无奇的招式，却如佛光普照般使敌人难以躲闪，对敌方造成你的攻击附加" + sh + "的伤害。";
        }
    }
};