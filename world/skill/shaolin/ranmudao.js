this.inherits(SKILL);
this.name = "燃木刀法";
this.id = "ranmudao";
this.grade = 3;
this.family = FAMILIES.SHAOLIN;

this.attack_actions = [
    "$N面带微笑，一招<HIR>「烈火烧身」</HIR>，举$w对着$n连砍了八八六十四刀，刀气纵横，迅雷不可挡",
    "$N运起内功一招<GRN>「点木生火」</GRN>，$w上带着无比劲气，划了一个大弧，从上而下劈向$n的$l",
    "$N手臂一沉，一招<HIM>「张弓望月」</HIM>，双手持$w划出一道雪亮刀光，接着拦腰反切，砍向$n的$l",
    "$N挥舞$w上劈下撩，左挡右开，使出一招<RED>「烈火腾云」</RED>，卷起阵阵刀风，齐齐罩向$n",
    "$N一招<MAG>「火中取栗」</MAG>，左脚跃步落地，手中$w单刀往前，挟着炙热的风声劈向$n的$l",
    "$N腾空而起，半空中一招<HIW>「玉石俱焚」</HIW>，手中$w挥出满天流光般的刀影，向$n的全身卷去"
];

this.desc = "少林寺七十二绝技之燃木刀法";
//"(\w+)"(.+?)"NOR"
//<$1>$2</$1>
this.can_enables = ["blade", "parry"];
this.learn_condition = {
    max_mp: 1000,
    skill: {
        blade: 300
    }
};
this.query_enable_prop = function (lv) {
    return {
        blade: {
            gj: parseInt(lv * 1.4 + 10),
            str: parseInt(lv / 5),
            mz: parseInt(lv * 0.9 + 10),
            desc: "燃木真焰：你的攻击会附加你的防御力数值的伤害"
        },
        parry: {
            zj: parseInt(lv * 1.3 + 10),
            fy: parseInt(lv * 1.3 + 10),
            max_hp: 1000 + lv * 5,
        }
    };
}
this.on_attack = function (me, target) {
    me.send_combat("<red>$n被烈焰划过，身上一道焦黑</red>", target);
    return me.fy;
}
this.on_parry_over = function (me, target, par) {
    let sh = me.query_temp("sk_ranmu");
    if (sh) {
        if (par.is_parry) sh = sh * 2;
        target.send_combat("<HIR>$n的护体真气灼伤了$N的真元！！</HIR>", me);
        target.damage2(sh, me);
        me.end_attack(target);
    }
}
this.pfm = {
    hu:
    {
        name: "护体真焰",
        distime: 30000,
        // enable_skill: "parry",
        mp: 20,
        release_time: 0,
        use: function (me, target, lv) {
            me.send_room("<HIR>$N仰天怒吼，全身登时腾起滔天烈焰。\n</HIR>", target);
            var time = 8000 + lv * 5;
            if (time > 200000) time = 200000;
            let add_fy = lv * 2 + 500;
            me.set_temp("sk_ranmu", add_fy, time);
            me.add_status({
                id: "weapon",
                name: "真焰",
                desc: "增加你的防御",
                duration: time,
                prop: {
                    fy: add_fy
                }
            });
        },
        query_desc: function (me, lv) {
            var time = 8000 + lv * 5;
            if (time > 200000) time = 200000;
            let add_fy = (lv * 2 + 500);
            return "真焰护体，增加你" + add_fy + "的防御，被敌人命中后对敌人造成" + add_fy + "的伤害。";
        }
    }, fen: {
        name: "焚尽八荒",
        distime: 20000,
        enable_skill: "blade",
        weapon_type: WEAPON_TYPE.BLADE,
        mp: 20,
        use: function (me, target, lv) {
            lv = 50 + parseInt(lv / 20);
            me.send_room("<HIy>$N双手持刀，对天咆哮，所施正是燃木刀法绝学「焚尽八荒」。霎时呼啸声大作，但见一股澎湃无比的罡劲至$N刀间涌出，云贯向$n而去</HIy>", target);
            var count = 8;
            for (var i = 0; i < count; i++) {
                me.do_attack({
                    target: target,
                    gj: me.gj * lv / 100,
                    mz: me.mz,
                    attack_msg: "<hir>一道罡气燃烧着熊熊烈焰向$n呼啸而去</hir>"
                });
            }
            me.end_attack(target);
        },
        query_desc: function (me, lv) {
            lv = 50 + parseInt(lv / 20);
            return "燃木刀法绝学「焚尽八荒」，瞬间用罡气攻击敌方8次，每次攻击造成" + lv + "%伤害";
        }
    }
};