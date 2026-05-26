this.inherits(SKILL);
this.name = "回风拂柳剑";
this.id = "huifengjian";
this.grade = 2;
this.family = FAMILIES.EMEI;
this.attack_actions = [
"$N剑尖剑芒暴长，一招「清风袭月」，手中$w自左下大开大阖，一剑向右上向$n的$l",
  "$N长剑圈转，施一招「飘雪穿云」，手中$w平展下刺，一剑轻轻划过$n的$l",
  "只见$N长剑轻灵跳动，剑随身长，右手$w猛地使出一式「千峰竞秀」刺向$n的$l",
    "$N长剑下指，剑意流转，一招「万流归宗」直取$n的$l",
"$N剑芒吞吐，幻若灵蛇，手中$w使出一式「乌龙搅柱」，剑势曼妙非凡，刺向$n的$l",
 
  "$N挥剑分击，剑势自胸前跃出，右手$w一式「进退龙游」，毫无留恋之势，刺向$n的$l",
 "$N退步，左手剑指划转，腰部一扭，右手$w一记「天地鹤翔」自下而上刺向$n的$l"
];
this.desc = "峨眉派的入门剑法，剑法轻灵，如回风拂柳";
//"\+(\w+)\+"(.+?)"\+NOR\+"
//<$1>$2</$1>
this.learn_condition = {
    max_mp: 2000,
    skill: {
        sword: 200
    }
};
this.can_enables = ["sword"];
this.query_enable_prop = function (lv) {
    return {
        sword: {
            gj: 20 + parseInt(lv * 1.3),
            mz: parseInt(lv * 1.3) + 20
        }
    };
}
this.pfm = {
    mie:
    {
        name: "灭剑",
        distime: 20000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 10,
        release_time:0,
        use: function (me, target, lv) {
            var miss = "<cyn>可是$p轻轻一笑，侧身右转，闪了开去</cyn>";
            if (me.do_attack({
                attack_msg: "<hir>$N屈腕云剑，剑光如彩碟纷飞，幻出点点星光，右手$w陡然使出一式「灭剑」跃跃洒洒飘向$n</hir>",
                target: target,
                gj: me.gj,
                mz: me.mz,
                miss_msg: miss,
                parry_msg: miss
            })) {
                var sh = 10 + parseInt(lv / 100);
                target.add_status({
                    id: "damage",
                    duration: 10000,
                    name: "灭剑",
                    downside: true,
                    prop: {
                        diff_sh_per: -sh
                    }
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var sh = 10 + parseInt(lv / 100);
            return "对敌方造成伤害，并使对方在之后10秒内受到的伤害增加" + sh + "%";
        }
    } , jue:
    {
        name: "绝剑",
        distime: 20000,
        enable_skill: "sword",
        weapon_type: WEAPON_TYPE.SWORD,
        mp: 10,
        release_time: 5000,
        use: function (me, target, lv) {
            var per = 10 + parseInt(lv / 100);
            var sh = 100 + parseInt(lv / 10);
            var miss = "<hic>可是$p轻轻一笑，侧身右转，伸出两指，正弹在$P的剑上，长剑在$p身侧划过，毫发无伤。</hic>";
            me.do_attack({
                attack_msg: "<hir>$N手中长剑剑芒跃动，剑光暴长，幻出死亡的色彩，剑尖渐渐逼近$n，$n看到漫天剑光，抽身后跃，只这一刹，漫天剑影化为一剑直刺$n前胸，快捷无伦！</hir>",
                target: target,
                gj: me.gj * sh/100,
                mz: me.mz ,
                miss_msg: miss,
                parry_msg: miss,
                diff_fy:per
            })
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            var sh = 100 + parseInt(lv / 10);
            var per = 10 + parseInt(lv / 100);
            return "对敌方造成" + sh +"%攻击力无视对方"+per+"%防御的伤害";
        }
    }
};